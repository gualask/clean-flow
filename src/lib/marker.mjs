// Temporary: reads the ownership marker the old installer wrote into each skill it copied, so that
// `cflow-skills migrate` removes only those. Delete with src/commands/migrate.mjs.

import path from "node:path";
import { readFile } from "node:fs/promises";

export const MARKER_FILE = ".cflow-sync.json";
const MARKER_OWNER = "clean-flow";
const MARKER_PACK = "cflow";

export async function readMarker(skillDir) {
  const pathname = path.join(skillDir, MARKER_FILE);
  try {
    return JSON.parse(await readFile(pathname, "utf8"));
  } catch (error) {
    if (error?.code === "ENOENT") {
      return null;
    }
    throw new Error(`Failed to read marker in ${skillDir}: ${error.message}`);
  }
}

export function isOwnedMarker(marker) {
  return Boolean(marker) && marker.owner === MARKER_OWNER && marker.pack === MARKER_PACK;
}
