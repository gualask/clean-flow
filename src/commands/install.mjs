import path from "node:path";

import { computeSkillFingerprint } from "../lib/fingerprint.mjs";
import {
  ensureDirectory,
  listDirectories,
  listPackageDirectories,
  pathExists,
  removeDirectory,
  removeTempDirectories,
  replaceDirectoryFromSource,
  TEMP_DIRECTORY_PREFIX,
} from "../lib/fs.mjs";
import { VENDOR_CONFIG_RELATIVE_PATH } from "../lib/materialize-skills.mjs";
import { isOwnedMarker, readMarker, writeMarker } from "../lib/marker.mjs";

export async function installSkills({ sourceRoot, destinationRoot, dryRun = false, onWarning }) {
  if (await pathExists(path.join(sourceRoot, VENDOR_CONFIG_RELATIVE_PATH))) {
    throw new Error(`Install source must be materialized before sync: ${sourceRoot}`);
  }

  const sourcePackages = await listPackageDirectories(sourceRoot);
  const sourceSkills = sourcePackages.filter((entry) => entry.kind === "skill");
  if (sourceSkills.length === 0) {
    throw new Error(`No skills found in source root: ${sourceRoot}`);
  }

  const targetDirectories = (await listDirectories(destinationRoot))
    .filter(entry => !entry.name.startsWith(TEMP_DIRECTORY_PREFIX));
  const targetByName = new Map(targetDirectories.map((entry) => [entry.name, entry.path]));
  const sourceByName = new Map(sourcePackages.map((entry) => [entry.name, entry.path]));

  const result = {
    command: "install",
    sourceRoot,
    destinationRoot,
    dryRun,
    added: [],
    updated: [],
    unchanged: [],
    pruned: [],
    conflicts: [],
    applied: false,
  };

  for (const sourcePackage of sourcePackages) {
    const sourceFingerprint = await computeSkillFingerprint(sourcePackage.path);
    const targetDir = targetByName.get(sourcePackage.name);

    if (!targetDir) {
      result.added.push({
        name: sourcePackage.name,
        kind: sourcePackage.kind,
        sourceDir: sourcePackage.path,
        targetDir: path.join(destinationRoot, sourcePackage.name),
        fingerprint: sourceFingerprint,
      });
      continue;
    }

    const marker = await readMarker(targetDir);
    if (!isOwnedMarker(marker)) {
      result.conflicts.push({
        name: sourcePackage.name,
        kind: sourcePackage.kind,
        targetDir,
        reason: "destination exists but is not owned by Cflow",
      });
      continue;
    }

    const targetFingerprint = await computeSkillFingerprint(targetDir);
    if (targetFingerprint === sourceFingerprint) {
      result.unchanged.push({
        name: sourcePackage.name,
        kind: sourcePackage.kind,
        targetDir,
        fingerprint: sourceFingerprint,
      });
      continue;
    }

    result.updated.push({
      name: sourcePackage.name,
      kind: sourcePackage.kind,
      sourceDir: sourcePackage.path,
      targetDir,
      fingerprint: sourceFingerprint,
      previousFingerprint: targetFingerprint,
    });
  }

  for (const targetDirectory of targetDirectories) {
    if (sourceByName.has(targetDirectory.name)) {
      continue;
    }
    const marker = await readMarker(targetDirectory.path);
    if (!isOwnedMarker(marker)) {
      continue;
    }

    result.pruned.push({
      name: targetDirectory.name,
      targetDir: targetDirectory.path,
    });
  }

  if (dryRun || result.conflicts.length > 0) {
    return result;
  }

  await ensureDirectory(destinationRoot);
  await removeTempDirectories(destinationRoot);

  for (const entry of [...result.added, ...result.updated]) {
    await replaceDirectoryFromSource(entry.sourceDir, entry.targetDir, async (stagedDir) => {
      await writeMarker(stagedDir, {
        sourceSkill: entry.name,
        sourceKind: entry.kind,
        fingerprint: entry.fingerprint,
      });
    }, { onWarning });
  }

  for (const entry of result.pruned) {
    await removeDirectory(entry.targetDir);
  }

  result.applied = true;
  return result;
}
