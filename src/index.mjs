import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { installCodexAgents } from "./commands/install-agents.mjs";
import { installSkills } from "./commands/install.mjs";
import { removeCodexAgents } from "./commands/remove-agents.mjs";
import { removeSkills } from "./commands/remove.mjs";

const PACKAGE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SKILLS_SOURCE_ROOT = path.join(PACKAGE_ROOT, "skills");
const CODEX_AGENTS_SOURCE_ROOT = path.join(PACKAGE_ROOT, "skills", "_codex_agents");

const HELP_TEXT = `Usage:
  cflow-skills install <repo-path> [--dry-run]
  cflow-skills install --global [--dry-run]
  cflow-skills remove <repo-path> [--dry-run]
  cflow-skills remove --global [--dry-run]

Notes:
  - install syncs packaged skills/support resources into <repo>/.agents/skills
  - install syncs packaged Codex custom agents into <repo>/.codex/agents
  - --global targets $CODEX_HOME/skills and $CODEX_HOME/agents, or ~/.codex/*
  - remove deletes only Cflow-owned skills, support directories, and Codex custom agents
`;

export async function main(argv, io = { stdout: process.stdout, stderr: process.stderr }) {
  let options;

  try {
    options = parseArgs(argv);
  } catch (error) {
    io.stderr.write(`Error: ${error.message}\n\n${HELP_TEXT}`);
    return 1;
  }

  if (options.help) {
    io.stdout.write(HELP_TEXT);
    return 0;
  }

  const destinations = resolveDestinations(options);

  try {
    const result =
      options.command === "install"
        ? await installAll({
            skillsDestinationRoot: destinations.skillsRoot,
            codexAgentsDestinationRoot: destinations.codexAgentsRoot,
            dryRun: options.dryRun,
          })
        : await removeAll({
            skillsDestinationRoot: destinations.skillsRoot,
            codexAgentsDestinationRoot: destinations.codexAgentsRoot,
            dryRun: options.dryRun,
          });

    writeSummary(io.stdout, result);
    return result.command === "install" && result.conflicts.length > 0 ? 1 : 0;
  } catch (error) {
    io.stderr.write(`Error: ${error.message}\n`);
    return 1;
  }
}

function parseArgs(argv) {
  const args = [...argv];

  if (args.length === 0) {
    return { help: true };
  }

  if (args[0] === "--help" || args[0] === "-h") {
    return { help: true };
  }

  const command = args.shift();
  if (!["install", "remove"].includes(command)) {
    throw new Error(`Unknown command: ${command}`);
  }

  let dryRun = false;
  let global = false;
  const positionals = [];

  while (args.length > 0) {
    const arg = args.shift();

    if (arg === "--help" || arg === "-h") {
      return { help: true };
    }

    if (arg === "--dry-run") {
      dryRun = true;
      continue;
    }

    if (arg === "--global") {
      global = true;
      continue;
    }

    if (arg.startsWith("-")) {
      throw new Error(`Unknown option: ${arg}`);
    }

    positionals.push(arg);
  }

  if (global && positionals.length > 0) {
    throw new Error("Pass either a repository path or --global, not both");
  }

  if (!global && positionals.length !== 1) {
    throw new Error("Pass exactly one repository path, or use --global");
  }

  return {
    help: false,
    command,
    dryRun,
    global,
    targetPath: global ? null : positionals[0],
  };
}

async function installAll({ skillsDestinationRoot, codexAgentsDestinationRoot, dryRun }) {
  const skillsPlan = await installSkills({
    sourceRoot: SKILLS_SOURCE_ROOT,
    destinationRoot: skillsDestinationRoot,
    dryRun: true,
  });
  const agentsPlan = await installCodexAgents({
    sourceRoot: CODEX_AGENTS_SOURCE_ROOT,
    destinationRoot: codexAgentsDestinationRoot,
    dryRun: true,
  });

  if (dryRun || skillsPlan.conflicts.length > 0 || agentsPlan.conflicts.length > 0) {
    return combineInstallResults(skillsPlan, agentsPlan, dryRun, false);
  }

  const skillsResult = await installSkills({
    sourceRoot: SKILLS_SOURCE_ROOT,
    destinationRoot: skillsDestinationRoot,
    dryRun: false,
  });
  const agentsResult = await installCodexAgents({
    sourceRoot: CODEX_AGENTS_SOURCE_ROOT,
    destinationRoot: codexAgentsDestinationRoot,
    dryRun: false,
  });

  return combineInstallResults(
    skillsResult,
    agentsResult,
    dryRun,
    skillsResult.applied && agentsResult.applied,
  );
}

