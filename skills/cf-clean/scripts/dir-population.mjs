#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { closeSync, openSync, readSync, readdirSync } from "node:fs";
import path from "node:path";

const THRESHOLD = 10;
const MAX_ROWS = 40;
const HEAD_BYTES = 16 * 1024;
const SOURCE_EXTENSIONS = new Set([
  ".c", ".cc", ".cjs", ".clj", ".cljc", ".cljs", ".cpp", ".cs", ".cts", ".cxx", ".dart", ".elm", ".erl",
  ".ex", ".exs", ".fs", ".gleam", ".go", ".groovy", ".h", ".hh", ".hpp", ".hrl", ".hs", ".java", ".jl",
  ".js", ".jsx", ".kt", ".kts", ".lua", ".m", ".mjs", ".ml", ".mm", ".mts", ".nim", ".php", ".pl", ".pm",
  ".py", ".r", ".rb", ".rs", ".scala", ".sol", ".svelte", ".swift", ".ts", ".tsx", ".vb", ".vue", ".zig",
]);
const FALLBACK_IGNORED_DIRS = new Set([
  ".git", ".hg", ".svn", ".cache", ".next", ".nuxt", ".turbo", "build", "coverage", "dist",
  "node_modules", "target", "tmp", "vendor",
]);
// Directory names compared lowercased; separator-suffixed forms (outline_tests, MyApp.Tests,
// integration-tests) are matched by TEST_DIR_SUFFIX.
const TEST_DIRS = new Set([
  "__tests__", "test", "tests", "spec", "specs", "e2e", "__mocks__", "mocks", "testdata", "testing",
  "cypress", "playwright", "androidtest", "integrationtest", "unittest", "functionaltest",
]);
const TEST_DIR_SUFFIX = /[._-](tests?|specs?|e2e)$/i;
const FIXTURE_DIRS = new Set(["__fixtures__", "fixtures", "__snapshots__", "snapshots", "stories", "testfixtures"]);
const GENERATED_DIRS = new Set(["generated", "__generated__", "gen"]);
const TEST_NAME = /(\.(test|spec|e2e|cy)\.[^.]+$|_(test|spec|unittest)\.[^.]+$|^test_[^/]*\.py$|^conftest\.py$|^tests?\.rs$|^test_helper\.exs$|(Test|Tests|Spec|Specs|IT)\.(java|kt|kts|scala|groovy|swift|cs|vb|php|m|mm)$)/;
const FIXTURE_NAME = /\.(fixture|fixtures|fixture-data|mock|mocks|stories|story|snap)\.[^.]+$/;
const GENERATED_NAME = /(\.(gen|generated|g|designer)\.[^.]+$|\.pb\.go$|_pb2(_grpc)?\.py$|\.pb\.(ts|js)$|_generated\.[^.]+$|_gen\.go$|\.d\.(ts|mts|cts)$)/i;
const GENERATED_HEADER = /(code generated .*do not edit|@generated|auto-?generated|do not edit)/i;
const COMMENT_LINE = /^\s*(\/\/|#|\/\*|\*|--|;|<!--|\(\*|%)/;

function main() {
  const args = process.argv.slice(2);
  if (args.includes("--help") || args.includes("-h")) {
    printHelp();
    return;
  }
  const includes = [];
  let root = ".";
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === "--include") {
      includes.push(args[(index += 1)]);
    } else if (args[index].startsWith("-")) {
      throw new Error(`Unknown option: ${args[index]}`);
    } else {
      root = args[index];
    }
  }
  root = path.resolve(root);

  const files = listFiles(root).filter((file) =>
    includes.length === 0 || includes.some((include) => {
      const prefix = path.relative(root, path.resolve(root, include)).split(path.sep).join("/");
      return prefix === "" || file === prefix || file.startsWith(`${prefix}/`);
    }),
  );

  const directories = new Map();
  const entry = (dir) => {
    if (!directories.has(dir)) {
      directories.set(dir, { dir, real: 0, tests: 0, fixtures: 0, reexports: 0, generated: 0 });
    }
    return directories.get(dir);
  };

  for (const file of files) {
    if (!SOURCE_EXTENSIONS.has(path.extname(file))) {
      continue;
    }
    const kind = classify(root, file);
    if (kind !== "missing") {
      entry(path.posix.dirname(file))[kind] += 1;
    }
  }

  const realDirs = [...directories.values()].filter((row) => row.real > 0);
  for (const row of realDirs) {
    const prefix = row.dir === "." ? "" : `${row.dir}/`;
    row.subgroups = new Set(realDirs
      .filter((other) => other.dir !== row.dir && other.dir.startsWith(prefix))
      .map((other) => other.dir.slice(prefix.length).split("/")[0])).size;
  }
  realDirs.sort((left, right) => right.real - left.real || left.dir.localeCompare(right.dir));

  const lines = [
    "dir-population",
    `root: ${root}`,
    `counted: direct real source files per directory; tests, fixtures, snapshots, re-export files, and generated files are excluded`,
    "approximate: classified by file and folder names and the first lines of each file; read a candidate directory's files before deciding",
    `marked: ${THRESHOLD} or more direct real source files`,
    "",
  ];
  const shown = realDirs.filter((row, index) => row.real >= THRESHOLD || index < MAX_ROWS);
  for (const row of shown) {
    const excluded = ["tests", "fixtures", "reexports", "generated"]
      .filter((key) => row[key] > 0)
      .map((key) => `${key === "reexports" ? "re-exports" : key} ${row[key]}`);
    const mark = row.real >= THRESHOLD ? "  <-- " + THRESHOLD + "+" : "";
    lines.push(`${String(row.real).padStart(4)}  ${row.dir}  (subfolders with source: ${row.subgroups}${excluded.length ? "; excluded: " + excluded.join(", ") : ""})${mark}`);
  }
  if (realDirs.length > shown.length) {
    lines.push(`... ${realDirs.length - shown.length} smaller directories hidden`);
  }
  process.stdout.write(`${lines.join("\n")}\n`);
}

