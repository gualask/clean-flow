import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { access, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { findVendorDrift, vendorSharedFiles } from "../src/lib/vendor.mjs";
import { makeTempWorkspace, writeSkill } from "./support/helpers.mjs";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function readJson(relativePath) {
  return JSON.parse(await readFile(path.join(REPO_ROOT, relativePath), "utf8"));
}

test("the Claude Code and Codex manifests agree with package.json", async () => {
  const pkg = await readJson("package.json");
  const claude = await readJson(".claude-plugin/plugin.json");
  const codex = await readJson(".codex-plugin/plugin.json");

  for (const [label, manifest] of [["claude", claude], ["codex", codex]]) {
    assert.equal(manifest.name, "cflow", label);
    assert.equal(manifest.version, pkg.version, `${label} version must follow package.json`);
    assert.equal(manifest.license, pkg.license, label);
  }
  assert.equal(codex.description, claude.description, "one plugin description for both hosts");
  assert.equal(codex.skills, "./skills/");
});

test("each host's marketplace lists the cflow plugin at the repository root", async () => {
  const claude = await readJson(".claude-plugin/marketplace.json");
  const codex = await readJson(".agents/plugins/marketplace.json");

  assert.equal(claude.name, "clean-flow");
  assert.deepEqual(
    claude.plugins.map(({ name, source }) => ({ name, source })),
    [{ name: "cflow", source: "./" }],
  );
  assert.equal(codex.name, "clean-flow");
  assert.deepEqual(
    codex.plugins.map(({ name, source }) => ({ name, source })),
    [{ name: "cflow", source: { source: "local", path: "./" } }],
  );
});

test("skills/ holds only skills", async () => {
  const entries = await readdir(path.join(REPO_ROOT, "skills"), { withFileTypes: true });

  // Dotfiles such as the Finder's .DS_Store are git-ignored and never reach a host.
  for (const entry of entries.filter((candidate) => !candidate.name.startsWith("."))) {
    assert.ok(entry.isDirectory(), `skills/${entry.name} is not a skill directory`);
    await assert.doesNotReject(
      access(path.join(REPO_ROOT, "skills", entry.name, "SKILL.md")),
      `skills/${entry.name} has no SKILL.md`,
    );
  }
});

test("every vendored copy in skills/ equals its source in shared/", async () => {
  const problems = await findVendorDrift({
    skillsRoot: path.join(REPO_ROOT, "skills"),
    sharedRoot: path.join(REPO_ROOT, "shared"),
  });

  assert.deepEqual(
    problems.map(({ path: filePath, problem }) => `${path.relative(REPO_ROOT, filePath)}: ${problem}`),
    [],
    "run pnpm vendor",
  );
});

test("vendoring writes the mapped copies and drift names a stale or missing one", async () => {
  const workspace = await makeTempWorkspace();
  const skillsRoot = path.join(workspace, "skills");
  const sharedRoot = path.join(workspace, "shared");
  const roots = { skillsRoot, sharedRoot };
  await writeSkill(skillsRoot, "cf-a");
  await writeSkill(skillsRoot, "cf-b");
  await mkdir(path.join(sharedRoot, "references"), { recursive: true });
  await mkdir(path.join(sharedRoot, "scripts"), { recursive: true });
  await writeFile(path.join(sharedRoot, "references", "gate.md"), "# Gate\n");
  await writeFile(path.join(sharedRoot, "scripts", "tree.mjs"), "export {};\n");
  await writeFile(
    path.join(sharedRoot, "vendor.json"),
    JSON.stringify({ version: 1, skills: { "cf-a": { references: ["gate.md"], scripts: ["tree.mjs"] }, "cf-b": { references: ["gate.md"] } } }),
  );

  assert.equal((await findVendorDrift(roots)).length, 3);

  assert.equal((await vendorSharedFiles(roots)).length, 3);
  assert.equal(await readFile(path.join(skillsRoot, "cf-b", "references", "gate.md"), "utf8"), "# Gate\n");
  assert.deepEqual(await findVendorDrift(roots), []);
  assert.deepEqual(await vendorSharedFiles(roots), [], "a second run writes nothing");

  await writeFile(path.join(skillsRoot, "cf-a", "references", "gate.md"), "# Edited copy\n");
  const drift = await findVendorDrift(roots);
  assert.equal(drift.length, 1);
  assert.match(drift[0].problem, /differs from .*shared\/references\/gate\.md/);
});

test("vendoring rejects unknown skills and unsafe paths", async () => {
  const workspace = await makeTempWorkspace();
  const skillsRoot = path.join(workspace, "skills");
  const sharedRoot = path.join(workspace, "shared");
  const roots = { skillsRoot, sharedRoot };
  await writeSkill(skillsRoot, "cf-a");
  await mkdir(path.join(sharedRoot), { recursive: true });

  await writeFile(path.join(sharedRoot, "vendor.json"), JSON.stringify({ version: 1, skills: { "cf-x": {} } }));
  await assert.rejects(vendorSharedFiles(roots), /unknown skill: cf-x/);

  await writeFile(path.join(sharedRoot, "vendor.json"), JSON.stringify({ version: 1, skills: { "cf-a": { references: ["../escape.md"] } } }));
  await assert.rejects(vendorSharedFiles(roots), /unsafe path/);
});

test("a skill file pointing at shared/ is drift", async () => {
  const workspace = await makeTempWorkspace();
  const skillsRoot = path.join(workspace, "skills");
  const roots = { skillsRoot, sharedRoot: path.join(workspace, "shared") };
  await writeSkill(skillsRoot, "cf-a", { "SKILL.md": "---\nname: cf-a\ndescription: x\n---\n\nRead `../../shared/references/gate.md`.\n" });

  const drift = await findVendorDrift(roots);
  assert.equal(drift.length, 1);
  assert.match(drift[0].problem, /references shared source path/);
});
