import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { SKILLS_ROOT } from "../support/skill-contract-helpers.mjs";

test("cf-mr-wolf is a gate and carries no runtime references", async () => {
  const skill = await fs.readFile(path.join(SKILLS_ROOT, "cf-mr-wolf", "SKILL.md"), "utf8");
  const entries = await fs.readdir(path.join(SKILLS_ROOT, "cf-mr-wolf"), {
    withFileTypes: true,
  });

  // "You are a gate, not a pipeline" was removed on 2026-08-09. It existed to stop
  // the skill re-growing into the deleted nine-reference workflow, and the measurement
  // behind it was that the scaffold suppressed repository inspection. A plan contract
  // reproduced no such suppression — 48 to 75 files against a bare control's 43 — and
  // the sentence contradicted a description that now covers "what would this change
  // consist of". The scaffold guard that survives is the reference count below; whether
  // the sentence was doing anything else is untested, not refuted.
  assert.match(skill, /decidable target/);
  // routing is decided by what the request names: once turn 1 was allowed to read
  // code, the handoff branch investigated instead of routing
  assert.match(skill, /from the request text alone/i);
  // the gate reports what it found and stops, never offering a menu it has to invent
  assert.match(skill, /say two things and stop/i);
  assert.match(skill, /do not offer alternatives/i);
  assert.match(skill, /No recommendation, no plan, no implementation until they answer/);
  assert.doesNotMatch(skill, /recommended default/i);
  assert.doesNotMatch(skill, /Framing Workflow|Flow Selection/);

  // The reasoning scaffold stays deleted: across seven cases it never produced a
  // better decision than its absence, and it suppressed repository inspection.
  // One reference survives that ban, and only one. `SKILL.md` is read once and
  // never re-read, so a reference with a trigger is the only channel that reaches
  // the model in a later turn — which is where the confidently-wrong user does
  // its damage. Measured on the holdout before shipping.
  const references = entries.some(
    (entry) => entry.isDirectory() && entry.name === "references",
  )
    ? (await fs.readdir(path.join(SKILLS_ROOT, "cf-mr-wolf", "references"))).sort()
    : [];
  assert.deepEqual(
    references,
    ["pushback.md"],
    "cf-mr-wolf ships exactly one reference; adding more re-opens the deleted scaffold",
  );
  // the loading contract: nothing discovers a bundled file on its own, so the
  // consuming SKILL.md must say what it holds and when to read it
  assert.match(skill, /\[references\/pushback\.md\]\(references\/pushback\.md\)/);
  assert.match(skill, /Read it before answering whenever/);
  assert.match(skill, /every time/i);
});
