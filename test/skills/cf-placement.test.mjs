import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { SKILLS_ROOT } from "../support/skill-contract-helpers.mjs";

test("placement carries its gates in the body and ships no references", async () => {
  const placementContract = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-placement", "SKILL.md"),
    "utf8",
  );

  // cf-placement merged cf-split and cf-cohesion on 2026-10-25, built around the
  // gates the bare model missed; every line below held in its trial cells.
  assert.match(
    placementContract,
    /With no file or area named, count the direct source files per directory with the bundled `scripts\/dir-population\.mjs`, resolved from the active skill root, and name the best candidate\./,
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
