import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { chmod, mkdir, readFile, writeFile } from "node:fs/promises";

import { main } from "../src/index.mjs";
import { isPluginInstalled, PLUGIN_ID } from "../src/commands/migrate.mjs";
import { MARKER_FILE } from "../src/lib/marker.mjs";
import { listDirectoryNames, makeTempWorkspace, writeSkill } from "./support/helpers.mjs";

const FRICTION_BLOCK = "<!-- BEGIN CFLOW FRICTION -->\nlog friction\n<!-- END CFLOW FRICTION -->";

test("help names migrate as the only command", async () => {
  const io = makeIo();

  assert.equal(await main(["--help"], io), 0);
  assert.match(io.stdout.output, /cflow-skills migrate --global/);
  assert.doesNotMatch(io.stdout.output, /cflow-skills install/);
});

test("install and remove fail and point to migrate", async () => {
  for (const command of ["install", "remove"]) {
    const io = makeIo();

    assert.equal(await main([command, "--global"], io), 1);
    assert.match(io.stderr.output, new RegExp(`${command} is gone: Cflow installs as a plugin`));
    assert.match(io.stderr.output, /cflow-skills migrate/);
  }
});

test("global migrate removes owned skills and friction, keeps the rest, installs the Codex plugin once", async () => {
  const workspace = await makeTempWorkspace();
  const home = path.join(workspace, "home");
  const skillsRoot = path.join(home, ".agents", "skills");
  await writeOwnedSkill(skillsRoot, "cf-clean");
  await writeOwnedSkill(skillsRoot, "cf-docs");
  await writeSkill(skillsRoot, "cf-mine");
  await writeSkill(skillsRoot, "foreign-skill");

  const cflowHome = path.join(home, ".agents", "cflow");
  await mkdir(path.join(cflowHome, "bin"), { recursive: true });
  await mkdir(path.join(cflowHome, "friction"), { recursive: true });
  await writeFile(path.join(cflowHome, "bin", "friction.mjs"), "// logger\n");
  await writeFile(path.join(cflowHome, "friction", "2026-10.jsonl"), "{}\n");
  const agentsFile = path.join(home, ".codex", "AGENTS.md");
  await mkdir(path.dirname(agentsFile), { recursive: true });
  await writeFile(agentsFile, `# Global agent instructions\n\nKeep this.\n\n${FRICTION_BLOCK}\n`);

  const codex = fakeCodex();
  const dependencies = { homeDirectory: home, environment: {}, runCodex: codex.run };

  const first = makeIo();
  assert.equal(await main(["migrate", "--global"], first, dependencies), 0);
  assert.deepEqual(await listDirectoryNames(skillsRoot), ["cf-mine", "foreign-skill"]);
  assert.deepEqual(await listDirectoryNames(cflowHome), ["friction"]);
  assert.equal(await readFile(agentsFile, "utf8"), "# Global agent instructions\n\nKeep this.\n");
  assert.deepEqual(codex.calls, [
    "plugin list --marketplace clean-flow",
    "plugin marketplace add gualask/clean-flow",
    `plugin add ${PLUGIN_ID}`,
  ]);
  assert.match(first.stdout.output, /Removed old Cflow skills: cf-clean, cf-docs/);
  assert.match(first.stdout.output, /Codex plugin: installed/);

  const second = makeIo();
  assert.equal(await main(["migrate", "--global"], second, dependencies), 0);
  assert.deepEqual(await listDirectoryNames(skillsRoot), ["cf-mine", "foreign-skill"]);
  assert.deepEqual(codex.calls.slice(3), ["plugin list --marketplace clean-flow"]);
  assert.match(second.stdout.output, /Removed old Cflow skills: none/);
  assert.match(second.stdout.output, /Codex plugin: already installed/);
});

test("repository migrate dry run changes nothing and says what it would do", async () => {
  const workspace = await makeTempWorkspace();
  const repo = path.join(workspace, "repo");
  const skillsRoot = path.join(repo, ".agents", "skills");
  await writeOwnedSkill(skillsRoot, "cf-clean");
  const codex = fakeCodex();
  const io = makeIo();

  assert.equal(await main(["migrate", repo, "--dry-run"], io, { runCodex: codex.run }), 0);
  assert.deepEqual(await listDirectoryNames(skillsRoot), ["cf-clean"]);
  assert.deepEqual(codex.calls, ["plugin list --marketplace clean-flow"]);
  assert.match(io.stdout.output, /Would remove old Cflow skills: cf-clean/);
  assert.match(io.stdout.output, /Codex plugin: would run codex plugin marketplace add/);
});

