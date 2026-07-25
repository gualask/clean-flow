import path from "node:path";
import { readdir, readFile, rm, rmdir } from "node:fs/promises";

import { isOwnedMarker } from "../lib/marker.mjs";

const LEGACY_AGENT_KIND = "legacy-codex-agent";
const LEGACY_MARKER_DIRECTORY = ".cflow-sync";
const LEGACY_MARKER_SUFFIX = ".toml.json";

export async function pruneLegacyCodexAgents({ destinationRoot, dryRun = false }) {
  const markerRoot = path.join(destinationRoot, LEGACY_MARKER_DIRECTORY);
  const removed = [];

  for (const entry of await listMarkerFiles(markerRoot)) {
    const markerFile = path.join(markerRoot, entry.name);
    const marker = await readLegacyMarker(markerFile);

    if (!isOwnedMarker(marker) || marker.sourceKind !== "codex-agent") {
      continue;
    }

    const name = entry.name.slice(0, -".json".length);
    removed.push({
      name,
      kind: LEGACY_AGENT_KIND,
      targetFile: path.join(destinationRoot, name),
      markerFile,
    });
  }

  if (dryRun) {
    return { destinationRoot, dryRun, removed, applied: false };
  }

  for (const entry of removed) {
    await rm(entry.targetFile, { force: true });
    await rm(entry.markerFile, { force: true });
  }

  await removeEmptyMarkerDirectory(markerRoot);
  return { destinationRoot, dryRun, removed, applied: true };
}

async function listMarkerFiles(markerRoot) {
  try {
    const entries = await readdir(markerRoot, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && entry.name.endsWith(LEGACY_MARKER_SUFFIX))
      .sort((left, right) => left.name.localeCompare(right.name));
  } catch (error) {
    if (error?.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

async function readLegacyMarker(markerFile) {
  try {
    return JSON.parse(await readFile(markerFile, "utf8"));
  } catch (error) {
    if (error?.code === "ENOENT" || error instanceof SyntaxError) {
      return null;
    }
    throw error;
  }
}

async function removeEmptyMarkerDirectory(markerRoot) {
  try {
    await rmdir(markerRoot);
  } catch (error) {
    if (error?.code === "ENOENT" || error?.code === "ENOTEMPTY") {
      return;
    }
    throw error;
  }
}
