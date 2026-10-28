import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import {
  REPO_ROOT,
  SHARED_REFERENCES_ROOT,
  SKILLS_ROOT,
  parseFrontmatter,
} from "./support/skill-contract-helpers.mjs";

test("review owns reference loading and remains read-only", async () => {
  const reviewContract = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-review", "SKILL.md"),
    "utf8",
  );
  const reviewMetadata = parseFrontmatter(
    reviewContract,
    "skills/cf-review/SKILL.md",
  );
  const sweep = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-review", "references", "sweep.md"),
    "utf8",
  );
  const handoff = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-review", "references", "handoff.md"),
    "utf8",
  );
  const referenceAudit = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-review", "references", "reference-audit.md"),
    "utf8",
  );
  const contextMap = JSON.parse(
    await fs.readFile(
      path.join(REPO_ROOT, "src", "commands", "skill-token-report.context.json"),
      "utf8",
    ),
  );
  const reviewFlow = contextMap.skills["cf-review"].flows.default;

  assert.match(
    reviewMetadata.description,
    /^Report bugs, requirement contradictions, incomplete changes, documentation drift, and structural findings for a set of code changes\./,
  );
  assert.match(
    reviewMetadata.description,
    /Use only when the current request explicitly asks for a review\b/,
  );
  assert.match(reviewMetadata.description, /Do not use to fix findings\b/);
  assert.doesNotMatch(
    reviewMetadata.description,
    /\b(?:evidence|candidate|owning routes|sweep|lens|reference|handoff|audit surface|primary file)\b/i,
  );
  assert.match(reviewContract, /Read `references\/context-gate\.md`/);
  assert.match(
    reviewContract,
    /Read `references\/sweep\.md`; for Structure or All, also read `references\/navigation-cost\.md`/,
  );
  assert.match(
    reviewContract,
    /When the change is move-shaped and the focus is Leftovers and docs or All, also read `references\/reference-audit\.md`/,
  );
  assert.match(
    reviewContract,
    /When the sweep produced at least one finding, read `references\/handoff\.md`/,
  );
  assert.match(
    reviewContract,
    /With no findings, do not read it: report `Findings: none`, `Handoff: none`, and `Result: clear for the completed sweep`/,
  );
  assert.match(
    reviewContract,
    /Do not edit repository files other than the batched pass's recap\./,
  );
  assert.match(reviewContract, /Owns `\.cflow\/cf-review-recap\.md`/);
  assert.match(reviewContract, /\*\*Bugs and requirements\*\*, lenses 1–3/);
  assert.match(reviewContract, /\*\*Leftovers and docs\*\*, lenses 4–6/);
  assert.match(reviewContract, /\*\*Structure\*\*, lenses 7–12/);
  assert.match(reviewContract, /Otherwise take Bugs and requirements\./);
  assert.doesNotMatch(reviewContract, /What should this review focus on\?/);
  assert.match(reviewContract, /reporting, silent, not applicable, or not selected/);
  assert.match(reviewContract, /Name each focus not run as `not assessed`/);
  assert.doesNotMatch(reviewContract, /reaches most of the repository/);
  assert.match(sweep, /### Lens 1 — Bugs\n\nRoute: `cf-mr-wolf`/);
  assert.match(sweep, /### Lens 2 — Behavior Drift\n\nRoute: `cf-mr-wolf`/);
  assert.match(sweep, /A stale reference in documentation or examples belongs to lens 6/);
  assert.match(sweep, /run bundled `scripts\/dir-population\.mjs`, resolved from the active skill root/);
  assert.match(reviewContract, /Create or update no other repository file/);
  assert.match(reviewContract, /For `batched`, every batch applies every lens of the focus/);
  assert.match(reviewContract, /shared reference owns batching and completion/);
  assert.doesNotMatch(reviewContract, /complete path-only manifest|compact report|reconciles cross-batch references/);
  assert.match(reviewContract, /Test assertion quality/);
  assert.match(reviewContract, /not assessed in this pass/);
  assert.match(reviewContract, /same pending work or named history range/);
  assert.match(reviewContract, /Do not classify tests, report a test count/);
  assert.match(reviewContract, /never unqualified `clear` or `commit-ready`/);
  assert.doesNotMatch(reviewContract, /eligible — route cf-test|primary test count|no primary tests/);
  assert.match(
    reviewContract,
    /Test files selected by the change set remain primary files\./,
  );
  assert.match(reviewContract, /Primary files/);
  assert.match(reviewContract, /Deleted entries/);
  assert.match(reviewContract, /Audit surfaces/);
  assert.match(reviewContract, /Authoritative sources/);

  for (const contract of [sweep, handoff]) {
    assert.doesNotMatch(contract, /cf-todo/);
    assert.doesNotMatch(contract, /local-refactor-rules\.md/);
  }
  assert.match(reviewContract, /Persisting findings elsewhere belongs to `cf-todo`/);
  assert.doesNotMatch(reviewContract, /hands work to directly|persist the findings/);
  assert.doesNotMatch(reviewContract, /local-refactor-rules\.md/);
  assert.doesNotMatch(sweep, /\bRead `?references\//);
  assert.doesNotMatch(sweep, /references\/reference-audit\.md/);
  assert.doesNotMatch(handoff, /severity/i);
  assert.match(handoff, /introduced a finding from lens 1, 2, 3, 4, or 10, a lens 8 hard trigger/);
  assert.match(sweep, /Report each changed function past 20 logical lines as a function finding routed to `cf-cognitive`/);
  assert.match(sweep, /it does not hold the result/);
  assert.match(handoff, /hold for confirmation/);
  assert.match(handoff, /proceed with follow-up/);
  assert.match(handoff, /Use exactly one result for a non-empty finding set/);
  assert.doesNotMatch(handoff, /- \*\*clear\*\*/);
  assert.match(
    sweep,
    /### Lens 3 — Requirement Alignment\n\nRoute: `cf-scenario`/,
  );
  assert.match(
    sweep,
    /Conflicting, ambiguous, or absent sources produce no finding/,
  );
  assert.match(
    sweep,
    /Do not derive intent from implementation/,
  );
  assert.match(
    sweep,
    /Resolve sources from requirements in the current request or commit messages/,
  );
  assert.match(
    sweep,
    /List checked sources in \*\*Scope\*\*/,
  );
  assert.doesNotMatch(sweep, /## (?:Contents|What Counts As A Finding|Bounded Remedies)/);
  assert.match(
    sweep,
    /Exclude data clumps, primitive obsession, feature envy, temporal coupling, leaky abstractions/,
  );
  assert.match(
    reviewContract,
    /requirement alignment not assessed: no authoritative source identified/,
  );
  assert.doesNotMatch(handoff, /business correctness not assessed/);
  assert.match(
    referenceAudit,
    /Report each surviving stale reference and do not modify it/,
  );
  assert.deepEqual(reviewFlow.required, [
    "references/context-gate.md",
    "references/sweep.md",
  ]);
  assert.deepEqual(reviewFlow.conditional, [
    "references/navigation-cost.md",
    "references/batched-execution.md",
    "references/reference-audit.md",
    "references/handoff.md",
  ]);
  assert.equal(reviewFlow.handoffs, undefined);
});

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
  assert.match(metadata.description, /cf-review/);
  assert.match(metadata.description, /ambiguous expected behavior to cf-mr-wolf/);
  assert.match(testContract, /primary test/);
  assert.match(testContract, /contract surfaces/);
  assert.match(testContract, /path proximity alone is insufficient/);
  assert.doesNotMatch(testContract, /adjacent repository docs/);
  assert.match(testContract, /Read `references\/context-gate\.md`/);
  assert.match(testContract, /Read `references\/assertion-quality\.md`/);
  assert.match(testContract, /For `batched`, every batch applies both lens groups/);
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
