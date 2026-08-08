import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";

import { main, resolveDestinations } from "../src/index.mjs";
import { writeMarker } from "../src/lib/marker.mjs";
import {
  listDirectoryNames,
  listFileNames,
  makeTempWorkspace,
  readText,
  writeLegacyCodexAgentFixture,
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
      legacySkillsRoot: path.join(codexHome, "skills"),
      legacyCodexAgentsRoot: path.join(codexHome, "agents"),
    },
  );

  const repo = path.join(path.sep, "tmp", "repo");
  assert.deepEqual(resolveDestinations({ global: false, targetPath: repo }), {
    skillsRoot: path.join(repo, ".agents", "skills"),
    legacySkillsRoot: path.join(repo, ".codex", "skills"),
    legacyCodexAgentsRoot: path.join(repo, ".codex", "agents"),
  });
});

test("global install and remove use HOME .agents and migrate the CODEX_HOME legacy install", async () => {
  const workspace = await makeTempWorkspace();
  const homeDirectory = path.join(workspace, "home");
  const codexHome = path.join(workspace, "codex-home");
  const legacySkillsRoot = path.join(codexHome, "skills");
  const ownedLegacySkill = await writeSkill(legacySkillsRoot, "cf-start");
  await writeMarker(ownedLegacySkill, {
    sourceSkill: "cf-start",
    fingerprint: "sha256:legacy",
  });
  await writeSkill(legacySkillsRoot, "foreign-skill");

  const io = makeIo();
  const exitCode = await main(["install", "--global"], io, {
    environment: { CODEX_HOME: codexHome },
    homeDirectory,
  });

  assert.equal(exitCode, 0);
  assert.ok(
    (await listDirectoryNames(path.join(homeDirectory, ".agents", "skills"))).includes(
      "cf-start",
    ),
  );
  assert.deepEqual(await listDirectoryNames(legacySkillsRoot), ["foreign-skill"]);
  assert.match(io.stdout.output, /legacy-skill: cf-start/);
  assert.match(
    io.stdout.output,
    new RegExp(escapeRegExp(path.join(homeDirectory, ".agents", "skills"))),
  );

  const removeIo = makeIo();
  const removeExitCode = await main(["remove", "--global"], removeIo, {
    environment: { CODEX_HOME: codexHome },
    homeDirectory,
  });

  assert.equal(removeExitCode, 0);
  assert.deepEqual(
    await listDirectoryNames(path.join(homeDirectory, ".agents", "skills")),
    [],
  );
  assert.deepEqual(await listDirectoryNames(legacySkillsRoot), ["foreign-skill"]);
});

test("install and remove prune marked legacy agents while dry-run preserves them", async () => {
  const workspace = await makeTempWorkspace();
  const targetRoot = path.join(workspace, "repo");
  const agentsRoot = path.join(targetRoot, ".codex", "agents");
  const skillsRoot = path.join(targetRoot, ".agents", "skills");
  const legacySkillsRoot = path.join(targetRoot, ".codex", "skills");

  await writeLegacyCodexAgentFixture(agentsRoot);
  const ownedLegacySkill = await writeSkill(legacySkillsRoot, "cf-start");
  await writeMarker(ownedLegacySkill, {
    sourceSkill: "cf-start",
    fingerprint: "sha256:legacy",
  });
  await writeSkill(legacySkillsRoot, "foreign-skill");

  const dryRunIo = makeIo();
  const dryRunCode = await main(["install", targetRoot, "--dry-run"], dryRunIo);

  assert.equal(dryRunCode, 0);
  assert.deepEqual(await listDirectoryNames(skillsRoot), []);
  assert.deepEqual(await listDirectoryNames(legacySkillsRoot), [
    "cf-start",
    "foreign-skill",
  ]);
  assert.deepEqual(await listFileNames(agentsRoot), [
    "cflow_finding_derisk_recon.toml",
  ]);
  assert.match(dryRunIo.stdout.output, /legacy-skill: cf-start/);
  assert.match(
    dryRunIo.stdout.output,
    /legacy-codex-agent: cflow_finding_derisk_recon\.toml/,
  );

  const installIo = makeIo();
  const installCode = await main(["install", targetRoot], installIo);

  assert.equal(installCode, 0);
  assert.ok((await listDirectoryNames(skillsRoot)).includes("cf-start"));
  assert.deepEqual(await listDirectoryNames(legacySkillsRoot), ["foreign-skill"]);
  assert.deepEqual(await listFileNames(agentsRoot), []);
  assert.match(installIo.stdout.output, /legacy-skill: cf-start/);
  assert.match(
    installIo.stdout.output,
    /legacy-codex-agent: cflow_finding_derisk_recon\.toml/,
  );

  await writeLegacyCodexAgentFixture(agentsRoot, "cflow_trace_recon.toml");

  const removeIo = makeIo();
  const removeCode = await main(["remove", targetRoot], removeIo);

  assert.equal(removeCode, 0);
  assert.deepEqual(await listDirectoryNames(skillsRoot), []);
  assert.deepEqual(await listDirectoryNames(legacySkillsRoot), ["foreign-skill"]);
  assert.deepEqual(await listFileNames(agentsRoot), []);
  assert.match(
    removeIo.stdout.output,
    /legacy-codex-agent: cflow_trace_recon\.toml/,
  );
});

test("a conflict in .agents leaves an owned legacy install untouched", async () => {
  const workspace = await makeTempWorkspace();
  const targetRoot = path.join(workspace, "repo");
  const skillsRoot = path.join(targetRoot, ".agents", "skills");
  const legacySkillsRoot = path.join(targetRoot, ".codex", "skills");
  const foreignSkill = await writeSkill(skillsRoot, "cf-start", {
    "SKILL.md": `---\nname: "cf-start"\ndescription: "Foreign"\n---\n\n# foreign\n`,
  });
  const ownedLegacySkill = await writeSkill(legacySkillsRoot, "cf-start");
  await writeMarker(ownedLegacySkill, {
    sourceSkill: "cf-start",
    fingerprint: "sha256:legacy",
  });

  const before = await readText(path.join(foreignSkill, "SKILL.md"));
  const io = makeIo();
  const exitCode = await main(["install", targetRoot], io);

  assert.equal(exitCode, 1);
  assert.equal(await readText(path.join(foreignSkill, "SKILL.md")), before);
  assert.deepEqual(await listDirectoryNames(legacySkillsRoot), ["cf-start"]);
  assert.match(io.stdout.output, /Conflicts: 1/);
  assert.match(io.stdout.output, /Applied: no/);
});

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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
