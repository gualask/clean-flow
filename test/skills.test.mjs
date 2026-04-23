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
  const refineBody = await readFile(path.join(SKILLS_ROOT, "cf-refine", "SKILL.md"), "utf8");

  assert.match(
    startBody,
    /`cf-architecture-map` and `cf-refine` are also supported public entrypoints/,
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

  assert.match(
    refineBody,
    /This is a supported public entrypoint for bounded local refinement\./,
  );
  assert.match(refineBody, /You do not need `\.cflow\/\*` to start this skill\./);
  assert.match(
    refineBody,
    /Do not create or refresh `\.cflow\/refactor-brief\.md` from this skill itself\./,
  );
  assert.match(
    refineBody,
    /When the task does not fit `cf-refine`, say so clearly in `Refine fit`, make no code edits, and route to `cf-start`\./,
  );
});

test("only public entrypoints omit the cf-internal prefix", async () => {
  const skills = await listSkillDirectories(SKILLS_ROOT);
  const publicSkillNames = new Set(["cf-start", "cf-architecture-map", "cf-refine"]);

  for (const skill of skills) {
    const isPublic = publicSkillNames.has(skill.name);
    assert.equal(
      isPublic || skill.name.startsWith("cf-internal-"),
      true,
      `${skill.name} should use the cf-internal- prefix unless it is a public entrypoint`,
    );
  }
});
