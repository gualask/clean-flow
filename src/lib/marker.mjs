import path from "node:path";
import { mkdir, readdir, readFile, rm, rmdir, writeFile } from "node:fs/promises";

export const MARKER_FILE = ".cflow-sync.json";
export const MARKER_DIRECTORY = ".cflow-sync";
export const MARKER_OWNER = "clean-flow";
export const MARKER_PACK = "cflow";

export function markerPath(skillDir) {
  return path.join(skillDir, MARKER_FILE);
}

export async function readMarker(skillDir) {
  return readMarkerFile(markerPath(skillDir), `in ${skillDir}`);
}

export function fileMarkerPath(rootDir, fileName) {
  return path.join(rootDir, MARKER_DIRECTORY, `${fileName}.json`);
}

export async function readFileMarker(rootDir, fileName) {
  return readMarkerFile(fileMarkerPath(rootDir, fileName), `for ${fileName} in ${rootDir}`);
}

export async function listFileMarkers(rootDir) {
  const markerRoot = path.join(rootDir, MARKER_DIRECTORY);

  try {
    const entries = await readdir(markerRoot, { withFileTypes: true });
    const markers = [];

    for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
      if (!entry.isFile() || !entry.name.endsWith(".json")) {
        continue;
      }

      const fileName = entry.name.slice(0, -".json".length);
      const marker = await readMarkerFile(
        path.join(markerRoot, entry.name),
        `for ${fileName} in ${rootDir}`,
      );

      if (marker) {
        markers.push({ fileName, marker });
      }
    }

    return markers;
  } catch (error) {
    if (error?.code === "ENOENT") {
      return [];
    }
    throw error;
  }
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

export async function writeFileMarker(
  rootDir,
  fileName,
  { sourceSkill, sourceKind = "codex-agent", fingerprint },
) {
  const pathname = fileMarkerPath(rootDir, fileName);

  await mkdir(path.dirname(pathname), { recursive: true });
  return writeMarkerFile(pathname, { sourceSkill, sourceKind, fingerprint });
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

export async function removeFileMarker(rootDir, fileName) {
  await rm(fileMarkerPath(rootDir, fileName), { force: true });
}

export async function removeEmptyMarkerDirectory(rootDir) {
  try {
    await rmdir(path.join(rootDir, MARKER_DIRECTORY));
  } catch (error) {
    if (error?.code === "ENOENT" || error?.code === "ENOTEMPTY") {
      return;
    }
    throw error;
  }
}
