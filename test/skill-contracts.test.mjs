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
