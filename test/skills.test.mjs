import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { listSkillDirectories, pathExists } from "../src/lib/fs.mjs";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SKILLS_ROOT = path.join(REPO_ROOT, "skills");

test("packaged skills expose frontmatter and agent config", async () => {
  const skills = await listSkillDirectories(SKILLS_ROOT);

  assert.ok(skills.length > 0);

  for (const skill of skills) {
    const body = await readFile(path.join(skill.path, "SKILL.md"), "utf8");
    const frontmatter = body.match(/^---\n([\s\S]*?)\n---\n/);

    assert.ok(frontmatter, `${skill.name} is missing frontmatter`);
    assert.match(frontmatter[1], /^name:/m, `${skill.name} is missing a name`);
    assert.match(frontmatter[1], /^description:/m, `${skill.name} is missing a description`);
    assert.equal(
      await pathExists(path.join(skill.path, "agents", "openai.yaml")),
      true,
      `${skill.name} is missing agents/openai.yaml`,
    );
  }
});

test("packaged Cflow skills allow implicit Codex invocation", async () => {
  const skills = await listSkillDirectories(SKILLS_ROOT);

  assert.ok(skills.length > 0);

  for (const skill of skills) {
    const openaiYaml = await readFile(path.join(skill.path, "agents", "openai.yaml"), "utf8");
    assert.match(
      openaiYaml,
      /^\s*allow_implicit_invocation:\s*true\s*$/m,
      `${skill.name} should allow implicit Codex invocation`,
    );
  }
});

test("packaged Cflow skills expose default prompts", async () => {
  const skills = await listSkillDirectories(SKILLS_ROOT);

  assert.ok(skills.length > 0);

  for (const skill of skills) {
    const openaiYaml = await readFile(path.join(skill.path, "agents", "openai.yaml"), "utf8");
    const escapedSkillName = skill.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    assert.match(
      openaiYaml,
      new RegExp(`^\\s*default_prompt:\\s*".*\\$${escapedSkillName}.*"\\s*$`, "m"),
      `${skill.name} should expose a default_prompt that mentions $${skill.name}`,
    );
  }
});

test("cf-start ships bootstrap asset templates", async () => {
  assert.equal(
    await pathExists(path.join(SKILLS_ROOT, "cf-start", "assets", "architecture.template.md")),
    true,
  );
  assert.equal(
    await pathExists(path.join(SKILLS_ROOT, "cf-start", "assets", "refactor-brief.template.md")),
    true,
  );
  assert.equal(
    await pathExists(path.join(SKILLS_ROOT, "cf-mr-wolf", "assets", "mr-wolf-notes.template.md")),
    true,
  );
  assert.equal(
    await pathExists(path.join(SKILLS_ROOT, "cf-trace", "assets", "trace.template.md")),
    true,
  );
});

