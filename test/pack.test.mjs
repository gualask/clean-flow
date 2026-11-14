import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  buildSkillTokenReport,
  collectSkillTokenBudgetWarnings,
  skillTokenBudgetsFromEnv,
} from "../src/lib/skill-token-report.mjs";
import { DEFAULT_TOKEN_MODEL, resolveTokenEncoding } from "../src/lib/token-count.mjs";
import {
  DESCRIPTION_MAX_CHARS,
  DOCS_ROOT,
  SHARED_REFERENCES_ROOT,
  parseFrontmatter,
  publicSkillNames,
  skillAssetFiles,
  skillTextFiles,
} from "./support/skill-contract-helpers.mjs";
import * as tiktoken from "tiktoken";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SKILLS_ROOT = path.join(REPO_ROOT, "skills");
const SKILL_CONTEXT_MAP_PATH = path.join(
  REPO_ROOT,
  "src",
  "commands",
  "skill-token-report.context.json",
);

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

test("editing flows defer out-of-scope hard-trigger remedies without softening them", async () => {
  const navigationCost = await fs.readFile(
    path.join(SHARED_REFERENCES_ROOT, "navigation-cost.md"),
    "utf8",
  );
  const placementContract = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-placement", "SKILL.md"),
    "utf8",
  );
  const cognitiveContract = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-cognitive", "SKILL.md"),
    "utf8",
  );

  assert.match(navigationCost, /Report And Action Are Separate/);
  assert.match(navigationCost, /outside the authorized scope/);
  assert.match(navigationCost, /file modified by the pass or explicitly selected as a cleanup target/);
  assert.doesNotMatch(navigationCost, /file the pass evaluated or touched/);
  for (const field of [
    "exact unit",
    "claim",
    "evidence",
    "impact when not obvious",
    "confidence with its basis",
    "owning route",
    "status `Deferred`",
  ]) {
    assert.match(navigationCost, new RegExp(field));
  }
  assert.doesNotMatch(navigationCost, /severity/i);
  assert.match(navigationCost, /Widening the pass solely to remedy it/);
  assert.match(cognitiveContract, /- \*\*Deferred\*\*: after execution only, per the report\/action rule\./);
  // Function length is no hard trigger; without this slot line a
  // split and a regrouping both deferred `none` (1 run each). It matches
  // cf-clean's lens 5.
  assert.match(
    placementContract,
    /- \*\*Deferred\*\*: each function past 20 logical lines in a file you modified, routed to `cf-cognitive`; each owner cluster kept flat because a folder would be a new package or module, routed to `cf-architecture`; or `none`\./,
  );
  // cf-cognitive carries its execution flow in SKILL.md, so the same rule is
  // asserted on the contract itself rather than on a per-flow reference file.
  assert.match(
    cognitiveContract,
    /references\/navigation-cost\.md for the thresholds.*the report\/action rule/,
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

      // A path under `.cflow/` names a file, not a routing destination:
      // `.cflow/cf-test-recap.md` is cf-test's recap, not a skill called
      // `cf-test-recap`. Skip those spans only, so a routing typo still fails.
      const artifactSpans = [...text.matchAll(/\.cflow\/[A-Za-z0-9._/-]+/g)].map((m) => [
        m.index,
        m.index + m[0].length,
      ]);

      for (const match of text.matchAll(/\bcf-[a-z][a-z-]*[a-z]\b/g)) {
        if (artifactSpans.some(([from, to]) => match.index >= from && match.index < to)) continue;
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
  }
});

test("skill files only link runtime files that exist", async () => {
  for (const skillName of await publicSkillNames(SKILLS_ROOT)) {
    const skillDir = path.join(SKILLS_ROOT, skillName);

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
});

test("every public skill has a mirror in docs/sources whose links resolve", async () => {
  for (const skillName of await publicSkillNames(SKILLS_ROOT)) {
    const mirrorPath = path.join(DOCS_ROOT, "sources", `${skillName}.md`);

    await assert.doesNotReject(
      fs.access(mirrorPath),
      `${skillName} is missing ${path.relative(REPO_ROOT, mirrorPath)}`,
    );

    // A mirror holds the sources of the skill's rules and links to its runtime
    // files; a link left behind by a rename is the error it can carry.
    const mirror = await fs.readFile(mirrorPath, "utf8");
    for (const [, target] of mirror.matchAll(/\]\(([^)\s#]+)(?:#[^)]*)?\)/g)) {
      if (/^[a-z]+:/i.test(target)) continue;
      await assert.doesNotReject(
        fs.access(path.resolve(path.dirname(mirrorPath), target)),
        `${path.relative(REPO_ROOT, mirrorPath)} links to missing ${target}`,
      );
    }
  }
});

test("navigation-cost is the single source of hard-trigger threshold values", async () => {
  const canonicalContract = await fs.readFile(
    path.join(SHARED_REFERENCES_ROOT, "navigation-cost.md"),
    "utf8",
  );

  assert.match(canonicalContract, /past roughly 20 logical lines/);
  assert.match(canonicalContract, /past roughly 300 LOC/);
  // Test files stay out of the triggers unless asked: a 335-line test file was
  // left alone on the default request and reported when the request included tests.
  assert.match(
    canonicalContract,
    /Test files are out by default: the hard triggers and the soft signals reach a test file only when the request names it or asks to check tests\./,
  );

  const consumers = [
    path.join(SKILLS_ROOT, "cf-cognitive", "SKILL.md"),
    path.join(SKILLS_ROOT, "cf-clean", "references", "sweep.md"),
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
    const contextMap = JSON.parse(await fs.readFile(SKILL_CONTEXT_MAP_PATH, "utf8"));

    const report = await buildSkillTokenReport({
      skillsRoot: SKILLS_ROOT,
      rootForLabels: SKILLS_ROOT,
      encoder: resolved.encoder,
      budgets: skillTokenBudgetsFromEnv(),
      contextMap,
    });

    assert.ok(report.skills.length > 0, "expected at least one packaged skill");
    assert.equal(report.context.discoveryTokens, report.totals.metadataTokens);
    assert.deepEqual(
      [...new Set(report.context.flows.map((flow) => flow.skillName))].sort(),
      report.skills.map((skill) => skill.name).sort(),
    );

    const cognitiveExecution = report.context.flows.find(
      (flow) => flow.id === "cf-cognitive:execution",
    );
    assert.ok(cognitiveExecution, "expected a configured cf-cognitive execution flow");
    // A routed request ends the turn: an explicit extraction is named for cf-placement, not run
    // ("do not open it" held 0 of 2, "do not edit files" held 1 of 1).
    assert.deepEqual(
      cognitiveExecution.handoffs,
      [],
      "cf-cognitive execution ends the turn when it routes",
    );

    for (const warning of collectSkillTokenBudgetWarnings(report)) {
      process.emitWarning(warning.message, { code: warning.code });
    }
  } finally {
    resolved.encoder.free();
  }
});
