// Temporary: moves an installation made by the old `cflow-skills install` onto the plugin.
// Running it again changes nothing. Delete this file, src/lib/marker.mjs, src/index.mjs and
// bin/ once no installation from the old installer is left to migrate.

import { execFile } from "node:child_process";
import path from "node:path";
import { access, constants, readFile, rm, rmdir, writeFile } from "node:fs/promises";
import { promisify } from "node:util";

import { listDirectories, pathExists } from "../lib/fs.mjs";
import { isOwnedMarker, readMarker } from "../lib/marker.mjs";

export const MARKETPLACE_SOURCE = "gualask/clean-flow";
export const PLUGIN_ID = "cflow@clean-flow";

export function codexInstallCommands(marketplaceSource = MARKETPLACE_SOURCE) {
  return [
    ["plugin", "marketplace", "add", marketplaceSource],
    ["plugin", "add", PLUGIN_ID],
  ];
}

// Where VS Code and its forks keep extensions; the Codex extension (openai.chatgpt-*) ships its
// own codex under bin/<platform>/ and reads the same CODEX_HOME as the CLI.
const EXTENSION_ROOTS = [
  ".vscode/extensions",
  ".vscode-insiders/extensions",
  ".vscode-oss/extensions",
  ".cursor/extensions",
  ".windsurf/extensions",
];
const CODEX_BINARY = process.platform === "win32" ? "codex.exe" : "codex";

const FRICTION_SCRIPT = path.join("bin", "friction.mjs");
const FRICTION_BEGIN = "<!-- BEGIN CFLOW FRICTION -->";
const FRICTION_END = "<!-- END CFLOW FRICTION -->";

export async function migrate({
  skillsRoot,
  friction = null,
  dryRun = false,
  environment = process.env,
  homeDirectory,
  marketplaceSource = MARKETPLACE_SOURCE,
  runCodex = null,
}) {
  const result = {
    skillsRoot,
    dryRun,
    codex: null,
    removed: [],
    friction: [],
    plugin: null,
  };

  if (!runCodex) {
    result.codex = await findCodex({ environment, homeDirectory });
    if (!result.codex) {
      // Without codex the plugin cannot be installed, so the old copies stay: nothing changes.
      result.plugin = { status: "codex-missing", commands: codexInstallCommands(marketplaceSource) };
      return result;
    }
    runCodex = codexRunner(result.codex.path, environment);
  }

  // The plugin first: if its install fails, the old copies stay and the user keeps working skills.
  result.plugin = await installCodexPlugin({ dryRun, runCodex, marketplaceSource });

  for (const directory of await listDirectories(skillsRoot)) {
    if (isOwnedMarker(await readMarker(directory.path))) {
      result.removed.push(directory.name);
      if (!dryRun) {
        await rm(directory.path, { recursive: true, force: true });
      }
    }
  }

  if (friction) {
    result.friction = await removeFriction({ ...friction, dryRun });
  }

  return result;
}

// The friction log is gone from the pack: drop its logger and its AGENTS.md block, keep its logs.
async function removeFriction({ cflowHome, agentsFile, dryRun }) {
  const actions = [];
  const script = path.join(cflowHome, FRICTION_SCRIPT);

  if (await pathExists(script)) {
    actions.push(`removed ${script}`);
    if (!dryRun) {
      await rm(script, { force: true });
      await removeIfEmpty(path.dirname(script));
      await removeIfEmpty(cflowHome);
    }
  }

  const agents = await readFileOrNull(agentsFile);
  const stripped = agents === null ? null : stripFrictionBlock(agents);
  if (stripped !== null) {
    actions.push(`removed the friction block from ${agentsFile}`);
    if (!dryRun) {
      await writeFile(agentsFile, stripped, "utf8");
    }
  }

  return actions;
}

// codex on PATH first, else the newest one bundled in a Codex IDE extension.
export async function findCodex({ environment, homeDirectory }) {
  for (const directory of (environment.PATH ?? "").split(path.delimiter).filter(Boolean)) {
    const candidate = path.join(directory, CODEX_BINARY);
    if (await isExecutable(candidate)) {
      return { path: candidate, from: "PATH" };
    }
  }

  const bundled = [];
  for (const root of EXTENSION_ROOTS) {
    for (const extension of await listDirectories(path.join(homeDirectory, root))) {
      if (!extension.name.startsWith("openai.chatgpt-")) {
        continue;
      }
      for (const platform of await listDirectories(path.join(extension.path, "bin"))) {
        const candidate = path.join(platform.path, CODEX_BINARY);
        if (await isExecutable(candidate)) {
          bundled.push({ path: candidate, from: "extension", version: extensionVersion(extension.name) });
        }
      }
    }
  }
  bundled.sort((left, right) => compareVersions(right.version, left.version));
  return bundled[0] ? { path: bundled[0].path, from: "extension" } : null;
}

function extensionVersion(directoryName) {
  return (directoryName.match(/^openai\.chatgpt-(\d+(?:\.\d+)*)/)?.[1] ?? "0").split(".").map(Number);
}

function compareVersions(left, right) {
  for (let index = 0; index < Math.max(left.length, right.length); index += 1) {
    const difference = (left[index] ?? 0) - (right[index] ?? 0);
    if (difference !== 0) {
      return difference;
    }
  }
  return 0;
}

async function isExecutable(candidate) {
  try {
    await access(candidate, constants.X_OK);
    return true;
  } catch {
    return false;
  }
}

function codexRunner(binary, environment) {
  return async (args) => {
    const { stdout } = await promisify(execFile)(binary, args, { env: environment });
    return stdout;
  };
}

async function installCodexPlugin({ dryRun, runCodex, marketplaceSource }) {
  if (isPluginInstalled(await runCodex(["plugin", "list"]))) {
    return { status: "already-installed" };
  }
  if (dryRun) {
    return { status: "would-install", commands: codexInstallCommands(marketplaceSource) };
  }
  for (const args of codexInstallCommands(marketplaceSource)) {
    await runCodex(args);
  }
  return { status: "installed" };
}

export function isPluginInstalled(listing) {
  return listing.split("\n").some((line) => {
    const [id, ...rest] = line.trim().split(/\s+/);
    const status = rest.join(" ");
    return id === PLUGIN_ID && status.startsWith("installed");
  });
}

function stripFrictionBlock(content) {
  const start = content.indexOf(FRICTION_BEGIN);
  const endMarker = start === -1 ? -1 : content.indexOf(FRICTION_END, start);
  if (endMarker === -1) {
    return null;
  }

  const before = content.slice(0, start).replace(/\n+$/, "\n");
  const after = content.slice(endMarker + FRICTION_END.length).replace(/^\n+/, "");
  if (before.trim() === "" && after.trim() === "") {
    return "";
  }
  return after === "" ? before : `${before}\n${after}`;
}

async function readFileOrNull(pathname) {
  try {
    return await readFile(pathname, "utf8");
  } catch (error) {
    if (error?.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

async function removeIfEmpty(pathname) {
  try {
    await rmdir(pathname);
  } catch (error) {
    if (!["ENOENT", "ENOTEMPTY", "EEXIST"].includes(error?.code)) {
      throw error;
    }
  }
}
