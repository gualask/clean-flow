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
  const execution = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-cohesion", "references", "execution.md"),
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
  assert.match(targetedEvaluation, /this reference never edits files/);
  assert.match(targetedEvaluation, /When targeted evaluation is the selected flow/);
  assert.match(targetedEvaluation, /When loaded as execution preflight, emit no intermediate output/);
  assert.doesNotMatch(targetedEvaluation, /^Evaluate only\. Do not edit files\.$/m);
  assert.match(execution, /decision admitted by the execution gate/);
  assert.match(execution, /report `regrouping performed` only after files moved/);
  assert.match(execution, /If the evaluation gate stopped the flow before edits/);
});

test("cognitive execution routes to split only for remaining file-level pressure", async () => {
  const executionContract = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-cognitive", "references", "execution.md"),
    "utf8",
  );
  const flowDoc = await fs.readFile(
    path.join(DOCS_ROOT, "cognitive", "doc-cognitive.flow.md"),
    "utf8",
  );

  assert.match(
    executionContract,
    /route to `cf-split` evaluation before advancing only when remaining file-level pressure is demonstrated/,
  );
  assert.match(
    executionContract,
    /canonical file-length trigger without a recognized exemption/,
  );
  assert.match(
    executionContract,
    /stable named owner or boundary that still raises navigation cost/,
  );
  assert.match(
    executionContract,
    /otherwise finish the target and continue within the explicit target set/i,
  );
  assert.doesNotMatch(
    executionContract,
    /route to `cf-split` evaluation for that same file before advancing to another target file/,
  );
  assert.match(
    flowDoc,
    /route through `cf-split` evaluation only when remaining file-level pressure is demonstrated/,
  );
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

test("dynamic de-risk agents are terminal in selection and prompt contracts", async () => {
  const derisk = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-mr-wolf", "references", "derisk.md"),
    "utf8",
  );
  const dynamicAgents = await fs.readFile(
    path.join(SHARED_REFERENCES_ROOT, "dynamic-agents.md"),
    "utf8",
  );
  const brief = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-mr-wolf", "references", "derisk-agent-brief.md"),
    "utf8",
  );
  const mrWolfFlow = await fs.readFile(
    path.join(DOCS_ROOT, "mr-wolf", "doc-mr-wolf.flow.md"),
    "utf8",
  );

  assert.match(derisk, /terminal read-only agent/);
  assert.match(mrWolfFlow, /shared deterministic context gate selects delegation/);
  assert.doesNotMatch(mrWolfFlow, /dispatched to any available read-only subagent/);
  assert.match(dynamicAgents, /## Delegated Terminal Agent Protocol/);
  assert.match(dynamicAgents, /restricts only the delegated role/);
  assertStableFields(
    dynamicAgents,
    [...TERMINAL_AGENT_PROTOCOL, "reusable_brief_model_values: forbidden"],
    "shared delegated terminal agent protocol",
  );
  assert.doesNotMatch(brief, /Terminal protocol \(stable contract\)/);
  assert.match(brief, /do not activate skills/);
  assert.match(brief, /route prerequisites/);
  assert.match(brief, /delegate to another agent/);
  assert.match(brief, /Do not write anywhere on the filesystem, run tests/);
  assert.match(brief, /Stay inside the assigned context slice/);
  assert.match(derisk, /controller executes it/);
});

test("dynamic agent inputs require retained notes only when relevant", async () => {
  const dynamicAgents = await fs.readFile(
    path.join(SHARED_REFERENCES_ROOT, "dynamic-agents.md"),
    "utf8",
  );

  assert.match(dynamicAgents, /exact evidence question or candidate findings/);
  assert.match(dynamicAgents, /When retained notes exist and matter to the pass/);
  assert.doesNotMatch(
    dynamicAgents,
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

test("repository orientation is phase-scoped instead of global preflight", async () => {
  const startContract = await fs.readFile(path.join(SKILLS_ROOT, "cf-start", "SKILL.md"), "utf8");
  const assessment = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-start", "references", "assessment.md"),
    "utf8",
  );
  const targetShape = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-start", "references", "target-shape.md"),
    "utf8",
  );
  const sourceOrientation = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-start", "references", "source-orientation.md"),
    "utf8",
  );
  const startFlow = await fs.readFile(
    path.join(DOCS_ROOT, "start", "doc-start.flow.md"),
    "utf8",
  );
  const preflight = /## Preflight\n([\s\S]*?)\n## Flow Selection/.exec(startContract);

  assert.ok(preflight, "cf-start must keep an explicit Preflight section");
  assert.doesNotMatch(preflight[1], /repo-tree\.mjs/);
  assert.match(
    preflight[1],
    /Do not run repository-wide orientation unless the fresh-assessment or target-shape reference requires it/,
  );
  assert.match(startContract, /never rely on a stored map/i);
  assert.match(assessment, /controller's Source Orientation rules/);
  assert.match(targetShape, /controller's Source Orientation rules/);
  assert.match(assessment, /Read `references\/source-orientation\.md`/);
  assert.match(targetShape, /When target-shape is entered directly or the scope materially changed/);
  assert.match(targetShape, /read `references\/source-orientation\.md`/);
  assert.doesNotMatch(assessment, /repo-tree\.mjs/);
  assert.doesNotMatch(targetShape, /repo-tree\.mjs/);
  assert.match(sourceOrientation, /Resolve `scripts\/repo-tree\.mjs`/);
  assert.match(sourceOrientation, /Do not persist the tree as a Cflow artifact/);
  assert.match(startFlow, /orients fresh assessment and direct target-shape work/);
  assert.doesNotMatch(startContract, /architecture\.md/);
});

test("packaged skill routing only names skills that exist in the pack", async () => {
  const skillNames = await publicSkillNames(SKILLS_ROOT);
  const known = new Set(skillNames);

  for (const skillName of skillNames) {
    const skillDir = path.join(SKILLS_ROOT, skillName);

    for (const file of await skillTextFiles(skillDir)) {
      const text = await fs.readFile(file, "utf8");
      const label = `skills/${skillName}/${path.relative(skillDir, file)}`;

      for (const match of text.matchAll(/\bcf-[a-z][a-z-]*[a-z]\b/g)) {
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
