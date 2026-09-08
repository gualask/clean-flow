import assert from "node:assert/strict";
import { chmod, mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import { main } from "../src/index.mjs";
import { replaceDirectoryFromSource } from "../src/lib/fs.mjs";
import { createMaterializedSkills } from "../src/lib/materialize-skills.mjs";
import { writeMarker } from "../src/lib/marker.mjs";
import { makeTempWorkspace, writeSkill } from "./support/helpers.mjs";

const permissionTestsUnavailable = process.platform === "win32" || process.getuid?.() === 0;

test("install fails when staging leftovers inside the skills directory cannot be cleaned", { skip: permissionTestsUnavailable }, async () => {
  const repo = await makeTempWorkspace();
  const skillsRoot = path.join(repo, ".agents", "skills");
  const locked = path.join(skillsRoot, ".cflow-tmp-a");
  const removable = path.join(skillsRoot, ".cflow-tmp-b");
  await mkdir(locked, { recursive: true });
  await mkdir(removable);
  await writeSkill(locked, "interrupted-skill");
  await chmod(locked, 0o000);
  const io = makeIo();
  try {
    assert.equal(await main(["install", repo, "--dry-run"], io), 0);
    assert.equal(io.stderr.output, "");
    assert.ok((await stat(removable)).isDirectory());
    assert.equal(await main(["install", repo], io), 1, io.stderr.output);
  } finally {
    await chmod(locked, 0o700);
  }
  assert.match(io.stderr.output, /Error:.*(?:EACCES|EPERM)/);
  assert.ok(io.stderr.output.includes(locked));
  assert.match(await readFile(path.join(locked, "interrupted-skill", "SKILL.md"), "utf8"), /interrupted-skill/);
  assert.equal(await stat(path.join(skillsRoot, "cf-start")).catch(error => error.code), "ENOENT");
});

for (const mode of [0o000, 0o500]) {
  test(`install fails when an obsolete skill cannot be inspected or pruned (mode ${mode.toString(8)})`, { skip: permissionTestsUnavailable }, async () => {
    const repo = await makeTempWorkspace();
    const skillsRoot = path.join(repo, ".agents", "skills");
    const obsolete = await writeSkill(skillsRoot, "cf-obsolete");
    await writeMarker(obsolete, { sourceSkill: "cf-obsolete", fingerprint: "unused" });
    const io = makeIo();
    await chmod(obsolete, mode);
    try {
      assert.equal(await main(["install", repo], io), 1, io.stderr.output);
    } finally {
      await chmod(obsolete, 0o700);
    }
    assert.match(io.stderr.output, /Error:.*(?:EACCES|EPERM)/);
    assert.ok(io.stderr.output.includes(obsolete));
    assert.equal(io.stdout.output, "");
  });
}

test("install fails when obsolete references prevent replacing an installed skill", { skip: permissionTestsUnavailable }, async () => {
  const repo = await makeTempWorkspace();
  const installed = await writeSkill(path.join(repo, ".agents", "skills"), "cf-start");
  await writeMarker(installed, { sourceSkill: "cf-start", fingerprint: "outdated" });
  const references = path.join(installed, "references");
  await mkdir(references);
  await writeFile(path.join(references, "obsolete.md"), "obsolete reference");
  const io = makeIo();
  await chmod(references, 0o500);
  try {
    assert.equal(await main(["install", repo], io), 1, io.stderr.output);
  } finally {
    await chmod(references, 0o700);
  }
  assert.match(io.stderr.output, /Error:.*(?:EACCES|EPERM)/);
  assert.ok(io.stderr.output.includes(references));
  assert.equal(io.stdout.output, "");
});

for (const preparationFails of [false, true]) {
  test(`staging cleanup failure preserves ${preparationFails ? "the preparation error" : "the installed skill"}`, { skip: permissionTestsUnavailable }, async () => {
    const root = await makeTempWorkspace();
    const source = await writeSkill(path.join(root, "source"), "demo");
    const destination = path.join(root, "installed", "demo");
    const warnings = [];
    const preparationError = new Error("Could not prepare skill");
    let locked;
    try {
      const operation = replaceDirectoryFromSource(source, destination, async staged => {
        locked = path.join(path.dirname(staged), "locked");
        await mkdir(locked);
        await writeFile(path.join(locked, "kept"), "kept");
        await chmod(locked, 0o000);
        if (preparationFails) throw preparationError;
      }, { onWarning: message => warnings.push(message) });
      if (preparationFails) {
        await assert.rejects(operation, error => error === preparationError);
      } else {
        await operation;
        assert.match(await readFile(path.join(destination, "SKILL.md"), "utf8"), /Demo|demo/);
      }
      assert.equal(warnings.length, 1);
      assert.match(warnings[0], /Warning: Cleanup incomplete:/);
    } finally {
      if (locked) {
        await chmod(locked, 0o700);
        await rm(path.dirname(locked), { recursive: true, force: true });
      }
    }
  });
}

test("materialized skill cleanup warns without throwing", { skip: permissionTestsUnavailable }, async () => {
  const root = await makeTempWorkspace();
  await writeSkill(root, "demo");
  const warnings = [];
  const materialized = await createMaterializedSkills(root, { onWarning: message => warnings.push(message) });
  await chmod(materialized.skillsRoot, 0o000);
  try {
    await materialized.cleanup();
    assert.equal(warnings.length, 1);
    assert.match(warnings[0], /Warning: Cleanup incomplete:/);
  } finally {
    await chmod(materialized.skillsRoot, 0o700);
    await materialized.cleanup();
  }
});

function makeIo() {
  const buffer = () => ({ output: "", write(text) { this.output += text; } });
  return { stdout: buffer(), stderr: buffer() };
}
