#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { closeSync, openSync, readSync, readdirSync, realpathSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const CONTEXT_TOKEN_BYTES = 4;
const CONTEXT_BUDGETS = [
  { name: "local", maxFiles: 8, maxLoc: 800, maxTokens: 8_000 },
  { name: "subagent-1", maxFiles: 40, maxLoc: 6_000, maxTokens: 55_000 },
  { name: "subagent-2", maxFiles: 80, maxLoc: 12_000, maxTokens: 110_000 },
];
// Package-manager lockfiles: generated, often the largest file in a change set, never reviewed by reading.
const GENERATED_FILE_NAMES = new Set([
  "bun.lock",
  "bun.lockb",
  "Cargo.lock",
  "composer.lock",
  "deno.lock",
  "flake.lock",
  "Gemfile.lock",
  "go.sum",
  "gradle.lockfile",
  "mix.lock",
  "npm-shrinkwrap.json",
  "package-lock.json",
  "packages.lock.json",
  "Pipfile.lock",
  "pnpm-lock.yaml",
  "poetry.lock",
  "Podfile.lock",
  "pubspec.lock",
  "uv.lock",
  "yarn.lock",
]);
const FALLBACK_IGNORED_DIRS = new Set([
  ".git",
  ".hg",
  ".svn",
  ".cache",
  ".next",
  ".nuxt",
  ".turbo",
  "build",
  "coverage",
  "dist",
  "node_modules",
  "target",
  "tmp",
  "vendor",
]);

function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    printHelp();
    return;
  }

  const root = path.resolve(options.root);
  const inventory = listFiles(root);
  const scopedFiles = filterIncludedFiles(root, inventory.files, options.includes);

  if (options.contextBudget) {
    const generated = scopedFiles.filter(isGeneratedFile);
    const tree = buildTree(root, scopedFiles.filter((file) => !isGeneratedFile(file)));
    computeTotals(tree);
    assertMeasurementComplete(tree);
    printContextBudget(root, tree, inventory, options, generated);
    return;
  }

  const tree = buildTree(root, scopedFiles);
  computeTotals(tree);

  const lines = [
    "repo-tree",
    `root: ${root}`,
    `source: ${inventory.source}`,
    `files: ${tree.totalFiles}`,
    `loc: ${formatNumber(tree.totalLoc)} approximate`,
  ];
  if (inventory.warning) {
    lines.push(`warning: ${inventory.warning}`);
  }
  lines.push("");

  if (options.largest > 0) {
    lines.push(...renderLargest(tree, options.largest));
  } else {
    lines.push(`. (${formatMetrics(tree)})`);
    renderFolders(lines, tree, "", 1, options.depth);
  }

  process.stdout.write(`${lines.join("\n")}\n`);
}

function parseArgs(args) {
  const options = {
    contextBudget: false,
    depth: Number.POSITIVE_INFINITY,
    help: false,
    includes: [],
    largest: 0,
    root: ".",
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--help" || arg === "-h") {
      options.help = true;
      continue;
    }

    if (arg === "--context-budget") {
      options.contextBudget = true;
      continue;
    }

    if (arg === "--include") {
      options.includes.push(requiredValue(args, (index += 1), arg));
      continue;
    }

    if (arg === "--depth") {
      options.depth = parsePositiveInteger(requiredValue(args, (index += 1), arg), arg);
      continue;
    }

    if (arg === "--largest") {
      options.largest = parsePositiveInteger(requiredValue(args, (index += 1), arg), arg);
      continue;
    }

    if (arg.startsWith("-")) {
      throw new Error(`Unknown option: ${arg}`);
    }

    options.root = arg;
  }

  return options;
}

