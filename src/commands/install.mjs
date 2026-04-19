import path from "node:path";
import { readFile, writeFile } from "node:fs/promises";

import { computeSkillFingerprint } from "../lib/fingerprint.mjs";
import {
  ensureDirectory,
  listDirectories,
  listSkillDirectories,
  pathExists,
  removeDirectory,
  removeTempDirectories,
  replaceDirectoryFromSource,
} from "../lib/fs.mjs";
import { isOwnedMarker, readMarker, writeMarker } from "../lib/marker.mjs";

const CFLOW_DIRNAME = ".cflow";
const CFLOW_GITIGNORE_PATTERNS = new Set([".cflow/", ".cflow", "/.cflow/", "/.cflow"]);

export async function installSkills({ sourceRoot, destinationRoot, repoRoot = null, dryRun = false }) {
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
    artifactRoot: repoRoot ? path.join(repoRoot, CFLOW_DIRNAME) : null,
    artifactDirectoryCreated: false,
    gitignoreUpdated: false,
  };

  const cflowBootstrap = repoRoot ? await inspectCflowBootstrap(repoRoot) : null;
  if (cflowBootstrap) {
    result.artifactDirectoryCreated = cflowBootstrap.artifactDirectoryCreated;
    result.gitignoreUpdated = cflowBootstrap.gitignoreUpdated;
  }

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
  if (cflowBootstrap) {
    await applyCflowBootstrap(cflowBootstrap);
  }

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

async function inspectCflowBootstrap(repoRoot) {
  const artifactRoot = path.join(repoRoot, CFLOW_DIRNAME);
  const artifactDirectoryCreated = !(await pathExists(artifactRoot));
  const gitignorePath = path.join(repoRoot, ".gitignore");
  const gitignoreExists = await pathExists(gitignorePath);
  const gitignoreBody = gitignoreExists ? await readFile(gitignorePath, "utf8") : "";
  const gitignoreUpdated = !hasCflowGitignoreEntry(gitignoreBody);

  return {
    artifactRoot,
    artifactDirectoryCreated,
    gitignorePath,
    gitignoreBody,
    gitignoreUpdated,
  };
}

async function applyCflowBootstrap({ artifactRoot, gitignorePath, gitignoreBody, gitignoreUpdated }) {
  await ensureDirectory(artifactRoot);

  if (!gitignoreUpdated) {
    return;
  }

  let nextBody = gitignoreBody;
  if (nextBody.length > 0 && !nextBody.endsWith("\n")) {
    nextBody += "\n";
  }
  nextBody += ".cflow/\n";
  await writeFile(gitignorePath, nextBody, "utf8");
}

function hasCflowGitignoreEntry(body) {
  return body
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .some((line) => CFLOW_GITIGNORE_PATTERNS.has(line));
}
