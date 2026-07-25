import path from "node:path";
import { readFile, writeFile } from "node:fs/promises";

export const MARKER_FILE = ".cflow-sync.json";
export const MARKER_OWNER = "clean-flow";
export const MARKER_PACK = "cflow";

export function markerPath(skillDir) {
  return path.join(skillDir, MARKER_FILE);
}

export async function readMarker(skillDir) {
  return readMarkerFile(markerPath(skillDir), `in ${skillDir}`);
}

async function readMarkerFile(pathname, context) {
  try {
    const raw = await readFile(pathname, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    if (error?.code === "ENOENT") {
      return null;
    }
    throw new Error(`Failed to read marker ${context}: ${error.message}`);
  }
}

export function isOwnedMarker(marker) {
  return Boolean(marker) &&
    marker.owner === MARKER_OWNER &&
    marker.pack === MARKER_PACK;
}

export async function writeMarker(skillDir, { sourceSkill, sourceKind = "skill", fingerprint }) {
  return writeMarkerFile(markerPath(skillDir), { sourceSkill, sourceKind, fingerprint });
}

async function writeMarkerFile(pathname, { sourceSkill, sourceKind = "skill", fingerprint }) {
  const payload = {
    owner: MARKER_OWNER,
    pack: MARKER_PACK,
    sourceSkill,
    sourceKind,
    fingerprint,
  };

  await writeFile(pathname, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  return payload;
}
