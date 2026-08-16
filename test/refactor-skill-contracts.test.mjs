import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import {
  DOCS_ROOT,
  SHARED_REFERENCES_ROOT,
  SKILLS_ROOT,
} from "./support/skill-contract-helpers.mjs";

test("editing flows defer out-of-scope hard-trigger remedies without softening them", async () => {
  const navigationCost = await fs.readFile(
    path.join(SHARED_REFERENCES_ROOT, "navigation-cost.md"),
    "utf8",
  );
  const cohesionContract = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-cohesion", "SKILL.md"),
    "utf8",
  );
  const cohesionExecution = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-cohesion", "references", "execution.md"),
    "utf8",
  );
  const splitContract = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-split", "SKILL.md"),
    "utf8",
  );
  const splitExecution = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-split", "references", "execution.md"),
    "utf8",
  );
  const splitFlow = await fs.readFile(
    path.join(DOCS_ROOT, "split", "doc-split.flow.md"),
    "utf8",
  );
  const cognitiveContract = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-cognitive", "SKILL.md"),
    "utf8",
  );
  const cognitiveFlow = await fs.readFile(
    path.join(DOCS_ROOT, "cognitive", "doc-cognitive.flow.md"),
    "utf8",
  );

  assert.match(navigationCost, /Report And Action Are Separate/);
  assert.match(navigationCost, /outside the authorized scope/);
  assert.match(navigationCost, /file modified by the pass or explicitly selected as a cleanup target/);
  assert.doesNotMatch(navigationCost, /file the pass evaluated or touched/);
  for (const field of [
    "exact unit",
    "claim",
    "evidence",
    "trigger-defined severity",
    "impact when not obvious",
    "confidence with its basis",
    "owning route",
    "status `Deferred`",
  ]) {
    assert.match(navigationCost, new RegExp(field));
  }
  assert.match(navigationCost, /Widening the pass solely to remedy it/);
  for (const contract of [cohesionContract, splitContract, cognitiveContract]) {
    assert.match(contract, /\*\*Deferred\*\*: only after execution edits/);
    assert.match(contract, /Omit this section when no .* ran/);
  }
  for (const execution of [cohesionExecution, splitExecution]) {
    assert.match(execution, /report\/action separation in references\/navigation-cost\.md/);
    assert.match(execution, /For \*\*Deferred\*\*, after edits/);
  }
  // cf-cognitive carries its execution flow in SKILL.md, so the same rule is
  // asserted on the contract itself rather than on a per-flow reference file.
  assert.match(
    cognitiveContract,
    /report\/action separation in references\/navigation-cost\.md/,
  );
  for (const flow of [splitFlow, cognitiveFlow]) {
    assert.match(flow, /complete deferred finding required by the canonical navigation-cost contract/);
  }
});

test("cohesion audits ownership and stale references across repository-controlled text", async () => {
  const referenceAudit = await fs.readFile(
    path.join(SHARED_REFERENCES_ROOT, "reference-audit.md"),
    "utf8",
  );
  const cohesionExecution = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-cohesion", "references", "execution.md"),
    "utf8",
  );
  const targetedEvaluation = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-cohesion", "references", "targeted-evaluation.md"),
    "utf8",
  );
  const cohesionFlow = await fs.readFile(
    path.join(DOCS_ROOT, "cohesion", "doc-cohesion.flow.md"),
    "utf8",
  );

  assert.match(referenceAudit, /repository-wide/);
  assert.match(referenceAudit, /configuration/);
  assert.match(referenceAudit, /documentation/);
  assert.match(referenceAudit, /consumers outside the candidate unit as compatibility evidence/);
  assert.doesNotMatch(referenceAudit, /ownership evidence/);
  assert.match(targetedEvaluation, /run the reference audit for each candidate/i);
  assert.match(targetedEvaluation, /consumers outside the proposed cluster as ownership evidence/i);
  assert.match(targetedEvaluation, /broader than the proposed owner/);
  assert.match(cohesionExecution, /decision admitted by the execution gate.*confirmed owner cluster/);
  assert.doesNotMatch(cohesionExecution, /owned symbol/);
  assert.match(cohesionFlow, /code, configuration, and documentation/);
  assert.doesNotMatch(cohesionFlow, /unless a move is explicitly requested/);
});

test("cohesion owns first-level reference loading in its skill contract", async () => {
  const cohesionContract = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-cohesion", "SKILL.md"),
    "utf8",
  );
  const targetedEvaluation = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-cohesion", "references", "targeted-evaluation.md"),
    "utf8",
  );
  const execution = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-cohesion", "references", "execution.md"),
    "utf8",
  );

  assert.match(
    cohesionContract,
    /Read references\/targeted-evaluation\.md, references\/reference-audit\.md, and references\/navigation-cost\.md/,
  );
  assert.match(
    cohesionContract,
    /Read references\/targeted-evaluation\.md, references\/execution\.md, references\/reference-audit\.md, and references\/navigation-cost\.md/,
  );
  assert.match(
    cohesionContract,
    /Complete or refresh the targeted evaluation before editing/,
  );
  for (const reference of [targetedEvaluation, execution]) {
    assert.doesNotMatch(reference, /Ensure you have read references\//);
  }
});

