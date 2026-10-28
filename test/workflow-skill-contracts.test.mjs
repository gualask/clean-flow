import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import {
  SHARED_REFERENCES_ROOT,
  SKILLS_ROOT,
  publicSkillNames,
  skillAssetFiles,
  skillTextFiles,
} from "./support/skill-contract-helpers.mjs";

test("cognitive routes to placement up front, not by post-edit condition", async () => {
  const cognitiveContract = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-cognitive", "SKILL.md"),
    "utf8",
  );

  // Routing is stated once, on what the request is, and named again in the
  // result. The two post-edit conditional routes were dropped with the merge of
  // 2026-08-16: a vague condition inside a pointer fired 4 of 9 times on
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

test("todo rolls completed tasks over only when adding new work", async () => {
  const todoContract = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-todo", "SKILL.md"),
    "utf8",
  );
  for (const text of [todoContract]) {
    assert.match(text, /at least one existing task is unchecked/);
    assert.match(text, /every existing task is checked/);
    assert.match(text, /add(?:s|ing)? new tasks?/);
    assert.match(text, /no new task/);
    assert.doesNotMatch(text, /preparing a .*commit|ask whether to empty|commit cleanup|reset/);
  }
  assert.match(todoContract, /even when the request uses another language/);
  assert.match(todoContract, /do not write that task until it is given/);
  assert.match(todoContract, /only when the session stated them, impact and possible direction/);
  assert.match(todoContract, /extend it in its own shape/);
  assert.doesNotMatch(todoContract, /tracking file/);
});

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

test("brainstorm hands feature ownership to architecture through the shared lifecycle", async () => {
  const read = (...parts) => fs.readFile(path.join(...parts), "utf8");
  const brainstorm = await read(SKILLS_ROOT, "cf-brainstorm", "SKILL.md");
  const architecture = await read(SKILLS_ROOT, "cf-architecture", "SKILL.md");
  const lifecycle = await read(SHARED_REFERENCES_ROOT, "design-spec-lifecycle.md");

  assert.match(brainstorm, /## Ownership Handoff\n[\s\S]*hand the draft to `cf-architecture`/);
  assert.doesNotMatch(brainstorm, /architecture-principles\.md|navigation-cost\.md/);
  assert.match(architecture, /## Feature Handoff\n[\s\S]*Stay in the modules the feature touches/);
  assert.match(lifecycle, /## Handoff\n[\s\S]*handed off by: <skill>/);
  assert.match(lifecycle, /end the turn naming the receiver for the user to invoke; do not open the receiver in the same turn/);
});

test("packaged skill routing only names skills that exist in the pack", async () => {
  const skillNames = await publicSkillNames(SKILLS_ROOT);
  const known = new Set(skillNames);

  for (const skillName of skillNames) {
    const skillDir = path.join(SKILLS_ROOT, skillName);

    for (const file of await skillTextFiles(skillDir)) {
      const text = await fs.readFile(file, "utf8");
      const label = `skills/${skillName}/${path.relative(skillDir, file)}`;

      // A path under `.cflow/` names a file, not a routing destination:
      // `.cflow/cf-test-recap.md` is cf-test's recap, not a skill called
      // `cf-test-recap`. Skip those spans only, so a routing typo still fails.
      const artifactSpans = [...text.matchAll(/\.cflow\/[A-Za-z0-9._/-]+/g)].map((m) => [
        m.index,
        m.index + m[0].length,
      ]);

      for (const match of text.matchAll(/\bcf-[a-z][a-z-]*[a-z]\b/g)) {
        if (artifactSpans.some(([from, to]) => match.index >= from && match.index < to)) continue;
        assert.ok(
          known.has(match[0]),
          `${label} routes to ${match[0]}, which is not a skill in this pack`,
        );
      }
    }
  }
});

test("every `.cflow` artifact a skill references is owned by a skill in the pack", async () => {
  const skillNames = await publicSkillNames(SKILLS_ROOT);

  // Ownership is declared once per artifact, as `- Owns \`.cflow/<path>\``.
  const owned = new Set();
  for (const skillName of skillNames) {
    const contract = await fs.readFile(path.join(SKILLS_ROOT, skillName, "SKILL.md"), "utf8");
    for (const match of contract.matchAll(/^- Owns `(\.cflow\/[^`]+)`/gm)) {
      owned.add(match[1]);
    }
  }

  assert.ok(owned.size > 0, "no skill declares ownership of a `.cflow` artifact");

  for (const skillName of skillNames) {
    const skillDir = path.join(SKILLS_ROOT, skillName);
    const files = [...(await skillTextFiles(skillDir)), ...(await skillAssetFiles(skillDir))];

    for (const file of files) {
      const text = await fs.readFile(file, "utf8");
      const label = `skills/${skillName}/${path.relative(skillDir, file)}`;

      for (const match of text.matchAll(/`(\.cflow\/[A-Za-z0-9._/-]+)`/g)) {
        const artifact = match[1];
        // `.gitignore` is bootstrap, not an owned artifact; skills also refer to the directory itself.
        if (artifact === ".cflow/.gitignore" || artifact.endsWith("/")) continue;
        assert.ok(
          owned.has(artifact),
          `${label} references ${artifact}, which no skill in this pack owns`,
        );
      }
    }
  }
});