test("architecture artifact template stays observational", async () => {
  const body = await readFile(
    path.join(SKILLS_ROOT, "cf-start", "assets", "architecture.template.md"),
    "utf8",
  );

  assert.doesNotMatch(body, /Refactor guidance/i);
  assert.doesNotMatch(body, /future refactors should/i);
  assert.match(body, /Use this template as both the artifact shape and the controller review rubric/);
  assert.match(body, /Before writing the file, check the subagent report against every section below/);
  assert.match(body, /Must identify what the repository exists to do/);
  assert.match(body, /Exclude generated, vendored, dependency, cache, and build-output directories/);
  assert.match(body, /## Boundary and packaging model/);
  assert.doesNotMatch(body, /## Boundary model/);
  assert.doesNotMatch(body, /## Packaging model/);
  assert.doesNotMatch(body, /## Dependency direction/);
  assert.match(body, /Runtime crossings: `<caller area>` -> `<runtime\/API boundary>` -> `<owner area>`/);
  assert.match(body, /Should not repeat the top-level map directory by directory/);
  assert.match(body, /## Observed invariants/);
  assert.match(body, /Keep this section descriptive; do not add refactor recommendations, future-work caveats, or planning notes/);
});

test("cf-start ships workflow phase references", async () => {
  for (const referenceName of [
    "routing.md",
    "artifacts.md",
    "assessment.md",
    "alignment.md",
    "concentration-map.md",
    "fragmentation-map.md",
    "work-unit-planning.md",
    "target-shape.md",
    "migration-unit-planning.md",
    "safety-net.md",
    "split-execution.md",
    "consolidation-execution.md",
    "local-simplify.md",
    "review.md",
    "verify.md",
    "feedback-intake.md",
  ]) {
    assert.equal(
      await pathExists(path.join(SKILLS_ROOT, "cf-start", "references", referenceName)),
      true,
      `cf-start is missing references/${referenceName}`,
    );
  }
});

test("cf-architecture-map requires read-only clean-context reconnaissance", async () => {
  const body = await readFile(
    path.join(SKILLS_ROOT, "cf-architecture-map", "SKILL.md"),
    "utf8",
  );
  const flowBody = await readFile(
    path.join(REPO_ROOT, "docs", "architecture-map", "doc-architecture.map.flow.md"),
    "utf8",
  );

  assert.match(body, /Clean-Context Reconnaissance/);
  assert.match(body, /use the `cflow_architecture_recon` custom agent when available/);
  assert.match(body, /use one equivalent clean-context reconnaissance subagent/);
  assert.match(body, /Start the custom agent with only the repository path and the user's mapping request/);
  assert.match(body, /Do not paste the custom agent's TOML instructions or full report format into the spawn prompt/);
  assert.match(body, /Expect the subagent report to contain these sections/);
  assert.match(body, /Boundary and Packaging Model/);
  assert.match(body, /Use `\.\.\/cf-start\/assets\/architecture\.template\.md` as the review rubric/);
  assert.match(body, /If the report misses a template section or fills it with generic, prescriptive, or off-scope content/);
  assert.doesNotMatch(body, /## Boundary Model/);
  assert.doesNotMatch(body, /## Packaging Model/);
  assert.doesNotMatch(body, /Do not repeat the top-level map directory by directory/);
  assert.match(body, /Observed Invariants/);
  assert.match(body, /Keep `\.cflow\/architecture\.md` observational/);
  assert.match(body, /do not add refactor recommendations, target shapes, prescriptive guidance, future-work caveats, or planning notes/);
  assert.doesNotMatch(body, /Do not include generated, vendored, dependency, cache, or build-output directories/);
  assert.doesNotMatch(body, /Exclude generated, vendored, dependency, cache, and build-output directories/);
  assert.doesNotMatch(body, /Refactor Guidance/);
  assert.match(body, /Treat the subagent report as the primary repository scan/);
  assert.match(body, /While the subagent is running, do not read manifests, source directories, docs, or implementation files/);
  assert.match(body, /the controller may only inspect Cflow artifacts, `\.gitignore`, the architecture template, and worktree status/);
  assert.match(body, /Do not repeat full reconnaissance/);
  assert.match(body, /If a full controller-side scan becomes necessary, say why before doing it/);
  assert.match(body, /You still own artifact writes, `\.gitignore`, final interpretation/);
  assert.match(flowBody, /using bundled repo tree output when available/);
});

test("cf-architecture-map ships a low-cost read-only Codex custom agent", async () => {
  const body = await readFile(
    path.join(SKILLS_ROOT, "_codex_agents", "cflow_architecture_recon.toml"),
    "utf8",
  );

  assert.match(body, /^name = "cflow_architecture_recon"$/m);
  assert.match(body, /^model = "gpt-5\.4-mini"$/m);
  assert.match(body, /^model_reasoning_effort = "medium"$/m);
  assert.match(body, /^sandbox_mode = "read-only"$/m);
  assert.match(body, /Do not edit files, create \.cflow\/\*/);
  assert.match(body, /Cite enough concrete file evidence/);
  assert.match(body, /repo-tree helper/);
  assert.match(body, /<repo>\/\.agents\/skills\/_shared\/scripts\/repo-tree\.mjs/);
  assert.match(body, /\$CODEX_HOME\/skills\/_shared\/scripts\/repo-tree\.mjs/);
  assert.match(body, /\$HOME\/\.codex\/skills\/_shared\/scripts\/repo-tree\.mjs/);
  assert.match(body, /skip it if unavailable/);
  assert.match(body, /orientation, not architecture evidence/);
  assert.match(body, /Exclude generated, vendored, dependency, cache, and build-output directories/);
  assert.match(body, /## Boundary and Packaging Model/);
  assert.doesNotMatch(body, /## Boundary Model/);
  assert.doesNotMatch(body, /## Packaging Model/);
  assert.match(body, /Runtime crossings: `<caller area>` -> `<runtime\/API boundary>` -> `<owner area>`/);
  assert.match(body, /## Observed Invariants/);
  assert.match(body, /do not add refactor recommendations, future-work caveats, or planning notes/);
  assert.doesNotMatch(body, /Refactor Guidance/);
  assert.match(body, /## Evidence/);
  assert.match(body, /## Unknowns/);
});

test("cf-trace requires read-only clean-context reconstruction", async () => {
  const body = await readFile(path.join(SKILLS_ROOT, "cf-trace", "SKILL.md"), "utf8");
  const templateBody = await readFile(
    path.join(SKILLS_ROOT, "cf-trace", "assets", "trace.template.md"),
    "utf8",
  );
  const flowBody = await readFile(
    path.join(REPO_ROOT, "docs", "trace", "doc-trace.flow.md"),
    "utf8",
  );

  assert.match(body, /use the `cflow_trace_recon` custom agent when available/);
  assert.match(body, /use one equivalent clean-context reconnaissance subagent/);
  assert.match(body, /Read `\.cflow\/architecture\.md` if it exists/);
  assert.match(body, /route to `cf-architecture-map` before continuing/);
  assert.match(body, /Start the custom agent with only the repository path and the user's trace request/);
  assert.match(body, /Do not paste the custom agent's TOML instructions or full report format/);
  assert.match(body, /Use `assets\/trace\.template\.md` as the review rubric/);
  assert.match(body, /The subagent produces reconstruction only/);
  assert.match(body, /Every reconstructed step must be marked as observed or inferred/);
  assert.match(body, /sequence correctness/);
  assert.match(body, /state and resume/);
  assert.match(body, /instruction ambiguity/);
  assert.match(body, /Recommend exactly one immediate route/);
  assert.match(body, /do not create or refresh `\.cflow\/architecture\.md` or `\.cflow\/refactor-brief\.md`/);

  assert.match(templateBody, /## Reconstruction/);
  assert.match(templateBody, /status: observed \| inferred/);
  assert.match(templateBody, /## Audit findings/);
  assert.match(templateBody, /## Lens coverage/);
  assert.match(templateBody, /## Recommended route/);
  assert.match(templateBody, /cf-mr-wolf \| cf-architecture-map \| cf-start \| cf-cognitive \| cf-file-split \| direct fix \| none/);

  assert.match(flowBody, /Custom agent source: `skills\/_codex_agents\/cflow_trace_recon\.toml`/);
  assert.match(flowBody, /The custom agent must reconstruct the path only/);
  assert.match(flowBody, /preflight reads only existing `\.cflow\/architecture\.md`/);
  assert.match(flowBody, /routes to `cf-architecture-map` before continuing/);
  assert.match(flowBody, /reads `\.cflow\/architecture\.md` first when present/);
  assert.match(flowBody, /The controller must not duplicate the path scan/);
  assert.match(flowBody, /`\.cflow\/trace\.md` must distinguish observed from inferred steps/);
  assert.match(flowBody, /Every applicable audit lens must be covered/);
  assert.match(flowBody, /uses bundled repo tree output when available/);
});

test("cf-trace ships a low-cost read-only Codex custom agent", async () => {
  const body = await readFile(
    path.join(SKILLS_ROOT, "_codex_agents", "cflow_trace_recon.toml"),
    "utf8",
  );

  assert.match(body, /^name = "cflow_trace_recon"$/m);
  assert.match(body, /^model = "gpt-5\.4-mini"$/m);
  assert.match(body, /^model_reasoning_effort = "medium"$/m);
  assert.match(body, /^sandbox_mode = "read-only"$/m);
  assert.match(body, /Do not edit files, create \.cflow\/\*/);
  assert.match(body, /Do not .*decide audit severity/);
  assert.match(body, /repo-tree helper/);
  assert.match(body, /<repo>\/\.agents\/skills\/_shared\/scripts\/repo-tree\.mjs/);
  assert.match(body, /\$CODEX_HOME\/skills\/_shared\/scripts\/repo-tree\.mjs/);
  assert.match(body, /\$HOME\/\.codex\/skills\/_shared\/scripts\/repo-tree\.mjs/);
  assert.match(body, /skip it if unavailable/);
  assert.match(body, /orientation, not evidence that a path step exists/);
  assert.match(body, /Read \.cflow\/architecture\.md first when it exists/);
  assert.match(body, /Do not treat \.cflow\/architecture\.md as proof that a path step exists/);
  assert.match(body, /Every reconstructed step must be marked as observed or inferred/);
  assert.match(body, /## Trace Scope/);
  assert.match(body, /## Observed Sequence/);
  assert.match(body, /## Inputs and Triggers/);
  assert.match(body, /## State and Artifacts/);
  assert.match(body, /## External Effects/);
  assert.match(body, /## Failure and Resume Paths/);
  assert.match(body, /## Evidence/);
  assert.match(body, /## Unknowns/);
});

test("maintainer golden rules require empty-context skill polish", async () => {
  const body = await readFile(path.join(REPO_ROOT, "docs", "golden-rules.md"), "utf8");
  const maintainingBody = await readFile(
    path.join(REPO_ROOT, "docs", "maintaining-this-pack.md"),
    "utf8",
  );

  assert.match(maintainingBody, /golden-rules\.md/);
  assert.match(body, /empty context/);
  assert.match(body, /every sentence must be necessary runtime guidance/);
  assert.match(body, /progressive disclosure/);
  assert.match(body, /for all runtime guidance/);
  assert.match(body, /smallest linked resource/);
  assert.match(body, /no historical migration notes/);
  assert.match(body, /maintainer-only labels/);
  assert.match(body, /decorative wording/);
});

test("cf-start phase references preserve internal-skill guardrails", async () => {
  const safetyNetBody = await readFile(
    path.join(SKILLS_ROOT, "cf-start", "references", "safety-net.md"),
    "utf8",
  );
  const splitBody = await readFile(
    path.join(SKILLS_ROOT, "cf-start", "references", "split-execution.md"),
    "utf8",
  );
  const planningBody = await readFile(
    path.join(SKILLS_ROOT, "cf-start", "references", "work-unit-planning.md"),
    "utf8",
  );

  assert.match(safetyNetBody, /Characterization tests lock current behavior/);
  assert.match(safetyNetBody, /Do not weaken or rewrite tests just to make a refactor pass/);
  assert.match(splitBody, /If the seam is still not mapped enough/);
  assert.match(splitBody, /If the safety lock breaks after a move, stop and investigate/);
  assert.match(planningBody, /faking lightweight planning/);
  assert.match(planningBody, /Never finish planning with both `current work unit` and `recommended next work unit` unset/);
});

test("cf-file-split requires post-split placement review for related clusters", async () => {
  const skillBody = await readFile(path.join(SKILLS_ROOT, "cf-file-split", "SKILL.md"), "utf8");
  const rulesBody = await readFile(
    path.join(SKILLS_ROOT, "_shared", "references", "file-split-rules.md"),
    "utf8",
  );
  const flowBody = await readFile(
    path.join(REPO_ROOT, "docs", "file-split", "doc-file.split.flow.md"),
    "utf8",
  );

  assert.match(skillBody, /resulting local cluster/);
  assert.match(skillBody, /unhealthy flat cluster/);
  assert.match(skillBody, /previous split left one extracted file flat/);
  assert.match(skillBody, /final placement decision/);
  assert.match(skillBody, /\.\.\/_shared\/scripts\/repo-tree\.mjs/);

  assert.match(rulesBody, /resulting local cluster/);
  assert.match(rulesBody, /split creates or extends at least two related files/);
  assert.match(rulesBody, /second split turns them into a cluster/);
  assert.match(rulesBody, /do not leave the extracted cluster mixed flat/);

  assert.match(flowBody, /resulting local directory shape/);
  assert.match(flowBody, /related file cluster/);
  assert.match(flowBody, /second or optional split/);
  assert.match(flowBody, /bundled repo tree output/);
});

test("shared support resources are not packaged as public skills", async () => {
  const skills = await listSkillDirectories(SKILLS_ROOT);
  const skillNames = skills.map((skill) => skill.name);

  assert.equal(skillNames.includes("_shared"), false);
  assert.equal(
    await pathExists(
      path.join(SKILLS_ROOT, "_shared", "references", "local-refactor-rules.md"),
    ),
    true,
  );
  assert.equal(
    await pathExists(path.join(SKILLS_ROOT, "_shared", "references", "reference-audit.md")),
    true,
  );
  assert.equal(
    await pathExists(
      path.join(SKILLS_ROOT, "_shared", "references", "local-readability-review.md"),
    ),
    true,
  );
  assert.equal(
    await pathExists(path.join(SKILLS_ROOT, "_shared", "references", "file-split-rules.md")),
    true,
  );
  assert.equal(
    await pathExists(path.join(SKILLS_ROOT, "_shared", "scripts", "repo-tree.mjs")),
    true,
  );

  const mrWolfBody = await readFile(path.join(SKILLS_ROOT, "cf-mr-wolf", "SKILL.md"), "utf8");
  const cognitiveBody = await readFile(
    path.join(SKILLS_ROOT, "cf-cognitive", "SKILL.md"),
    "utf8",
  );
  const fileSplitBody = await readFile(
    path.join(SKILLS_ROOT, "cf-file-split", "SKILL.md"),
    "utf8",
  );
  const splitExecutionBody = await readFile(
    path.join(SKILLS_ROOT, "cf-start", "references", "split-execution.md"),
    "utf8",
  );
  const consolidationExecutionBody = await readFile(
    path.join(SKILLS_ROOT, "cf-start", "references", "consolidation-execution.md"),
    "utf8",
  );
  const localSimplifyBody = await readFile(
    path.join(SKILLS_ROOT, "cf-start", "references", "local-simplify.md"),
    "utf8",
  );
  const reviewBody = await readFile(
    path.join(SKILLS_ROOT, "cf-start", "references", "review.md"),
    "utf8",
  );
  const verifyBody = await readFile(
    path.join(SKILLS_ROOT, "cf-start", "references", "verify.md"),
    "utf8",
  );

  assert.match(mrWolfBody, /\.\.\/_shared\/scripts\/repo-tree\.mjs/);
  assert.match(cognitiveBody, /\.\.\/_shared\/scripts\/repo-tree\.mjs/);
  assert.match(fileSplitBody, /\.\.\/_shared\/scripts\/repo-tree\.mjs/);
  assert.match(cognitiveBody, /\.\.\/_shared\/references\/local-refactor-rules\.md/);
  assert.match(fileSplitBody, /\.\.\/_shared\/references\/file-split-rules\.md/);
  assert.match(fileSplitBody, /\.\.\/_shared\/references\/reference-audit\.md/);
  assert.match(splitExecutionBody, /\.\.\/\.\.\/_shared\/references\/file-split-rules\.md/);
  assert.match(splitExecutionBody, /\.\.\/\.\.\/_shared\/references\/reference-audit\.md/);
  assert.match(consolidationExecutionBody, /\.\.\/\.\.\/_shared\/references\/reference-audit\.md/);
  assert.match(localSimplifyBody, /\.\.\/\.\.\/_shared\/references\/local-refactor-rules\.md/);
  assert.match(localSimplifyBody, /\.\.\/\.\.\/_shared\/references\/local-readability-review\.md/);
  assert.match(reviewBody, /\.\.\/\.\.\/_shared\/references\/local-readability-review\.md/);
  assert.match(verifyBody, /\.\.\/\.\.\/_shared\/references\/reference-audit\.md/);
});

test("only public entrypoints are packaged as skills", async () => {
  const skills = await listSkillDirectories(SKILLS_ROOT);
  const publicSkillNames = new Set([
    "cf-start",
    "cf-mr-wolf",
    "cf-architecture-map",
    "cf-trace",
    "cf-cognitive",
    "cf-file-split",
  ]);

  for (const skill of skills) {
    assert.equal(
      publicSkillNames.has(skill.name),
      true,
      `${skill.name} should be a public entrypoint`,
    );
  }
});

test("public skill flow docs exist", async () => {
  for (const docPath of [
    path.join(REPO_ROOT, "docs", "start", "doc-start.flow.md"),
    path.join(
      REPO_ROOT,
      "docs",
      "mr-wolf",
      "doc-mr-wolf.flow.md",
    ),
    path.join(REPO_ROOT, "docs", "architecture-map", "doc-architecture.map.flow.md"),
    path.join(REPO_ROOT, "docs", "trace", "doc-trace.flow.md"),
    path.join(REPO_ROOT, "docs", "cognitive", "doc-cognitive.flow.md"),
    path.join(REPO_ROOT, "docs", "file-split", "doc-file.split.flow.md"),
  ]) {
    assert.equal(await pathExists(docPath), true, `${docPath} is missing`);
  }
});

test("cf-start routes upstream problem ambiguity to cf-mr-wolf", async () => {
  const startBody = await readFile(path.join(SKILLS_ROOT, "cf-start", "SKILL.md"), "utf8");
  const routingBody = await readFile(
    path.join(SKILLS_ROOT, "cf-start", "references", "routing.md"),
    "utf8",
  );

  assert.match(startBody, /cf-mr-wolf/);
  assert.match(startBody, /problem, goal, scope, or success criteria/);
  assert.match(routingBody, /cf-mr-wolf-handoff/);
  assert.match(routingBody, /before creating or updating Cflow artifacts/);
});

test("cf-start routes path reconstruction and workflow audit to cf-trace", async () => {
  const startBody = await readFile(path.join(SKILLS_ROOT, "cf-start", "SKILL.md"), "utf8");
  const routingBody = await readFile(
    path.join(SKILLS_ROOT, "cf-start", "references", "routing.md"),
    "utf8",
  );
  const flowBody = await readFile(
    path.join(REPO_ROOT, "docs", "start", "doc-start.flow.md"),
    "utf8",
  );

  assert.match(startBody, /path reconstruction or workflow audit/);
  assert.match(startBody, /cf-trace/);
  assert.match(routingBody, /cf-trace-handoff/);
  assert.match(routingBody, /orchestration flaw/);
  assert.match(flowBody, /routes to `cf-trace` before refactor assessment/);
});

test("cf-mr-wolf fully replaces the old clarification entrypoint", async () => {
  const staleNoun = ["brain", "storming"].join("");
  const staleSkillName = ["problem", staleNoun].join("-");
  const staleFlowName = ["problem", staleNoun].join(".");
  const scannedFiles = await listFiles([
    path.join(REPO_ROOT, "README.md"),
    path.join(REPO_ROOT, "docs"),
    path.join(REPO_ROOT, "skills"),
  ]);

  assert.equal(await pathExists(path.join(SKILLS_ROOT, staleSkillName)), false);
  assert.equal(
    await pathExists(path.join(REPO_ROOT, "docs", staleSkillName)),
    false,
  );

  for (const filePath of scannedFiles) {
    const body = await readFile(filePath, "utf8");
    assert.equal(body.includes(staleSkillName), false, `${filePath} mentions ${staleSkillName}`);
    assert.equal(body.includes(staleFlowName), false, `${filePath} mentions ${staleFlowName}`);
  }
});

test("cf-mr-wolf maintains compact investigation notes under .cflow", async () => {
  const body = await readFile(path.join(SKILLS_ROOT, "cf-mr-wolf", "SKILL.md"), "utf8");
  const flowBody = await readFile(
    path.join(REPO_ROOT, "docs", "mr-wolf", "doc-mr-wolf.flow.md"),
    "utf8",
  );
  const templateBody = await readFile(
    path.join(SKILLS_ROOT, "cf-mr-wolf", "assets", "mr-wolf-notes.template.md"),
    "utf8",
  );

  assert.match(body, /\.cflow\/mr-wolf-notes\.md/);
  assert.match(body, /assets\/mr-wolf-notes\.template\.md/);
  assert.match(body, /Overwrite stale or unrelated notes/);
  assert.match(body, /Do not list every non-candidate file/);
  assert.match(body, /Do not add handoff, next skill, or workflow-decision sections/);
  assert.match(body, /one finding or candidate per bullet/);
  assert.match(body, /list only tools and scripts that produced evidence/);
  assert.match(body, /do not include tools used only to create or update `\.cflow\/mr-wolf-notes\.md`/);
  assert.doesNotMatch(body, /docs\/mr-wolf/);
  assert.doesNotMatch(body, /\.cflow\/mr-wolf-brief\.md/);

  assert.match(flowBody, /\.cflow\/mr-wolf-notes\.md/);
  assert.match(flowBody, /reuse or reset it based on relevance/);
  assert.match(flowBody, /keep notes current but do not write `\.cflow\/architecture\.md` or `\.cflow\/refactor-brief\.md`/);
  assert.doesNotMatch(flowBody, /do not write `\.cflow\/\*` artifacts/);
  assert.match(flowBody, /excluded false positives/);
  assert.match(flowBody, /not exhaustive rejected lists/);
  assert.doesNotMatch(flowBody, /docs\/mr-wolf\/YYYY-MM-DD/);

  assert.match(templateBody, /## Findings/);
  assert.match(templateBody, /confidence:/);
  assert.match(templateBody, /confidence basis/);
  assert.match(templateBody, /evidence channels/);
  assert.match(templateBody, /specialist skills used/);
  assert.match(templateBody, /evidence tools used/);
  assert.match(templateBody, /confirmed candidates/);
  assert.match(templateBody, /candidates to verify/);
  assert.match(templateBody, /excluded false positives/);
  assert.doesNotMatch(templateBody, /## Handoff/);
  assert.doesNotMatch(templateBody, /next skill/);
});

test("cf-mr-wolf uses tools and deterministic temp scripts for evidence gathering", async () => {
  const body = await readFile(path.join(SKILLS_ROOT, "cf-mr-wolf", "SKILL.md"), "utf8");
  const flowBody = await readFile(
    path.join(REPO_ROOT, "docs", "mr-wolf", "doc-mr-wolf.flow.md"),
    "utf8",
  );

  assert.match(body, /MCP resources or tools/);
  assert.match(body, /Operating Loop/);
  assert.match(body, /Evidence Channels/);
  assert.match(body, /Sufficiency Gate/);
  assert.match(body, /Problem-framing pass/);
  assert.match(body, /Bounded analysis pass/);
  assert.match(body, /Scoping questions are part of problem framing/);
  assert.match(body, /Ask exactly one focused scoping question before broad inventory/);
  assert.match(body, /candidate areas, priority, success criteria, constraints, or validation/);
  assert.match(body, /Skip it when the target is already bounded/);
  assert.match(body, /Use specialist skills only after the problem frame or candidate area is bounded/);
  assert.match(body, /currently available skill names and descriptions/);
  assert.match(body, /Record only specialist skills actually used/);
  assert.match(body, /Specialist evidence informs the handoff/);
  assert.match(body, /make `Next step` a short recommendation with a reason/);
  assert.match(body, /naming a specialized available skill when it is the best follow-up/);
  assert.doesNotMatch(body, /direct implementation only when/);
  assert.doesNotMatch(body, /other installed skills when one clearly owns/);
  assert.doesNotMatch(body, /This skill/);
  assert.doesNotMatch(body, /not available`/);
  assert.doesNotMatch(body, /not relevant`/);
  assert.doesNotMatch(body, /sub-agent/);
  assert.match(body, /system commands/);
  assert.match(body, /temporary scripts/);
  assert.match(body, /under `\/tmp`/);
  assert.match(body, /For repo-wide, many-input, or multi-candidate analysis, use deterministic commands or a temporary script/);
  assert.match(body, /When MCP tools are available and the question depends on code structure/);
  assert.match(body, /parse, count, index, diff, group/);
  assert.match(body, /record why/);
  assert.match(body, /notes for used evidence channels, important skipped non-specialist high-value channels, and only specialist skills actually used/);
  assert.match(body, /do not make product, architecture, or prioritization judgments/);

  assert.match(flowBody, /MCP resources/);
  assert.match(flowBody, /problem-framing pass/);
  assert.match(flowBody, /ask one focused scoping question before broad inventory/);
  assert.match(flowBody, /clear goal with broad possible scope/);
  assert.match(flowBody, /unnecessarily large work area/);
  assert.match(flowBody, /bounded analysis pass/);
  assert.match(flowBody, /record only the specialist skills actually used plus why/);
  assert.match(flowBody, /considers clearly matching specialist skills only after the problem frame or candidate area is bounded/);
  assert.match(flowBody, /short recommended next step with a reason/);
  assert.match(flowBody, /completed handoff/);
  assert.match(flowBody, /recommends specialized available skills as next steps/);
  assert.match(flowBody, /used-channel notes, or required skipped-channel reasons/);
  assert.doesNotMatch(flowBody, /sub-agent/);
  assert.match(flowBody, /deterministic `\/tmp` scripts/);
  assert.match(flowBody, /mechanical analysis/);
});

test("cf-mr-wolf requires confidence-gated narrowing before sufficiency", async () => {
  const body = await readFile(path.join(SKILLS_ROOT, "cf-mr-wolf", "SKILL.md"), "utf8");
  const flowBody = await readFile(
    path.join(REPO_ROOT, "docs", "mr-wolf", "doc-mr-wolf.flow.md"),
    "utf8",
  );

  assert.match(body, /Sufficiency Gate/);
  assert.match(body, /assign an investigation confidence percentage/);
  assert.match(body, /broad inventory/);
  assert.match(body, /narrowing pass/);
  assert.match(body, /false-positive check/);
  assert.match(body, /keep confidence below 80% unless the evidence includes/);
  assert.match(body, /notes for used evidence channels, important skipped non-specialist high-value channels, and only specialist skills actually used/);
  assert.match(body, /Use `sufficient` only at 80% confidence or higher/);
  assert.match(body, /Below 80%, continue the operating loop or ask one focused question/);

  assert.match(flowBody, /broad inventory, narrowing pass, and false-positive check/);
  assert.match(flowBody, /investigation confidence percentage/);
  assert.match(flowBody, /at least 80% confidence/);
  assert.match(flowBody, /repo-wide or multi-candidate work stays below 80%/);
  assert.match(flowBody, /used-channel notes, or required skipped-channel reasons/);
});

test("cf-mr-wolf hands cleanup discovery to cf-start before execution skills", async () => {
  const body = await readFile(path.join(SKILLS_ROOT, "cf-mr-wolf", "SKILL.md"), "utf8");
  const flowBody = await readFile(
    path.join(REPO_ROOT, "docs", "mr-wolf", "doc-mr-wolf.flow.md"),
    "utf8",
  );

  assert.match(body, /Cflow Handoff Boundary/);
  assert.match(body, /do not jump directly into execution skills/);
  assert.match(body, /cf-file-split/);
  assert.match(body, /cf-cognitive/);
  assert.match(body, /preserve the discovery in `\.cflow\/refactor-brief\.md`/);
  assert.match(body, /cf-start` owns that brief/);
  assert.match(body, /cf-start` should read `\.cflow\/mr-wolf-notes\.md` as discovery input/);
  assert.match(body, /not an execution plan or refactor backlog/);

  assert.match(flowBody, /recommend `cf-start`/);
  assert.match(flowBody, /do not route straight to `cf-file-split` or `cf-cognitive`/);
  assert.match(flowBody, /do not create that brief directly from `cf-mr-wolf`/);
});

async function listFiles(pathsToScan) {
  const files = [];

  for (const pathname of pathsToScan) {
    const entries = await readdir(pathname, { withFileTypes: true }).catch((error) => {
      if (error?.code === "ENOTDIR") {
        return null;
      }
      throw error;
    });

    if (entries === null) {
      files.push(pathname);
      continue;
    }

    for (const entry of entries) {
      const entryPath = path.join(pathname, entry.name);
      if (entry.isDirectory()) {
        files.push(...(await listFiles([entryPath])));
      } else if (entry.isFile()) {
        files.push(entryPath);
      }
    }
  }

  return files;
}
