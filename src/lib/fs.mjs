import path from "node:path";
import { cp, mkdtemp, mkdir, readdir, rename, rm, stat } from "node:fs/promises";

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

export async function removeTempDirectories(root, prefix = ".cflow-tmp-") {
  const directories = await listDirectories(root);

  for (const directory of directories) {
    if (directory.name.startsWith(prefix)) {
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

export async function replaceDirectoryFromSource(sourceDir, destinationDir, prepare) {
  const destinationRoot = path.dirname(destinationDir);
  await ensureDirectory(destinationRoot);

  const tempParent = await mkdtemp(
    path.join(destinationRoot, `.cflow-tmp-${path.basename(destinationDir)}-`),
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
    await rm(tempParent, { recursive: true, force: true });
  }
}

export async function removeDirectory(pathname) {
  await rm(pathname, { recursive: true, force: true });
}
