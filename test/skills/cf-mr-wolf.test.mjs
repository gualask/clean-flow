import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { SKILLS_ROOT } from "../support/skill-contract-helpers.mjs";

test("cf-mr-wolf is a gate and carries only its two triggered references", async () => {
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
  // The second reference is no reasoning scaffold: it loads only on a request to fix a
  // defect and asks for a search and a deliverable, not for steps of thought. Before it,
  // a fix request on a defect with a shared cause got the local fix 4/4 (bare and head);
  // with it, the cause and three sibling sites, no file touched, 2/2; an isolated defect
  // was fixed with one line on the search.
  assert.deepEqual(
    references,
    ["pushback.md", "wider.md"],
    "cf-mr-wolf ships pushback.md and wider.md only; adding more re-opens the deleted scaffold",
  );
  // the loading contract: nothing discovers a bundled file on its own, so the
  // consuming SKILL.md must say what it holds and when to read it
  assert.match(skill, /\[references\/pushback\.md\]\(references\/pushback\.md\)/);
  assert.match(skill, /Read it before answering whenever/);
  assert.match(skill, /every time/i);
  assert.match(skill, /\[references\/wider\.md\]\(references\/wider\.md\), which checks whether the defect is one site of a wider problem, and follow it before changing any file/);
  // a fix request also names a decidable target: without this line it got two contradicting instructions
  assert.match(skill, /The only question below and its branches apply to every other request/);
});

test("cf-mr-wolf takes a request to fix a defect and checks it for a wider problem first", async () => {
  const skill = await fs.readFile(path.join(SKILLS_ROOT, "cf-mr-wolf", "SKILL.md"), "utf8");
  const wider = await fs.readFile(path.join(SKILLS_ROOT, "cf-mr-wolf", "references", "wider.md"), "utf8");
  const description = skill.match(/^description: "(.*)"$/m)[1];
  // routing: with the localized-defect exclusion in the description, fix requests opened no skill 5/5;
  // with the trigger, cf-mr-wolf 5/5 and no request owned by another skill or by none moved to it
  assert.match(description, /asks to fix a defect or a bug in the code/);
  assert.doesNotMatch(description, /a defect whose fix is one localized edit/);
  // a follow-up names the file and the fix; the generic "names both its target and the change" exclusion
  // kept it out (1 of 8 follow-ups opened the skill), naming the follow-up and listing what is no defect 5 of 8
  assert.match(description, /a follow-up that picks one found earlier/);
  // after a review that wrote a fix per finding and offered to apply it, "go ahead" read as consent to that plan:
  // 2 of 6 without the go-ahead case, 6 of 6 with it; "go ahead with point 3" (no defect) opened it 0 of 2 either way
  assert.match(description, /or a go-ahead on a fix proposed earlier, even when it names the file and the fix/);
  assert.doesNotMatch(description, /names both its target and the change/);
  // routing: without the clause Codex opened cf-mr-wolf on "Is it ready to merge?" 2/2, with it 0/2;
  // the rest of the old non-use list moved no prompt on either host
  assert.match(description, /Not for code review\.$/);
  // the search reaches outside the files the defect names: that is where the sibling sites were
  assert.match(wider, /Search the whole repository, not only the files the defect names/);
  // a shared cause stops the edit and hands the choice to the user; an isolated defect is fixed
  assert.match(wider, /\*\*A shared cause\*\*: change no file/);
  assert.match(wider, /then fix the defect as asked/);
  for (const slot of ["Cause", "Sites", "Fix", "Question"]) assert.match(wider, new RegExp(`- \\*\\*${slot}\\*\\*:`));
});