test("split owns first-level reference loading and audits consumers before editing", async () => {
  const splitContract = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-split", "SKILL.md"),
    "utf8",
  );
  const fileSplitRules = await fs.readFile(
    path.join(SHARED_REFERENCES_ROOT, "file-split-rules.md"),
    "utf8",
  );
  const evaluation = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-split", "references", "evaluation.md"),
    "utf8",
  );
  const execution = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-split", "references", "execution.md"),
    "utf8",
  );
  const splitFlow = await fs.readFile(
    path.join(DOCS_ROOT, "split", "doc-split.flow.md"),
    "utf8",
  );
  const startSplitExecution = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-start", "references", "split-execution.md"),
    "utf8",
  );
  const startReview = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-start", "references", "review.md"),
    "utf8",
  );

  assert.match(
    splitContract,
    /Read references\/evaluation\.md, references\/file-split-rules\.md, and references\/navigation-cost\.md/,
  );
  assert.match(
    splitContract,
    /Read references\/execution\.md, references\/file-split-rules\.md, references\/navigation-cost\.md, and references\/reference-audit\.md/,
  );
  assert.match(
    splitContract,
    /If a verification check fails, read references\/regression-handling\.md/,
  );
  for (const reference of [evaluation, execution]) {
    assert.doesNotMatch(reference, /ensure you have read references\//i);
  }
  assert.match(fileSplitRules, /hard-trigger values and exemptions come from `references\/navigation-cost\.md`/);
  assert.doesNotMatch(fileSplitRules, /read `references\/navigation-cost\.md`/i);
  for (const phaseReference of [startSplitExecution, startReview]) {
    assert.match(
      phaseReference,
      /read references\/file-split-rules\.md and references\/navigation-cost\.md/,
    );
  }
  assert.match(
    execution,
    /Complete the reference audit for the candidate unit before choosing the seam or placement/,
  );
  assert.match(execution, /consumers outside the unit as compatibility evidence/);
  assert.match(execution, /repeat the reference audit for moved names and paths/);
  assert.match(splitFlow, /Before execution edits, audit repository-controlled consumers/);
  assert.match(splitFlow, /fixing stale code, configuration, and documentation references/);
});

test("cognitive owns first-level reference loading in its skill contract", async () => {
  const cognitiveContract = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-cognitive", "SKILL.md"),
    "utf8",
  );
  const localRefactorRules = await fs.readFile(
    path.join(SHARED_REFERENCES_ROOT, "local-refactor-rules.md"),
    "utf8",
  );
  assert.match(
    cognitiveContract,
    /Before applying any flow, read references\/navigation-cost\.md/,
  );
  assert.match(
    cognitiveContract,
    /Read references\/local-refactor-rules\.md/,
  );
  // The three per-flow reference files were merged into SKILL.md on 2026-08-16,
  // so the contract itself must carry all three flows and ship no flow file.
  for (const flow of [
    /\*\*Discovery\*\* —/,
    /\*\*Targeted evaluation\*\* —/,
    /\*\*Execution\*\* —/,
  ]) {
    assert.match(cognitiveContract, flow);
  }
  // The Defects slot, added 2026-08-16. It is a SLOT and not a sentence on
  // purpose: a field that must be filled is not passed over in silence. Its first
  // version reported 2 of 3 against a floor of 0 of 8 on a case with a planted
  // defect and stayed quiet 3 of 3 with the defect removed, but once filled
  // itself with a bare `none` over a live defect. The basis clause makes `none` a
  // claim rather than a silence: 3 of 3 named the README on the clean case, and
  // nobody wrote `none` at all on the defective one.
  assert.match(
    cognitiveContract,
    /- \*\*Defects\*\*: behavior defects noticed while reading the target, with file and line\. `none` is a claim/,
  );
  assert.match(cognitiveContract, /name what you checked it against\./);
  const shipped = await fs.readdir(
    path.join(SKILLS_ROOT, "cf-cognitive", "references"),
  );
  assert.deepEqual(
    shipped.filter((f) => f.endsWith(".md")).sort(),
    ["local-refactor-rules.md", "navigation-cost.md"],
  );
  assert.match(
    localRefactorRules,
    /hard-trigger values, exemptions, and remedy rules come from `references\/navigation-cost\.md`/,
  );
  assert.match(
    localRefactorRules,
    /nested try\/catch blocks that make control flow hard to follow/,
  );
  assert.doesNotMatch(cognitiveContract, /## Shared Triggers/);
  assert.doesNotMatch(localRefactorRules, /read `references\/navigation-cost\.md`/i);
});
