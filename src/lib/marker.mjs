import path from "node:path";
import { readFile, writeFile } from "node:fs/promises";

export const MARKER_FILE = ".cflow-sync.json";
export const MARKER_OWNER = "clean-flow";
export const MARKER_PACK = "cflow";

export function markerPath(skillDir) {
  return path.join(skillDir, MARKER_FILE);
}

export async function readMarker(skillDir) {
  try {
    const raw = await readFile(markerPath(skillDir), "utf8");
    return JSON.parse(raw);
  } catch (error) {
    if (error?.code === "ENOENT") {
      return null;
    }
    throw new Error(`Failed to read marker in ${skillDir}: ${error.message}`);
  }
}

export function isOwnedMarker(marker) {
  return Boolean(marker) &&
    marker.owner === MARKER_OWNER &&
    marker.pack === MARKER_PACK;
}

export async function writeMarker(skillDir, { sourceSkill, sourceKind = "skill", fingerprint }) {
  const payload = {
    owner: MARKER_OWNER,
    pack: MARKER_PACK,
    sourceSkill,
    sourceKind,
    fingerprint,
  };

  await writeFile(markerPath(skillDir), `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  return payload;
}
