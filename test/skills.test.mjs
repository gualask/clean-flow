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
  assert.match(body, /use one clean-context reconnaissance subagent/);
  assert.match(body, /must not:\n\n- edit files\n- create `\.cflow\/\*`\n- update `\.gitignore`/);
  assert.match(body, /Treat the subagent report as the primary repository scan/);
  assert.match(body, /Do not repeat full reconnaissance/);
  assert.match(body, /You still own artifact writes, `\.gitignore`, final interpretation/);
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