test("a failed plugin install leaves the old skills in place", async () => {
  const workspace = await makeTempWorkspace();
  const repo = path.join(workspace, "repo");
  const skillsRoot = path.join(repo, ".agents", "skills");
  await writeOwnedSkill(skillsRoot, "cf-clean");
  const io = makeIo();
  const failing = async (args) => {
    if (args[1] === "marketplace") {
      throw new Error("marketplace root does not contain a supported manifest");
    }
    return "";
  };

  assert.equal(await main(["migrate", repo], io, { runCodex: failing }), 1);
  assert.deepEqual(await listDirectoryNames(skillsRoot), ["cf-clean"]);
  assert.match(io.stderr.output, /supported manifest/);
});

test("without codex on PATH, migrate changes nothing and fails", async () => {
  const workspace = await makeTempWorkspace();
  const home = path.join(workspace, "home");
  const skillsRoot = path.join(home, ".agents", "skills");
  await writeOwnedSkill(skillsRoot, "cf-clean");
  const io = makeIo();

  assert.equal(await main(["migrate", "--global"], io, { homeDirectory: home, environment: { PATH: "" } }), 1);
  assert.deepEqual(await listDirectoryNames(skillsRoot), ["cf-clean"]);
  assert.match(io.stdout.output, /Nothing changed: codex is not on PATH/);
  assert.match(io.stdout.output, /npm install -g @openai\/codex/);
});

test("migrate runs the codex it finds on PATH", async () => {
  const workspace = await makeTempWorkspace();
  const home = path.join(workspace, "home");
  const skillsRoot = path.join(home, ".agents", "skills");
  await writeOwnedSkill(skillsRoot, "cf-clean");
  const log = path.join(workspace, "codex.log");
  const bin = path.join(workspace, "bin");
  const binary = await writeFakeCodex(bin, log);
  const io = makeIo();

  const exitCode = await main(["migrate", "--global"], io, {
    homeDirectory: home,
    environment: { PATH: bin, CFLOW_MARKETPLACE: "/tmp/clean-flow-checkout" },
  });

  assert.equal(exitCode, 0, io.stderr.output);
  assert.deepEqual(await listDirectoryNames(skillsRoot), []);
  assert.match(io.stdout.output, new RegExp(`Codex: ${binary.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\n`));
  assert.deepEqual((await readFile(log, "utf8")).trim().split("\n"), [
    "plugin list --marketplace clean-flow",
    "plugin marketplace add /tmp/clean-flow-checkout",
    "plugin add cflow@clean-flow",
  ]);
});

test("the Codex plugin counts as installed only on an installed status", () => {
  assert.equal(isPluginInstalled("PLUGIN  STATUS  VERSION\ncflow@clean-flow  installed, enabled  0.4.4  /x\n"), true);
  assert.equal(isPluginInstalled("cflow@clean-flow  not installed    /x\n"), false);
  assert.equal(isPluginInstalled("other@clean-flow  installed, enabled  1.0.0  /x\n"), false);
});

async function writeOwnedSkill(root, name) {
  const skillDir = await writeSkill(root, name);
  await writeFile(
    path.join(skillDir, MARKER_FILE),
    `${JSON.stringify({ owner: "clean-flow", pack: "cflow", sourceSkill: name, sourceKind: "skill", fingerprint: "x" })}\n`,
  );
  return skillDir;
}

async function writeFakeCodex(directory, log) {
  const binary = path.join(directory, "codex");
  await mkdir(directory, { recursive: true });
  await writeFile(binary, `#!/bin/sh\necho "$*" >> "${log}"\n`);
  await chmod(binary, 0o755);
  return binary;
}

function fakeCodex() {
  let installed = false;
  const calls = [];
  return {
    calls,
    async run(args) {
      calls.push(args.join(" "));
      if (args.join(" ") === `plugin add ${PLUGIN_ID}`) {
        installed = true;
      }
      return args[1] === "list" && args.includes("--marketplace") && installed ? `${PLUGIN_ID}  installed, enabled  0.4.4  /x\n` : "";
    },
  };
}

function makeIo() {
  return {
    stdout: makeStream(),
    stderr: makeStream(),
  };
}

function makeStream() {
  return {
    output: "",
    write(chunk) {
      this.output += chunk;
    },
  };
}
