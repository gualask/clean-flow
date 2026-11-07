import path from "node:path";
import { readdir, stat } from "node:fs/promises";

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
