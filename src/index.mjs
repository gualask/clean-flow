import { readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { installFriction, removeFriction } from "./commands/install-friction.mjs";
import { installSkills } from "./commands/install.mjs";
import { pruneLegacyCodexAgents } from "./commands/prune-legacy-agents.mjs";
import { removeSkills } from "./commands/remove.mjs";
import { createMaterializedSkills } from "./lib/materialize-skills.mjs";

const PACKAGE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SKILLS_SOURCE_ROOT = path.join(PACKAGE_ROOT, "skills");
const FRICTION_SOURCE_ROOT = path.join(PACKAGE_ROOT, "install", "friction");

const HELP_TEXT = `Usage:
  cflow-skills install <repo-path> [--dry-run]
  cflow-skills install --global [--friction] [--dry-run]
  cflow-skills remove <repo-path> [--dry-run]
  cflow-skills remove --global [--dry-run]

Notes:
  - install syncs packaged, materialized skills into <repo>/.codex/skills
  - --global targets $CODEX_HOME/skills, or ~/.codex/skills
  - install and remove prune legacy static agents marked as Cflow-owned
  - --friction also installs the always-on friction log: the logger script
    and law under ~/.cflow (or $CFLOW_HOME), plus a marked import block in
    the global AGENTS.md (created minimal when absent)
  - remove deletes only Cflow-owned skill directories; global remove also
    removes the friction pieces and their AGENTS.md block
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
            legacyCodexAgentsDestinationRoot: destinations.legacyCodexAgentsRoot,
            dryRun: options.dryRun,
          })
        : await removeAll({
            skillsDestinationRoot: destinations.skillsRoot,
            legacyCodexAgentsDestinationRoot: destinations.legacyCodexAgentsRoot,
            dryRun: options.dryRun,
          });

    if (options.command === "install" && options.friction) {
      const frictionTargets = resolveFrictionTargets();
      result.friction = await installFriction({
        sourceRoot: FRICTION_SOURCE_ROOT,
        cflowHome: frictionTargets.cflowHome,
        agentsFile: frictionTargets.agentsFile,
        version: await readPackageVersion(),
        dryRun: options.dryRun || result.conflicts.length > 0,
      });
    }

    if (options.command === "remove" && options.global) {
      const frictionTargets = resolveFrictionTargets();
      result.friction = await removeFriction({
        cflowHome: frictionTargets.cflowHome,
        agentsFile: frictionTargets.agentsFile,
        dryRun: options.dryRun,
      });
    }

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
  let friction = false;
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

    if (arg === "--friction") {
      friction = true;
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

  if (friction && !global) {
    throw new Error("--friction requires --global");
  }

  if (friction && command !== "install") {
    throw new Error("--friction applies to install only");
  }

  return {
    help: false,
    command,
    dryRun,
    global,
    friction,
    targetPath: global ? null : positionals[0],
  };
}

async function installAll({
  skillsDestinationRoot,
  legacyCodexAgentsDestinationRoot,
  dryRun,
}) {
  const materialized = await createMaterializedSkills(SKILLS_SOURCE_ROOT);

  try {
    const skillsPlan = await installSkills({
      sourceRoot: materialized.skillsRoot,
      destinationRoot: skillsDestinationRoot,
      dryRun: true,
    });
    const legacyAgentsPlan = await pruneLegacyCodexAgents({
      destinationRoot: legacyCodexAgentsDestinationRoot,
      dryRun: true,
    });

    if (dryRun || skillsPlan.conflicts.length > 0) {
      return withPackagedSkillsSource(
        toInstallResult(skillsPlan, legacyAgentsPlan, dryRun, false),
      );
    }

    const legacyAgentsResult = await pruneLegacyCodexAgents({
      destinationRoot: legacyCodexAgentsDestinationRoot,
      dryRun: false,
    });
    const skillsResult = await installSkills({
      sourceRoot: materialized.skillsRoot,
      destinationRoot: skillsDestinationRoot,
      dryRun: false,
    });

    return withPackagedSkillsSource(
      toInstallResult(
        skillsResult,
        legacyAgentsResult,
        dryRun,
        skillsResult.applied && legacyAgentsResult.applied,
      ),
    );
  } finally {
    await materialized.cleanup();
  }
}

async function removeAll({
  skillsDestinationRoot,
  legacyCodexAgentsDestinationRoot,
  dryRun,
}) {
  const legacyAgentsResult = await pruneLegacyCodexAgents({
    destinationRoot: legacyCodexAgentsDestinationRoot,
    dryRun,
  });
  const skillsResult = await removeSkills({
    destinationRoot: skillsDestinationRoot,
    dryRun,
  });

  return {
    command: "remove",
    destinationRoot: skillsDestinationRoot,
    skillsDestinationRoot,
    dryRun,
    removed: [...skillsResult.removed, ...legacyAgentsResult.removed],
    kept: [...skillsResult.kept],
    conflicts: [],
    applied: skillsResult.applied && legacyAgentsResult.applied,
  };
}

function toInstallResult(skillsResult, legacyAgentsResult, dryRun, applied) {
  return {
    command: "install",
    sourceRoot: skillsResult.sourceRoot,
    destinationRoot: skillsResult.destinationRoot,
    skillsSourceRoot: skillsResult.sourceRoot,
    skillsDestinationRoot: skillsResult.destinationRoot,
    dryRun,
    added: [...skillsResult.added],
    updated: [...skillsResult.updated],
    unchanged: [...skillsResult.unchanged],
    pruned: [...skillsResult.pruned, ...legacyAgentsResult.removed],
    conflicts: [...skillsResult.conflicts],
    applied,
  };
}

function withPackagedSkillsSource(result) {
  return {
    ...result,
    sourceRoot: SKILLS_SOURCE_ROOT,
    skillsSourceRoot: SKILLS_SOURCE_ROOT,
  };
}

function resolveDestinations(options) {
  if (options.global) {
    const codexHome = process.env.CODEX_HOME || path.join(os.homedir(), ".codex");
    return {
      skillsRoot: path.resolve(codexHome, "skills"),
      legacyCodexAgentsRoot: path.resolve(codexHome, "agents"),
    };
  }

  const targetRoot = path.resolve(options.targetPath);
  return {
    skillsRoot: path.resolve(targetRoot, ".codex", "skills"),
    legacyCodexAgentsRoot: path.resolve(targetRoot, ".codex", "agents"),
  };
}

function resolveFrictionTargets() {
  const codexHome = process.env.CODEX_HOME || path.join(os.homedir(), ".codex");
  return {
    cflowHome: path.resolve(process.env.CFLOW_HOME || path.join(os.homedir(), ".cflow")),
    agentsFile: path.resolve(codexHome, "AGENTS.md"),
  };
}

async function readPackageVersion() {
  const raw = await readFile(path.join(PACKAGE_ROOT, "package.json"), "utf8");
  return JSON.parse(raw).version;
}

function writeSummary(stream, result) {
  if (result.command === "install") {
    stream.write(`Command: install\n`);
    stream.write(`Skills source: ${result.skillsSourceRoot}\n`);
    stream.write(`Skills destination: ${result.skillsDestinationRoot}\n`);
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
    writeFrictionSummary(stream, result.friction);
    return;
  }

  stream.write(`Command: remove\n`);
  stream.write(`Skills destination: ${result.skillsDestinationRoot}\n`);
  stream.write(`Dry run: ${result.dryRun ? "yes" : "no"}\n`);
  stream.write(`Removed: ${result.removed.length}\n`);
  stream.write(`Kept: ${result.kept.length}\n`);
  writeEntries(stream, "Removed entries", result.removed);
  writeFrictionSummary(stream, result.friction);
}

function writeFrictionSummary(stream, friction) {
  if (!friction) {
    return;
  }

  stream.write(`Friction home: ${friction.cflowHome}\n`);
  for (const file of friction.files) {
    stream.write(`Friction ${file.name}: ${file.action}\n`);
  }
  if (friction.command === "remove-friction" && friction.files.length === 0) {
    stream.write(`Friction files: none found\n`);
  }
  stream.write(`Friction AGENTS.md: ${friction.agentsFile} (${friction.agents.action})\n`);
  stream.write(`Friction applied: ${friction.applied ? "yes" : "no"}\n`);
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
