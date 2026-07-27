import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { createMaterializedSkills } from "../src/lib/materialize-skills.mjs";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SKILLS_ROOT = path.join(REPO_ROOT, "skills");
const DOCS_ROOT = path.join(REPO_ROOT, "docs");
const SHARED_REFERENCES_ROOT = path.join(SKILLS_ROOT, "_shared", "references");
const DESCRIPTION_MAX_CHARS = 1024;

async function publicSkillNames(root) {
  const entries = await fs.readdir(root, { withFileTypes: true });
  return entries
    .filter(
      (entry) =>
        entry.isDirectory() && !entry.name.startsWith("_") && !entry.name.startsWith("."),
    )
    .map((entry) => entry.name)
    .sort();
}

async function skillTextFiles(skillDir) {
  const files = [path.join(skillDir, "SKILL.md")];
  const referencesDir = path.join(skillDir, "references");

  try {
    for (const entry of await fs.readdir(referencesDir, { withFileTypes: true })) {
      if (entry.isFile() && entry.name.endsWith(".md")) {
        files.push(path.join(referencesDir, entry.name));
      }
    }
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }

  return files;
}

async function skillAssetFiles(skillDir) {
  const assetsDir = path.join(skillDir, "assets");

  try {
    return (await fs.readdir(assetsDir, { withFileTypes: true }))
      .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
      .map((entry) => path.join(assetsDir, entry.name));
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
    return [];
  }
}

