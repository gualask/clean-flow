import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import {
  DOCS_ROOT,
  REPO_ROOT,
  SHARED_REFERENCES_ROOT,
  SKILLS_ROOT,
  TERMINAL_AGENT_PROTOCOL,
  assertStableFields,
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
  const reviewAgentBrief = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-review", "references", "review-agent-brief.md"),
    "utf8",
  );
  const reviewFlowDoc = await fs.readFile(
    path.join(DOCS_ROOT, "review", "doc-review.flow.md"),
    "utf8",
  );
  const referenceAudit = await fs.readFile(
    path.join(SHARED_REFERENCES_ROOT, "reference-audit.md"),
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
    /^Report structural, convention, and authoritative requirement findings for a set of code changes\./,
  );
  assert.match(
    reviewMetadata.description,
    /Use when the current request asks to review\b/,
  );
  assert.match(reviewMetadata.description, /Do not use to fix findings\b/);
  assert.doesNotMatch(
    reviewMetadata.description,
    /\b(?:evidence|candidate|owning routes|sweep|lens|reference|handoff|audit surface|primary file)\b/i,
  );
  assert.match(reviewContract, /Read `references\/dynamic-agents\.md`/);
  assert.match(
    reviewContract,
    /Read `references\/sweep\.md` and `references\/navigation-cost\.md`/,
  );
  assert.match(
    reviewContract,
    /When the change is move-shaped, also read `references\/reference-audit\.md`/,
  );
  assert.match(
    reviewContract,
    /When the sweep produced at least one finding, read `references\/handoff\.md`/,
  );
  assert.match(
    reviewContract,
    /With no findings, do not read it: report `Findings: none`, `Handoff: none`, and `Result: clear`/,
  );
  assert.match(
    reviewContract,
    /Do not edit repository files or invoke another skill that edits them/,
  );
  assert.match(reviewContract, /references\/review-agent-brief\.md/);
  assert.match(reviewFlowDoc, /de-risks only its cited evidence and never advances `status: candidate`/);
  assert.doesNotMatch(reviewFlowDoc, /Does not confirm, de-risk, or fix a candidate/);
  assert.match(reviewContract, /For `subagent-1`, `subagent-2`, or `batched`/);
  assert.match(reviewContract, /Every assignment applies all lenses/);
  assert.match(reviewContract, /shared reference owns assignment and completion/);
  assert.doesNotMatch(reviewContract, /complete path-only manifest|compact reports|reconciles cross-batch references/);
  assert.match(reviewAgentBrief, /Logical scope manifest: \{SCOPE_MANIFEST\}/);
  assert.match(reviewAgentBrief, /cross-batch reconciliation/);
  assert.doesNotMatch(reviewContract, /Two agents receive non-overlapping groups/);
  assertStableFields(reviewAgentBrief, TERMINAL_AGENT_PROTOCOL, "review agent brief");
  assertStableFields(
    reviewAgentBrief,
    [
      "lens",
      "claim",
      "evidence",
      "severity",
      "impact",
      "confidence_basis",
      "introduced_by_change",
      "hard_trigger_exemption",
      "false_positive_check",
      "unknowns",
    ],
    "review agent brief",
  );
  assert.match(reviewContract, /Test-quality follow-up/);
  assert.match(reviewContract, /eligible — route cf-test/);
  assert.match(reviewContract, /eligible — route cf-test` with the primary test count/);
  assert.match(reviewContract, /not applicable — no primary tests/);
  assert.match(reviewContract, /Primary files/);
  assert.match(reviewContract, /Deleted entries/);
  assert.match(reviewContract, /Audit surfaces/);
  assert.match(reviewContract, /Authoritative intent sources/);

  for (const contract of [sweep, handoff]) {
    assert.doesNotMatch(contract, /cf-todo/);
    assert.doesNotMatch(contract, /local-refactor-rules\.md/);
  }
  assert.match(reviewContract, /name `cf-todo` as the separate next action/);
  assert.doesNotMatch(reviewContract, /hands work to directly|persist the findings/);
  assert.doesNotMatch(reviewContract, /local-refactor-rules\.md/);
  assert.doesNotMatch(sweep, /\bRead `?references\//);
  assert.doesNotMatch(sweep, /references\/reference-audit\.md/);
  assert.match(handoff, /Severity belongs to the rule that fired/);
  assert.match(handoff, /hold for confirmation/);
  assert.match(handoff, /proceed with follow-up/);
  assert.match(handoff, /Use exactly one result for a non-empty finding set/);
  assert.doesNotMatch(handoff, /- \*\*clear\*\*/);
  assert.match(
    sweep,
    /## Lens 11 — Business Requirement Alignment[\s\S]*Route: `cf-scenario`/,
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
    /business correctness not assessed: no authoritative requirement source identified/,
  );
  assert.doesNotMatch(handoff, /business correctness not assessed/);
  assert.match(
    referenceAudit,
    /When the active pass is read-only, report each surviving stale reference and do not modify it/,
  );
  assert.deepEqual(reviewFlow.required, [
    "references/dynamic-agents.md",
    "references/sweep.md",
    "references/navigation-cost.md",
  ]);
  assert.deepEqual(reviewFlow.conditional, [
    "references/reference-audit.md",
    "references/review-agent-brief.md",
    "references/handoff.md",
  ]);
  assert.equal(reviewFlow.handoffs, undefined);
});

