import path from "node:path";

import { computeSkillFingerprint } from "../lib/fingerprint.mjs";
import {
  ensureDirectory,
  listDirectories,
  listSkillDirectories,
  removeDirectory,
  removeTempDirectories,
  replaceDirectoryFromSource,
} from "../lib/fs.mjs";
import { isOwnedMarker, readMarker, writeMarker } from "../lib/marker.mjs";

export async function installSkills({ sourceRoot, destinationRoot, dryRun = false }) {
  const sourceSkills = await listSkillDirectories(sourceRoot);
  if (sourceSkills.length === 0) {
    throw new Error(`No skills found in source root: ${sourceRoot}`);
  }

  const targetDirectories = await listDirectories(destinationRoot);
  const targetByName = new Map(targetDirectories.map((entry) => [entry.name, entry.path]));
  const sourceByName = new Map(sourceSkills.map((entry) => [entry.name, entry.path]));

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

  await removeTempDirectories(destinationRoot);

  for (const sourceSkill of sourceSkills) {
    const sourceFingerprint = await computeSkillFingerprint(sourceSkill.path);
    const targetDir = targetByName.get(sourceSkill.name);

    if (!targetDir) {
      result.added.push({
        name: sourceSkill.name,
        sourceDir: sourceSkill.path,
        targetDir: path.join(destinationRoot, sourceSkill.name),
        fingerprint: sourceFingerprint,
      });
      continue;
    }

    const marker = await readMarker(targetDir);
    if (!isOwnedMarker(marker)) {
      result.conflicts.push({
        name: sourceSkill.name,
        targetDir,
        reason: "destination exists but is not owned by Cflow",
      });
      continue;
    }

    const targetFingerprint = await computeSkillFingerprint(targetDir);
    if (targetFingerprint === sourceFingerprint) {
      result.unchanged.push({
        name: sourceSkill.name,
        targetDir,
        fingerprint: sourceFingerprint,
      });
      continue;
    }

    result.updated.push({
      name: sourceSkill.name,
      sourceDir: sourceSkill.path,
      targetDir,
      fingerprint: sourceFingerprint,
      previousFingerprint: targetFingerprint,
    });
  }

  for (const targetDirectory of targetDirectories) {
    const marker = await readMarker(targetDirectory.path);
    if (!isOwnedMarker(marker) || sourceByName.has(targetDirectory.name)) {
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

  for (const entry of [...result.added, ...result.updated]) {
    await replaceDirectoryFromSource(entry.sourceDir, entry.targetDir, async (stagedDir) => {
      await writeMarker(stagedDir, {
        sourceSkill: entry.name,
        fingerprint: entry.fingerprint,
      });
    });
  }

  for (const entry of result.pruned) {
    await removeDirectory(entry.targetDir);
  }

  result.applied = true;
  return result;
}
