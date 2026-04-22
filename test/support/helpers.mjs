import os from "node:os";
import path from "node:path";
import { mkdir, mkdtemp, readdir, readFile, writeFile } from "node:fs/promises";

export async function makeTempWorkspace(prefix = "clean-flow-") {
  return mkdtemp(path.join(os.tmpdir(), prefix));
}

export async function writeSkill(root, name, files = {}) {
  const skillDir = path.join(root, name);
  const defaultFiles = {
    "SKILL.md": `---\nname: "${name}"\ndescription: "Test skill ${name}"\n---\n\n# ${name}\n`,
    "agents/openai.yaml": "allow_implicit_invocation: false\n",
  };

  for (const [relativePath, content] of Object.entries({ ...defaultFiles, ...files })) {
    const absolutePath = path.join(skillDir, relativePath);
    await mkdir(path.dirname(absolutePath), { recursive: true });
    await writeFile(absolutePath, content, "utf8");
  }

  return skillDir;
}

export async function listDirectoryNames(root) {
  try {
    const entries = await readdir(root, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort((left, right) => left.localeCompare(right));
  } catch (error) {
    if (error?.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

export async function readText(pathname) {
  return readFile(pathname, "utf8");
}
