import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import {
  SHARED_REFERENCES_ROOT,
  SKILLS_ROOT,
} from "./support/skill-contract-helpers.mjs";

test("editing flows defer out-of-scope hard-trigger remedies without softening them", async () => {
  const navigationCost = await fs.readFile(
    path.join(SHARED_REFERENCES_ROOT, "navigation-cost.md"),
    "utf8",
  );
  const placementContract = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-placement", "SKILL.md"),
    "utf8",
  );
  const cognitiveContract = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-cognitive", "SKILL.md"),
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
    "impact when not obvious",
    "confidence with its basis",
    "owning route",
    "status `Deferred`",
  ]) {
    assert.match(navigationCost, new RegExp(field));
  }
  assert.doesNotMatch(navigationCost, /severity/i);
  assert.match(navigationCost, /Widening the pass solely to remedy it/);
  assert.match(cognitiveContract, /- \*\*Deferred\*\*: after execution only, per the report\/action rule\./);
  // Function length left the hard triggers on 2026-10-24; without this slot line a
  // split and a regrouping both deferred `none` (1 run each, 2026-10-25). It matches
  // cf-review's lens 8.
  assert.match(
    placementContract,
    /- \*\*Deferred\*\*: each function past 20 logical lines in a file you modified, routed to `cf-cognitive`; each owner cluster kept flat because a folder would be a new package or module, routed to `cf-architecture`; or `none`\./,
  );
  // cf-cognitive carries its execution flow in SKILL.md, so the same rule is
  // asserted on the contract itself rather than on a per-flow reference file.
  assert.match(
    cognitiveContract,
    /references\/navigation-cost\.md for the thresholds.*the report\/action rule/,
  );
});

test("placement carries its gates in the body and ships no references", async () => {
  const placementContract = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-placement", "SKILL.md"),
    "utf8",
  );

  // cf-placement merged cf-split and cf-cohesion on 2026-10-25, built around the
  // gates the bare model missed; every line below held in its trial cells.
  assert.match(placementContract, /When the request only asks whether to split or regroup, answer and do not edit\./);
  assert.match(
    placementContract,
    /With no file or area named, count the direct source files per directory with the bundled `scripts\/dir-population\.mjs`, resolved from the active skill root, name the best candidate, and do not edit\./,
  );
  assert.match(
    placementContract,
    /a new package or module, move files across features, or change module boundaries, do not edit: name `cf-architecture` and the reason in \*\*Result\*\*, and end the turn\./,
  );
  assert.match(placementContract, /kept flat where a folder would be a new package or module/);
  assert.match(placementContract, /A regrouping moves whole files without rewriting them\./);
  assert.match(placementContract, /Move the tests of each moved unit next to its new file, update every reference/);
  // "smallest relevant check" left an unused export that the repository's knip
  // rejected (2 of 2); the scoped hint ran knip and nothing unrelated.
  assert.match(
    placementContract,
    /run those tests and the checks a move can break \(types, lint, unused exports\), scoped to what changed\./,
  );
  assert.match(
    placementContract,
    /- \*\*Defects\*\*: behavior defects noticed against the code's documented rules, with file and line, or `none` naming what you checked against\./,
  );
  assert.doesNotMatch(placementContract, /references\//);
  await assert.rejects(fs.readdir(path.join(SKILLS_ROOT, "cf-placement", "references")));
  for (const removed of ["cf-split", "cf-cohesion"]) {
    await assert.rejects(fs.readdir(path.join(SKILLS_ROOT, removed)));
  }
});

test("reference audit is local to review, read-only, and repository-wide", async () => {
  const referenceAudit = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-review", "references", "reference-audit.md"),
    "utf8",
  );

  // cf-execute, its only other consumer, was removed on 2026-10-26: the audit lives in review alone.
  await assert.rejects(fs.readFile(path.join(SHARED_REFERENCES_ROOT, "reference-audit.md"), "utf8"));
  assert.match(referenceAudit, /repository-wide/);
  assert.match(referenceAudit, /configuration/);
  assert.match(referenceAudit, /documentation/);
  assert.match(referenceAudit, /consumers outside the change set as compatibility evidence/);
  assert.doesNotMatch(referenceAudit, /authorizes edits|candidate unit/);
});

test("cognitive owns first-level reference loading in its skill contract", async () => {
  const cognitiveContract = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-cognitive", "SKILL.md"),
    "utf8",
  );
  assert.match(
    cognitiveContract,
    /Read references\/navigation-cost\.md for the thresholds/,
  );
  // local-refactor-rules.md left cf-cognitive on 2026-10-24: its rules are the
  // four tests in the body, and without it the lifecycle cell kept its shape.
  assert.doesNotMatch(cognitiveContract, /local-refactor-rules\.md/);
  // The three per-flow reference files were merged into SKILL.md on 2026-08-16,
  // so the contract itself must carry all three flows and ship no flow file.
  for (const flow of [
    /- \*\*Discovery\*\* \(/,
    /- \*\*Evaluation\*\* \(/,
    /- \*\*Execution\*\* \(/,
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
    /- \*\*Defects\*\*: behavior defects noticed against the code's documented rules, with file and line, or `none` naming what you checked against\./,
  );
  const shipped = await fs.readdir(
    path.join(SKILLS_ROOT, "cf-cognitive", "references"),
  );
  assert.deepEqual(
    shipped.filter((f) => f.endsWith(".md")).sort(),
    ["navigation-cost.md"],
  );
  assert.doesNotMatch(cognitiveContract, /## Shared Triggers/);
});
