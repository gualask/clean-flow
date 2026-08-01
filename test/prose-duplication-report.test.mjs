import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import {
  buildProseDuplicationReport,
  extractMarkdownBlocks,
  findSimilarBlocks,
  formatProseDuplicationReport,
} from "../src/lib/prose-duplication.mjs";
import { buildProseContextModel } from "../src/lib/prose-duplication-context.mjs";
import { makeTempWorkspace } from "./support/helpers.mjs";

const execFileAsync = promisify(execFile);
const REPORT_COMMAND = fileURLToPath(
  new URL("../src/commands/prose-duplication-report.mjs", import.meta.url),
);

test("extractMarkdownBlocks normalizes wrapping and skips non-prose regions", () => {
  const blocks = extractMarkdownBlocks(
    `---
name: demo
description: This frontmatter sentence is deliberately long enough to pass the configured limits.
---

# Heading that should not become prose

This is a sufficiently long prose block that is wrapped
across two lines but should still be compared as one normalized block.

\`\`\`
This fenced example is deliberately long enough to pass the configured limits but must be ignored.
\`\`\`

<!-- This long comment must not become an eligible block in the report output. -->
`,
    "/workspace/demo.md",
    { minWords: 8, minChars: 40 },
  );

  assert.deepEqual(blocks, [
    {
      filePath: "/workspace/demo.md",
      line: 8,
      normalized:
        "This is a sufficiently long prose block that is wrapped across two lines but should still be compared as one normalized block.",
      tokens: [
        "This", "is", "a", "sufficiently", "long", "prose", "block", "that", "is", "wrapped",
        "across", "two", "lines", "but", "should", "still", "be", "compared", "as", "one",
        "normalized", "block",
      ],
      comparisonTokens: [
        "this", "is", "a", "sufficiently", "long", "prose", "block", "that", "is", "wrapped",
        "across", "two", "lines", "but", "should", "still", "be", "compared", "as", "one",
        "normalized", "block",
      ],
      words: 22,
    },
  ]);
});

test("prose duplication report finds blocks despite wrapping and list marker changes", async () => {
  const workspace = await makeTempWorkspace("prose-duplication-");
  const docsPath = path.join(workspace, "docs");
  await mkdir(docsPath, { recursive: true });

  await writeFile(
    path.join(docsPath, "one.md"),
    `# One

- Keep this deliberately substantial instruction together because it describes one complete behavioral rule for every consumer.
`,
    "utf8",
  );
  await writeFile(
    path.join(docsPath, "two.md"),
    `# Two

* Keep this deliberately substantial instruction together because it describes
one complete behavioral rule for every consumer.
`,
    "utf8",
  );
  await writeFile(path.join(docsPath, "short.md"), "Repeated short text.\n", "utf8");

  const report = await buildProseDuplicationReport({
    inputPaths: [docsPath],
    rootForLabels: workspace,
    minWords: 10,
    minChars: 60,
  });
  const output = formatProseDuplicationReport(report);

  assert.equal(report.filesScanned, 3);
  assert.equal(report.blocksCompared, 2);
  assert.equal(report.duplicates.length, 1);
  assert.deepEqual(report.duplicates[0].occurrences, [
    { path: "docs/one.md", line: 3 },
    { path: "docs/two.md", line: 3 },
  ]);
  assert.match(output, /Exact candidates: 1/);
  assert.match(output, /Similarity threshold: 86\.0%/);
  assert.match(output, /docs\/one\.md:3/);
  assert.match(output, /docs\/two\.md:3/);
});

test("findSimilarBlocks reports normalized word similarity and delta", () => {
  const left = extractMarkdownBlocks(
    "Keep every delegated agent terminal and prevent it from activating skills, routing prerequisites, expanding scope, or delegating work again.",
    "/workspace/review.md",
    { minWords: 8, minChars: 40 },
  )[0];
  const right = extractMarkdownBlocks(
    "Keep every delegated agent terminal and prevent it from activating skills, routing prerequisites, expanding scope, or selecting another agent again.",
    "/workspace/test.md",
    { minWords: 8, minChars: 40 },
  )[0];

  const [candidate] = findSimilarBlocks([left, right], { similarityThreshold: 0.8 });

  assert.equal(candidate.distance, 3);
  assert.equal(candidate.similarity, 0.85);
  assert.deepEqual(candidate.removed, ["delegating", "work"]);
  assert.deepEqual(candidate.added, ["selecting", "another", "agent"]);
});

test("prose context model distinguishes same-flow, same-thread, and same-skill sources", async () => {
  const workspace = await makeTempWorkspace("prose-context-");
  const skillsRoot = path.join(workspace, "skills");
  const sharedPath = path.join(skillsRoot, "_shared", "references", "shared.md");
  const alphaSkill = path.join(skillsRoot, "alpha", "SKILL.md");
  const betaSkill = path.join(skillsRoot, "beta", "SKILL.md");
  const alphaOther = path.join(skillsRoot, "alpha", "references", "other.md");
  const contextModel = buildProseContextModel({
    skillsRoot,
    contextMap: {
      version: 1,
      skills: {
        alpha: {
          flows: {
            default: {
              required: ["references/shared.md"],
              conditional: [],
              handoffs: [{ to: "beta:default", kind: "conditional", context: "same-thread" }],
            },
            other: { required: ["references/other.md"], conditional: [] },
          },
        },
        beta: { flows: { default: { required: [], conditional: [] } } },
      },
    },
    vendorConfig: {
      version: 1,
      skills: { alpha: { references: ["shared.md"] } },
    },
  });

  const occurrence = (filePath) => ({
    runtimeIds: contextModel.runtimeIdsFor(filePath),
  });

  assert.deepEqual(contextModel.runtimeIdsFor(sharedPath), ["alpha/references/shared.md"]);
  assert.equal(
    contextModel.classify([occurrence(sharedPath), occurrence(alphaSkill)]).category,
    "same-flow",
  );
  assert.equal(
    contextModel.classify([occurrence(alphaSkill), occurrence(betaSkill)]).category,
    "same-thread",
  );
  assert.equal(
    contextModel.classify([occurrence(sharedPath), occurrence(alphaOther)]).category,
    "same-skill",
  );
});

test("prose duplication command accepts pnpm's option separator", async () => {
  const workspace = await makeTempWorkspace("prose-duplication-cli-");
  const markdownPath = path.join(workspace, "sample.md");
  await writeFile(
    markdownPath,
    "This deliberately long paragraph has enough words to be eligible but occurs only once in this sample file.\n",
    "utf8",
  );

  const { stdout } = await execFileAsync(process.execPath, [
    REPORT_COMMAND,
    "--",
    "--min-words",
    "8",
    markdownPath,
  ]);

  assert.match(stdout, /Scanned: 1 Markdown files/);
  assert.match(stdout, /Exact candidates: 0/);
});