test("cf-test owns assertion quality with deterministic provider-neutral delegation", async () => {
  const testContract = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-test", "SKILL.md"),
    "utf8",
  );
  const metadata = parseFrontmatter(testContract, "skills/cf-test/SKILL.md");
  const assertionQuality = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-test", "references", "assertion-quality.md"),
    "utf8",
  );
  const agentBrief = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-test", "references", "test-agent-brief.md"),
    "utf8",
  );
  const dynamicAgents = await fs.readFile(
    path.join(SHARED_REFERENCES_ROOT, "dynamic-agents.md"),
    "utf8",
  );
  const contextMap = JSON.parse(
    await fs.readFile(
      path.join(REPO_ROOT, "src", "commands", "skill-token-report.context.json"),
      "utf8",
    ),
  );
  const flow = contextMap.skills["cf-test"].flows.default;

  assert.match(metadata.description, /assertion-quality and test-contract findings/);
  assert.match(metadata.description, /cf-review/);
  assert.match(metadata.description, /cf-scenario/);
  assert.match(testContract, /primary test/);
  assert.match(testContract, /contract surfaces/);
  assert.match(testContract, /path proximity alone is insufficient/);
  assert.doesNotMatch(testContract, /adjacent repository docs/);
  assert.match(testContract, /Read `references\/dynamic-agents\.md`/);
  assert.match(testContract, /Read `references\/assertion-quality\.md`/);
  assert.match(testContract, /references\/test-agent-brief\.md/);
  assert.match(testContract, /For `subagent-1`, `subagent-2`, or `batched`/);
  assert.match(testContract, /Every assignment applies both lens groups/);
  assert.match(testContract, /shared reference owns assignment and completion/);
  assert.doesNotMatch(testContract, /complete path-only manifest|compact reports|reconcile cross-batch references/);
  assert.match(agentBrief, /Logical scope manifest: \{SCOPE_MANIFEST\}/);
  assert.match(agentBrief, /cross-batch reconciliation/);
  assert.match(agentBrief, /Do not edit files, run tests, create artifacts/);
  assert.match(agentBrief, /delegate again, confirm candidates, decide final routing/);
  assert.doesNotMatch(agentBrief, /run broad test suites/);
  assert.doesNotMatch(testContract, /assign one lens group to each/);
  for (const slot of ["Scope", "Context budget", "Lenses", "Findings", "Handoff", "Result"]) {
    assert.match(
      testContract,
      new RegExp(`^- \\*\\*${slot}\\*\\*:` , "m"),
      `cf-test output contract must retain ${slot}`,
    );
  }
  assert.match(testContract, /status `candidate`/);

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
    /No locatable source and no concrete passing regression means no finding/,
  );
  assert.match(assertionQuality, /language-agnostic/);
  assertStableFields(agentBrief, TERMINAL_AGENT_PROTOCOL, "test agent brief");
  assertStableFields(
    agentBrief,
    [
      "id",
      "primary_test",
      "claim",
      "evidence",
      "invariant_or_contract",
      "concrete_regression",
      "severity",
      "confidence_basis",
      "false_positive_check",
      "unknowns",
    ],
    "test agent brief",
  );
  assert.match(dynamicAgents, /policy.*authoritative/s);
  assert.match(dynamicAgents, /`batched`/);
  assert.match(dynamicAgents, /Batching changes source loading, never the logical scope/);
  assert.match(dynamicAgents, /controller retains only these reports in its context/);
  assert.match(dynamicAgents, /do not create a repository or temporary artifact/);
  assert.match(dynamicAgents, /missing report or unresolved cross-batch check cannot produce a clear result/);
  assert.match(dynamicAgents, /Loading every batch into the same local context is not a batched fallback/);
  assert.match(dynamicAgents, /runtime default/);
  assertStableFields(
    dynamicAgents,
    [
      "runtime_model_selection: controller-owned",
      "runtime_effort_selection: controller-owned",
      "reusable_brief_model_values: forbidden",
    ],
    "dynamic agent routing contract",
  );

  assert.deepEqual(flow.required, [
    "references/dynamic-agents.md",
    "references/assertion-quality.md",
  ]);
  assert.deepEqual(flow.conditional, ["references/test-agent-brief.md"]);
});
