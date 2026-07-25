import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";

import { main } from "../src/index.mjs";
import {
  listFileNames,
  makeTempWorkspace,
  writeLegacyCodexAgentFixture,
} from "./support/helpers.mjs";

test("top-level help exits successfully", async () => {
  const io = makeIo();

  const exitCode = await main(["--help"], io);

  assert.equal(exitCode, 0);
  assert.match(io.stdout.output, /Usage:/);
  assert.equal(io.stderr.output, "");
});

test("short top-level help exits successfully", async () => {
  const io = makeIo();

  const exitCode = await main(["-h"], io);

  assert.equal(exitCode, 0);
  assert.match(io.stdout.output, /Usage:/);
  assert.equal(io.stderr.output, "");
});

test("install and remove prune marked legacy agents while dry-run preserves them", async () => {
  const workspace = await makeTempWorkspace();
  const targetRoot = path.join(workspace, "repo");
  const agentsRoot = path.join(targetRoot, ".codex", "agents");

  await writeLegacyCodexAgentFixture(agentsRoot);

  const dryRunIo = makeIo();
  const dryRunCode = await main(["install", targetRoot, "--dry-run"], dryRunIo);

  assert.equal(dryRunCode, 0);
  assert.deepEqual(await listFileNames(agentsRoot), [
    "cflow_finding_derisk_recon.toml",
  ]);
  assert.match(
    dryRunIo.stdout.output,
    /legacy-codex-agent: cflow_finding_derisk_recon\.toml/,
  );

  const installIo = makeIo();
  const installCode = await main(["install", targetRoot], installIo);

  assert.equal(installCode, 0);
  assert.deepEqual(await listFileNames(agentsRoot), []);
  assert.match(
    installIo.stdout.output,
    /legacy-codex-agent: cflow_finding_derisk_recon\.toml/,
  );

  await writeLegacyCodexAgentFixture(agentsRoot, "cflow_trace_recon.toml");

  const removeIo = makeIo();
  const removeCode = await main(["remove", targetRoot], removeIo);

  assert.equal(removeCode, 0);
  assert.deepEqual(await listFileNames(agentsRoot), []);
  assert.match(
    removeIo.stdout.output,
    /legacy-codex-agent: cflow_trace_recon\.toml/,
  );
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
