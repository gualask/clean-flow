import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { mkdir } from "node:fs/promises";

import { installSkills } from "../src/commands/install.mjs";
import { computeSkillFingerprint } from "../src/lib/fingerprint.mjs";
import { readMarker, writeMarker } from "../src/lib/marker.mjs";
import {
  listDirectoryNames,
  makeTempWorkspace,
  readText,
  writeSkill,
} from "./support/helpers.mjs";

test("install copies new skills and writes owned markers", async () => {
  const workspace = await makeTempWorkspace();
  const sourceRoot = path.join(workspace, "source");
  const destinationRoot = path.join(workspace, "repo", ".agents", "skills");

  await mkdir(sourceRoot, { recursive: true });
  await writeSkill(sourceRoot, "cf-start");
  await writeSkill(sourceRoot, "cf-internal-review");

  const result = await installSkills({ sourceRoot, destinationRoot });

  assert.equal(result.added.length, 2);
  assert.equal(result.updated.length, 0);
  assert.equal(result.pruned.length, 0);
  assert.equal(result.conflicts.length, 0);
  assert.equal(result.applied, true);
  assert.deepEqual(await listDirectoryNames(destinationRoot), ["cf-internal-review", "cf-start"]);

  const marker = await readMarker(path.join(destinationRoot, "cf-start"));
  assert.equal(marker.owner, "clean-flow");
  assert.equal(marker.pack, "cflow");
  assert.match(marker.fingerprint, /^sha256:/);
});

test("install updates owned skills, prunes removed owned skills, and keeps foreign skills", async () => {
  const workspace = await makeTempWorkspace();
  const sourceRoot = path.join(workspace, "source");
  const destinationRoot = path.join(workspace, "repo", ".agents", "skills");

  await mkdir(sourceRoot, { recursive: true });
  await mkdir(destinationRoot, { recursive: true });

  await writeSkill(sourceRoot, "cf-start", {
    "SKILL.md": `---\nname: "cf-start"\ndescription: "Updated"\n---\n\n# cf-start v2\n`,
  });
  await writeSkill(sourceRoot, "cf-internal-review");

  const ownedStart = await writeSkill(destinationRoot, "cf-start", {
    "SKILL.md": `---\nname: "cf-start"\ndescription: "Old"\n---\n\n# cf-start v1\n`,
  });
  const ownedOld = await writeSkill(destinationRoot, "cf-old");
  await writeSkill(destinationRoot, "foreign-skill", {
    "SKILL.md": `---\nname: "foreign-skill"\ndescription: "Foreign"\n---\n\n# foreign\n`,
  });

  await writeMarker(ownedStart, {
    sourceSkill: "cf-start",
    fingerprint: await computeSkillFingerprint(ownedStart),
  });
  await writeMarker(ownedOld, {
    sourceSkill: "cf-old",
    fingerprint: await computeSkillFingerprint(ownedOld),
  });

  const result = await installSkills({ sourceRoot, destinationRoot });

  assert.equal(result.updated.length, 1);
  assert.equal(result.added.length, 1);
  assert.equal(result.pruned.length, 1);
  assert.equal(result.conflicts.length, 0);
  assert.deepEqual(await listDirectoryNames(destinationRoot), [
    "cf-internal-review",
    "cf-start",
    "foreign-skill",
  ]);

  const updatedBody = await readText(path.join(destinationRoot, "cf-start", "SKILL.md"));
  assert.match(updatedBody, /Updated/);

  const foreignBody = await readText(path.join(destinationRoot, "foreign-skill", "SKILL.md"));
  assert.match(foreignBody, /Foreign/);
});

test("install reports conflicts and leaves foreign same-name skills untouched", async () => {
  const workspace = await makeTempWorkspace();
  const sourceRoot = path.join(workspace, "source");
  const destinationRoot = path.join(workspace, "repo", ".agents", "skills");

  await mkdir(sourceRoot, { recursive: true });
  await mkdir(destinationRoot, { recursive: true });
  await writeSkill(sourceRoot, "cf-start");
  await writeSkill(destinationRoot, "cf-start", {
    "SKILL.md": `---\nname: "cf-start"\ndescription: "Foreign"\n---\n\n# foreign copy\n`,
  });

  const before = await readText(path.join(destinationRoot, "cf-start", "SKILL.md"));
  const result = await installSkills({ sourceRoot, destinationRoot });
  const after = await readText(path.join(destinationRoot, "cf-start", "SKILL.md"));

  assert.equal(result.conflicts.length, 1);
  assert.equal(result.applied, false);
  assert.equal(before, after);
});

test("install dry-run computes the plan without mutating the target", async () => {
  const workspace = await makeTempWorkspace();
  const sourceRoot = path.join(workspace, "source");
  const destinationRoot = path.join(workspace, "repo", ".agents", "skills");

  await mkdir(sourceRoot, { recursive: true });
  await writeSkill(sourceRoot, "cf-start");

  const result = await installSkills({ sourceRoot, destinationRoot, dryRun: true });

  assert.equal(result.added.length, 1);
  assert.equal(result.applied, false);
  assert.deepEqual(await listDirectoryNames(destinationRoot), []);
});
