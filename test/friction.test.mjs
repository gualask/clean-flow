import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { chmod, mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

import { installFriction, removeFriction } from "../src/commands/install-friction.mjs";
import { main } from "../src/index.mjs";
import { makeTempWorkspace, readText, writeSkill } from "./support/helpers.mjs";

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

async function readSingleLogEntry(logDir) {
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
    args: ["three retries on build", "expected one pass", "--category", "repeated-attempts", "--skill", "cf-scenario"],
    cwd: nested,
    home,
  });

  assert.equal(stdout.trim(), "friction logged");
  const entry = await readSingleLogEntry(path.join(repo, ".cflow", "friction"));
  assert.equal(entry.observed, "three retries on build");
  assert.equal(entry.expected, "expected one pass");
  assert.equal(entry.category, "repeated-attempts");
  assert.equal(entry.skill, "cf-scenario");
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

  const entry = await readSingleLogEntry(path.join(main, ".cflow", "friction"));
  assert.equal(entry.observed, "observed");
});

test("logger falls back to .agents/cflow outside a git repository", async () => {
  const cwd = await makeTempWorkspace();
  const home = await makeTempWorkspace();

  await runLogger({
    args: ["observed", "expected", "--category=workaround"],
    cwd,
    home,
    env: { CODEX_SESSION_ID: "session-42" },
  });

  const entry = await readSingleLogEntry(path.join(home, ".agents", "cflow", "friction"));
  assert.equal(entry.category, "workaround");
  assert.equal(entry.session, "session-42");
  assert.equal(await stat(path.join(home, ".cflow")).catch(error => error.code), "ENOENT");
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
  const cflowHome = path.join(await makeTempWorkspace(), ".agents", "cflow");
  const agentsFile = path.join(await makeTempWorkspace(), "AGENTS.md");

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
});

test("installed logger uses its installation home and stamped version without environment overrides", async () => {
  const cflowHome = path.join(await makeTempWorkspace(), 'custom "Cflow" home');
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

  const entry = await readSingleLogEntry(path.join(cflowHome, "friction"));
  assert.equal(entry.pack_version, "1.2.3");
  assert.deepEqual(await readdir(home), []);
});

test("logger honors CFLOW_HOME only outside a repository", async () => {
  const home = await makeTempWorkspace();
  const fallback = path.join(home, "custom-cflow");
  const repo = await makeTempWorkspace();
  await runLogger({ args: ["outside", "expected"], cwd: home, home, env: { CFLOW_HOME: fallback } });
  await mkdir(path.join(repo, ".git"));
  await runLogger({ args: ["inside", "expected"], cwd: repo, home, env: { CFLOW_HOME: fallback } });

  assert.equal((await readSingleLogEntry(path.join(fallback, "friction"))).observed, "outside");
  assert.equal((await readSingleLogEntry(path.join(repo, ".cflow", "friction"))).observed, "inside");
});

test("installFriction appends to an existing AGENTS.md and stays idempotent", async () => {
  const cflowHome = path.join(await makeTempWorkspace(), ".agents", "cflow");
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
  const cflowHome = path.join(await makeTempWorkspace(), ".agents", "cflow");
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
    await readFile(path.join(cflowHome, "bin", "friction.mjs"), "utf8").catch((error) => error.code),
    "ENOENT",
  );
});