function filterIncludedFiles(root, files, includes) {
  if (includes.length === 0) {
    return files;
  }

  const normalizedIncludes = includes.map((include) => normalizeInclude(root, include));
  const matchedIncludes = new Set();
  const selected = files.filter((file) => {
    let selectedFile = false;
    for (const include of normalizedIncludes) {
      const matched = include === "." || file === include || file.startsWith(`${include}/`);
      if (matched) {
        matchedIncludes.add(include);
        selectedFile = true;
      }
    }
    return selectedFile;
  });

  const missing = normalizedIncludes.filter((include) => !matchedIncludes.has(include));
  if (missing.length > 0) {
    throw new Error(`--include did not match repository files: ${missing.join(", ")}`);
  }

  return selected;
}

function normalizeInclude(root, include) {
  const absolutePath = path.resolve(root, include);
  const relativePath = path.relative(root, absolutePath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    throw new Error(`--include must stay inside the repository root: ${include}`);
  }

  return normalizeRelativePath(relativePath) || ".";
}

export function isGeneratedFile(relativePath) {
  return GENERATED_FILE_NAMES.has(path.posix.basename(relativePath));
}

function requiredValue(args, index, flag) {
  const value = args[index];
  if (!value || value.startsWith("--")) {
    throw new Error(`${flag} requires a value`);
  }
  return value;
}

function parsePositiveInteger(value, flag) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isSafeInteger(parsed) || parsed < 1) {
    throw new Error(`${flag} must be a positive integer`);
  }
  return parsed;
}

function listFiles(root) {
  const gitResult = gitLsFiles(root);
  if (gitResult.ok) {
    return {
      files: gitResult.files,
      source: "git ls-files -co --exclude-standard",
    };
  }

  return {
    files: walkFilesystem(root),
    source: "filesystem fallback",
    warning: `git inventory unavailable; used built-in directory skips only (${gitResult.reason})`,
  };
}

function gitLsFiles(root) {
  const result = spawnSync(
    "git",
    ["-C", root, "ls-files", "-co", "--exclude-standard", "-z", "--", "."],
    {
      encoding: "buffer",
      maxBuffer: 1024 * 1024 * 100,
    },
  );

  return parseGitLsFilesResult(result);
}

export function parseGitLsFilesResult(result) {
  if (result.status !== 0) {
    const stderr = result.stderr?.toString("utf8").trim();
    return {
      ok: false,
      reason: result.error?.message || stderr || `git exited with status ${result.status}`,
    };
  }

  const files = result.stdout
    .toString("utf8")
    .split("\0")
    .filter(Boolean)
    .map((entry) => normalizeRelativePath(entry))
    .filter((entry) => entry && !entry.startsWith("../"))
    .sort(compareNames);

  return { ok: true, files };
}

function walkFilesystem(root) {
  const files = [];

  function visit(absoluteDir, relativeDir) {
    const entries = readdirSync(absoluteDir, { withFileTypes: true }).sort((left, right) =>
      compareNames(left.name, right.name),
    );

    for (const entry of entries) {
      if (entry.isSymbolicLink()) {
        continue;
      }

      const relativePath = relativeDir ? `${relativeDir}/${entry.name}` : entry.name;
      const absolutePath = path.join(absoluteDir, entry.name);

      if (entry.isDirectory()) {
        if (FALLBACK_IGNORED_DIRS.has(entry.name)) {
          continue;
        }
        visit(absolutePath, relativePath);
        continue;
      }

      if (entry.isFile()) {
        files.push(normalizeRelativePath(relativePath));
      }
    }
  }

  visit(root, "");
  return files.sort(compareNames);
}

