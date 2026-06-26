import os from "node:os";
import path from "node:path";
import { cp, mkdir, mkdtemp, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";

import { listSkillDirectories, pathExists } from "./fs.mjs";

export const VENDOR_CONFIG_RELATIVE_PATH = "_shared/vendor.json";

const VENDOR_CONFIG_VERSION = 1;
const PLACEHOLDER_LABEL = "Cflow vendored placeholder";
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
const RUNTIME_SHARED_PATTERNS = [
  "../_shared/",
  "../../_shared/",
  "_shared/references/",
  "_shared/scripts/",
];

export async function createMaterializedSkills(sourceRoot) {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), "cflow-skills-"));
  const skillsRoot = path.join(tempRoot, "skills");

  try {
    await materializeSkills({ sourceRoot, destinationRoot: skillsRoot });
  } catch (error) {
    await rm(tempRoot, { recursive: true, force: true });
    throw error;
  }

  return {
    skillsRoot,
    cleanup: () => rm(tempRoot, { recursive: true, force: true }),
  };
}

export async function materializeSkills({ sourceRoot, destinationRoot }) {
  const config = await readVendorConfig(sourceRoot);
  const skills = await listSkillDirectories(sourceRoot);

  await rm(destinationRoot, { recursive: true, force: true });
  await mkdir(destinationRoot, { recursive: true });

  for (const skill of skills) {
    await cp(skill.path, path.join(destinationRoot, skill.name), { recursive: true });
  }

  if (config !== null) {
    await vendorConfiguredFiles({ sourceRoot, destinationRoot, config, skills });
  }

  await assertMaterializedRuntimeTree(destinationRoot);

  return { skillsRoot: destinationRoot };
}

async function readVendorConfig(sourceRoot) {
  const configPath = path.join(sourceRoot, VENDOR_CONFIG_RELATIVE_PATH);

  if (!(await pathExists(configPath))) {
    return null;
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

async function vendorConfiguredFiles({ sourceRoot, destinationRoot, config, skills }) {
  const skillNames = new Set(skills.map((skill) => skill.name));

  for (const [skillName, skillConfig] of Object.entries(config.skills)) {
    if (!skillNames.has(skillName)) {
      throw new Error(`Vendor config references unknown skill: ${skillName}`);
    }

    assertVendorSkillConfig(skillName, skillConfig);

    for (const item of skillConfig.references ?? []) {
      await replacePlaceholderWithSharedFile({
        sourceRoot,
        destinationRoot,
        skillName,
        section: "references",
        item,
        commentStyle: "markdown",
      });
    }

    for (const item of skillConfig.scripts ?? []) {
      await replacePlaceholderWithSharedFile({
        sourceRoot,
        destinationRoot,
        skillName,
        section: "scripts",
        item,
        commentStyle: "line",
      });
    }
  }
}

function assertVendorSkillConfig(skillName, skillConfig) {
  if (!skillConfig || typeof skillConfig !== "object" || Array.isArray(skillConfig)) {
    throw new Error(`Vendor config for ${skillName} must be an object`);
  }

  for (const key of Object.keys(skillConfig)) {
    if (!["references", "scripts"].includes(key)) {
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

async function replacePlaceholderWithSharedFile({
  sourceRoot,
  destinationRoot,
  skillName,
  section,
  item,
  commentStyle,
}) {
  const sharedPath = path.join(sourceRoot, "_shared", section, item);
  const placeholderPath = path.join(sourceRoot, skillName, section, item);
  const targetPath = path.join(destinationRoot, skillName, section, item);

  await assertFileExists(sharedPath, `Vendored source file is missing: ${sharedPath}`);
  await assertFileExists(placeholderPath, `Vendored placeholder is missing: ${placeholderPath}`);
  await assertPlaceholderLine({ placeholderPath, sharedPath, commentStyle });

  await mkdir(path.dirname(targetPath), { recursive: true });
  await writeFile(targetPath, await readFile(sharedPath), "utf8");
}

async function assertFileExists(filePath, message) {
  const stats = await stat(filePath).catch((error) => {
    if (error?.code === "ENOENT") {
      return null;
    }
    throw error;
  });

  if (!stats?.isFile()) {
    throw new Error(message);
  }
}

async function assertPlaceholderLine({ placeholderPath, sharedPath, commentStyle }) {
  const text = await readFile(placeholderPath, "utf8");
  const firstLine = text.split(/\r?\n/, 1)[0];
  const relativeSharedPath = path
    .relative(path.dirname(placeholderPath), sharedPath)
    .split(path.sep)
    .join("/");
  const expected =
    commentStyle === "markdown"
      ? `<!-- ${PLACEHOLDER_LABEL}: ${relativeSharedPath} -->`
      : `// ${PLACEHOLDER_LABEL}: ${relativeSharedPath}`;

  if (firstLine !== expected) {
    throw new Error(
      `Vendored placeholder ${placeholderPath} must start with ${JSON.stringify(expected)}`,
    );
  }
}

async function assertMaterializedRuntimeTree(destinationRoot) {
  const files = await listTextRuntimeFiles(destinationRoot);

  for (const filePath of files) {
    const text = await readFile(filePath, "utf8");

    if (text.includes(PLACEHOLDER_LABEL)) {
      throw new Error(`Materialized skill still contains a vendored placeholder: ${filePath}`);
    }

    for (const pattern of RUNTIME_SHARED_PATTERNS) {
      if (text.includes(pattern)) {
        throw new Error(
          `Materialized skill still references shared source path ${JSON.stringify(pattern)}: ${filePath}`,
        );
      }
    }
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