test("removeFriction strips the block, keeps user content and logs", async () => {
  const cflowHome = path.join(await makeTempWorkspace(), ".agents", "cflow");
  const agentsFile = path.join(await makeTempWorkspace(), "AGENTS.md");
  await writeFile(agentsFile, "# My rules\n\nAlways be kind.\n", "utf8");

  await installFriction({
    sourceRoot: FRICTION_SOURCE_ROOT,
    cflowHome,
    agentsFile,
    version: "1.0.0",
  });
  const logFile = path.join(cflowHome, "friction", "2026-07.jsonl");
  await mkdir(path.dirname(logFile), { recursive: true });
  await writeFile(logFile, '{"observed":"kept"}\n', "utf8");

  const result = await removeFriction({ cflowHome, agentsFile });

  assert.equal(result.applied, true);
  assert.equal(result.files.length, 1);

  const agents = await readText(agentsFile);
  assert.match(agents, /Always be kind\./);
  assert.doesNotMatch(agents, /CFLOW FRICTION/);

  assert.equal(
    await readFile(path.join(cflowHome, "bin", "friction.mjs"), "utf8").catch((error) => error.code),
    "ENOENT",
  );
  assert.equal(await readText(logFile), '{"observed":"kept"}\n');
});

test("removeFriction on a clean system reports nothing to do", async () => {
  const cflowHome = path.join(await makeTempWorkspace(), ".agents", "cflow");
  const agentsFile = path.join(await makeTempWorkspace(), "AGENTS.md");

  const result = await removeFriction({ cflowHome, agentsFile });

  assert.equal(result.files.length, 0);
  assert.equal(result.agents.action, "unchanged");
});

test("a default global install copies only skills and does not create friction homes", async () => {
  const fixture = await makeGlobalInstallFixture({ customHome: false });
  const io = makeIo();
  assert.equal(await main(["install", "--global"], io, fixture.dependencies), 0, io.stderr.output);
  assert.deepEqual(await readdir(fixture.homeDirectory), [".agents"]);
  assert.deepEqual(await readdir(path.join(fixture.homeDirectory, ".agents")), ["skills"]);
  const installedFiles = await readdir(path.join(fixture.homeDirectory, ".agents", "skills"), { recursive: true });
  assert.ok(installedFiles.some(file => path.basename(file) === "SKILL.md"));
  assert.ok(installedFiles.every(file => !path.basename(file).startsWith("friction")));
  assert.equal(await stat(fixture.agentsFile).catch(error => error.code), "ENOENT");
});

test("global friction opt-in installs under .agents and stays idempotent", async () => {
  const fixture = await makeGlobalInstallFixture({ customHome: false });
  const io = makeIo();
  assert.equal(await main(["install", "--global", "--friction", "--dry-run"], io, fixture.dependencies), 0);
  assert.equal(await stat(fixture.homeDirectory).catch(error => error.code), "ENOENT");
  assert.equal(await stat(fixture.agentsFile).catch(error => error.code), "ENOENT");

  assert.equal(await main(["install", "--global", "--friction"], io, fixture.dependencies), 0, io.stderr.output);
  const scriptTarget = path.join(fixture.cflowHome, "bin", "friction.mjs");
  const agents = await readText(fixture.agentsFile);
  assert.ok(agents.includes(scriptTarget));
  assert.deepEqual(await readdir(fixture.homeDirectory), [".agents"]);
  await execFileAsync(process.execPath, [scriptTarget, "new log", "expected"], {
    cwd: fixture.homeDirectory,
    env: { PATH: process.env.PATH, HOME: fixture.homeDirectory },
  });
  assert.equal((await readSingleLogEntry(path.join(fixture.cflowHome, "friction"))).observed, "new log");

  const reinstalledIo = makeIo();
  assert.equal(await main(["install", "--global", "--friction"], reinstalledIo, fixture.dependencies), 0);
  assert.equal(await readText(fixture.agentsFile), agents);
  assert.match(reinstalledIo.stdout.output, /Friction friction script: unchanged/);
});

for (const command of ["install", "remove"]) {
  test(`global ${command} without friction disables the integration and preserves logs`, async () => {
    const fixture = await makeGlobalInstallFixture({ customHome: false });
    const { cflowHome, agentsFile } = fixture;
    await installFriction({ sourceRoot: FRICTION_SOURCE_ROOT, cflowHome, agentsFile, version: "1.0.0" });
    await mkdir(path.join(cflowHome, "friction"));
    await writeFile(path.join(cflowHome, "friction", "kept.jsonl"), "kept\n");
    const io = makeIo();
    assert.equal(await main([command, "--global"], io, fixture.dependencies), 0, io.stderr.output);
    assert.equal(await stat(path.join(cflowHome, "bin")).catch(error => error.code), "ENOENT");
    assert.equal(await readText(path.join(cflowHome, "friction", "kept.jsonl")), "kept\n");
    assert.doesNotMatch(await readText(agentsFile), /BEGIN CFLOW FRICTION/);
  });
}

