import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";

import { main, resolveDestinations } from "../src/index.mjs";
import {
  listDirectoryNames,
  makeTempWorkspace,
  readText,
  writeSkill,
} from "./support/helpers.mjs";

test("top-level help exits successfully", async () => {
  const io = makeIo();

  const exitCode = await main(["--help"], io);

  assert.equal(exitCode, 0);
  assert.match(io.stdout.output, /Usage:/);
  assert.match(io.stdout.output, /<repo>\/\.agents\/skills/);
  assert.match(io.stdout.output, /--global targets ~\/\.agents\/skills/);
  assert.equal(io.stderr.output, "");
});

test("short top-level help exits successfully", async () => {
  const io = makeIo();

  const exitCode = await main(["-h"], io);

  assert.equal(exitCode, 0);
  assert.match(io.stdout.output, /Usage:/);
  assert.equal(io.stderr.output, "");
});

test("install delegates an exact tag while preserving install options", async () => {
  const io = makeIo();
  let delegated;

  const exitCode = await main(
    ["install", "--global", "--friction", "--dry-run", "--tag", "0.0.1"],
    io,
    {
      installFromTag: async (request) => {
        delegated = request;
        return 7;
      },
    },
  );

  assert.equal(exitCode, 7);
  assert.equal(delegated.tag, "0.0.1");
  assert.deepEqual(delegated.installArgs, [
    "install",
    "--global",
    "--friction",
    "--dry-run",
  ]);
  assert.equal(delegated.io, io);
});

test("install accepts an inline tag for a repository target", async () => {
  const io = makeIo();
  let delegated;

  const exitCode = await main(
    ["install", "/tmp/example", "--tag=0.0.1"],
    io,
    {
      installFromTag: async (request) => {
        delegated = request;
        return 0;
      },
    },
  );

  assert.equal(exitCode, 0);
  assert.deepEqual(delegated.installArgs, ["install", "/tmp/example"]);
});

test("tag selection rejects missing, repeated, and remove usage", async () => {
  for (const argv of [
    ["install", "/tmp/example", "--tag"],
    ["install", "/tmp/example", "--tag", "0.0.1", "--tag", "0.0.2"],
    ["remove", "/tmp/example", "--tag", "0.0.1"],
  ]) {
    const io = makeIo();
    const exitCode = await main(argv, io);

    assert.equal(exitCode, 1);
    assert.match(io.stderr.output, /Error: --tag/);
  }
});

test("destination resolution follows Codex user and repository skill locations", () => {
  const homeDirectory = path.join(path.sep, "tmp", "cflow-home");
  const codexHome = path.join(path.sep, "tmp", "custom-codex-home");

  assert.deepEqual(
    resolveDestinations(
      { global: true },
      { homeDirectory, environment: { CODEX_HOME: codexHome } },
    ),
    {
      skillsRoot: path.join(homeDirectory, ".agents", "skills"),
    },
  );

  const repo = path.join(path.sep, "tmp", "repo");
  assert.deepEqual(resolveDestinations({ global: false, targetPath: repo }), {
    skillsRoot: path.join(repo, ".agents", "skills"),
  });
});

test("global install and remove use HOME .agents and preserve foreign skills", async () => {
  const homeDirectory = await makeTempWorkspace();
  const skillsRoot = path.join(homeDirectory, ".agents", "skills");
  const dependencies = { homeDirectory, environment: {} };
  await writeSkill(skillsRoot, "foreign-skill");

  const io = makeIo();
  assert.equal(await main(["install", "--global"], io, dependencies), 0);
  assert.ok((await listDirectoryNames(skillsRoot)).includes("cf-execute"));
  assert.ok(io.stdout.output.includes(`Skills destination: ${skillsRoot}`));

  const removeIo = makeIo();
  assert.equal(await main(["remove", "--global"], removeIo, dependencies), 0);
  assert.deepEqual(await listDirectoryNames(skillsRoot), ["foreign-skill"]);
});

test("repository install is idempotent and install/remove dry runs preserve the target", async () => {
  const targetRoot = await makeTempWorkspace();
  const skillsRoot = path.join(targetRoot, ".agents", "skills");
  assert.equal(await main(["install", targetRoot, "--dry-run"], makeIo()), 0);
  assert.deepEqual(await listDirectoryNames(skillsRoot), []);

  assert.equal(await main(["install", targetRoot], makeIo()), 0);
  const installed = await listDirectoryNames(skillsRoot);
  assert.ok(installed.includes("cf-execute"));
  const repeatIo = makeIo();
  assert.equal(await main(["install", targetRoot], repeatIo), 0);
  assert.ok(repeatIo.stdout.output.includes(`Unchanged: ${installed.length}`));

  assert.equal(await main(["remove", targetRoot, "--dry-run"], makeIo()), 0);
  assert.deepEqual(await listDirectoryNames(skillsRoot), installed);
  assert.equal(await main(["remove", targetRoot], makeIo()), 0);
  assert.deepEqual(await listDirectoryNames(skillsRoot), []);
});

test("a conflict in .agents preserves foreign skills and prevents installation", async () => {
  const targetRoot = await makeTempWorkspace();
  const skillsRoot = path.join(targetRoot, ".agents", "skills");
  const foreignSkill = await writeSkill(skillsRoot, "cf-execute");
  const before = await readText(path.join(foreignSkill, "SKILL.md"));
  const io = makeIo();
  assert.equal(await main(["install", targetRoot], io), 1);
  assert.equal(await readText(path.join(foreignSkill, "SKILL.md")), before);
  assert.deepEqual(await listDirectoryNames(skillsRoot), ["cf-execute"]);
  assert.match(io.stdout.output, /Conflicts: 1/);
  assert.match(io.stdout.output, /Applied: no/);
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