async function removeAll({ skillsDestinationRoot, codexAgentsDestinationRoot, dryRun }) {
  const skillsResult = await removeSkills({
    destinationRoot: skillsDestinationRoot,
    dryRun,
  });
  const agentsResult = await removeCodexAgents({
    destinationRoot: codexAgentsDestinationRoot,
    dryRun,
  });

  return {
    command: "remove",
    destinationRoot: skillsDestinationRoot,
    skillsDestinationRoot,
    codexAgentsDestinationRoot,
    dryRun,
    removed: [...skillsResult.removed, ...agentsResult.removed],
    kept: [...skillsResult.kept, ...agentsResult.kept],
    conflicts: [],
    applied: skillsResult.applied && agentsResult.applied,
  };
}

function combineInstallResults(skillsResult, agentsResult, dryRun, applied) {
  return {
    command: "install",
    sourceRoot: skillsResult.sourceRoot,
    destinationRoot: skillsResult.destinationRoot,
    skillsSourceRoot: skillsResult.sourceRoot,
    skillsDestinationRoot: skillsResult.destinationRoot,
    codexAgentsSourceRoot: agentsResult.sourceRoot,
    codexAgentsDestinationRoot: agentsResult.destinationRoot,
    dryRun,
    added: [...skillsResult.added, ...agentsResult.added],
    updated: [...skillsResult.updated, ...agentsResult.updated],
    unchanged: [...skillsResult.unchanged, ...agentsResult.unchanged],
    pruned: [...skillsResult.pruned, ...agentsResult.pruned],
    conflicts: [...skillsResult.conflicts, ...agentsResult.conflicts],
    applied,
  };
}

function resolveDestinations(options) {
  if (options.global) {
    const codexHome = process.env.CODEX_HOME || path.join(os.homedir(), ".codex");
    return {
      skillsRoot: path.resolve(codexHome, "skills"),
      codexAgentsRoot: path.resolve(codexHome, "agents"),
    };
  }

  const targetRoot = path.resolve(options.targetPath);
  return {
    skillsRoot: path.resolve(targetRoot, ".agents", "skills"),
    codexAgentsRoot: path.resolve(targetRoot, ".codex", "agents"),
  };
}

function writeSummary(stream, result) {
  if (result.command === "install") {
    stream.write(`Command: install\n`);
    stream.write(`Skills source: ${result.skillsSourceRoot}\n`);
    stream.write(`Skills destination: ${result.skillsDestinationRoot}\n`);
    stream.write(`Codex agents source: ${result.codexAgentsSourceRoot}\n`);
    stream.write(`Codex agents destination: ${result.codexAgentsDestinationRoot}\n`);
    stream.write(`Dry run: ${result.dryRun ? "yes" : "no"}\n`);
    stream.write(`Added: ${result.added.length}\n`);
    stream.write(`Updated: ${result.updated.length}\n`);
    stream.write(`Unchanged: ${result.unchanged.length}\n`);
    stream.write(`Pruned: ${result.pruned.length}\n`);
    stream.write(`Conflicts: ${result.conflicts.length}\n`);
    stream.write(`Applied: ${result.applied ? "yes" : "no"}\n`);
    writeEntries(stream, "Added entries", result.added);
    writeEntries(stream, "Updated entries", result.updated);
    writeEntries(stream, "Pruned entries", result.pruned);
    writeConflicts(stream, result.conflicts);
    return;
  }

  stream.write(`Command: remove\n`);
  stream.write(`Skills destination: ${result.skillsDestinationRoot}\n`);
  stream.write(`Codex agents destination: ${result.codexAgentsDestinationRoot}\n`);
  stream.write(`Dry run: ${result.dryRun ? "yes" : "no"}\n`);
  stream.write(`Removed: ${result.removed.length}\n`);
  stream.write(`Kept: ${result.kept.length}\n`);
  writeEntries(stream, "Removed entries", result.removed);
}

function writeEntries(stream, label, entries) {
  if (entries.length === 0) {
    return;
  }

  stream.write(`${label}:\n`);
  for (const entry of entries) {
    stream.write(`- ${entry.kind ? `${entry.kind}: ` : ""}${entry.name}\n`);
  }
}

function writeConflicts(stream, conflicts) {
  if (conflicts.length === 0) {
    return;
  }

  stream.write(`Conflicts:\n`);
  for (const conflict of conflicts) {
    stream.write(
      `- ${conflict.kind ? `${conflict.kind}: ` : ""}${conflict.name}: ${conflict.reason} (${conflict.targetDir || conflict.targetFile})\n`,
    );
  }
}
