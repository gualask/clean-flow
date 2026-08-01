import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdir, stat, symlink, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

import {
  classifyContextBudget,
  parseGitLsFilesResult,
} from "../skills/_shared/scripts/repo-tree.mjs";
import { makeTempWorkspace } from "./support/helpers.mjs";

const execFileAsync = promisify(execFile);
const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SCRIPT_PATH = path.join(REPO_ROOT, "skills", "_shared", "scripts", "repo-tree.mjs");

test("repo-tree accepts successful Git output when spawnSync also reports an error", () => {
  const result = parseGitLsFilesResult({
    error: Object.assign(new Error("spawnSync git EPERM"), { code: "EPERM" }),
    status: 0,
    stdout: Buffer.from("src/index.mjs\0README.md\0"),
    stderr: Buffer.alloc(0),
  });

  assert.deepEqual(result, {
    ok: true,
    files: ["README.md", "src/index.mjs"],
  });
});

test("repo-tree rejects Git results without a successful exit status", () => {
  const result = parseGitLsFilesResult({
    error: Object.assign(new Error("spawnSync git EPERM"), { code: "EPERM" }),
    status: null,
    stdout: Buffer.from("src/index.mjs\0"),
    stderr: Buffer.alloc(0),
  });

  assert.deepEqual(result, {
    ok: false,
    reason: "spawnSync git EPERM",
  });
});

test("repo-tree runs when invoked through a symbolic link", async () => {
  const workspace = await makeTempWorkspace("repo-tree-link-");
  const linkedScript = path.join(workspace, "repo-tree.mjs");
  await symlink(SCRIPT_PATH, linkedScript);

  const { stdout } = await execFileAsync(process.execPath, [linkedScript, "--help"]);
  assert.match(stdout, /Usage:/);
  assert.match(stdout, /--context-budget/);
});

test("repo-tree context budget uses deterministic boundary bands", () => {
  for (const [metrics, expected] of [
    [{ files: 8, loc: 800, estimatedTokens: 8_000 }, "local"],
    [{ files: 9, loc: 800, estimatedTokens: 8_000 }, "subagent-1"],
    [{ files: 8, loc: 801, estimatedTokens: 8_000 }, "subagent-1"],
    [{ files: 8, loc: 800, estimatedTokens: 8_001 }, "subagent-1"],
    [{ files: 40, loc: 6_000, estimatedTokens: 55_000 }, "subagent-1"],
    [{ files: 41, loc: 6_000, estimatedTokens: 55_000 }, "subagent-2"],
    [{ files: 40, loc: 6_001, estimatedTokens: 55_000 }, "subagent-2"],
    [{ files: 40, loc: 6_000, estimatedTokens: 55_001 }, "subagent-2"],
    [{ files: 80, loc: 12_000, estimatedTokens: 110_000 }, "subagent-2"],
    [{ files: 81, loc: 12_000, estimatedTokens: 110_000 }, "batched"],
    [{ files: 80, loc: 12_001, estimatedTokens: 110_000 }, "batched"],
    [{ files: 80, loc: 12_000, estimatedTokens: 110_001 }, "batched"],
  ]) {
    assert.equal(classifyContextBudget(metrics), expected);
  }
});

test("repo-tree renders gitignore-aware names and folders views", async () => {
  const workspace = await makeRepoTreeFixture();

  const names = await runRepoTree(workspace, "--mode", "names", "--full");
  assert.match(names, /source: git ls-files -co --exclude-standard/);
  assert.match(names, /loc: \d+ approximate/);
  assert.match(names, /Button\.tsx \(\d+ loc\)/);
  assert.match(names, /Button\.test\.tsx \(\d+ loc\)/);
  assert.match(names, /useButtonState\.ts \(\d+ loc\)/);
  assert.doesNotMatch(names, /generated\.js/);
  assert.doesNotMatch(names, /node_modules/);

  const folders = await runRepoTree(workspace, "--mode", "folders", "--full");
  assert.match(folders, /src\/ \(4 files, \d+ loc\)/);
  assert.match(folders, /internal\/ \(1 file, \d+ loc\)/);
  assert.match(folders, /docs\/ \(1 file, \d+ loc\)/);
  assert.doesNotMatch(folders, /Button\.tsx/);
  assert.doesNotMatch(folders, /guide\.md/);
});

