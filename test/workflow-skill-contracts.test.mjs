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
  publicSkillNames,
  skillAssetFiles,
  skillTextFiles,
} from "./support/skill-contract-helpers.mjs";

test("cohesion execution composes evaluation as a gated non-terminal preflight", async () => {
  const cohesionContract = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-cohesion", "SKILL.md"),
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

  for (const contract of [cohesionContract, cohesionFlow]) {
    assert.match(contract, /Continue only (?:when|for).*`recommended` or `optional`/);
    assert.match(contract, /for `keep as-is` or `route`, stop without editing/i);
  }
  // Measured 2026-10-06 on gpt-6-luna: without these lines a route still edited
  // (cf-cognitive opened in the same turn), a requested regrouping created a Go
  // package the evaluation had routed, and execution split a file it moved.
  // 2026-10-07: "use `cf-cognitive` for that" was not read as a route and still edited
  // (1 of 3 clean); "Route ... to `cf-cognitive`" routed 3 of 3. The generic package
  // line kept the Go route 2 of 2 and let a TypeScript regrouping run.
  assert.match(cohesionContract, /When routing, do not edit files: name the route and the reason in \*\*Result\*\*, and end the turn\./);
  assert.match(cohesionContract, /^Route cognitive cleanup inside one file to `cf-cognitive`\.$/m);
  assert.match(cohesionContract, /^Route extracting responsibilities out of one source file to `cf-split`\.$/m);
  assert.doesNotMatch(cohesionContract, /use `cf-(cognitive|split)` for that/);
  assert.match(cohesionContract, /a folder that the language or build would treat as a new package or module.*even when the request asks for the move/);
  assert.match(cohesionContract, /do not split, merge, or rewrite file contents.*do not add barrel or re-export files/);
  // Discovery counts with the bundled script, not with a command the model writes (3 of 3, 2026-10-07).
  assert.match(cohesionContract, /Count with the bundled `scripts\/dir-population\.mjs`, resolved from the active skill root and never from the project working directory; do not write your own count\./);
  assert.match(cohesionContract, /\*\*Decision\*\*: the decision label; in discovery, `candidates` or `none`; after execution, `regrouped`\./);
  assert.match(targetedEvaluation, /When targeted evaluation is the selected flow/);
  assert.match(targetedEvaluation, /When loaded before execution, emit no intermediate output/);
  assert.doesNotMatch(targetedEvaluation, /^Evaluate only\. Do not edit files\.$/m);
});

test("cognitive routes to split and cohesion up front, not by post-edit condition", async () => {
  const cognitiveContract = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-cognitive", "SKILL.md"),
    "utf8",
  );
  const flowDoc = await fs.readFile(
    path.join(DOCS_ROOT, "cognitive", "doc-cognitive.flow.md"),
    "utf8",
  );

  // Routing is stated once, on what the request is, and named again in the
  // result. The two post-edit conditional routes were dropped with the merge of
  // 2026-08-16: a vague condition inside a pointer fired 4 of 9 times on
  // identical input, and no bed ever exercised either clause.
  assert.match(
    cognitiveContract,
    /Route elsewhere instead of working here: `cf-split`.*`cf-cohesion`.*`cf-architecture`/s,
  );
  assert.match(
    cognitiveContract,
    /`cf-split` or `cf-cohesion` next step when relevant/,
  );
  for (const contract of [cognitiveContract, flowDoc]) {
    assert.doesNotMatch(contract, /After editing a target file, route to/);
    assert.doesNotMatch(
      contract,
      /route through `cf-split` evaluation only when remaining file-level pressure is demonstrated/,
    );
  }
});

test("todo rolls completed tasks over only when adding new work", async () => {
  const todoContract = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-todo", "SKILL.md"),
    "utf8",
  );
  const todoFlow = await fs.readFile(
    path.join(DOCS_ROOT, "todo", "doc-todo.flow.md"),
    "utf8",
  );

  for (const text of [todoContract, todoFlow]) {
    assert.match(text, /at least one existing task is unchecked/);
    assert.match(text, /every existing task is checked/);
    assert.match(text, /add(?:s|ing)? new tasks?/);
    assert.match(text, /no new task/);
    assert.doesNotMatch(text, /preparing a .*commit|ask whether to empty|commit cleanup|reset/);
  }
});

