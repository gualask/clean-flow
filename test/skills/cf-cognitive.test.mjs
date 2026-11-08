import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { SKILLS_ROOT } from "../support/skill-contract-helpers.mjs";

test("cognitive owns first-level reference loading in its skill contract", async () => {
  const cognitiveContract = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-cognitive", "SKILL.md"),
    "utf8",
  );
  assert.match(
    cognitiveContract,
    /Read references\/navigation-cost\.md for the thresholds/,
  );
  // cf-cognitive ships no local-refactor-rules.md: its rules are the
  // four tests in the body, and without it the lifecycle cell kept its shape.
  assert.doesNotMatch(cognitiveContract, /local-refactor-rules\.md/);
  // The three flows live in SKILL.md, not in per-flow reference files,
  // so the contract itself must carry all three flows and ship no flow file.
  for (const flow of [
    /- \*\*Discovery\*\* \(/,
    /- \*\*Evaluation\*\* \(/,
    /- \*\*Execution\*\* \(/,
  ]) {
    assert.match(cognitiveContract, flow);
  }
  // The Defects slot. It is a SLOT and not a sentence on
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

test("cognitive routes to placement up front, not by post-edit condition", async () => {
  const cognitiveContract = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-cognitive", "SKILL.md"),
    "utf8",
  );

  // Routing is stated once, on what the request is, and named again in the
  // result. It carries no post-edit conditional route: a vague condition inside a pointer fired 4 of 9 times on
  // identical input, and no bed ever exercised either clause.
  assert.match(
    cognitiveContract,
    /Route elsewhere instead of working here, and when routing do not edit files: `cf-placement`.*`cf-architecture`/s,
  );
  assert.match(
    cognitiveContract,
    /next step when a route applies/,
  );
  for (const contract of [cognitiveContract]) {
    assert.doesNotMatch(contract, /After editing a target file, route to/);
    assert.doesNotMatch(
      contract,
      /route through `cf-(?:split|placement)` evaluation only when remaining file-level pressure is demonstrated/,
    );
  }
});
