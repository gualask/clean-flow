import path from "node:path";
import { cp, mkdtemp, mkdir, readdir, rename, rm, stat } from "node:fs/promises";
import { tryCleanup } from "./cleanup.mjs";

export const TEMP_DIRECTORY_PREFIX = ".cflow-tmp-";

export async function pathExists(pathname) {
  try {
    await stat(pathname);
    return true;
  } catch (error) {
    if (error?.code === "ENOENT") {
      return false;
    }
    throw error;
  }
}

export async function ensureDirectory(pathname) {
  await mkdir(pathname, { recursive: true });
}

export async function removeTempDirectories(root) {
  const directories = await listDirectories(root);

  for (const directory of directories) {
    if (directory.name.startsWith(TEMP_DIRECTORY_PREFIX)) {
      // Interrupted staging can still contain skills inside the discovery tree.
      await removeDirectory(directory.path);
    }
  }
}

export async function listDirectories(root) {
  if (!(await pathExists(root))) {
    return [];
  }

  const entries = await readdir(root, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => ({
      name: entry.name,
      path: path.join(root, entry.name),
    }))
    .sort((left, right) => left.name.localeCompare(right.name));
}

export async function listSkillDirectories(root) {
  const directories = await listDirectories(root);
  const skills = [];

  for (const directory of directories) {
    if (await pathExists(path.join(directory.path, "SKILL.md"))) {
      skills.push(directory);
    }
  }

  return skills;
}

export async function listPackageDirectories(root) {
  const directories = await listDirectories(root);
  const packages = [];

  for (const directory of directories) {
    if (await pathExists(path.join(directory.path, "SKILL.md"))) {
      packages.push({ ...directory, kind: "skill" });
    }
  }

  return packages;
}

export async function replaceDirectoryFromSource(sourceDir, destinationDir, prepare, { onWarning } = {}) {
  const destinationRoot = path.dirname(destinationDir);
  await ensureDirectory(destinationRoot);

  const tempParent = await mkdtemp(
    path.join(destinationRoot, `${TEMP_DIRECTORY_PREFIX}${path.basename(destinationDir)}-`),
  );
  const stagedDir = path.join(tempParent, path.basename(destinationDir));

  try {
    await cp(sourceDir, stagedDir, { recursive: true });
    if (prepare) {
      await prepare(stagedDir);
    }
    await rm(destinationDir, { recursive: true, force: true });
    await rename(stagedDir, destinationDir);
  } finally {
    await cleanupDirectory(tempParent, onWarning);
  }
}

export async function removeDirectory(pathname) {
  await rm(pathname, { recursive: true, force: true });
}

export async function cleanupDirectory(pathname, onWarning) {
  return tryCleanup(async () => {
    await removeDirectory(pathname);
    return true;
  }, onWarning);
}
