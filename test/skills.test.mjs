import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

import {
  buildSkillTokenReport,
  collectSkillTokenBudgetWarnings,
  skillTokenBudgetsFromEnv,
} from "../src/lib/skill-token-report.mjs";
import { createMaterializedSkills } from "../src/lib/materialize-skills.mjs";
import {
  DEFAULT_TOKEN_MODEL,
  resolveTokenEncoding,
} from "../src/lib/token-count.mjs";

import * as tiktoken from "tiktoken";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SKILLS_ROOT = path.join(REPO_ROOT, "skills");

const require = createRequire(import.meta.url);
const modelToEncoding = require("tiktoken/model_to_encoding.json");

async function skillFiles(root) {
  const entries = await fs.readdir(root, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await skillFiles(entryPath)));
    } else if (entry.name === "SKILL.md") {
      files.push(entryPath);
    }
  }

  return files;
}

test("packaged skill frontmatter quotes YAML-sensitive scalar values", async () => {
  for (const skillFile of await skillFiles(SKILLS_ROOT)) {
    const text = await fs.readFile(skillFile, "utf8");
    const frontmatter = /^---\n([\s\S]*?)\n---\n?/.exec(text);

    assert.ok(frontmatter, `${path.relative(REPO_ROOT, skillFile)} is missing frontmatter`);

    for (const line of frontmatter[1].split("\n")) {
      const field = /^(name|description):\s*(.+)$/.exec(line);
      if (!field) continue;

      const value = field[2].trim();
      const quoted =
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"));

      assert.ok(
        quoted || !/:\s/.test(value),
        `${path.relative(REPO_ROOT, skillFile)} ${field[1]} contains an unquoted ": " sequence`,
      );
    }
  }
});

test("packaged skill runtime files stay within token budget warnings", async () => {
  const resolved = resolveTokenEncoding({
    tiktoken,
    modelToEncoding,
    model: DEFAULT_TOKEN_MODEL,
    encoding: null,
  });

  try {
    const materialized = await createMaterializedSkills(SKILLS_ROOT);

    try {
      const report = await buildSkillTokenReport({
        skillsRoot: materialized.skillsRoot,
        rootForLabels: materialized.skillsRoot,
        encoder: resolved.encoder,
        budgets: skillTokenBudgetsFromEnv(),
      });

      assert.ok(report.skills.length > 0, "expected at least one packaged skill");

      for (const warning of collectSkillTokenBudgetWarnings(report)) {
        process.emitWarning(warning.message, { code: warning.code });
      }
    } finally {
      await materialized.cleanup();
    }
  } finally {
    resolved.encoder.free();
  }
});
