import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

import {
  buildSkillTokenReport,
  collectSkillTokenBudgetWarnings,
  skillTokenBudgetsFromEnv,
} from "../src/lib/skill-token-report.mjs";
import {
  DEFAULT_TOKEN_MODEL,
  resolveTokenEncoding,
} from "../src/lib/token-count.mjs";

import * as tiktoken from "tiktoken";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SKILLS_ROOT = path.join(REPO_ROOT, "skills");

const require = createRequire(import.meta.url);
const modelToEncoding = require("tiktoken/model_to_encoding.json");

test("packaged skill runtime files stay within token budget warnings", async () => {
  const resolved = resolveTokenEncoding({
    tiktoken,
    modelToEncoding,
    model: DEFAULT_TOKEN_MODEL,
    encoding: null,
  });

  try {
    const report = await buildSkillTokenReport({
      skillsRoot: SKILLS_ROOT,
      rootForLabels: REPO_ROOT,
      encoder: resolved.encoder,
      budgets: skillTokenBudgetsFromEnv(),
    });

    assert.ok(report.skills.length > 0, "expected at least one packaged skill");

    for (const warning of collectSkillTokenBudgetWarnings(report)) {
      process.emitWarning(warning.message, { code: warning.code });
    }
  } finally {
    resolved.encoder.free();
  }
});
