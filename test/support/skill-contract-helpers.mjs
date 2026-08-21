import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const REPO_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
export const SKILLS_ROOT = path.join(REPO_ROOT, "skills");
export const DOCS_ROOT = path.join(REPO_ROOT, "docs");
export const SHARED_REFERENCES_ROOT = path.join(SKILLS_ROOT, "_shared", "references");
export const DESCRIPTION_MAX_CHARS = 1024;

export const TERMINAL_AGENT_PROTOCOL = [
  "filesystem_writes: forbidden",
  "test_execution: forbidden",
  "artifact_creation: forbidden",
  "skill_activation: forbidden",
  "prerequisite_routing: forbidden",
  "further_delegation: forbidden",
  "candidate_confirmation: forbidden",
  "final_routing_decision: forbidden",
  "scope_expansion: forbidden",
  "runtime_model_selection: controller-owned",
  "runtime_effort_selection: controller-owned",
];

export async function publicSkillNames(root) {
  const entries = await fs.readdir(root, { withFileTypes: true });
  return entries
    .filter(
      (entry) =>
        entry.isDirectory() && !entry.name.startsWith("_") && !entry.name.startsWith("."),
    )
    .map((entry) => entry.name)
    .sort();
}

export async function skillTextFiles(skillDir) {
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

export async function skillAssetFiles(skillDir) {
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

const FRONTMATTER = /^---\n([\s\S]*?)\n---\n?/;

export function parseFrontmatter(text, label) {
  const frontmatter = FRONTMATTER.exec(text);
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

export function parseBody(text, label) {
  const frontmatter = FRONTMATTER.exec(text);
  assert.ok(frontmatter, `${label} is missing frontmatter`);

  return text.slice(frontmatter[0].length);
}

export function assertStableFields(text, fields, label) {
  for (const field of fields) {
    assert.match(
      text,
      new RegExp("^\\s*- `" + field + "`\\s*$", "m"),
      `${label} must declare ${field}`,
    );
  }
}
