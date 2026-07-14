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

test("delegated reconnaissance is terminal in every runtime enforcement layer", async () => {
  const sharedContract = await fs.readFile(
    path.join(SHARED_REFERENCES_ROOT, "clean-context-recon.md"),
    "utf8",
  );

  assert.match(sharedContract, /delegated terminal evidence-only reconnaissance/);
  assert.match(sharedContract, /reconnaissance kind and expected report section names/);
  assert.match(sharedContract, /must not invoke or load any skill/);
  assert.match(sharedContract, /spawn, delegate to, or coordinate another agent/);
  assert.match(
    sharedContract,
    /Report missing prerequisites or unavailable context under \*\*Unknowns\*\*/,
  );
  assert.doesNotMatch(sharedContract, /Use subagents\? Reply/);

  for (const skillName of ["cf-architecture", "cf-trace"]) {
    const skillContract = await fs.readFile(
      path.join(SKILLS_ROOT, skillName, "SKILL.md"),
      "utf8",
    );

    assert.match(skillContract, /state marker `delegated terminal evidence-only reconnaissance`/);
    assert.match(skillContract, /do not enter this controller flow/);
    assert.match(skillContract, /delegate again/);
  }

  for (const agentName of ["cflow_architecture_recon.toml", "cflow_trace_recon.toml"]) {
    const agentContract = await fs.readFile(path.join(CODEX_AGENTS_ROOT, agentName), "utf8");

    assert.match(agentContract, /state marker `delegated terminal evidence-only reconnaissance`/);
    assert.match(agentContract, /Do not invoke or load any skill/);
    assert.match(agentContract, /Do not spawn, delegate to, or coordinate other agents/);
    assert.match(agentContract, /record it under Unknowns and return to the controller/);
  }
});

test("trace serializes architecture mapping and architecture reuses in-flight work", async () => {
  const architectureContract = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-architecture", "SKILL.md"),
    "utf8",
  );
  const traceContract = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-trace", "SKILL.md"),
    "utf8",
  );

  assert.match(architectureContract, /in-flight repository-mapping run/);
  assert.match(architectureContract, /do not start a second controller or reconnaissance agent/);
  assert.match(traceContract, /suspend this flow and route to exactly one `cf-architecture` run/);
  assert.match(
    traceContract,
    /Do not run the mapping and trace controller flows or their reconnaissance agents concurrently/,
  );
  assert.ok(
    traceContract.indexOf("route to exactly one `cf-architecture` run") <
      traceContract.indexOf("## Reconnaissance Gate"),
    "cf-trace must resolve architecture before opening its reconnaissance gate",
  );
});

test("maintainer flow docs mirror terminal delegation and serialized prerequisites", async () => {
  const architectureFlow = await fs.readFile(
    path.join(DOCS_ROOT, "architecture", "doc-architecture.flow.md"),
    "utf8",
  );
  const traceFlow = await fs.readFile(
    path.join(DOCS_ROOT, "trace", "doc-trace.flow.md"),
    "utf8",
  );

  for (const flow of [architectureFlow, traceFlow]) {
    assert.match(flow, /delegated terminal evidence-only reconnaissance/);
    assert.match(flow, /do not activate skills or delegate/);
  }

  assert.match(architectureFlow, /in-flight repository-mapping run/);
  assert.match(traceFlow, /run or await exactly one `cf-architecture` flow/);
  assert.match(
    traceFlow,
    /never run the two controller flows or their reconnaissance agents concurrently/,
  );
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
