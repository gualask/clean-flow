import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import {
  REPO_ROOT,
  SHARED_REFERENCES_ROOT,
  SKILLS_ROOT,
  parseFrontmatter,
} from "../support/skill-contract-helpers.mjs";

test("cf-test owns assertion quality with a deterministic context gate", async () => {
  const testContract = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-test", "SKILL.md"),
    "utf8",
  );
  const metadata = parseFrontmatter(testContract, "skills/cf-test/SKILL.md");
  const assertionQuality = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-test", "references", "assertion-quality.md"),
    "utf8",
  );
  const contextGate = await fs.readFile(
    path.join(SHARED_REFERENCES_ROOT, "context-gate.md"),
    "utf8",
  );
  // The gate is read at step 2 of every pass, the batched contract only when
  // the policy is `batched`. Assertions follow
  // the text they belong to, so the gate keeps its own coverage.
  const batchedExecution = await fs.readFile(
    path.join(SHARED_REFERENCES_ROOT, "batched-execution.md"),
    "utf8",
  );
  const contextMap = JSON.parse(
    await fs.readFile(
      path.join(REPO_ROOT, "src", "commands", "skill-token-report.context.json"),
      "utf8",
    ),
  );
  const flow = contextMap.skills["cf-test"].flows.default;

  assert.match(metadata.description, /assertion-quality findings/);
  // routing: without this route Codex sent a doubt about a test's expected behavior to cf-test 2/2, with it 0/2.
  assert.match(metadata.description, /ambiguous expected behavior to cf-mr-wolf/);
  assert.match(testContract, /primary test/);
  assert.match(testContract, /contract surfaces/);
  assert.match(testContract, /path proximity alone is insufficient/);
  assert.doesNotMatch(testContract, /adjacent repository docs/);
  assert.match(testContract, /Read `references\/context-gate\.md`/);
  assert.match(testContract, /Read `references\/assertion-quality\.md`/);
  assert.match(testContract, /For `batched`, every batch applies every lens group/);
  assert.match(testContract, /shared reference owns batching and completion/);
  assert.doesNotMatch(testContract, /complete path-only manifest|compact report|reconcile cross-batch references/);
  // The recap is the pass's one repository write, declared in the pack's own
  // ownership idiom, and every other write stays banned.
  assert.match(testContract, /Owns `\.cflow\/cf-test-recap\.md`/);
  assert.match(testContract, /Create or update no other repository file/);
  assert.match(
    testContract,
    /Do not edit repository files other than the batched pass's recap/,
  );
  assert.doesNotMatch(testContract, /assign one lens group to each/);
  for (const slot of ["Scope", "Context budget", "Lenses", "Findings", "Handoff", "Result"]) {
    assert.match(
      testContract,
      new RegExp(`^- \\*\\*${slot}\\*\\*:` , "m"),
      `cf-test output contract must retain ${slot}`,
    );
  }
  assert.match(testContract, /status `candidate`/);
  assert.match(testContract, /confidence with its basis/);

  for (const lens of [
    "Missing Observable Invariant",
    "Absence Without An Invariant",
    "Invalid Domain States Remain Representable",
    "Redundant Assertion",
    "Over-Specified Test",
    "Brittle String Assertion",
    "Implementation-Detail Coupling",
    "Duplicated Setup",
    "Nondeterministic Test",
    "Cross-Layer Repetition",
  ]) {
    assert.match(assertionQuality, new RegExp(lens));
  }
  assert.match(
    assertionQuality,
    /No locatable source and no concrete regression or behavior-preserving change means no candidate/,
  );
  assert.match(assertionQuality, /language-agnostic/);
  assert.match(contextGate, /policy.*authoritative/s);
  assert.match(contextGate, /`batched`/);
  // The gate names no other reference: the consuming skill is the only router.
  assert.doesNotMatch(contextGate, /batched-execution\.md/);
  assert.doesNotMatch(contextGate, /## Recap File/);
  assert.match(batchedExecution, /Read this when the context gate returns `batched`/);
  assert.doesNotMatch(batchedExecution, /context-gate\.md/);
  assert.match(batchedExecution, /Batching changes source loading, never the logical scope/);
  assert.match(batchedExecution, /create no other repository or temporary artifact/);
  assert.match(batchedExecution, /missing batch report or unresolved cross-batch check cannot produce a clear result/);
  // The recap is a deliverable, owned by each skill that batches, and never
  // overwritten without asking.
  assert.match(batchedExecution, /## Recap File/);
  assert.match(batchedExecution, /The consuming skill owns its own recap at the path its Artifacts contract names/);
  // One recap per skill, at `.cflow/<skill>-recap.md`, named by each skill's own
  // Artifacts contract: the shared text names no path, so two batching skills
  // never collide on one file.
  assert.doesNotMatch(batchedExecution, /`\.cflow\/recap\.md`/);
  assert.match(batchedExecution, /Each batching skill has its own recap and writes no other skill's/);
  assert.match(batchedExecution, /never overwrite it silently/);
  assert.doesNotMatch(batchedExecution, /narrower-scope fallback for/);
  for (const contract of [contextGate, batchedExecution]) {
    assert.doesNotMatch(contract, /\bagents?\b|delegat/i);
  }

  assert.deepEqual(flow.required, [
    "references/context-gate.md",
    "references/assertion-quality.md",
  ]);
  assert.deepEqual(flow.conditional, ["references/batched-execution.md"]);
});
