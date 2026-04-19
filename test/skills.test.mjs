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
