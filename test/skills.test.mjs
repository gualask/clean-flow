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

test("public entrypoints keep bootstrap and routing ownership split", async () => {
  const startBody = await readFile(path.join(SKILLS_ROOT, "cf-start", "SKILL.md"), "utf8");
  const architectureMapBody = await readFile(
    path.join(SKILLS_ROOT, "cf-architecture-map", "SKILL.md"),
    "utf8",
  );

  assert.match(
    startBody,
    /`cf-architecture-map` is also a supported public entrypoint/,
  );
  assert.match(
    startBody,
    /Do not create or refresh `\.cflow\/architecture\.md` directly in this skill\./,
  );
  assert.match(
    startBody,
    /Use `cf-architecture-map` when the architecture map is missing or stale\./,
  );

  assert.match(
    architectureMapBody,
    /This is a supported public entrypoint for repository mapping\./,
  );
  assert.match(architectureMapBody, /Create or refresh `\.cflow\/architecture\.md` only\./);
  assert.match(
    architectureMapBody,
    /never create or refresh `\.cflow\/refactor-brief\.md` in this skill/,
  );
});

test("cf-cognitive stays standalone and local", async () => {
  const cognitiveBody = await readFile(
    path.join(SKILLS_ROOT, "cf-cognitive", "SKILL.md"),
    "utf8",
  );

  assert.match(
    cognitiveBody,
    /This is a supported public entrypoint for local file-level cognitive complexity refactors\./,
  );
  assert.match(cognitiveBody, /If no file is provided, discover candidate files/);
  assert.match(cognitiveBody, /propose up to three justified targets/);
  assert.match(cognitiveBody, /remaining shortlisted candidates/);
  assert.match(cognitiveBody, /After three files, stop/);
  assert.match(cognitiveBody, /\*\*Behavior preservation\*\*/);
  assert.match(cognitiveBody, /Do not bootstrap or require `\.cflow\/` artifacts\./);
  assert.match(
    cognitiveBody,
    /route to `cf-start` instead/,
  );
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

  const cognitiveBody = await readFile(
    path.join(SKILLS_ROOT, "cf-cognitive", "SKILL.md"),
    "utf8",
  );
  const localSimplifyBody = await readFile(
    path.join(SKILLS_ROOT, "cf-internal-local-simplify", "SKILL.md"),
    "utf8",
  );
  const boundaryBody = await readFile(
    path.join(SKILLS_ROOT, "cf-internal-boundary-apply", "SKILL.md"),
    "utf8",
  );
  const consolidateBody = await readFile(
    path.join(SKILLS_ROOT, "cf-internal-consolidate-seam", "SKILL.md"),
    "utf8",
  );
  const verifyBody = await readFile(
    path.join(SKILLS_ROOT, "cf-internal-verify", "SKILL.md"),
    "utf8",
  );
  const reviewBody = await readFile(
    path.join(SKILLS_ROOT, "cf-internal-review", "SKILL.md"),
    "utf8",
  );

  assert.match(cognitiveBody, /\.\.\/_shared\/references\/local-refactor-rules\.md/);
  assert.match(localSimplifyBody, /\.\.\/_shared\/references\/local-refactor-rules\.md/);
  assert.match(localSimplifyBody, /\.\.\/_shared\/references\/local-readability-review\.md/);
  assert.match(boundaryBody, /\.\.\/_shared\/references\/reference-audit\.md/);
  assert.match(consolidateBody, /\.\.\/_shared\/references\/reference-audit\.md/);
  assert.match(verifyBody, /\.\.\/_shared\/references\/reference-audit\.md/);
  assert.match(reviewBody, /\.\.\/_shared\/references\/local-readability-review\.md/);
});

test("only public entrypoints omit the cf-internal prefix", async () => {
  const skills = await listSkillDirectories(SKILLS_ROOT);
  const publicSkillNames = new Set(["cf-start", "cf-architecture-map", "cf-cognitive"]);

  for (const skill of skills) {
    const isPublic = publicSkillNames.has(skill.name);
    assert.equal(
      isPublic || skill.name.startsWith("cf-internal-"),
      true,
      `${skill.name} should use the cf-internal- prefix unless it is a public entrypoint`,
    );
  }
});
