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

export async function writeSupportDirectory(root, name = "_shared", files = {}) {
  const supportDir = path.join(root, name);
  const defaultFiles = {
    "references/example.md": "# Example\n",
  };

  for (const [relativePath, content] of Object.entries({ ...defaultFiles, ...files })) {
    const absolutePath = path.join(supportDir, relativePath);
    await mkdir(path.dirname(absolutePath), { recursive: true });
    await writeFile(absolutePath, content, "utf8");
  }

  return supportDir;
}

export async function writeLegacyCodexAgentFixture(
  root,
  name = "cflow_finding_derisk_recon.toml",
  {
    marker = {
      owner: "clean-flow",
      pack: "cflow",
      sourceSkill: name,
      sourceKind: "codex-agent",
      fingerprint: "sha256:legacy",
    },
    writeAgent = true,
  } = {},
) {
  const agentFile = path.join(root, name);
  const markerFile = path.join(root, ".cflow-sync", `${name}.json`);

  if (writeAgent) {
    await mkdir(root, { recursive: true });
    await writeFile(agentFile, `name = "${path.basename(name, ".toml")}"\n`, "utf8");
  }

  if (marker) {
    await mkdir(path.dirname(markerFile), { recursive: true });
    await writeFile(markerFile, `${JSON.stringify(marker, null, 2)}\n`, "utf8");
  }

  return { agentFile, markerFile };
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

export async function listFileNames(root) {
  try {
    const entries = await readdir(root, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile())
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
