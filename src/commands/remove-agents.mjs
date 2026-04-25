import { rm } from "node:fs/promises";

import { pathExists } from "../lib/fs.mjs";
import { listCodexAgentFiles } from "./install-agents.mjs";
import {
  isOwnedMarker,
  listFileMarkers,
  readFileMarker,
  removeEmptyMarkerDirectory,
  removeFileMarker,
} from "../lib/marker.mjs";

const CODEX_AGENT_KIND = "codex-agent";

export async function removeCodexAgents({ destinationRoot, dryRun = false }) {
  const targetAgents = await listCodexAgentFiles(destinationRoot);
  const targetByName = new Map(targetAgents.map((entry) => [entry.name, entry.path]));
  const result = {
    command: "remove",
    destinationRoot,
    dryRun,
    removed: [],
    kept: [],
    conflicts: [],
    applied: false,
  };

  for (const targetAgent of targetAgents) {
    const marker = await readFileMarker(destinationRoot, targetAgent.name);
    if (isOwnedMarker(marker) && marker.sourceKind === CODEX_AGENT_KIND) {
      result.removed.push({
        name: targetAgent.name,
        kind: CODEX_AGENT_KIND,
        targetFile: targetAgent.path,
      });
      continue;
    }

    result.kept.push({
      name: targetAgent.name,
      kind: CODEX_AGENT_KIND,
      targetFile: targetAgent.path,
    });
  }

  const staleMarkers = [];
  for (const entry of await listFileMarkers(destinationRoot)) {
    if (
      isOwnedMarker(entry.marker) &&
      entry.marker.sourceKind === CODEX_AGENT_KIND &&
      !targetByName.has(entry.fileName)
    ) {
      staleMarkers.push(entry.fileName);
    }
  }

  if (dryRun) {
    return result;
  }

  for (const entry of result.removed) {
    if (await pathExists(entry.targetFile)) {
      await rm(entry.targetFile, { force: true });
    }
    await removeFileMarker(destinationRoot, entry.name);
  }

  for (const fileName of staleMarkers) {
    await removeFileMarker(destinationRoot, fileName);
  }

  await removeEmptyMarkerDirectory(destinationRoot);

  result.applied = true;
  return result;
}
