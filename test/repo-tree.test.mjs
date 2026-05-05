import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

import { makeTempWorkspace } from "./support/helpers.mjs";

const execFileAsync = promisify(execFile);
const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SCRIPT_PATH = path.join(REPO_ROOT, "skills", "_shared", "scripts", "repo-tree.mjs");

test("repo-tree renders gitignore-aware names and folders views", async () => {
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

  const names = await runRepoTree(workspace, "--mode", "names", "--full");
  assert.match(names, /source: git ls-files -co --exclude-standard/);
  assert.match(names, /loc: \d+ approximate/);
  assert.match(names, /Button\.tsx \(\d+ loc\)/);
  assert.match(names, /Button\.test\.tsx \(\d+ loc\)/);
  assert.match(names, /useButtonState\.ts \(\d+ loc\)/);
  assert.doesNotMatch(names, /KiB|MiB|\d+ B/);
  assert.doesNotMatch(names, /generated\.js/);
  assert.doesNotMatch(names, /node_modules/);

  const folders = await runRepoTree(workspace, "--mode", "folders", "--full");
  assert.match(folders, /src\/ \(4 files, \d+ loc\)/);
  assert.match(folders, /internal\/ \(1 file, \d+ loc\)/);
  assert.match(folders, /docs\/ \(1 file, \d+ loc\)/);
  assert.doesNotMatch(folders, /Button\.tsx/);
  assert.doesNotMatch(folders, /guide\.md/);
});

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
