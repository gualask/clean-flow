import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { createMaterializedSkills } from "../src/lib/materialize-skills.mjs";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SKILLS_ROOT = path.join(REPO_ROOT, "skills");
const DOCS_ROOT = path.join(REPO_ROOT, "docs");
const CODEX_AGENTS_ROOT = path.join(SKILLS_ROOT, "_codex_agents");
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

test("packaged Codex agents pin the intended GPT-5.6 family roles", async () => {
  const expectedAgents = [["cflow_finding_derisk_recon.toml", "gpt-5.6-sol", "medium"]];

  for (const [agentName, model, reasoningEffort] of expectedAgents) {
    const agentContract = await fs.readFile(path.join(CODEX_AGENTS_ROOT, agentName), "utf8");

    assert.ok(agentContract.includes(`model = "${model}"`), `${agentName} must use ${model}`);
    assert.ok(
      agentContract.includes(`model_reasoning_effort = "${reasoningEffort}"`),
      `${agentName} must use ${reasoningEffort} reasoning`,
    );
    assert.doesNotMatch(agentContract, /model = "gpt-5\.5(?:"|-)/);
  }
});

test("repository orientation goes through the bundled tree script, not a stored map", async () => {
  const startContract = await fs.readFile(path.join(SKILLS_ROOT, "cf-start", "SKILL.md"), "utf8");
  const assessment = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-start", "references", "assessment.md"),
    "utf8",
  );

  assert.match(startContract, /run `scripts\/repo-tree\.mjs`/);
  assert.match(startContract, /Never rely on a stored map/);
  assert.match(assessment, /`scripts\/repo-tree\.mjs` is the default first pass/);
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
