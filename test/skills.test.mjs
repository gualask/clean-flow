import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { readFile } from "node:fs/promises";
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

test("shared support references are not packaged as public skills", async () => {
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
    "cf-architecture-map",
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
