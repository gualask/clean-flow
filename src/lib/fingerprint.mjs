import { createHash } from "node:crypto";
import path from "node:path";
import { readdir, readFile } from "node:fs/promises";

import { MARKER_FILE } from "./marker.mjs";

const IGNORED_FILES = new Set([MARKER_FILE, ".DS_Store"]);

export async function computeSkillFingerprint(skillDir) {
  const hash = createHash("sha256");
  const files = await collectFiles(skillDir, skillDir);

  for (const file of files) {
    hash.update(file.relativePath);
    hash.update("\0");
    hash.update(await readFile(file.absolutePath));
    hash.update("\0");
  }

  return `sha256:${hash.digest("hex")}`;
}

async function collectFiles(rootDir, currentDir) {
  const entries = await readdir(currentDir, { withFileTypes: true });
  const files = [];

  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    const absolutePath = path.join(currentDir, entry.name);
    const relativePath = path.relative(rootDir, absolutePath).split(path.sep).join("/");

    if (entry.isSymbolicLink()) {
      throw new Error(`Symlinks are not supported in skills: ${absolutePath}`);
    }

    if (entry.isDirectory()) {
      files.push(...(await collectFiles(rootDir, absolutePath)));
      continue;
    }

    if (entry.isFile() && !IGNORED_FILES.has(entry.name)) {
      files.push({ absolutePath, relativePath });
    }
  }

  return files;
}
