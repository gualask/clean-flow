#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { closeSync, openSync, readSync, readdirSync } from "node:fs";
import path from "node:path";

const DEFAULT_MAX_NODES = 3000;
const DEFAULT_DEPTH = Number.POSITIVE_INFINITY;
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
  const inventory = listFiles(root, options);
  const tree = buildTree(root, inventory.files);
  computeTotals(tree);

  const lines = [];
  lines.push("repo-tree");
  lines.push(`root: ${root}`);
  lines.push(`mode: ${options.mode}`);
  lines.push(`source: ${inventory.source}`);
  lines.push(`files: ${tree.totalFiles}`);
  lines.push(`directories: ${tree.totalDirectories}`);
  lines.push(`loc: ${formatNumber(tree.totalLoc)} approximate`);
  lines.push(`depth: ${Number.isFinite(options.depth) ? options.depth : "all"}`);
  lines.push(`max nodes: ${options.maxNodes === 0 ? "none" : options.maxNodes}`);
  if (inventory.warning) {
    lines.push(`warning: ${inventory.warning}`);
  }
  lines.push("");
  lines.push(...renderTree(tree, options));

  process.stdout.write(`${lines.join("\n")}\n`);
}

function parseArgs(args) {
  const options = {
    depth: DEFAULT_DEPTH,
    help: false,
    maxNodes: DEFAULT_MAX_NODES,
    mode: "folders",
    root: ".",
    useGitignore: true,
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--help" || arg === "-h") {
      options.help = true;
      continue;
    }

    if (arg === "--no-gitignore") {
      options.useGitignore = false;
      continue;
    }

    if (arg === "--full") {
      options.maxNodes = 0;
      continue;
    }

    if (arg === "--root") {
      options.root = requiredValue(args, (index += 1), arg);
      continue;
    }

    if (arg === "--mode") {
      options.mode = requiredValue(args, (index += 1), arg);
      continue;
    }

    if (arg === "--depth") {
      options.depth = parsePositiveInteger(requiredValue(args, (index += 1), arg), arg);
      continue;
    }

    if (arg === "--max-nodes") {
      options.maxNodes = parseNonNegativeInteger(requiredValue(args, (index += 1), arg), arg);
      continue;
    }

    if (arg.startsWith("--")) {
      throw new Error(`Unknown option: ${arg}`);
    }

    options.root = arg;
  }

  if (!["folders", "names"].includes(options.mode)) {
    throw new Error(`--mode must be "folders" or "names", got: ${options.mode}`);
  }

  return options;
}

function requiredValue(args, index, flag) {
  const value = args[index];
  if (!value || value.startsWith("--")) {
    throw new Error(`${flag} requires a value`);
  }
  return value;
}

function parsePositiveInteger(value, flag) {
  if (value === "all") {
    return Number.POSITIVE_INFINITY;
  }

  const parsed = Number.parseInt(value, 10);
  if (!Number.isSafeInteger(parsed) || parsed < 1) {
    throw new Error(`${flag} must be a positive integer or "all"`);
  }
  return parsed;
}

function parseNonNegativeInteger(value, flag) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isSafeInteger(parsed) || parsed < 0) {
    throw new Error(`${flag} must be a non-negative integer`);
  }
  return parsed;
}

