// Temporary CLI: only `migrate` is left, for installations made by the old installer.
// Cflow installs as a plugin; see README.md.

import os from "node:os";
import path from "node:path";

import { MARKETPLACE_SOURCE, migrate } from "./commands/migrate.mjs";

const HELP_TEXT = `Usage:
  cflow-skills migrate --global [--dry-run]
  cflow-skills migrate <repo-path> [--dry-run]

Moves an installation made by the old installer onto the cflow plugin:
  - removes the Cflow-owned skill directories from ~/.agents/skills (--global)
    or <repo>/.agents/skills, and keeps every other skill
  - --global also removes the friction logger and its AGENTS.md block, keeping its logs
  - installs the cflow plugin in Codex first, with codex from PATH; without it, it changes
    nothing
Running it again changes nothing.
`;

export async function main(
  argv,
  io = { stdout: process.stdout, stderr: process.stderr },
  dependencies = {},
) {
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

  const environment = dependencies.environment ?? process.env;
  const homeDirectory = dependencies.homeDirectory ?? os.homedir();
  const skillsRoot = options.global
    ? path.resolve(homeDirectory, ".agents", "skills")
    : path.resolve(options.targetPath, ".agents", "skills");
  const friction = options.global
    ? {
        cflowHome: path.resolve(environment.CFLOW_HOME || path.join(homeDirectory, ".agents", "cflow")),
        agentsFile: path.resolve(environment.CODEX_HOME || path.join(homeDirectory, ".codex"), "AGENTS.md"),
      }
    : null;

  try {
    const result = await migrate({
      skillsRoot,
      friction,
      dryRun: options.dryRun,
      environment,
      // CFLOW_MARKETPLACE points the migration at a local checkout, for trying it before a release.
      marketplaceSource: environment.CFLOW_MARKETPLACE || MARKETPLACE_SOURCE,
      runCodex: dependencies.runCodex ?? null,
    });
    writeSummary(io.stdout, result);
    return result.plugin.status === "codex-missing" ? 1 : 0;
  } catch (error) {
    io.stderr.write(`Error: ${error.message}\n`);
    return 1;
  }
}

function parseArgs(argv) {
  const args = [...argv];
  if (args.length === 0 || args[0] === "--help" || args[0] === "-h") {
    return { help: true };
  }

  const command = args.shift();
  if (command !== "migrate") {
    throw new Error(
      command === "install" || command === "remove"
        ? `${command} is gone: Cflow installs as a plugin (see README.md). Run "cflow-skills migrate" once to move an existing installation.`
        : `Unknown command: ${command}`,
    );
  }

  let dryRun = false;
  let global = false;
  const positionals = [];
  for (const arg of args) {
    if (arg === "--help" || arg === "-h") {
      return { help: true };
    }
    if (arg === "--dry-run") {
      dryRun = true;
    } else if (arg === "--global") {
      global = true;
    } else if (arg.startsWith("-")) {
      throw new Error(`Unknown option: ${arg}`);
    } else {
      positionals.push(arg);
    }
  }

  if (global && positionals.length > 0) {
    throw new Error("Pass either a repository path or --global, not both");
  }
  if (!global && positionals.length !== 1) {
    throw new Error("Pass exactly one repository path, or use --global");
  }

  return { help: false, dryRun, global, targetPath: global ? null : positionals[0] };
}

function writeSummary(stream, result) {
  if (result.plugin.status === "codex-missing") {
    stream.write("Nothing changed: codex is not on PATH.\n");
    stream.write("Install the Codex CLI (npm install -g @openai/codex), then run migrate again.\n");
    return;
  }

  if (result.codex) {
    stream.write(`Codex: ${result.codex.path}\n`);
  }
  const verb = result.dryRun ? "Would remove" : "Removed";
  stream.write(`Skills directory: ${result.skillsRoot}\n`);
  stream.write(`${verb} old Cflow skills: ${result.removed.length === 0 ? "none" : result.removed.join(", ")}\n`);
  for (const action of result.friction) {
    stream.write(`${result.dryRun ? "Would have " : ""}${action}\n`);
  }

  const plugin = {
    "already-installed": "Codex plugin: already installed",
    installed: "Codex plugin: installed; start a new Codex session, or restart the desktop app, to use it",
    "would-install": `Codex plugin: would run ${(result.plugin.commands ?? []).map(args => `codex ${args.join(" ")}`).join(" && ")}`,
  }[result.plugin.status];
  stream.write(`${plugin}\n`);
  stream.write("Claude Code, if you use it: claude plugin install cflow --marketplace gualask/clean-flow\n");
}