function classify(root, file) {
  const segments = file.split("/");
  const name = segments.at(-1);
  const dirs = segments.slice(0, -1);
  if (dirs.some((segment) => TEST_DIRS.has(segment.toLowerCase()) || TEST_DIR_SUFFIX.test(segment)) || TEST_NAME.test(name)) return "tests";
  if (dirs.some((segment) => FIXTURE_DIRS.has(segment.toLowerCase())) || FIXTURE_NAME.test(name)) return "fixtures";
  if (dirs.some((segment) => GENERATED_DIRS.has(segment.toLowerCase())) || GENERATED_NAME.test(name)) return "generated";
  const head = readHead(path.join(root, file));
  if (head === null) return "missing";
  const header = head.text.split("\n").slice(0, 5).filter((line) => COMMENT_LINE.test(line)).join("\n");
  if (GENERATED_HEADER.test(header)) return "generated";
  if (!head.truncated && isReexportOnly(name, head.text)) return "reexports";
  return "real";
}

// Reads at most HEAD_BYTES: enough for a header or a barrel; a longer file is never a barrel.
function readHead(absolutePath) {
  let file;
  try {
    file = openSync(absolutePath, "r");
  } catch {
    return null;
  }
  try {
    const buffer = Buffer.alloc(HEAD_BYTES + 1);
    const bytes = readSync(file, buffer, 0, buffer.length, 0);
    return { text: buffer.subarray(0, Math.min(bytes, HEAD_BYTES)).toString("utf8"), truncated: bytes > HEAD_BYTES };
  } catch {
    return { text: "", truncated: true };
  } finally {
    closeSync(file);
  }
}

function isReexportOnly(name, text) {
  const lines = text
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .split("\n")
    .map((line) => line.replace(/^\s*(\/\/|#).*$/, "").trim())
    .filter(Boolean);
  const body = lines.join(" ");
  if (body === "") return /^(index\.|__init__\.py$|mod\.rs$)/.test(name);
  const ext = path.extname(name);
  if ([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".mts", ".cts"].includes(ext)) {
    const statements = body.split(";").map((part) => part.trim()).filter(Boolean);
    return statements.every((statement) => /^export\s+(type\s+)?(\*(\s+as\s+\w+)?|\{[^}]*\})\s+from\s+['"][^'"]+['"]$/.test(statement));
  }
  if (name === "__init__.py") {
    // Relative imports, __all__, and the continuation lines of a parenthesized list.
    return lines.every((line) => /^(from\s+\.\S*\s+import\s|import\s|__all__\s*=|[\w\s,()'"[\]]*$)/.test(line));
  }
  if (name === "mod.rs" || name === "lib.rs") {
    return body.split(";").map((part) => part.trim()).filter(Boolean).every((part) => /^(pub(\([^)]*\))?\s+)?(mod|use)\s/.test(part));
  }
  return false;
}


function listFiles(root) {
  const result = spawnSync("git", ["-C", root, "ls-files", "-co", "--exclude-standard", "-z", "--", "."], {
    encoding: "buffer",
    maxBuffer: 1024 * 1024 * 100,
  });
  if (result.status === 0) {
    return result.stdout.toString("utf8").split("\0").filter(Boolean);
  }
  const files = [];
  const visit = (absolute, relative) => {
    for (const item of readdirSync(absolute, { withFileTypes: true })) {
      const next = relative ? `${relative}/${item.name}` : item.name;
      if (item.isDirectory() && !FALLBACK_IGNORED_DIRS.has(item.name)) visit(path.join(absolute, item.name), next);
      else if (item.isFile()) files.push(next);
    }
  };
  visit(root, "");
  return files;
}

function printHelp() {
  process.stdout.write(`dir-population

Counts the direct real source files of every directory, largest first.
Tests, fixtures, snapshots, stories, re-export-only files (barrels), declaration files, and
generated files are excluded and shown per directory. Directories at ${THRESHOLD} or more are marked.
The classification is approximate (file and folder names, first lines of each file); files with
other extensions are not counted. Whether the files already form one owner cluster is not judged
here: read a candidate directory's files before deciding.

Usage:
  node dir-population.mjs [root] [--include PATH ...]
`);
}

main();
