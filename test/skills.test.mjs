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

test("cf-architecture requires read-only clean-context reconnaissance", async () => {
  const body = await readFile(
    path.join(SKILLS_ROOT, "cf-architecture", "SKILL.md"),
    "utf8",
  );
  const flowBody = await readFile(
    path.join(REPO_ROOT, "docs", "architecture", "doc-architecture.flow.md"),
    "utf8",
  );

  assert.match(body, /Clean-Context Reconnaissance/);
  assert.match(body, /use the `cflow_architecture_recon` custom agent when available/);
  assert.match(body, /use one equivalent clean-context reconnaissance subagent/);
  assert.match(body, /requires explicit subagent authorization/);
  assert.match(body, /must not trigger controller-side architecture mapping/);
  assert.match(body, /Start the custom agent with only the repository path and the current mapping request/);
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

test("cf-architecture ships a low-cost read-only Codex custom agent", async () => {
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
  assert.match(body, /<repo>\/\.codex\/skills\/_shared\/scripts\/repo-tree\.mjs/);
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
  assert.match(body, /requires explicit subagent authorization/);
  assert.match(body, /must not trigger controller-side reconstruction/);
  assert.match(body, /preflight is complete; ask for authorization and stop/);
  assert.match(body, /Do not continue with local-only trace reconstruction/);
  assert.match(body, /Read `\.cflow\/architecture\.md` if it exists/);
  assert.match(body, /route to `cf-architecture` before continuing/);
  assert.match(body, /Start the custom agent with only the repository path and the current trace request/);
  assert.match(body, /Do not paste the custom agent's TOML instructions or full report format/);
  assert.match(body, /Use `assets\/trace\.template\.md` as the review rubric/);
  assert.match(body, /The subagent produces reconstruction only/);
  assert.match(body, /Every reconstructed step must be marked as observed or inferred/);
  assert.match(body, /sequence correctness/);
  assert.match(body, /state and resume/);
  assert.match(body, /instruction ambiguity/);
  assert.match(body, /Recommend exactly one immediate route/);
  assert.match(body, /do not create or refresh `\.cflow\/architecture\.md` or `\.cflow\/refactor-brief\.md`/);
  assert.doesNotMatch(body, /gitignore/i);

  assert.match(templateBody, /## Reconstruction/);
  assert.match(templateBody, /status: observed \| inferred/);
  assert.match(templateBody, /## Audit findings/);
  assert.match(templateBody, /## Lens coverage/);
  assert.match(templateBody, /## Recommended route/);
  assert.match(templateBody, /cf-mr-wolf \| cf-architecture \| cf-start \| cf-cognitive \| cf-split \| cf-cohesion \| direct fix \| none/);

  assert.match(flowBody, /Custom agent source: `skills\/_codex_agents\/cflow_trace_recon\.toml`/);
  assert.match(flowBody, /The custom agent must reconstruct the path only/);
  assert.match(flowBody, /Blocked subagent authorization must stop the flow/);
  assert.match(flowBody, /must not fall back to local-only source scanning, trace updates, or audit/);
  assert.match(flowBody, /preflight reads only existing `\.cflow\/architecture\.md`/);
  assert.match(flowBody, /routes to `cf-architecture` before continuing/);
  assert.match(flowBody, /reads `\.cflow\/architecture\.md` first when present/);
  assert.match(flowBody, /The controller must not duplicate the path scan/);
  assert.match(flowBody, /`\.cflow\/trace\.md` must distinguish observed from inferred steps/);
  assert.match(flowBody, /Every applicable audit lens must be covered/);
  assert.match(flowBody, /uses bundled repo tree output when available/);
  assert.doesNotMatch(flowBody, /gitignore/i);
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
  assert.match(body, /<repo>\/\.codex\/skills\/_shared\/scripts\/repo-tree\.mjs/);
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

test("cf-mr-wolf ships a high-judgment read-only issue discovery agent", async () => {
  const body = await readFile(
    path.join(SKILLS_ROOT, "_codex_agents", "cflow_candidate_finding_recon.toml"),
    "utf8",
  );

  assert.match(body, /^name = "cflow_candidate_finding_recon"$/m);
  assert.match(body, /^description = "Read-only Cflow candidate finding discovery from bounded evidence and a selected context slice\."$/m);
  assert.match(body, /^model = "gpt-5\.5"$/m);
  assert.match(body, /^model_reasoning_effort = "medium"$/m);
  assert.match(body, /^sandbox_mode = "read-only"$/m);
  assert.match(body, /^nickname_candidates = \["Vincent"\]$/m);
  assert.match(body, /candidate-finding discovery mode/);
  assert.match(body, /Do not edit files, create \.cflow\/\*/);
  assert.match(body, /Do not .*implement fixes/);
  assert.match(body, /verify final false-positive status/);
  assert.match(body, /Use available MCP tools or resources/);
  assert.match(body, /MCP structure queries/);
  assert.match(body, /Do not cap findings at three/);
  assert.match(body, /Report every materially relevant candidate finding/);
  assert.match(body, /Group equivalent findings together/);
  assert.match(body, /## Discovery Scope/);
  assert.match(body, /## Candidate Findings/);
  assert.match(body, /Supporting evidence:/);
  assert.match(body, /Affected area\/path:/);
  assert.doesNotMatch(body, /Flow evidence:/);
  assert.doesNotMatch(body, /Affected path:/);
  assert.match(body, /Needs de-risk: yes \| no/);
  assert.match(body, /## Grouped Or Deferred Observations/);
  assert.match(body, /## Evidence/);
  assert.match(body, /## Unknowns/);
});

test("cf-mr-wolf ships a high-judgment read-only finding de-risk agent", async () => {
  const body = await readFile(
    path.join(SKILLS_ROOT, "_codex_agents", "cflow_finding_derisk_recon.toml"),
    "utf8",
  );

  assert.match(body, /^name = "cflow_finding_derisk_recon"$/m);
  assert.match(body, /^model = "gpt-5\.5"$/m);
  assert.match(body, /^model_reasoning_effort = "medium"$/m);
  assert.match(body, /^sandbox_mode = "read-only"$/m);
  assert.match(body, /^nickname_candidates = \["Jules"\]$/m);
  assert.match(body, /Verify only the candidate findings provided by the controller/);
  assert.doesNotMatch(body, /skills\/cf-mr-wolf\/references\/finding-de-risk\.md/);
  assert.match(body, /Do not edit files, create \.cflow\/\*/);
  assert.match(body, /Do not .*implement fixes/);
  assert.match(body, /Do not propose unrelated refactors or new findings/);
  assert.match(body, /Use available MCP tools or resources/);
  assert.match(body, /MCP structure queries/);
  assert.match(body, /Reject false positives and unsafe fixes/);
  assert.match(body, /whether the issue is reachable in the current behavior, path, or context/);
  assert.match(body, /already handled, impossible, intentional, test-only, out of scope/);
  assert.match(body, /ordering, invariants, ownership, API shape, persistence, resume behavior/);
  assert.match(body, /Do not mark a finding `confirmed` only because code looks suspicious/);
  assert.match(body, /Treat missing evidence as uncertainty, not confirmation/);
  assert.match(body, /## Verification Scope/);
  assert.match(body, /## Finding Classification/);
  assert.match(body, /Status: confirmed \| false-positive \| uncertain/);
  assert.match(body, /## Fix-Fit Risks/);
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
  assert.match(body, /## How to Use/);
  assert.match(body, /file type, runtime role, and public or installable surface/);
  assert.match(body, /evaluate the full change against all of them/);
  assert.match(body, /do not stop at the first matching issue/);
  assert.match(body, /For runtime guidance/);
  assert.match(body, /For non-runtime files/);
  assert.match(body, /## Runtime Placement/);
  assert.match(body, /## Runtime Skill Text/);
  assert.match(body, /## Pack Surface Boundaries/);
  assert.match(body, /## File-Type Checklist/);
  assert.match(body, /Use this checklist additively/);
  assert.match(body, /multiple roles/);
  assert.match(body, /frontmatter `description` as discovery metadata/);
  assert.match(body, /trigger phrases/);
  assert.match(body, /artifact names unless they are invocation signals/);
  assert.match(body, /empty context/);
  assert.match(body, /every sentence must be necessary runtime guidance/);
  assert.match(body, /do not refer to the current skill by its own skill name/);
  assert.match(body, /state, scope, artifact, or phase terms/);
  assert.match(body, /progressive disclosure/);
  assert.match(body, /for all runtime guidance/);
  assert.match(body, /smallest linked resource/);
  assert.match(body, /no historical migration notes/);
  assert.match(body, /maintainer-only labels/);
  assert.match(body, /decorative wording/);
  assert.match(body, /current request/);
  assert.match(body, /literal user or another skill/);
  assert.match(body, /user-level authorization gates/);
  assert.match(body, /`references\/\*\.md`: operational rules for an already-selected path/);
  assert.match(body, /`docs\/\*\.md`: maintainer-only explanation/);
  assert.match(body, /tests: guard contracts and package behavior/);
});

test("composable skill entry modes use the current request", async () => {
  const cognitiveBody = await readFile(
    path.join(SKILLS_ROOT, "cf-cognitive", "SKILL.md"),
    "utf8",
  );
  const cohesionBody = await readFile(path.join(SKILLS_ROOT, "cf-cohesion", "SKILL.md"), "utf8");

  assert.match(cognitiveBody, /current request asks to review/);
  assert.match(cognitiveBody, /current request explicitly asks to refactor/);
  assert.match(cohesionBody, /current request does not explicitly ask to move files/);
  assert.match(cohesionBody, /current request explicitly asks to regroup/);
});

test("cf-cognitive treats nested main-path stacks as local pressure", async () => {
  const skillBody = await readFile(path.join(SKILLS_ROOT, "cf-cognitive", "SKILL.md"), "utf8");
  const targetedBody = await readFile(
    path.join(SKILLS_ROOT, "cf-cognitive", "references", "targeted-evaluation.md"),
    "utf8",
  );
  const executionBody = await readFile(
    path.join(SKILLS_ROOT, "cf-cognitive", "references", "execution.md"),
    "utf8",
  );
  const flowBody = await readFile(
    path.join(REPO_ROOT, "docs", "cognitive", "doc-cognitive.flow.md"),
    "utf8",
  );

  assert.match(skillBody, /deepest main-path stack/);
  assert.match(skillBody, /Do not downrank this only because behavior is correct/);
  assert.match(targetedBody, /Use `recommended`, not `optional`/);
  assert.match(targetedBody, /guard or branch -> runner\/callback -> try\/catch -> result branching/);
  assert.match(executionBody, /Flatten the target function's main path first/);
  assert.match(executionBody, /result-to-toast\/error branching/);
  assert.match(flowBody, /guard\/runner\/callback\/try\/result branching stacks/);
});

test("cf-start phase references preserve internal-skill guardrails", async () => {
  const startBody = await readFile(path.join(SKILLS_ROOT, "cf-start", "SKILL.md"), "utf8");
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
  assert.match(startBody, /Do not implement while a material decision is open/);
  assert.match(startBody, /missing framing answer/);
  assert.match(startBody, /checked evidence source/);
  assert.doesNotMatch(startBody, /references\/alignment\.md/);
  assert.equal(
    await pathExists(path.join(SKILLS_ROOT, "cf-start", "references", "alignment.md")),
    false,
  );
});

test("cf-split requires post-split placement review for related clusters", async () => {
  const skillBody = await readFile(path.join(SKILLS_ROOT, "cf-split", "SKILL.md"), "utf8");
  const evaluationBody = await readFile(
    path.join(SKILLS_ROOT, "cf-split", "references", "evaluation.md"),
    "utf8",
  );
  const executionBody = await readFile(
    path.join(SKILLS_ROOT, "cf-split", "references", "execution.md"),
    "utf8",
  );
  const rulesBody = await readFile(
    path.join(SKILLS_ROOT, "_shared", "references", "file-split-rules.md"),
    "utf8",
  );
  const flowBody = await readFile(
    path.join(REPO_ROOT, "docs", "split", "doc-split.flow.md"),
    "utf8",
  );

  assert.match(skillBody, /references\/evaluation\.md/);
  assert.match(skillBody, /references\/execution\.md/);
  assert.match(skillBody, /final placement decision/);

  assert.match(evaluationBody, /Evaluate only\. Do not edit files\./);
  assert.match(evaluationBody, /\.\.\/\.\.\/_shared\/scripts\/repo-tree\.mjs/);
  assert.match(evaluationBody, /\.\.\/\.\.\/_shared\/references\/file-split-rules\.md/);
  assert.match(executionBody, /resulting local cluster/);
  assert.match(executionBody, /unhealthy flat cluster/);
  assert.match(executionBody, /previous split left one extracted file flat/);
  assert.match(executionBody, /\.\.\/\.\.\/_shared\/scripts\/repo-tree\.mjs/);
  assert.match(executionBody, /\.\.\/\.\.\/_shared\/references\/file-split-rules\.md/);
  assert.match(executionBody, /\.\.\/\.\.\/_shared\/references\/reference-audit\.md/);

  assert.match(rulesBody, /resulting local cluster/);
  assert.match(rulesBody, /split creates or extends at least two related files/);
  assert.match(rulesBody, /second split turns them into a cluster/);
  assert.match(rulesBody, /do not leave the extracted cluster mixed flat/);

  assert.match(flowBody, /resulting local directory shape/);
  assert.match(flowBody, /related file cluster/);
  assert.match(flowBody, /second or optional split/);
  assert.match(flowBody, /references\/evaluation\.md/);
  assert.match(flowBody, /references\/execution\.md/);
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
  const mrWolfEvidenceBody = await readFile(
    path.join(SKILLS_ROOT, "cf-mr-wolf", "references", "evidence.md"),
    "utf8",
  );
  const cognitiveBody = await readFile(
    path.join(SKILLS_ROOT, "cf-cognitive", "SKILL.md"),
    "utf8",
  );
  const cognitiveDiscoveryBody = await readFile(
    path.join(SKILLS_ROOT, "cf-cognitive", "references", "discovery.md"),
    "utf8",
  );
  const cognitiveTargetedBody = await readFile(
    path.join(SKILLS_ROOT, "cf-cognitive", "references", "targeted-evaluation.md"),
    "utf8",
  );
  const cognitiveExecutionBody = await readFile(
    path.join(SKILLS_ROOT, "cf-cognitive", "references", "execution.md"),
    "utf8",
  );
  const fileSplitBody = await readFile(
    path.join(SKILLS_ROOT, "cf-split", "SKILL.md"),
    "utf8",
  );
  const fileSplitEvaluationBody = await readFile(
    path.join(SKILLS_ROOT, "cf-split", "references", "evaluation.md"),
    "utf8",
  );
  const fileSplitExecutionBody = await readFile(
    path.join(SKILLS_ROOT, "cf-split", "references", "execution.md"),
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
  const localRefactorRulesBody = await readFile(
    path.join(SKILLS_ROOT, "_shared", "references", "local-refactor-rules.md"),
    "utf8",
  );

  assert.match(mrWolfBody, /references\/evidence\.md/);
  assert.match(mrWolfEvidenceBody, /\.\.\/\.\.\/_shared\/scripts\/repo-tree\.mjs/);
  assert.match(cognitiveBody, /references\/discovery\.md/);
  assert.match(cognitiveDiscoveryBody, /\.\.\/\.\.\/_shared\/scripts\/repo-tree\.mjs/);
  assert.match(fileSplitEvaluationBody, /\.\.\/\.\.\/_shared\/scripts\/repo-tree\.mjs/);
  assert.match(fileSplitExecutionBody, /\.\.\/\.\.\/_shared\/scripts\/repo-tree\.mjs/);
  assert.match(cognitiveBody, /references\/targeted-evaluation\.md/);
  assert.match(cognitiveTargetedBody, /Evaluate only\. Do not edit files\./);
  assert.match(cognitiveBody, /references\/execution\.md/);
  assert.match(cognitiveExecutionBody, /\.\.\/\.\.\/_shared\/references\/local-refactor-rules\.md/);
  assert.match(cognitiveExecutionBody, /registration\/lifecycle APIs/);
  assert.match(cognitiveTargetedBody, /do not classify the target as `keep as-is` only because it is not split-worthy/);
  assert.match(cognitiveTargetedBody, /same-file named handler or shallow local helper/);
  assert.match(localRefactorRulesBody, /wiring blocks that mix setup\/teardown/);
  assert.match(localRefactorRulesBody, /keep setup, teardown, cancellation, and ordering visible at the call site/);
  assert.match(localRefactorRulesBody, /Extract inline callback behavior into named file-local handlers/);
  assert.match(localRefactorRulesBody, /without hiding ordering-sensitive side effects/);
  assert.match(fileSplitBody, /references\/evaluation\.md/);
  assert.match(fileSplitBody, /references\/execution\.md/);
  assert.match(fileSplitEvaluationBody, /\.\.\/\.\.\/_shared\/references\/file-split-rules\.md/);
  assert.match(fileSplitExecutionBody, /\.\.\/\.\.\/_shared\/references\/file-split-rules\.md/);
  assert.match(fileSplitExecutionBody, /\.\.\/\.\.\/_shared\/references\/reference-audit\.md/);
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
    "cf-architecture",
    "cf-trace",
    "cf-cognitive",
    "cf-split",
    "cf-cohesion",
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
    path.join(REPO_ROOT, "docs", "architecture", "doc-architecture.flow.md"),
    path.join(REPO_ROOT, "docs", "trace", "doc-trace.flow.md"),
    path.join(REPO_ROOT, "docs", "cognitive", "doc-cognitive.flow.md"),
    path.join(REPO_ROOT, "docs", "split", "doc-split.flow.md"),
    path.join(REPO_ROOT, "docs", "cohesion", "doc-cohesion.flow.md"),
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

test("cf-mr-wolf description stays discovery metadata", async () => {
  const body = await readFile(path.join(SKILLS_ROOT, "cf-mr-wolf", "SKILL.md"), "utf8");
  const description = body.match(/^description:\s*(.+)$/m)?.[1] ?? "";

  assert.match(description, /Clarify ambiguous problem framing/);
  assert.match(description, /success criteria/);
  assert.match(description, /refactor intent/);
  assert.match(description, /implementation direction/);
  assert.match(description, /skip when the requested edit or bug fix is already clear and bounded/);
  assert.doesNotMatch(description, /If invoked|first ask|Do not use|Z-|\.cflow/);
});

test("cf-mr-wolf maintains compact investigation notes under .cflow", async () => {
  const body = await readFile(path.join(SKILLS_ROOT, "cf-mr-wolf", "SKILL.md"), "utf8");
  const framingBody = await readFile(
    path.join(SKILLS_ROOT, "cf-mr-wolf", "references", "framing.md"),
    "utf8",
  );
  const flowBody = await readFile(
    path.join(REPO_ROOT, "docs", "mr-wolf", "doc-mr-wolf.flow.md"),
    "utf8",
  );
  const templateBody = await readFile(
    path.join(SKILLS_ROOT, "cf-mr-wolf", "assets", "mr-wolf-notes.template.md"),
    "utf8",
  );

  assert.match(body, /\.cflow\/mr-wolf-notes\.md/);
  assert.match(body, /## Runtime Artifacts/);
  assert.ok(
    body.indexOf("## Runtime Artifacts") < body.indexOf("## Runtime Flow"),
    "Runtime Artifacts should appear before the runtime graph",
  );
  assert.ok(
    body.indexOf("## Entry Behavior") < body.indexOf("## Runtime Flow"),
    "Entry Behavior should appear before the runtime graph",
  );
  assert.match(body, /Use artifacts as routing state, not aliases/);
  assert.match(body, /`\.cflow\/mr-wolf-notes\.md`: owned here/);
  assert.match(body, /before repository inspection, load \[references\/framing\.md\]/);
  assert.match(body, /read existing notes if present or create them from `assets\/mr-wolf-notes\.template\.md`/);
  assert.match(body, /match the current request and repository state before reusing, updating, or resetting/);
  assert.match(body, /`\.cflow\/architecture\.md`: available input only/);
  assert.match(body, /never create or update it here/);
  assert.match(body, /`\.cflow\/refactor-brief\.md`: owned by `cf-start`, not this skill/);
  assert.doesNotMatch(body, /## Artifacts Aliases/);
  assert.doesNotMatch(body, /Z-notes|Z-brief/);
  assert.doesNotMatch(body, /Create `?\.cflow\//);
  assert.match(body, /references\/framing\.md/);
  assert.match(framingBody, /assets\/mr-wolf-notes\.template\.md/);
  assert.match(framingBody, /Overwrite stale or unrelated notes/);
  assert.match(framingBody, /Do not list every non-candidate file/);
  assert.match(framingBody, /Do not add handoff, next skill, or workflow-decision sections/);
  assert.match(framingBody, /one finding or candidate per bullet/);
  assert.match(framingBody, /list only tools and scripts that produced evidence/);
  assert.match(framingBody, /do not include tools used only to create or update `\.cflow\/mr-wolf-notes\.md`/);
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

test("cf-mr-wolf centralizes route selection in a DOT priority contract", async () => {
  const body = await readFile(path.join(SKILLS_ROOT, "cf-mr-wolf", "SKILL.md"), "utf8");
  const flowBody = await readFile(
    path.join(REPO_ROOT, "docs", "mr-wolf", "doc-mr-wolf.flow.md"),
    "utf8",
  );

  assert.match(body, /## Runtime Flow/);
  assert.match(body, /```dot\s+digraph mr_wolf_runtime/);
  assert.match(body, /DOT is first-match routing/);
  assert.match(body, /## Reference Map/);
  assert.match(body, /Read a reference only when its DOT nodes are reached/);
  assert.match(body, /references\/framing\.md/);
  assert.match(body, /references\/evidence\.md/);
  assert.match(body, /references\/agents\.md/);
  assert.match(body, /references\/outcomes\.md/);
  assert.match(body, /## Decision Priority/);
  assert.match(body, /DOT owns pre-outcome gates/);
  assert.match(body, /Only enter `choose_outcome` after `sufficiency >=80`/);
  assert.match(body, /Choose the first matching route/);
  assert.match(body, /`cflow_handoff`: cleanup\/refactor candidates/);
  assert.match(body, /`trace_recommendation`: unclear path, ordering, state, or workflow flaw/);
  assert.match(body, /Base the route on current request, evidence, confidence, and artifact state/);

  assert.match(flowBody, /## Runtime Diagram/);
  assert.match(flowBody, /first-match routing contract/);
  assert.match(flowBody, /digraph mr_wolf_runtime/);
  assert.match(flowBody, /## Outcome Priority/);
  assert.match(flowBody, /choose exactly one outcome route/);
});

test("cf-mr-wolf uses tools and deterministic temp scripts for evidence gathering", async () => {
  const body = await readFile(path.join(SKILLS_ROOT, "cf-mr-wolf", "SKILL.md"), "utf8");
  const framingBody = await readFile(
    path.join(SKILLS_ROOT, "cf-mr-wolf", "references", "framing.md"),
    "utf8",
  );
  const evidenceBody = await readFile(
    path.join(SKILLS_ROOT, "cf-mr-wolf", "references", "evidence.md"),
    "utf8",
  );
  const outcomesBody = await readFile(
    path.join(SKILLS_ROOT, "cf-mr-wolf", "references", "outcomes.md"),
    "utf8",
  );
  const flowBody = await readFile(
    path.join(REPO_ROOT, "docs", "mr-wolf", "doc-mr-wolf.flow.md"),
    "utf8",
  );

  assert.match(evidenceBody, /MCP resources or tools/);
  assert.match(framingBody, /Operating Loop/);
  assert.match(evidenceBody, /Evidence Channels/);
  assert.match(evidenceBody, /Sufficiency Gate/);
  assert.match(framingBody, /Problem-framing pass/);
  assert.match(framingBody, /Bounded analysis pass/);
  assert.match(framingBody, /Scoping questions are part of problem framing/);
  assert.match(framingBody, /Ask exactly one focused scoping question before broad inventory/);
  assert.match(framingBody, /candidate areas, priority, success criteria, constraints, or validation/);
  assert.match(framingBody, /Skip it when the target is already bounded/);
  assert.match(evidenceBody, /After the frame or candidate area is bounded/);
  assert.match(evidenceBody, /check available skill names\/descriptions/);
  assert.match(evidenceBody, /use it as a bounded review lens over the selected slice/);
  assert.match(evidenceBody, /record only the specialist skills actually used plus why/);
  assert.match(outcomesBody, /make `Next step` a short recommendation with a reason/);
  assert.match(outcomesBody, /name a specialized available skill when it clearly owns the best follow-up/);
  assert.doesNotMatch(body, /direct implementation only when/);
  assert.doesNotMatch(body, /other installed skills when one clearly owns/);
  assert.doesNotMatch(body, /This skill/);
  assert.doesNotMatch(body, /not available`/);
  assert.doesNotMatch(body, /not relevant`/);
  assert.doesNotMatch(body, /sub-agent/);
  assert.match(evidenceBody, /system commands/);
  assert.match(evidenceBody, /temporary `\/tmp` scripts/);
  assert.match(evidenceBody, /For repo-wide, many-input, or multi-candidate analysis, use deterministic commands or a temporary script/);
  assert.match(evidenceBody, /When MCP tools are available and the question depends on code structure/);
  assert.match(evidenceBody, /record why/);
  assert.match(evidenceBody, /notes for used evidence channels, important skipped non-specialist high-value channels, and only specialist skills actually used/);

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
  const evidenceBody = await readFile(
    path.join(SKILLS_ROOT, "cf-mr-wolf", "references", "evidence.md"),
    "utf8",
  );
  const flowBody = await readFile(
    path.join(REPO_ROOT, "docs", "mr-wolf", "doc-mr-wolf.flow.md"),
    "utf8",
  );

  assert.match(evidenceBody, /Sufficiency Gate/);
  assert.match(evidenceBody, /broad inventory/);
  assert.match(evidenceBody, /narrowing pass/);
  assert.match(evidenceBody, /finding de-risk checks for candidate findings/);
  assert.match(evidenceBody, /keep confidence below 80% unless the evidence includes/);
  assert.match(evidenceBody, /notes for used evidence channels, important skipped non-specialist high-value channels, and only specialist skills actually used/);
  assert.match(evidenceBody, /Use `sufficient` only at 80% confidence or higher/);
  assert.match(evidenceBody, /Below 80%, continue the operating loop or ask one focused question/);

  assert.match(flowBody, /broad inventory, narrowing pass, candidate discovery, and finding de-risk checks/);
  assert.match(flowBody, /investigation confidence percentage/);
  assert.match(flowBody, /at least 80% confidence/);
  assert.match(flowBody, /repo-wide or multi-candidate work stays below 80%/);
  assert.match(flowBody, /used-channel notes, or required skipped-channel reasons/);
});

test("cf-mr-wolf de-risks findings before recommending fixes", async () => {
  const body = await readFile(path.join(SKILLS_ROOT, "cf-mr-wolf", "SKILL.md"), "utf8");
  const framingBody = await readFile(
    path.join(SKILLS_ROOT, "cf-mr-wolf", "references", "framing.md"),
    "utf8",
  );
  const agentsBody = await readFile(
    path.join(SKILLS_ROOT, "cf-mr-wolf", "references", "agents.md"),
    "utf8",
  );
  const outcomesBody = await readFile(
    path.join(SKILLS_ROOT, "cf-mr-wolf", "references", "outcomes.md"),
    "utf8",
  );
  const agentBody = await readFile(
    path.join(SKILLS_ROOT, "_codex_agents", "cflow_finding_derisk_recon.toml"),
    "utf8",
  );
  const flowBody = await readFile(
    path.join(REPO_ROOT, "docs", "mr-wolf", "doc-mr-wolf.flow.md"),
    "utf8",
  );
  const deRiskReferencePath = path.join(
    SKILLS_ROOT,
    "cf-mr-wolf",
    "references",
    "finding-de-risk.md",
  );

  assert.equal(await pathExists(deRiskReferencePath), false);
  assert.doesNotMatch(body, /references\/finding-de-risk\.md/);
  assert.match(body, /references\/agents\.md/);
  assert.match(agentsBody, /cflow_candidate_finding_recon/);
  assert.match(agentsBody, /cflow_finding_derisk_recon/);
  assert.match(agentsBody, /Agent Use/);
  assert.match(agentsBody, /Run at most one custom agent at a time/);
  assert.match(agentsBody, /wait for its report before starting another/);
  assert.match(agentsBody, /Start each custom agent with only the inputs named in the owning section; do not paste the agent TOML/);
  assert.match(agentsBody, /While waiting, do not duplicate the delegated discovery or verification/);
  assert.doesNotMatch(agentsBody, /Do not build a duplicate candidate discovery or finding verification while the agent is running/);
  assert.match(agentsBody, /Use each report as primary evidence/);
  assert.match(agentsBody, /spot-check only gaps, contradictions, or unsupported claims/);
  assert.match(agentsBody, /final judgment, notes, routing, and user-facing output remain yours/);
  assert.match(agentsBody, /Candidate Finding Agent/);
  assert.match(agentsBody, /When bounded evidence plus the selected context slice is context-heavy, use the `cflow_candidate_finding_recon` custom agent to propose candidate findings/);
  assert.match(agentsBody, /Start it with only the repository path, problem frame, success criteria, non-goals, bounded evidence path\/summary, selected context slice, and explicit exclusions/);
  assert.match(agentsBody, /Finding De-risk Agent/);
  assert.match(agentsBody, /Use the `cflow_finding_derisk_recon` custom agent to verify selected candidate findings/);
  assert.match(agentsBody, /Start it with only the repository path, problem frame, assigned candidate findings, selected context slice, and explicit exclusions/);
  assert.match(agentsBody, /Do not cap candidate findings at three/);
  assert.match(agentsBody, /smallest decision-blocking subset first/);
  assert.doesNotMatch(agentsBody, /Do not paste the custom agent's TOML instructions or full report format/);
  assert.match(framingBody, /de-risk the findings before declaring them actionable/);
  assert.match(outcomesBody, /separate confirmed, false-positive, and uncertain findings/);
  assert.doesNotMatch(body, /Clean-Context/);
  assert.doesNotMatch(body, /GPT-5\.5 medium-reasoning/);
  assert.doesNotMatch(body, /at most two/);

  assert.match(flowBody, /cflow_candidate_finding_recon/);
  assert.match(flowBody, /bounded evidence plus the selected context slice is context-heavy/);
  assert.match(flowBody, /cflow_finding_derisk_recon/);
  assert.match(flowBody, /Do not cap candidate findings at three/);
  assert.match(flowBody, /Run custom agents sequentially only/);
  assert.match(flowBody, /never run multiple custom agents at the same time/);
  assert.match(flowBody, /merge any sequential reports before sufficiency/);
  assert.doesNotMatch(flowBody, /Finding de-risk reference/);
  assert.doesNotMatch(flowBody, /at most two/);
  assert.match(flowBody, /classify each finding as confirmed, false-positive, or uncertain/);
  assert.match(flowBody, /does not recommend fixes for candidate findings until reachability, false positives, and fix-fit/);

  assert.match(agentBody, /Reject false positives and unsafe fixes/);
  assert.match(agentBody, /whether the issue is reachable in the current behavior, path, or context/);
  assert.match(agentBody, /fix-fit/);
  assert.match(agentBody, /ordering, invariants, ownership, API shape, persistence, resume behavior/);
  assert.match(agentBody, /Do not mark a finding `confirmed` only because code looks suspicious/);
});

test("cf-mr-wolf hands cleanup discovery to cf-start before execution skills", async () => {
  const body = await readFile(path.join(SKILLS_ROOT, "cf-mr-wolf", "SKILL.md"), "utf8");
  const outcomesBody = await readFile(
    path.join(SKILLS_ROOT, "cf-mr-wolf", "references", "outcomes.md"),
    "utf8",
  );
  const flowBody = await readFile(
    path.join(REPO_ROOT, "docs", "mr-wolf", "doc-mr-wolf.flow.md"),
    "utf8",
  );

  assert.match(outcomesBody, /Cflow Handoff Boundary/);
  assert.match(outcomesBody, /do not jump directly into execution skills/);
  assert.match(outcomesBody, /cf-split/);
  assert.match(outcomesBody, /cf-cognitive/);
  assert.match(outcomesBody, /cf-cohesion/);
  assert.match(outcomesBody, /preserve the discovery in `\.cflow\/refactor-brief\.md`/);
  assert.match(outcomesBody, /cf-start` owns that brief/);
  assert.match(outcomesBody, /cf-start` should read `\.cflow\/mr-wolf-notes\.md` as discovery input/);
  assert.match(outcomesBody, /When a follow-up skill owns required reconnaissance, artifact writes, or execution/);
  assert.match(outcomesBody, /hand off instead of doing that work here/);
  assert.match(outcomesBody, /if the current request continues into that skill and it needs subagent authorization, ask first/);

  assert.match(flowBody, /recommend `cf-start`/);
  assert.match(flowBody, /do not route straight to `cf-split`, `cf-cognitive`, or `cf-cohesion`/);
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