test("global install treats --friction as the desired enabled state", async () => {
  const fixture = await makeGlobalInstallFixture();
  const scriptTarget = path.join(fixture.cflowHome, "bin", "friction.mjs");
  const logFile = path.join(fixture.cflowHome, "friction", "kept.jsonl");
  await mkdir(path.dirname(fixture.agentsFile), { recursive: true });
  await writeFile(fixture.agentsFile, "# My rules\n\nAlways be kind.\n", "utf8");

  const enableIo = makeIo();
  const enableCode = await main(
    ["install", "--global", "--friction"],
    enableIo,
    fixture.dependencies,
  );

  assert.equal(enableCode, 0);
  assert.match(await readText(scriptTarget), /Cflow friction logger/);
  assert.match(await readText(fixture.agentsFile), /BEGIN CFLOW FRICTION/);

  await mkdir(path.dirname(logFile), { recursive: true });
  await writeFile(logFile, '{"observed":"kept"}\n', "utf8");

  const dryRunIo = makeIo();
  const dryRunCode = await main(
    ["install", "--global", "--dry-run"],
    dryRunIo,
    fixture.dependencies,
  );

  assert.equal(dryRunCode, 0);
  assert.match(await readText(scriptTarget), /Cflow friction logger/);
  assert.match(await readText(fixture.agentsFile), /BEGIN CFLOW FRICTION/);
  assert.match(dryRunIo.stdout.output, /Friction friction script: removed/);
  assert.match(dryRunIo.stdout.output, /Friction applied: no/);

  const disableIo = makeIo();
  const disableCode = await main(
    ["install", "--global"],
    disableIo,
    fixture.dependencies,
  );

  assert.equal(disableCode, 0);
  assert.equal(
    await readFile(scriptTarget, "utf8").catch((error) => error.code),
    "ENOENT",
  );
  const agents = await readText(fixture.agentsFile);
  assert.match(agents, /Always be kind\./);
  assert.doesNotMatch(agents, /CFLOW FRICTION/);
  assert.equal(await readText(logFile), '{"observed":"kept"}\n');
  assert.match(disableIo.stdout.output, /Friction friction script: removed/);
  assert.match(disableIo.stdout.output, /Friction applied: yes/);
});

test("a global install conflict does not disable friction", async () => {
  const fixture = await makeGlobalInstallFixture();
  const scriptTarget = path.join(fixture.cflowHome, "bin", "friction.mjs");
  await installFriction({
    sourceRoot: FRICTION_SOURCE_ROOT,
    cflowHome: fixture.cflowHome,
    agentsFile: fixture.agentsFile,
    version: "1.0.0",
  });
  await writeSkill(
    path.join(fixture.homeDirectory, ".agents", "skills"),
    "cf-start",
    {
      "SKILL.md": `---\nname: "cf-start"\ndescription: "Foreign"\n---\n\n# foreign\n`,
    },
  );

  const io = makeIo();
  const exitCode = await main(
    ["install", "--global"],
    io,
    fixture.dependencies,
  );

  assert.equal(exitCode, 1);
  assert.match(await readText(scriptTarget), /Cflow friction logger/);
  assert.match(await readText(fixture.agentsFile), /BEGIN CFLOW FRICTION/);
  assert.match(io.stdout.output, /Conflicts: 1/);
  assert.match(io.stdout.output, /Friction applied: no/);
});

const permissionTestsUnavailable = process.platform === "win32" || process.getuid?.() === 0;

