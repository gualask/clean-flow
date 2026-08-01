import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import { createMaterializedSkills } from "../src/lib/materialize-skills.mjs";
import {
  DESCRIPTION_MAX_CHARS,
  DOCS_ROOT,
  REPO_ROOT,
  SHARED_REFERENCES_ROOT,
  SKILLS_ROOT,
  parseFrontmatter,
  publicSkillNames,
  skillTextFiles,
} from "./support/skill-contract-helpers.mjs";

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
    assert.doesNotMatch(description, /\b(?:TODO|TBD)\b/);
    const activation = /\b(?:use|apply|invoke|run|trigger|activate)\b[^.;]{0,160}\b(?:when|after|for)\b/i.exec(
      description,
    );
    assert.ok(activation, `${label} description must state an activation condition`);
    assert.match(
      description.slice(0, activation.index).trim(),
      /^\S+\s+\S+/,
      `${label} description must identify its owned task before the activation condition`,
    );
    assert.match(
      description,
      /\b(?:do not|don't|never|route|only when|first when|otherwise)\b/i,
      `${label} description must state a non-use or routing boundary`,
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