function parseFrontmatter(text, label) {
  const frontmatter = /^---\n([\s\S]*?)\n---\n?/.exec(text);
  assert.ok(frontmatter, `${label} is missing frontmatter`);

  const fields = {};
  for (const line of frontmatter[1].split("\n")) {
    const field = /^(name|description):\s*(.+)$/.exec(line);
    if (!field) continue;
    let value = field[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    fields[field[1]] = value;
  }

  return fields;
}

test("packaged skill frontmatter name matches its directory", async () => {
  for (const skillName of await publicSkillNames(SKILLS_ROOT)) {
    const skillFile = path.join(SKILLS_ROOT, skillName, "SKILL.md");
    const fields = parseFrontmatter(await fs.readFile(skillFile, "utf8"), `skills/${skillName}/SKILL.md`);

    assert.equal(
      fields.name,
      skillName,
      `skills/${skillName}/SKILL.md frontmatter name must match the directory name`,
    );
  }
});

test("packaged skill descriptions satisfy discovery constraints", async () => {
  for (const skillName of await publicSkillNames(SKILLS_ROOT)) {
    const skillFile = path.join(SKILLS_ROOT, skillName, "SKILL.md");
    const label = `skills/${skillName}/SKILL.md`;
    const fields = parseFrontmatter(await fs.readFile(skillFile, "utf8"), label);
    const description = fields.description ?? "";

    assert.ok(description.length > 0, `${label} description must not be empty`);
    assert.ok(
      description.length <= DESCRIPTION_MAX_CHARS,
      `${label} description is ${description.length} chars; the Agent Skills spec caps it at ${DESCRIPTION_MAX_CHARS}`,
    );
    assert.match(
      description,
      /\bUse (when|after|as|only when)\b/,
      `${label} description must state when to use the skill ("Use when/after/as/only when ...")`,
    );
  }
});

test("cf-docs routes only by Markdown write intent", async () => {
  const skillFile = path.join(SKILLS_ROOT, "cf-docs", "SKILL.md");
  const skill = await fs.readFile(skillFile, "utf8");
  const description = parseFrontmatter(skill, "skills/cf-docs/SKILL.md").description;
  const flow = await fs.readFile(
    path.join(DOCS_ROOT, "docs", "doc-docs.flow.md"),
    "utf8",
  );

  for (const contract of [description, skill, flow]) {
    assert.match(contract, /write operation on a Markdown file/);
    assert.match(contract, /do not use (?:it )?otherwise/i);
  }
});

test("cf-simplify discovery stays within software implementation", async () => {
  const skillFile = path.join(SKILLS_ROOT, "cf-simplify", "SKILL.md");
  const skill = await fs.readFile(skillFile, "utf8");
  const description = parseFrontmatter(
    skill,
    "skills/cf-simplify/SKILL.md",
  ).description;

  assert.match(description, /overengineering in software implementation/);
  assert.match(description, /implementation structure or behavior/);
  assert.match(description, /Do not use for non-code content/);
  assert.match(description, /local code readability work to cf-cognitive/);
  assert.doesNotMatch(description, /questions whether files are necessary/);
});

test("cf-cohesion discovery excludes non-code content", async () => {
  const skillFile = path.join(SKILLS_ROOT, "cf-cohesion", "SKILL.md");
  const skill = await fs.readFile(skillFile, "utf8");
  const description = parseFrontmatter(
    skill,
    "skills/cf-cohesion/SKILL.md",
  ).description;

  assert.match(description, /Do not use for non-code content/);
});

test("materialized skill files only link runtime files that exist", async () => {
  const materialized = await createMaterializedSkills(SKILLS_ROOT);

  try {
    for (const skillName of await publicSkillNames(materialized.skillsRoot)) {
      const skillDir = path.join(materialized.skillsRoot, skillName);

      for (const file of await skillTextFiles(skillDir)) {
        const text = await fs.readFile(file, "utf8");
        const label = `skills/${skillName}/${path.relative(skillDir, file)}`;

        for (const match of text.matchAll(
          /(?<![\w/])(?:\.\.\/[\w.-]+\/)?(?:references|scripts|assets)\/[\w./-]+\.(?:md|mjs)/g,
        )) {
          const target = path.join(skillDir, match[0]);

          await assert.doesNotReject(
            fs.access(target),
            `${label} links ${match[0]}, which does not exist in the skill`,
          );
        }
      }
    }
  } finally {
    await materialized.cleanup();
  }
});

test("every public skill has a maintainer flow doc", async () => {
  for (const skillName of await publicSkillNames(SKILLS_ROOT)) {
    const shortName = skillName.replace(/^cf-/, "");
    const flowDoc = path.join(DOCS_ROOT, shortName, `doc-${shortName}.flow.md`);

    await assert.doesNotReject(
      fs.access(flowDoc),
      `${skillName} is missing ${path.relative(REPO_ROOT, flowDoc)}`,
    );
  }
});

test("navigation-cost is the single source of hard-trigger threshold values", async () => {
  const canonicalContract = await fs.readFile(
    path.join(SHARED_REFERENCES_ROOT, "navigation-cost.md"),
    "utf8",
  );

  assert.match(canonicalContract, /past roughly 20-30 logical lines/);
  assert.match(canonicalContract, /past roughly 300 LOC/);

  const consumers = [
    path.join(SHARED_REFERENCES_ROOT, "local-refactor-rules.md"),
    path.join(SHARED_REFERENCES_ROOT, "file-split-rules.md"),
    path.join(SKILLS_ROOT, "cf-cognitive", "SKILL.md"),
    path.join(SKILLS_ROOT, "cf-cognitive", "references", "discovery.md"),
    path.join(SKILLS_ROOT, "cf-cognitive", "references", "targeted-evaluation.md"),
    path.join(SKILLS_ROOT, "cf-review", "references", "sweep.md"),
    path.join(SKILLS_ROOT, "cf-split", "references", "evaluation.md"),
  ];

  for (const file of consumers) {
    const contract = await fs.readFile(file, "utf8");
    const label = path.relative(REPO_ROOT, file);

    assert.match(
      contract,
      /references\/navigation-cost\.md/,
      `${label} must use the canonical contract`,
    );
    assert.doesNotMatch(
      contract,
      /20-30|20–30|300(?:-LOC| LOC)/,
      `${label} must not duplicate canonical threshold values`,
    );
  }
});

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
  const cognitiveExecution = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-cognitive", "references", "execution.md"),
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
  for (const execution of [cohesionExecution, splitExecution, cognitiveExecution]) {
    assert.match(execution, /report\/action separation in references\/navigation-cost\.md/);
    assert.match(execution, /For \*\*Deferred\*\*, after edits/);
  }
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
  const discovery = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-cognitive", "references", "discovery.md"),
    "utf8",
  );
  const targetedEvaluation = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-cognitive", "references", "targeted-evaluation.md"),
    "utf8",
  );
  const execution = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-cognitive", "references", "execution.md"),
    "utf8",
  );

  assert.match(
    cognitiveContract,
    /Before applying any flow, read references\/navigation-cost\.md/,
  );
  assert.match(
    cognitiveContract,
    /Read references\/execution\.md and references\/local-refactor-rules\.md/,
  );
  for (const reference of [discovery, targetedEvaluation, execution]) {
    assert.doesNotMatch(reference, /ensure you have read references\//i);
  }
  assert.match(
    localRefactorRules,
    /hard-trigger values, exemptions, and remedy rules come from `references\/navigation-cost\.md`/,
  );
  assert.doesNotMatch(localRefactorRules, /read `references\/navigation-cost\.md`/i);
});

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
    "references/sweep.md",
    "references/navigation-cost.md",
  ]);
  assert.deepEqual(reviewFlow.conditional, [
    "references/reference-audit.md",
    "references/handoff.md",
  ]);
  assert.equal(reviewFlow.handoffs, undefined);
});

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
    path.join(SKILLS_ROOT, "cf-mr-wolf", "references", "dynamic-agents.md"),
    "utf8",
  );
  const brief = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-mr-wolf", "references", "derisk-agent-brief.md"),
    "utf8",
  );

  assert.match(derisk, /terminal read-only agent/);
  for (const contract of [dynamicAgents, brief]) {
    assert.match(contract, /activate skills/);
    assert.match(contract, /route prerequisites/);
    assert.match(contract, /delegate (?:again|to another agent)/);
  }
});

test("dynamic agent inputs require retained notes only when relevant", async () => {
  const dynamicAgents = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-mr-wolf", "references", "dynamic-agents.md"),
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