function listFiles(root, options) {
  if (options.useGitignore) {
    const gitResult = gitLsFiles(root);
    if (gitResult.ok) {
      return {
        files: gitResult.files,
        source: "git ls-files -co --exclude-standard",
      };
    }

    const fallback = walkFilesystem(root);
    return {
      files: fallback.files,
      source: "filesystem fallback",
      warning: `git inventory unavailable; used built-in directory skips only (${gitResult.reason})`,
    };
  }

  const fallback = walkFilesystem(root);
  return {
    files: fallback.files,
    source: "filesystem walk without gitignore",
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

  if (result.error) {
    return { ok: false, reason: result.error.message };
  }

  if (result.status !== 0) {
    const stderr = result.stderr?.toString("utf8").trim();
    return { ok: false, reason: stderr || `git exited with status ${result.status}` };
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
  return { files: files.sort(compareNames) };
}

function normalizeRelativePath(value) {
  return value.split(path.sep).join("/").replace(/^\.\//, "");
}

function buildTree(root, files) {
  const treeRoot = createDirectoryNode(".");

  for (const file of files) {
    const parts = file.split("/").filter(Boolean);
    let current = treeRoot;

    for (let index = 0; index < parts.length; index += 1) {
      const part = parts[index];
      const isFile = index === parts.length - 1;

      if (isFile) {
        current.files.push(createFileNode(root, file, part));
        continue;
      }

      if (!current.directories.has(part)) {
        current.directories.set(part, createDirectoryNode(part));
      }
      current = current.directories.get(part);
    }
  }

  sortTree(treeRoot);
  return treeRoot;
}

function createDirectoryNode(name) {
  return {
    directories: new Map(),
    directFileCount: 0,
    files: [],
    name,
    totalDirectories: 0,
    totalFiles: 0,
    totalLoc: 0,
  };
}

function createFileNode(root, relativePath, name) {
  const absolutePath = path.join(root, relativePath);

  return {
    loc: countLines(absolutePath),
    name,
  };
}

function countLines(absolutePath) {
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
  } catch {
    return 0;
  } finally {
    if (file !== null) {
      closeFile(file);
    }
  }

  if (bytesReadTotal === 0) {
    return 0;
  }

  return lineBreaks + (lastByte === 10 ? 0 : 1);
}

function closeFile(file) {
  try {
    closeSync(file);
  } catch {
    // Ignore close failures; this script is an inventory helper.
  }
}

function sortTree(node) {
  node.files.sort((left, right) => compareNames(left.name, right.name));
  node.directories = new Map(
    [...node.directories.entries()]
      .sort(([left], [right]) => compareNames(left, right))
      .map(([name, child]) => {
        sortTree(child);
        return [name, child];
      }),
  );
}

function computeTotals(node) {
  node.directFileCount = node.files.length;
  node.totalFiles = node.files.length;
  node.totalDirectories = node.directories.size;
  node.totalLoc = node.files.reduce((sum, file) => sum + file.loc, 0);

  for (const child of node.directories.values()) {
    computeTotals(child);
    node.totalFiles += child.totalFiles;
    node.totalDirectories += child.totalDirectories;
    node.totalLoc += child.totalLoc;
  }
}

function renderTree(root, options) {
  const state = {
    emitted: 0,
    maxNodes: options.maxNodes,
    truncated: false,
  };

  const lines = [
    options.mode === "folders" ? `. (${formatMetrics(root)})` : `. (${formatMetrics(root)})`,
  ];

  const children =
    options.mode === "folders"
      ? directoryEntries(root)
      : [...directoryEntries(root), ...fileEntries(root)];

  renderEntries(lines, children, "", 1, options, state);

  if (state.truncated) {
    lines.push("... output truncated; rerun with --max-nodes 0 or --full for all nodes");
  }

  return lines;
}

function renderEntries(lines, entries, prefix, depth, options, state) {
  if (entries.length === 0) {
    return;
  }

  if (depth > options.depth) {
    lines.push(`${prefix}\`-- ... (${pluralize(countEntryNodes(entries, options.mode), "node")} hidden)`);
    return;
  }

  for (let index = 0; index < entries.length; index += 1) {
    if (state.maxNodes > 0 && state.emitted >= state.maxNodes) {
      state.truncated = true;
      return;
    }

    const entry = entries[index];
    const isLast = index === entries.length - 1;
    lines.push(`${prefix}${isLast ? "`-- " : "|-- "}${formatEntry(entry, options.mode)}`);
    state.emitted += 1;

    if (entry.kind !== "directory") {
      continue;
    }

    const children =
      options.mode === "folders"
        ? directoryEntries(entry.node)
        : [...directoryEntries(entry.node), ...fileEntries(entry.node)];

    renderEntries(lines, children, `${prefix}${isLast ? "    " : "|   "}`, depth + 1, options, state);
  }
}

function directoryEntries(node) {
  return [...node.directories.values()].map((child) => ({
    kind: "directory",
    name: child.name,
    node: child,
  }));
}

function fileEntries(node) {
  return node.files.map((file) => ({
    file,
    kind: "file",
    name: file.name,
  }));
}

function formatEntry(entry, mode) {
  if (entry.kind === "file") {
    return `${entry.name} (${formatFileMetrics(entry.file)})`;
  }

  if (mode === "folders") {
    return `${entry.name}/ (${formatMetrics(entry.node)})`;
  }

  return `${entry.name}/ (${formatMetrics(entry.node)})`;
}

function countEntryNodes(entries, mode) {
  let count = 0;

  for (const entry of entries) {
    count += 1;
    if (entry.kind === "directory") {
      const children =
        mode === "folders"
          ? directoryEntries(entry.node)
          : [...directoryEntries(entry.node), ...fileEntries(entry.node)];
      count += countEntryNodes(children, mode);
    }
  }

  return count;
}

function pluralize(count, noun) {
  return `${count} ${noun}${count === 1 ? "" : "s"}`;
}

function formatMetrics(node) {
  return `${pluralize(node.totalFiles, "file")}, ${formatNumber(node.totalLoc)} loc`;
}

function formatFileMetrics(file) {
  return `${formatNumber(file.loc)} loc`;
}

function formatNumber(value) {
  return value.toLocaleString("en-US");
}

function compareNames(left, right) {
  return left.localeCompare(right, "en", {
    numeric: true,
    sensitivity: "base",
  });
}

function printHelp() {
  process.stdout.write(`repo-tree

Gitignore-aware repository tree for Cflow context gathering.
Every rendered file and directory includes approximate line count.
Use LOC as a rough size signal, not a quality or complexity judgment.

Usage:
  node repo-tree.mjs [root] [--mode folders|names] [--depth N|all] [--max-nodes N]

Options:
  --root PATH       Repository root. Defaults to current directory.
  --mode MODE      folders: directory tree with recursive file counts.
                   names: directory and file tree for naming/grouping review.
  --depth N|all    Maximum tree depth. Defaults to all.
  --max-nodes N    Maximum rendered nodes. Use 0 for no limit. Defaults to ${DEFAULT_MAX_NODES}.
  --full           Alias for --max-nodes 0.
  --no-gitignore   Walk the filesystem instead of using git exclude rules.
  --help           Show this help.

Modes:
  folders          Show only directories, with recursive file and LOC counts.
  names            Show directories and file names, with LOC counts for grouping review.

Use a narrow --depth or --max-nodes when full output would bury the signal.

Default behavior uses:
  git ls-files -co --exclude-standard

That includes tracked files and untracked non-ignored files, while excluding files ignored by
.gitignore, .git/info/exclude, and global Git excludes.
`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
}
