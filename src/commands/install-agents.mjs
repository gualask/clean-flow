import path from "node:path";
import { copyFile, readdir, rm } from "node:fs/promises";

import { computeFileFingerprint } from "../lib/fingerprint.mjs";
import { ensureDirectory, pathExists } from "../lib/fs.mjs";
import {
  isOwnedMarker,
  listFileMarkers,
  readFileMarker,
  removeEmptyMarkerDirectory,
  removeFileMarker,
  writeFileMarker,
} from "../lib/marker.mjs";

const CODEX_AGENT_KIND = "codex-agent";

export async function installCodexAgents({ sourceRoot, destinationRoot, dryRun = false }) {
  const sourceAgents = await listCodexAgentFiles(sourceRoot);
  const sourceByName = new Map(sourceAgents.map((entry) => [entry.name, entry.path]));

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

  for (const sourceAgent of sourceAgents) {
    const sourceFingerprint = await computeFileFingerprint(sourceAgent.path);
    const targetFile = path.join(destinationRoot, sourceAgent.name);
    const marker = await readFileMarker(destinationRoot, sourceAgent.name);

    if (!(await pathExists(targetFile))) {
      result.added.push({
        name: sourceAgent.name,
        kind: CODEX_AGENT_KIND,
        sourceFile: sourceAgent.path,
        targetFile,
        fingerprint: sourceFingerprint,
      });
      continue;
    }

    if (!isOwnedMarker(marker) || marker.sourceKind !== CODEX_AGENT_KIND) {
      result.conflicts.push({
        name: sourceAgent.name,
        kind: CODEX_AGENT_KIND,
        targetFile,
        reason: "destination exists but is not owned by Cflow",
      });
      continue;
    }

    const targetFingerprint = await computeFileFingerprint(targetFile);
    if (targetFingerprint === sourceFingerprint) {
      result.unchanged.push({
        name: sourceAgent.name,
        kind: CODEX_AGENT_KIND,
        targetFile,
        fingerprint: sourceFingerprint,
      });
      continue;
    }

    result.updated.push({
      name: sourceAgent.name,
      kind: CODEX_AGENT_KIND,
      sourceFile: sourceAgent.path,
      targetFile,
      fingerprint: sourceFingerprint,
      previousFingerprint: targetFingerprint,
    });
  }

  for (const entry of await listFileMarkers(destinationRoot)) {
    if (
      !isOwnedMarker(entry.marker) ||
      entry.marker.sourceKind !== CODEX_AGENT_KIND ||
      sourceByName.has(entry.fileName)
    ) {
      continue;
    }

    result.pruned.push({
      name: entry.fileName,
      kind: CODEX_AGENT_KIND,
      targetFile: path.join(destinationRoot, entry.fileName),
    });
  }

  if (dryRun || result.conflicts.length > 0) {
    return result;
  }

  await ensureDirectory(destinationRoot);

  for (const entry of [...result.added, ...result.updated]) {
    await copyFile(entry.sourceFile, entry.targetFile);
    await writeFileMarker(destinationRoot, entry.name, {
      sourceSkill: entry.name,
      sourceKind: CODEX_AGENT_KIND,
      fingerprint: entry.fingerprint,
    });
  }

  for (const entry of result.pruned) {
    await rm(entry.targetFile, { force: true });
    await removeFileMarker(destinationRoot, entry.name);
  }

  await removeEmptyMarkerDirectory(destinationRoot);

  result.applied = true;
  return result;
}

export async function listCodexAgentFiles(root) {
  if (!(await pathExists(root))) {
    return [];
  }

  const entries = await readdir(root, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".toml"))
    .map((entry) => ({
      name: entry.name,
      path: path.join(root, entry.name),
    }))
    .sort((left, right) => left.name.localeCompare(right.name));
}
