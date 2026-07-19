#!/usr/bin/env node
// Cflow friction logger. Node stdlib only, cross-platform.
//
// Reliability bar: this script must NEVER block, prompt, throw, or exit
// non-zero, no matter what. Every code path funnels through the try/catch
// in `main` so an internal failure is silent and the process still exits 0.
// Prints exactly one line, "friction logged", on success; nothing on failure.
//
// Usage:
//   node friction.mjs "<observed>" "<expected>" [--category C] [--skill S]
//
// Log location: the main repository's .cflow/friction/<yyyy-mm>.jsonl when
// cwd is inside a git repository or one of its linked worktrees (a .git
// pointer file resolves to the main checkout, so every worktree shares one
// project log), else ~/.cflow/friction/<yyyy-mm>.jsonl.

import { appendFileSync, mkdirSync, readFileSync, statSync } from "node:fs";
import os from "node:os";
import path from "node:path";

const PACK_VERSION = "__CFLOW_PACK_VERSION__";

const FLAG_MAP = {
  "--category": "category",
  "--skill": "skill",
};

const SESSION_ENV_VARS = [
  "CLAUDE_SESSION_ID",
  "CLAUDE_CODE_SESSION_ID",
  "CODEX_SESSION_ID",
  "SESSION_ID",
];

const MAX_WALK_UP = 200;

function parseArgs(argv) {
  const positionals = [];
  const options = {};

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    const [flag, inlineValue] = splitInlineFlag(token);

    if (flag in FLAG_MAP) {
      if (inlineValue !== null) {
        options[FLAG_MAP[flag]] = inlineValue;
        continue;
      }
      i += 1;
      if (i >= argv.length) {
        return null;
      }
      options[FLAG_MAP[flag]] = argv[i];
      continue;
    }

    positionals.push(token);
  }

  if (positionals.length === 0) {
    return null;
  }

  return {
    observed: positionals[0],
    expected: positionals[1] ?? "",
    options,
  };
}

function splitInlineFlag(token) {
  const separator = token.indexOf("=");
  if (!token.startsWith("--") || separator === -1) {
    return [token, null];
  }
  return [token.slice(0, separator), token.slice(separator + 1)];
}

function findSession(env) {
  for (const name of SESSION_ENV_VARS) {
    if (env[name]) {
      return env[name];
    }
  }
  return null;
}

// Returns the main repository root for cwd, or null when cwd is not inside
// a git repository. A .git pointer file (linked worktree) resolves to the
// main checkout so all worktrees share one log.
function findRepoRoot(startDir) {
  let dir = startDir;

  for (let depth = 0; depth < MAX_WALK_UP; depth += 1) {
    const gitPath = path.join(dir, ".git");
    const kind = pathKind(gitPath);

    if (kind === "directory") {
      return dir;
    }
    if (kind === "file") {
      return resolveWorktreeRoot(gitPath) ?? dir;
    }

    const parent = path.dirname(dir);
    if (parent === dir) {
      return null;
    }
    dir = parent;
  }

  return null;
}

function pathKind(pathname) {
  try {
    const stats = statSync(pathname);
    return stats.isDirectory() ? "directory" : "file";
  } catch {
    return null;
  }
}

function resolveWorktreeRoot(gitFilePath) {
  try {
    const contents = readFileSync(gitFilePath, "utf8");
    const match = contents.match(/^gitdir:\s*(.+)\s*$/m);
    if (!match) {
      return null;
    }

    const gitDir = path.resolve(path.dirname(gitFilePath), match[1].trim());
    const segments = gitDir.split(path.sep);
    const worktreesIndex = segments.lastIndexOf("worktrees");

    if (worktreesIndex > 0 && segments[worktreesIndex - 1] === ".git") {
      return segments.slice(0, worktreesIndex - 1).join(path.sep) || path.sep;
    }

    return null;
  } catch {
    return null;
  }
}

function main(argv) {
  const parsed = parseArgs(argv);
  if (!parsed) {
    return;
  }

  const now = new Date();
  const entry = {
    ts: now.toISOString().replace(/\.\d{3}Z$/, "Z"),
    observed: parsed.observed,
    expected: parsed.expected,
  };

  for (const key of ["category", "skill"]) {
    if (parsed.options[key]) {
      entry[key] = parsed.options[key];
    }
  }

  const session = findSession(process.env);
  if (session) {
    entry.session = session;
  }
  if (!PACK_VERSION.startsWith("__")) {
    entry.pack_version = PACK_VERSION;
  }

  const root = findRepoRoot(process.cwd()) ?? os.homedir();
  const month = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  const logFile = path.join(root, ".cflow", "friction", `${month}.jsonl`);

  mkdirSync(path.dirname(logFile), { recursive: true });
  appendFileSync(logFile, `${JSON.stringify(entry)}\n`, "utf8");
  process.stdout.write("friction logged\n");
}

try {
  main(process.argv.slice(2));
} catch {
  // Never fail the calling task.
}
process.exitCode = 0;
