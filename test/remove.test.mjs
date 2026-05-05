import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { mkdir } from "node:fs/promises";

import { removeCodexAgents } from "../src/commands/remove-agents.mjs";
import { removeSkills } from "../src/commands/remove.mjs";
import { computeSkillFingerprint } from "../src/lib/fingerprint.mjs";
import { writeFileMarker, writeMarker } from "../src/lib/marker.mjs";
import {
  listFileNames,
  listDirectoryNames,
  makeTempWorkspace,
  writeCodexAgent,
  writeSkill,
  writeSupportDirectory,
} from "./support/helpers.mjs";

test("remove deletes only Cflow-owned skill and support directories", async () => {
  const workspace = await makeTempWorkspace();
  const destinationRoot = path.join(workspace, "repo", ".codex", "skills");

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

test("remove deletes only Cflow-owned Codex custom agents", async () => {
  const workspace = await makeTempWorkspace();
  const destinationRoot = path.join(workspace, "repo", ".codex", "agents");

  await mkdir(destinationRoot, { recursive: true });

  await writeCodexAgent(destinationRoot, "cflow_architecture_recon.toml");
  await writeCodexAgent(destinationRoot, "foreign_agent.toml");
  await writeFileMarker(destinationRoot, "cflow_architecture_recon.toml", {
    sourceSkill: "cflow_architecture_recon.toml",
    fingerprint: "sha256:owned",
  });

  const result = await removeCodexAgents({ destinationRoot });

  assert.equal(result.removed.length, 1);
  assert.equal(result.kept.length, 1);
  assert.equal(result.applied, true);
  assert.deepEqual(await listFileNames(destinationRoot), ["foreign_agent.toml"]);
});