for (const scenario of ["unreadable home", "unwritable bin", "unwritable AGENTS.md", "unremovable empty home"]) {
  test(`global install warns and continues with friction ${scenario}`, { skip: permissionTestsUnavailable }, async () => {
    const fixture = await makeGlobalInstallFixture();
    const scriptTarget = path.join(fixture.cflowHome, "bin", "friction.mjs");
    await installFriction({
      sourceRoot: FRICTION_SOURCE_ROOT,
      cflowHome: fixture.cflowHome,
      agentsFile: fixture.agentsFile,
      version: "1.0.0",
    });
    const [restrictedPath, mode, restoredMode] = {
      "unreadable home": [fixture.cflowHome, 0o000, 0o700],
      "unwritable bin": [path.dirname(scriptTarget), 0o500, 0o700],
      "unwritable AGENTS.md": [fixture.agentsFile, 0o400, 0o600],
      "unremovable empty home": [path.dirname(fixture.cflowHome), 0o500, 0o700],
    }[scenario];
    // Keep the skills destination writable when the friction home's parent is locked.
    await mkdir(fixture.homeDirectory, { recursive: true });
    const io = makeIo();
    await chmod(restrictedPath, mode);
    try {
      const exitCode = await main(["install", "--global"], io, fixture.dependencies);
      assert.equal(exitCode, 0, io.stderr.output);
    } finally {
      await chmod(restrictedPath, restoredMode);
    }

    assert.match(await readText(path.join(fixture.homeDirectory, ".agents", "skills", "cf-start", "SKILL.md")), /name: cf-start/);
    assert.match(io.stderr.output, /Warning: Friction cleanup incomplete:.*(?:EACCES|EPERM)/);
    assert.match(io.stdout.output, /Friction applied: no/);

    const agents = await readText(fixture.agentsFile);
    if (scenario === "unwritable AGENTS.md") {
      assert.match(agents, /BEGIN CFLOW FRICTION/);
      assert.match(io.stdout.output, /Friction AGENTS.md: .* \(skipped\)/);
    } else {
      assert.doesNotMatch(agents, /BEGIN CFLOW FRICTION/);
    }
    if (scenario === "unreadable home" || scenario === "unwritable bin") {
      assert.match(await readText(scriptTarget), /Cflow friction logger/);
      assert.match(io.stdout.output, /Friction friction script: skipped/);
    } else {
      assert.equal(await readFile(scriptTarget).catch(error => error.code), "ENOENT");
    }
  });
}

test("a repository install does not change global friction state", async () => {
  const fixture = await makeGlobalInstallFixture();
  const scriptTarget = path.join(fixture.cflowHome, "bin", "friction.mjs");
  await installFriction({
    sourceRoot: FRICTION_SOURCE_ROOT,
    cflowHome: fixture.cflowHome,
    agentsFile: fixture.agentsFile,
    version: "1.0.0",
  });

  const io = makeIo();
  const repo = await makeTempWorkspace();
  const exitCode = await main(["install", repo], io, fixture.dependencies);

  assert.equal(exitCode, 0);
  assert.match(await readText(scriptTarget), /Cflow friction logger/);
  assert.match(await readText(fixture.agentsFile), /BEGIN CFLOW FRICTION/);
  assert.doesNotMatch(io.stdout.output, /Friction home:/);
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

async function makeGlobalInstallFixture({ customHome = true } = {}) {
  const root = await makeTempWorkspace();
  const homeDirectory = path.join(root, "home");
  const codexHome = path.join(root, "codex-home");
  const cflowHome = customHome ? path.join(root, "cflow-home") : path.join(homeDirectory, ".agents", "cflow");

  return {
    homeDirectory,
    cflowHome,
    agentsFile: path.join(codexHome, "AGENTS.md"),
    dependencies: {
      homeDirectory,
      environment: { CODEX_HOME: codexHome, ...(customHome ? { CFLOW_HOME: cflowHome } : {}) },
    },
  };
}

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
