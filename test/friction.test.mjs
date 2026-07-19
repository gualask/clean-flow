import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

import { installFriction, removeFriction } from "../src/commands/install-friction.mjs";
import { main } from "../src/index.mjs";
import { makeTempWorkspace, readText } from "./support/helpers.mjs";

const execFileAsync = promisify(execFile);

const PACKAGE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FRICTION_SOURCE_ROOT = path.join(PACKAGE_ROOT, "install", "friction");
const FRICTION_SCRIPT = path.join(FRICTION_SOURCE_ROOT, "friction.mjs");

async function runLogger({ args = [], cwd, home, env = {} }) {
  return execFileAsync(process.execPath, [FRICTION_SCRIPT, ...args], {
    cwd,
    env: { PATH: process.env.PATH, HOME: home, ...env },
  });
}

async function readSingleLogEntry(root) {
  const logDir = path.join(root, ".cflow", "friction");
  const now = new Date();
  const month = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  const raw = await readFile(path.join(logDir, `${month}.jsonl`), "utf8");
  const lines = raw.trim().split("\n");
  assert.equal(lines.length, 1);
  return JSON.parse(lines[0]);
}

test("logger appends to the repo root log from a subdirectory", async () => {
  const repo = await makeTempWorkspace();
  const home = await makeTempWorkspace();
  await mkdir(path.join(repo, ".git"), { recursive: true });
  const nested = path.join(repo, "src", "deep");
  await mkdir(nested, { recursive: true });

  const { stdout } = await runLogger({
    args: ["three retries on build", "expected one pass", "--category", "repeated-attempts", "--skill", "cf-trace"],
    cwd: nested,
    home,
  });

  assert.equal(stdout.trim(), "friction logged");
  const entry = await readSingleLogEntry(repo);
  assert.equal(entry.observed, "three retries on build");
  assert.equal(entry.expected, "expected one pass");
  assert.equal(entry.category, "repeated-attempts");
  assert.equal(entry.skill, "cf-trace");
  assert.match(entry.ts, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
  assert.equal(entry.pack_version, undefined);
});

test("logger resolves a linked worktree to the main repository log", async () => {
  const main = await makeTempWorkspace();
  const worktree = await makeTempWorkspace();
  const home = await makeTempWorkspace();
  await mkdir(path.join(main, ".git", "worktrees", "wt"), { recursive: true });
  await writeFile(
    path.join(worktree, ".git"),
    `gitdir: ${path.join(main, ".git", "worktrees", "wt")}\n`,
    "utf8",
  );

  await runLogger({ args: ["observed", "expected"], cwd: worktree, home });

  const entry = await readSingleLogEntry(main);
  assert.equal(entry.observed, "observed");
});

test("logger falls back to the home directory outside a git repository", async () => {
  const cwd = await makeTempWorkspace();
  const home = await makeTempWorkspace();

  await runLogger({
    args: ["observed", "expected", "--category=workaround"],
    cwd,
    home,
    env: { CODEX_SESSION_ID: "session-42" },
  });

  const entry = await readSingleLogEntry(home);
  assert.equal(entry.category, "workaround");
  assert.equal(entry.session, "session-42");
});

test("logger without arguments exits 0 and writes nothing", async () => {
  const cwd = await makeTempWorkspace();
  const home = await makeTempWorkspace();
  await mkdir(path.join(cwd, ".git"), { recursive: true });

  const { stdout } = await runLogger({ args: [], cwd, home });

  assert.equal(stdout, "");
  const entries = await readFile(path.join(cwd, ".cflow"), "utf8").catch((error) => error.code);
  assert.equal(entries, "ENOENT");
});

test("installFriction writes the script and inlines the law in a minimal AGENTS.md", async () => {
  const cflowHome = path.join(await makeTempWorkspace(), ".cflow");
  const agentsFile = path.join(await makeTempWorkspace(), "AGENTS.md");
  await mkdir(cflowHome, { recursive: true });
  await writeFile(path.join(cflowHome, "friction-law.md"), "legacy law\n", "utf8");

  const result = await installFriction({
    sourceRoot: FRICTION_SOURCE_ROOT,
    cflowHome,
    agentsFile,
    version: "9.9.9",
  });

  assert.equal(result.applied, true);
  assert.equal(result.agents.action, "created");

  const script = await readText(path.join(cflowHome, "bin", "friction.mjs"));
  assert.match(script, /9\.9\.9/);
  assert.doesNotMatch(script, /__CFLOW_PACK_VERSION__/);

  const agents = await readText(agentsFile);
  assert.match(agents, /# Global agent instructions/);
  assert.match(agents, /<!-- BEGIN CFLOW FRICTION -->/);
  assert.match(agents, /Friction is any of:/);
  assert.doesNotMatch(agents, /\{\{CFLOW_BIN\}\}/);
  assert.ok(agents.includes(path.join(cflowHome, "bin", "friction.mjs")));
  assert.match(agents, /<!-- END CFLOW FRICTION -->/);

  assert.equal(
    await readFile(path.join(cflowHome, "friction-law.md"), "utf8").catch((error) => error.code),
    "ENOENT",
  );
});

test("installed logger records the stamped pack version", async () => {
  const cflowHome = path.join(await makeTempWorkspace(), ".cflow");
  const agentsFile = path.join(await makeTempWorkspace(), "AGENTS.md");
  const home = await makeTempWorkspace();

  await installFriction({
    sourceRoot: FRICTION_SOURCE_ROOT,
    cflowHome,
    agentsFile,
    version: "1.2.3",
  });
  await execFileAsync(
    process.execPath,
    [path.join(cflowHome, "bin", "friction.mjs"), "observed", "expected"],
    { cwd: home, env: { PATH: process.env.PATH, HOME: home } },
  );

  const entry = await readSingleLogEntry(home);
  assert.equal(entry.pack_version, "1.2.3");
});

test("installFriction appends to an existing AGENTS.md and stays idempotent", async () => {
  const cflowHome = path.join(await makeTempWorkspace(), ".cflow");
  const agentsFile = path.join(await makeTempWorkspace(), "AGENTS.md");
  await writeFile(agentsFile, "# My rules\n\nAlways be kind.\n", "utf8");

  const first = await installFriction({
    sourceRoot: FRICTION_SOURCE_ROOT,
    cflowHome,
    agentsFile,
    version: "1.0.0",
  });
  const second = await installFriction({
    sourceRoot: FRICTION_SOURCE_ROOT,
    cflowHome,
    agentsFile,
    version: "1.0.0",
  });

  assert.equal(first.agents.action, "appended");
  assert.equal(second.agents.action, "unchanged");

  const agents = await readText(agentsFile);
  assert.match(agents, /Always be kind\./);
  assert.equal(agents.match(/BEGIN CFLOW FRICTION/g).length, 1);
});

test("installFriction dry run writes nothing", async () => {
  const cflowHome = path.join(await makeTempWorkspace(), ".cflow");
  const agentsFile = path.join(await makeTempWorkspace(), "AGENTS.md");

  const result = await installFriction({
    sourceRoot: FRICTION_SOURCE_ROOT,
    cflowHome,
    agentsFile,
    version: "1.0.0",
    dryRun: true,
  });

  assert.equal(result.applied, false);
  assert.equal(await readFile(agentsFile, "utf8").catch((error) => error.code), "ENOENT");
  assert.equal(
    await readFile(path.join(cflowHome, "friction-law.md"), "utf8").catch((error) => error.code),
    "ENOENT",
  );
});

test("removeFriction strips the block, keeps user content and logs", async () => {
  const cflowHome = path.join(await makeTempWorkspace(), ".cflow");
  const agentsFile = path.join(await makeTempWorkspace(), "AGENTS.md");
  await writeFile(agentsFile, "# My rules\n\nAlways be kind.\n", "utf8");

  await installFriction({
    sourceRoot: FRICTION_SOURCE_ROOT,
    cflowHome,
    agentsFile,
    version: "1.0.0",
  });
  // Legacy law file from an import-based install: remove must clean it too.
  await writeFile(path.join(cflowHome, "friction-law.md"), "old law\n", "utf8");
  const logFile = path.join(cflowHome, "friction", "2026-07.jsonl");
  await mkdir(path.dirname(logFile), { recursive: true });
  await writeFile(logFile, '{"observed":"kept"}\n', "utf8");

  const result = await removeFriction({ cflowHome, agentsFile });

  assert.equal(result.applied, true);
  assert.equal(result.files.length, 2);

  const agents = await readText(agentsFile);
  assert.match(agents, /Always be kind\./);
  assert.doesNotMatch(agents, /CFLOW FRICTION/);

  assert.equal(
    await readFile(path.join(cflowHome, "friction-law.md"), "utf8").catch((error) => error.code),
    "ENOENT",
  );
  assert.equal(await readText(logFile), '{"observed":"kept"}\n');
});

test("removeFriction on a clean system reports nothing to do", async () => {
  const cflowHome = path.join(await makeTempWorkspace(), ".cflow");
  const agentsFile = path.join(await makeTempWorkspace(), "AGENTS.md");

  const result = await removeFriction({ cflowHome, agentsFile });

  assert.equal(result.files.length, 0);
  assert.equal(result.agents.action, "unchanged");
});

test("--friction requires --global", async () => {
  const io = makeIo();
  const repo = await makeTempWorkspace();

  const exitCode = await main(["install", repo, "--friction"], io);

  assert.equal(exitCode, 1);
  assert.match(io.stderr.output, /--friction requires --global/);
});

test("--friction applies to install only", async () => {
  const io = makeIo();

  const exitCode = await main(["remove", "--global", "--friction"], io);

  assert.equal(exitCode, 1);
  assert.match(io.stderr.output, /--friction applies to install only/);
});

function makeIo() {
  return {
    stdout: makeWritableBuffer(),
    stderr: makeWritableBuffer(),
  };
}

function makeWritableBuffer() {
  return {
    output: "",
    write(chunk) {
      this.output += chunk;
    },
  };
}
