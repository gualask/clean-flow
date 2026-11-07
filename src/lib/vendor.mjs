import path from "node:path";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";

import { listSkillDirectories, pathExists } from "./fs.mjs";

const VENDOR_CONFIG_FILE = "vendor.json";

const VENDOR_CONFIG_VERSION = 1;
const VENDOR_SECTIONS = ["references", "scripts"];
const TEXT_RUNTIME_EXTENSIONS = new Set([
  ".js",
  ".json",
  ".jsx",
  ".md",
  ".mjs",
  ".toml",
  ".ts",
  ".tsx",
  ".yaml",
  ".yml",
]);
// A skill ships on its own: its text points at its own copies, never at the shared source tree.
const RUNTIME_SHARED_PATTERNS = [
  "../shared/",
  "../../shared/",
  "_shared/",
];

// Each vendored copy: the shared source it must equal and the skill path it lives at.
export async function listVendoredCopies({ skillsRoot, sharedRoot }) {
  const config = await readVendorConfig(sharedRoot);
  const skillNames = new Set((await listSkillDirectories(skillsRoot)).map(skill => skill.name));
  const copies = [];

  for (const [skillName, skillConfig] of Object.entries(config.skills)) {
    if (!skillNames.has(skillName)) {
      throw new Error(`Vendor config references unknown skill: ${skillName}`);
    }
    assertVendorSkillConfig(skillName, skillConfig);

    for (const section of VENDOR_SECTIONS) {
      for (const item of skillConfig[section] ?? []) {
        copies.push({
          skillName,
          section,
          item,
          sharedPath: path.join(sharedRoot, section, item),
          copyPath: path.join(skillsRoot, skillName, section, item),
        });
      }
    }
  }

  return copies;
}

// Writes every vendored copy from its shared source; returns the copies that changed.
export async function vendorSharedFiles(roots) {
  const written = [];

  for (const copy of await listVendoredCopies(roots)) {
    const content = await readSharedFile(copy.sharedPath);
    const current = await readFileOrNull(copy.copyPath);
    if (current !== null && current.equals(content)) {
      continue;
    }
    await mkdir(path.dirname(copy.copyPath), { recursive: true });
    await writeFile(copy.copyPath, content);
    written.push(copy);
  }

  return written;
}

// Lists vendored copies that are missing or differ from their shared source, and skill files that
// still point at the shared source tree instead of their own copy.
export async function findVendorDrift(roots) {
  const problems = [];

  for (const copy of await listVendoredCopies(roots)) {
    const content = await readSharedFile(copy.sharedPath);
    const current = await readFileOrNull(copy.copyPath);
    if (current === null) {
      problems.push({ path: copy.copyPath, problem: "missing vendored copy" });
    } else if (!current.equals(content)) {
      problems.push({ path: copy.copyPath, problem: `differs from ${copy.sharedPath}` });
    }
  }

  for (const skill of await listSkillDirectories(roots.skillsRoot)) {
    for (const filePath of await listTextRuntimeFiles(skill.path)) {
      const text = await readFile(filePath, "utf8");
      const pattern = RUNTIME_SHARED_PATTERNS.find(candidate => text.includes(candidate));
      if (pattern) {
        problems.push({ path: filePath, problem: `references shared source path ${JSON.stringify(pattern)}` });
      }
    }
  }

  return problems;
}

async function readVendorConfig(sharedRoot) {
  const configPath = path.join(sharedRoot, VENDOR_CONFIG_FILE);

  if (!(await pathExists(configPath))) {
    return { version: VENDOR_CONFIG_VERSION, skills: {} };
  }

  let config;
  try {
    config = JSON.parse(await readFile(configPath, "utf8"));
  } catch (error) {
    throw new Error(`Invalid vendor config ${configPath}: ${error.message}`);
  }

  if (config.version !== VENDOR_CONFIG_VERSION) {
    throw new Error(
      `Unsupported vendor config version in ${configPath}: ${JSON.stringify(config.version)}`,
    );
  }

  if (!config.skills || typeof config.skills !== "object" || Array.isArray(config.skills)) {
    throw new Error(`Vendor config ${configPath} must define an object at "skills"`);
  }

  return config;
}

function assertVendorSkillConfig(skillName, skillConfig) {
  if (!skillConfig || typeof skillConfig !== "object" || Array.isArray(skillConfig)) {
    throw new Error(`Vendor config for ${skillName} must be an object`);
  }

  for (const key of Object.keys(skillConfig)) {
    if (!VENDOR_SECTIONS.includes(key)) {
      throw new Error(`Vendor config for ${skillName} has unknown key: ${key}`);
    }
    if (!Array.isArray(skillConfig[key])) {
      throw new Error(`Vendor config for ${skillName}.${key} must be an array`);
    }
    for (const item of skillConfig[key]) {
      assertSafeVendorItem(skillName, key, item);
    }
  }
}

function assertSafeVendorItem(skillName, section, item) {
  if (typeof item !== "string" || item.trim() === "") {
    throw new Error(`Vendor config for ${skillName}.${section} contains an invalid path`);
  }

  if (path.isAbsolute(item) || item.includes("\\") || item.split("/").some(isUnsafeSegment)) {
    throw new Error(`Vendor config for ${skillName}.${section} contains an unsafe path: ${item}`);
  }
}

function isUnsafeSegment(segment) {
  return segment === "" || segment === "." || segment === "..";
}

async function readSharedFile(sharedPath) {
  const content = await readFileOrNull(sharedPath);
  if (content === null) {
    throw new Error(`Vendored source file is missing: ${sharedPath}`);
  }
  return content;
}

async function readFileOrNull(filePath) {
  try {
    return await readFile(filePath);
  } catch (error) {
    if (error?.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

async function listTextRuntimeFiles(currentDir) {
  const entries = await readdir(currentDir, { withFileTypes: true });
  const files = [];

  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    const absolutePath = path.join(currentDir, entry.name);

    if (entry.isSymbolicLink()) {
      throw new Error(`Symlinks are not supported in skills: ${absolutePath}`);
    }
    if (entry.isDirectory()) {
      files.push(...(await listTextRuntimeFiles(absolutePath)));
      continue;
    }
    if (entry.isFile() && isTextRuntimeFile(entry.name)) {
      files.push(absolutePath);
    }
  }

  return files;
}

function isTextRuntimeFile(fileName) {
  return fileName === "SKILL.md" || TEXT_RUNTIME_EXTENSIONS.has(path.extname(fileName));
}