test("delegated terminal agents keep a stable shared protocol", async () => {
  const delegatedExecution = await fs.readFile(
    path.join(SHARED_REFERENCES_ROOT, "delegated-execution.md"),
    "utf8",
  );

  assert.match(delegatedExecution, /## Delegated Terminal Agent Protocol/);
  assert.match(delegatedExecution, /restricts only the delegated role/);
  assertStableFields(
    delegatedExecution,
    [...TERMINAL_AGENT_PROTOCOL, "reusable_brief_model_values: forbidden"],
    "shared delegated terminal agent protocol",
  );
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

test("dynamic agent inputs require retained notes only when relevant", async () => {
  const delegatedExecution = await fs.readFile(
    path.join(SHARED_REFERENCES_ROOT, "delegated-execution.md"),
    "utf8",
  );

  assert.match(delegatedExecution, /exact evidence question or candidate findings/);
  assert.match(delegatedExecution, /When retained notes exist and matter to the pass/);
  assert.doesNotMatch(
    delegatedExecution,
    /notes path or compact notes summary, and exact evidence question/,
  );
});

test("skill value trials declare their intervention instead of inheriting one case", async () => {
  const method = await fs.readFile(
    path.join(DOCS_ROOT, "skill-value-trials", "trial-method.md"),
    "utf8",
  );

  for (const field of [
    "Value claim",
    "Population",
    "Controlled inputs",
    "Oracle",
    "Metrics",
    "Stopping rule",
  ]) {
    assert.match(method, new RegExp(`\\*\\*${field}\\*\\*`));
  }

  assert.doesNotMatch(
    method,
    /cf-trace|\.cflow\/architecture\.md|artifact-owned-by-skill|proceed in local mode|100.?400 source files/,
  );
});

test("execute inspects only the spec or unit scope and hands off without a spec", async () => {
  const executeContract = await fs.readFile(path.join(SKILLS_ROOT, "cf-execute", "SKILL.md"), "utf8");
  const executeFlow = await fs.readFile(
    path.join(DOCS_ROOT, "execute", "doc-execute.flow.md"),
    "utf8",
  );
  const rules = /## Rules\n([\s\S]*?)\n## /.exec(executeContract);
  const specGate = /## Spec Gate\n([\s\S]*?)\n## /.exec(executeContract);

  assert.ok(rules, "cf-execute must keep its cross-phase Rules section");
  assert.doesNotMatch(rules[1], /repo-tree\.mjs/);
  assert.match(rules[1], /Inspect only the spec's scope or the accepted unit's touched scope/);
  assert.match(rules[1], /never rely on a stored map/i);
  assert.match(rules[1], /Do not assess or redesign under this skill/);
  assert.match(rules[1], /A `recommended next work unit` is not accepted/);
  assert.ok(specGate, "cf-execute must keep an explicit Spec Gate section");
  assert.match(specGate[1], /ls -a \.cflow \.cflow\/specs/);
  assert.match(specGate[1], /`\.cflow\/specs\/draft\.md` is not approved/);
  assert.match(specGate[1], /do not plan: hand the request to the skill that designs it/);
  assert.match(specGate[1], /`cf-architecture`/);
  assert.match(specGate[1], /`cf-mr-wolf`: a feature or product idea is not designed yet/);
  assert.doesNotMatch(specGate[1], /`cf-brainstorm`/);
  assert.doesNotMatch(executeContract, /Frame Gate|assessment\.md|target-shape\.md|source-orientation\.md/);
  assert.match(executeFlow, /Spec Gate replaces cf-start's Frame Gate/);
});

test("execute defines unit modes once where both planning references are reached", async () => {
  const executeRoot = path.join(SKILLS_ROOT, "cf-execute");
  const executeContract = await fs.readFile(path.join(executeRoot, "SKILL.md"), "utf8");
  const planning = /### Planning\n([\s\S]*?)\n### /.exec(executeContract);

  assert.ok(planning, "cf-execute must keep a Planning phase");
  assert.match(planning[1], /- `split`: gives a responsibility its own owner/);
  assert.match(planning[1], /- `consolidate`: collapses a boundary with no real responsibility/);
  assert.match(planning[1], /A behavior-preserving unit is never `feature`/);
  for (const reference of ["work-unit-planning.md", "migration-unit-planning.md"]) {
    const text = await fs.readFile(path.join(executeRoot, "references", reference), "utf8");
    assert.doesNotMatch(text, /mode: (split|consolidate|feature)/, `${reference} must not redefine unit modes`);
  }
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
