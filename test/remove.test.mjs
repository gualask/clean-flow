import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { mkdir } from "node:fs/promises";

import { removeSkills } from "../src/commands/remove.mjs";
import { computeSkillFingerprint } from "../src/lib/fingerprint.mjs";
import { writeMarker } from "../src/lib/marker.mjs";
import {
  listDirectoryNames,
  makeTempWorkspace,
  writeSkill,
  writeSupportDirectory,
} from "./support/helpers.mjs";

test("remove deletes only Cflow-owned skill and support directories", async () => {
  const workspace = await makeTempWorkspace();
  const destinationRoot = path.join(workspace, "repo", ".agents", "skills");

  await mkdir(destinationRoot, { recursive: true });

  const ownedShared = await writeSupportDirectory(destinationRoot);
  const ownedStart = await writeSkill(destinationRoot, "cf-start");
  const ownedCognitive = await writeSkill(destinationRoot, "cf-cognitive");
  await writeSkill(destinationRoot, "foreign-skill");

  await writeMarker(ownedShared, {
    sourceSkill: "_shared",
    sourceKind: "support",
    fingerprint: await computeSkillFingerprint(ownedShared),
  });
  await writeMarker(ownedStart, {
    sourceSkill: "cf-start",
    fingerprint: await computeSkillFingerprint(ownedStart),
  });
  await writeMarker(ownedCognitive, {
    sourceSkill: "cf-cognitive",
    fingerprint: await computeSkillFingerprint(ownedCognitive),
  });

  const result = await removeSkills({ destinationRoot });

  assert.equal(result.removed.length, 3);
  assert.equal(result.kept.length, 1);
  assert.equal(result.applied, true);
  assert.deepEqual(await listDirectoryNames(destinationRoot), ["foreign-skill"]);
});