function normalizeRelativePath(value) {
  return value.split(path.sep).join("/").replace(/^\.\//, "");
}

function buildTree(root, files) {
  const treeRoot = createDirectoryNode(".");

  for (const file of files) {
    const parts = file.split("/").filter(Boolean);
    let current = treeRoot;

    for (let index = 0; index < parts.length - 1; index += 1) {
      const part = parts[index];
      if (!current.directories.has(part)) {
        current.directories.set(part, createDirectoryNode(part));
      }
      current = current.directories.get(part);
    }

    current.files.push(createFileNode(root, file));
  }

  sortDirectories(treeRoot);
  return treeRoot;
}

function createDirectoryNode(name) {
  return {
    directories: new Map(),
    files: [],
    measurementFailures: [],
    name,
    totalBytes: 0,
    totalFiles: 0,
    totalLoc: 0,
  };
}

function createFileNode(root, relativePath) {
  const measurement = measureFile(path.join(root, relativePath));

  return {
    bytes: measurement.bytes,
    loc: measurement.loc,
    measurementError: measurement.error,
    relativePath,
  };
}

function measureFile(absolutePath) {
  const buffer = Buffer.allocUnsafe(64 * 1024);
  let file = null;
  let bytesReadTotal = 0;
  let lineBreaks = 0;
  let lastByte = null;

  try {
    file = openSync(absolutePath, "r");

    for (;;) {
      const bytesRead = readSync(file, buffer, 0, buffer.length, null);
      if (bytesRead === 0) {
        break;
      }

      bytesReadTotal += bytesRead;
      for (let index = 0; index < bytesRead; index += 1) {
        if (buffer[index] === 10) {
          lineBreaks += 1;
        }
        lastByte = buffer[index];
      }
    }
  } catch (error) {
    return {
      bytes: 0,
      error: error instanceof Error ? error.message : String(error),
      loc: 0,
    };
  } finally {
    if (file !== null) {
      closeFile(file);
    }
  }

  if (bytesReadTotal === 0) {
    return { bytes: 0, loc: 0 };
  }

  return {
    bytes: bytesReadTotal,
    loc: lineBreaks + (lastByte === 10 ? 0 : 1),
  };
}

function closeFile(file) {
  try {
    closeSync(file);
  } catch {
    // Ignore close failures; this script is an inventory helper.
  }
}

function sortDirectories(node) {
  node.directories = new Map(
    [...node.directories.entries()]
      .sort(([left], [right]) => compareNames(left, right))
      .map(([name, child]) => {
        sortDirectories(child);
        return [name, child];
      }),
  );
}

function computeTotals(node) {
  node.measurementFailures = node.files
    .filter((file) => file.measurementError)
    .map((file) => ({ error: file.measurementError, path: file.relativePath }));
  node.totalFiles = node.files.length;
  node.totalBytes = node.files.reduce((sum, file) => sum + file.bytes, 0);
  node.totalLoc = node.files.reduce((sum, file) => sum + file.loc, 0);

  for (const child of node.directories.values()) {
    computeTotals(child);
    node.totalFiles += child.totalFiles;
    node.totalBytes += child.totalBytes;
    node.totalLoc += child.totalLoc;
    node.measurementFailures.push(...child.measurementFailures);
  }
}

function renderFolders(lines, node, prefix, depth, maxDepth) {
  const children = [...node.directories.values()];
  if (children.length === 0) {
    return;
  }

  if (depth > maxDepth) {
    lines.push(`${prefix}\`-- ... (${pluralize(countDirectories(children), "directory", "directories")} hidden)`);
    return;
  }

  children.forEach((child, index) => {
    const isLast = index === children.length - 1;
    lines.push(`${prefix}${isLast ? "`-- " : "|-- "}${child.name}/ (${formatMetrics(child)})`);
    renderFolders(lines, child, `${prefix}${isLast ? "    " : "|   "}`, depth + 1, maxDepth);
  });
}

function countDirectories(nodes) {
  return nodes.reduce((sum, node) => sum + 1 + countDirectories([...node.directories.values()]), 0);
}

function renderLargest(tree, count) {
  const largest = collectFiles(tree)
    .sort((left, right) => right.loc - left.loc || compareNames(left.relativePath, right.relativePath))
    .slice(0, count);
  const width = formatNumber(largest[0]?.loc ?? 0).length;
  return largest.map((file) => `${formatNumber(file.loc).padStart(width)} loc  ${file.relativePath}`);
}

function collectFiles(node, files = []) {
  files.push(...node.files);
  for (const child of node.directories.values()) {
    collectFiles(child, files);
  }
  return files;
}

function pluralize(count, singular, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

function formatMetrics(node) {
  return `${pluralize(node.totalFiles, "file")}, ${formatNumber(node.totalLoc)} loc`;
}

function formatNumber(value) {
  return value.toLocaleString("en-US");
}

export function classifyContextBudget({ files, loc, estimatedTokens }) {
  for (const budget of CONTEXT_BUDGETS) {
    if (
      files <= budget.maxFiles &&
      loc <= budget.maxLoc &&
      estimatedTokens <= budget.maxTokens
    ) {
      return budget.name;
    }
  }

  return "batched";
}

function assertMeasurementComplete(tree) {
  if (tree.measurementFailures.length === 0) {
    return;
  }

  const failures = tree.measurementFailures
    .map((failure) => `${failure.path} (${failure.error})`)
    .join(", ");
  throw new Error(`could not measure selected files: ${failures}`);
}

function printContextBudget(root, tree, inventory, options, generated) {
  const estimatedTokens = Math.ceil(tree.totalBytes / CONTEXT_TOKEN_BYTES);
  const policy = classifyContextBudget({
    files: tree.totalFiles,
    loc: tree.totalLoc,
    estimatedTokens,
  });

  process.stdout.write(`context-budget\n`);
  process.stdout.write(`root: ${root}\n`);
  process.stdout.write(`source: ${inventory.source}\n`);
  process.stdout.write(`scope: ${options.includes.length > 0 ? `${options.includes.length} includes` : "repository"}\n`);
  process.stdout.write(`files: ${tree.totalFiles}\n`);
  process.stdout.write(`loc: ${tree.totalLoc}\n`);
  process.stdout.write(`bytes: ${tree.totalBytes}\n`);
  process.stdout.write(`estimated tokens: ${estimatedTokens} (bytes / ${CONTEXT_TOKEN_BYTES})\n`);
  process.stdout.write(`policy: ${policy}\n`);
  process.stdout.write(`generated: ${generated.length > 0 ? generated.join(", ") : "none"}\n`);
}

function compareNames(left, right) {
  return left.localeCompare(right, "en", {
    numeric: true,
    sensitivity: "base",
  });
}

function printHelp() {
  process.stdout.write(`repo-tree

Gitignore-aware file inventory with approximate line counts (LOC = newline count).
LOC is a size signal, not a quality or complexity judgment.

Usage:
  node repo-tree.mjs [root] [--depth N] [--include PATH ...]
  node repo-tree.mjs [root] --largest N [--include PATH ...]
  node repo-tree.mjs [root] --context-budget [--include PATH ...]

Without --largest or --context-budget it prints the directory tree, each directory with its
recursive file count and LOC.

Options:
  --depth N        Directory levels to show. Defaults to all.
  --largest N      Print only the N longest files, longest first. Every file counts,
                   including tests, docs, and lockfiles; narrow with --include.
  --context-budget Print only deterministic context metrics and delegation policy.
                   Lockfiles are generated: left out of the metrics and listed on
                   the generated line.
  --include PATH   Limit the inventory to an exact file or directory. Repeatable.
  --help           Show this help.

Context budget policy:
  local       <= 8 files, <= 800 LOC, and <= 8,000 estimated tokens
  subagent-1  <= 40 files, <= 6,000 LOC, and <= 55,000 estimated tokens
  subagent-2  <= 80 files, <= 12,000 LOC, and <= 110,000 estimated tokens
  batched     anything larger; keep one logical scope and process file batches

Estimated context tokens use bytes / ${CONTEXT_TOKEN_BYTES}. They are a provider-neutral size
signal, not an exact tokenizer or billing count. The highest exceeded limit selects the next band.

The inventory is git ls-files -co --exclude-standard: tracked files and untracked non-ignored
files. Outside a Git repository it walks the filesystem and skips common build and dependency
directories.
`);
}

function isMainModule(argvPath) {
  if (!argvPath) return false;

  try {
    return realpathSync(argvPath) === realpathSync(fileURLToPath(import.meta.url));
  } catch {
    return import.meta.url === pathToFileURL(path.resolve(argvPath)).href;
  }
}

if (isMainModule(process.argv[1])) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}
