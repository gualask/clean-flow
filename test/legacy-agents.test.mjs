import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";

import { pruneLegacyCodexAgents } from "../src/commands/prune-legacy-agents.mjs";
import {
  listDirectoryNames,
  listFileNames,
  makeTempWorkspace,
  writeLegacyCodexAgentFixture,
} from "./support/helpers.mjs";

test("legacy cleanup removes all marked Cflow agents and preserves foreign agents", async () => {
  const workspace = await makeTempWorkspace();
  const destinationRoot = path.join(workspace, "repo", ".codex", "agents");

  await writeLegacyCodexAgentFixture(
    destinationRoot,
    "cflow_finding_derisk_recon.toml",
  );
  await writeLegacyCodexAgentFixture(destinationRoot, "cflow_trace_recon.toml");
  await writeLegacyCodexAgentFixture(
    destinationRoot,
    "cflow_architecture_recon.toml",
    { writeAgent: false },
  );
  await writeLegacyCodexAgentFixture(destinationRoot, "foreign_agent.toml", {
    marker: {
      owner: "another-pack",
      pack: "foreign",
      sourceKind: "codex-agent",
    },
  });
  await writeLegacyCodexAgentFixture(destinationRoot, "user_agent.toml", {
    marker: null,
  });

  const result = await pruneLegacyCodexAgents({ destinationRoot });

  assert.deepEqual(
    result.removed.map((entry) => entry.name),
    [
      "cflow_architecture_recon.toml",
      "cflow_finding_derisk_recon.toml",
      "cflow_trace_recon.toml",
    ],
  );
  assert.equal(result.applied, true);
  assert.deepEqual(await listFileNames(destinationRoot), [
    "foreign_agent.toml",
    "user_agent.toml",
  ]);
  assert.deepEqual(await listFileNames(path.join(destinationRoot, ".cflow-sync")), [
    "foreign_agent.toml.json",
  ]);
});

test("legacy cleanup dry-run reports owned agents without changing the target", async () => {
  const workspace = await makeTempWorkspace();
  const destinationRoot = path.join(workspace, "repo", ".codex", "agents");

  await writeLegacyCodexAgentFixture(destinationRoot);

  const result = await pruneLegacyCodexAgents({
    destinationRoot,
    dryRun: true,
  });

  assert.equal(result.removed.length, 1);
  assert.equal(result.applied, false);
  assert.deepEqual(await listFileNames(destinationRoot), [
    "cflow_finding_derisk_recon.toml",
  ]);
  assert.deepEqual(await listDirectoryNames(destinationRoot), [".cflow-sync"]);
});

test("legacy cleanup removes the marker directory when no foreign markers remain", async () => {
  const workspace = await makeTempWorkspace();
  const destinationRoot = path.join(workspace, "repo", ".codex", "agents");

  await writeLegacyCodexAgentFixture(destinationRoot);
  await pruneLegacyCodexAgents({ destinationRoot });

  assert.deepEqual(await listFileNames(destinationRoot), []);
  assert.deepEqual(await listDirectoryNames(destinationRoot), []);
});