test("repo-tree context budget measures only included files", async () => {
  const workspace = await makeRepoTreeFixture();

  const budget = await runRepoTree(
    workspace,
    "--context-budget",
    "--include",
    "src",
    "--include",
    "docs/guide.md",
  );
  assert.match(budget, /^context-budget/m);
  assert.match(budget, /scope: 2 includes/);
  assert.match(budget, /files: 5/);
  assert.match(budget, /loc: 5/);
  const expectedBytes = await totalBytes(workspace, [
    "src/Button.tsx",
    "src/Button.test.tsx",
    "src/Button.types.ts",
    "src/internal/useButtonState.ts",
    "docs/guide.md",
  ]);
  const measuredBytes = Number(/^bytes: (\d+)$/m.exec(budget)?.[1]);
  const estimatedTokens = Number(/^estimated tokens: (\d+) \(bytes \/ 4\)$/m.exec(budget)?.[1]);
  assert.equal(measuredBytes, expectedBytes);
  assert.equal(estimatedTokens, Math.ceil(expectedBytes / 4));
  assert.match(budget, /policy: local/);
  assert.doesNotMatch(budget, /package\.json|Button\.tsx/);
});

test("repo-tree context budget deduplicates overlapping includes", async () => {
  const workspace = await makeRepoTreeFixture();

  const overlappingBudget = await runRepoTree(
    workspace,
    "--context-budget",
    "--include",
    "src",
    "--include",
    "src/Button.tsx",
  );
  assert.match(overlappingBudget, /scope: 2 includes/);
  assert.match(overlappingBudget, /files: 4/);
});

test("repo-tree context budget classifies byte thresholds", async () => {
  const workspace = await makeRepoTreeFixture();

  for (const [bytes, tokens, policy] of [
    [32_001, 8_001, "subagent-1"],
    [220_001, 55_001, "subagent-2"],
    [440_001, 110_001, "batched"],
  ]) {
    await writeFixture(workspace, "budget/large.txt", "x".repeat(bytes));
    const largerBudget = await runRepoTree(
      workspace,
      "--context-budget",
      "--include",
      "budget/large.txt",
    );
    assert.match(largerBudget, /files: 1/);
    assert.match(largerBudget, /loc: 1/);
    assert.match(largerBudget, new RegExp(`bytes: ${bytes}`));
    assert.match(largerBudget, new RegExp(`estimated tokens: ${tokens} \\(bytes \\/ 4\\)`));
    assert.match(largerBudget, new RegExp(`policy: ${policy}`));
  }
});

test("repo-tree context budget rejects unmatched or unreadable includes", async () => {
  const workspace = await makeRepoTreeFixture();

  await assert.rejects(
    () => runRepoTree(workspace, "--context-budget", "--include", "missing.mjs"),
    /--include did not match repository files: missing\.mjs/,
  );

  const brokenLink = path.join(workspace, "broken-link.mjs");
  await symlink("missing-target.mjs", brokenLink);
  await assert.rejects(
    () => runRepoTree(workspace, "--context-budget", "--include", "broken-link.mjs"),
    /could not measure selected files: broken-link\.mjs/,
  );
});

async function makeRepoTreeFixture() {
  const workspace = await makeTempWorkspace("repo-tree-");
  await writeFixture(workspace, ".gitignore", "dist/\nnode_modules/\n");
  await writeFixture(workspace, "package.json", '{"scripts":{"test":"node --test"}}\n');
  await writeFixture(workspace, "src/Button.tsx", "export function Button() { return null; }\n");
  await writeFixture(workspace, "src/Button.test.tsx", "import { Button } from './Button';\n");
  await writeFixture(workspace, "src/Button.types.ts", "export type ButtonProps = {};\n");
  await writeFixture(workspace, "src/internal/useButtonState.ts", "export function useButtonState() {}\n");
  await writeFixture(workspace, "docs/guide.md", "# Guide\n");
  await writeFixture(workspace, "dist/generated.js", "ignored();\n");
  await writeFixture(workspace, "node_modules/pkg/index.js", "ignored();\n");
  await execFileAsync("git", ["init"], { cwd: workspace });
  return workspace;
}

async function runRepoTree(root, ...args) {
  const result = await execFileAsync(process.execPath, [SCRIPT_PATH, "--root", root, ...args], {
    cwd: root,
  });
  return result.stdout;
}

async function writeFixture(root, relativePath, content) {
  const absolutePath = path.join(root, relativePath);
  await mkdir(path.dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, content, "utf8");
}

async function totalBytes(root, relativePaths) {
  const measurements = await Promise.all(
    relativePaths.map((relativePath) => stat(path.join(root, relativePath))),
  );
  return measurements.reduce((sum, measurement) => sum + measurement.size, 0);
}
