import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { installSkills } from "./commands/install.mjs";
import { removeSkills } from "./commands/remove.mjs";

const PACKAGE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_ROOT = path.join(PACKAGE_ROOT, "skills");

const HELP_TEXT = `Usage:
  cflow-skills install <repo-path> [--dry-run]
  cflow-skills install --global [--dry-run]
  cflow-skills remove <repo-path> [--dry-run]
  cflow-skills remove --global [--dry-run]

Notes:
  - install syncs packaged skills and support resources into <repo>/.agents/skills
  - --global targets $CODEX_HOME/skills or ~/.codex/skills
  - remove deletes only Cflow-owned skill and support directories
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

  const destinationRoot = resolveDestinationRoot(options);

  try {
    const result =
      options.command === "install"
        ? await installSkills({
            sourceRoot: SOURCE_ROOT,
            destinationRoot,
            dryRun: options.dryRun,
          })
        : await removeSkills({
            destinationRoot,
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

function resolveDestinationRoot(options) {
  if (options.global) {
    const codexHome = process.env.CODEX_HOME || path.join(os.homedir(), ".codex");
    return path.resolve(codexHome, "skills");
  }

  return path.resolve(options.targetPath, ".agents", "skills");
}

function writeSummary(stream, result) {
  if (result.command === "install") {
    stream.write(`Command: install\n`);
    stream.write(`Source: ${result.sourceRoot}\n`);
    stream.write(`Destination: ${result.destinationRoot}\n`);
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
  stream.write(`Destination: ${result.destinationRoot}\n`);
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
    stream.write(`- ${entry.name}\n`);
  }
}

function writeConflicts(stream, conflicts) {
  if (conflicts.length === 0) {
    return;
  }

  stream.write(`Conflicts:\n`);
  for (const conflict of conflicts) {
    stream.write(`- ${conflict.name}: ${conflict.reason} (${conflict.targetDir})\n`);
  }
}
