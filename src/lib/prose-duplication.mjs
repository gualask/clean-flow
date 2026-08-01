import path from "node:path";
import { readFile, readdir, stat } from "node:fs/promises";

import { contextCategoryPriority } from "./prose-duplication-context.mjs";

const DEFAULT_IGNORED_DIRECTORIES = new Set([
  ".git",
  ".pnpm-store",
  "coverage",
  "node_modules",
]);

export async function listMarkdownFiles(inputPaths) {
  const files = [];

  for (const inputPath of inputPaths) {
    const inputStat = await stat(inputPath);
    if (inputStat.isDirectory()) {
      files.push(...(await listDirectoryMarkdownFiles(inputPath)));
    } else if (inputStat.isFile() && path.extname(inputPath).toLowerCase() === ".md") {
      files.push(inputPath);
    }
  }

  return [...new Set(files.map((filePath) => path.resolve(filePath)))].sort();
}

export function extractMarkdownBlocks(text, filePath, { minWords = 12, minChars = 80 } = {}) {
  const lines = text.split(/\r?\n/);
  const blocks = [];
  let current = [];
  let startLine = null;
  let inFrontmatter = lines[0]?.trim() === "---";
  let inFence = false;
  let inComment = false;

  const flush = () => {
    if (current.length === 0) {
      return;
    }

    const raw = current.join("\n");
    const normalized = normalizeProseBlock(raw);
    const tokens = tokenizeWords(normalized);

    if (
      normalized.length >= minChars &&
      tokens.length >= minWords &&
      !isStructuralBlock(normalized)
    ) {
      blocks.push({
        filePath,
        line: startLine,
        normalized,
        tokens,
        comparisonTokens: tokens.map((token) => token.toLowerCase()),
        words: tokens.length,
      });
    }

    current = [];
    startLine = null;
  };

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmed = line.trim();

    if (inFrontmatter) {
      if (index > 0 && trimmed === "---") {
        inFrontmatter = false;
      }
      continue;
    }

    if (inComment) {
      if (trimmed.includes("-->")) {
        inComment = false;
      }
      continue;
    }

    if (trimmed.startsWith("<!--")) {
      flush();
      inComment = !trimmed.includes("-->");
      continue;
    }

    if (/^(```|~~~)/.test(trimmed)) {
      flush();
      inFence = !inFence;
      continue;
    }

    if (inFence) {
      continue;
    }

    if (trimmed === "") {
      flush();
      continue;
    }

    if (startLine === null) {
      startLine = index + 1;
    }
    current.push(line);
  }

  flush();
  return blocks;
}

export function findDuplicateBlocks(blocks, { limit = Number.POSITIVE_INFINITY } = {}) {
  const groups = new Map();

  for (const block of blocks) {
    const occurrences = groups.get(block.normalized) ?? [];
    occurrences.push(block);
    groups.set(block.normalized, occurrences);
  }

  return [...groups.entries()]
    .filter(([, occurrences]) => occurrences.length > 1)
    .map(([text, occurrences]) => ({
      text,
      words: occurrences[0].words,
      occurrences,
      repeatedChars: text.length * (occurrences.length - 1),
    }))
    .sort(
      (left, right) =>
        right.repeatedChars - left.repeatedChars ||
        right.occurrences.length - left.occurrences.length ||
        left.text.localeCompare(right.text),
    )
    .slice(0, limit);
}

export function findSimilarBlocks(
  blocks,
  { similarityThreshold = 0.86, limit = Number.POSITIVE_INFINITY } = {},
) {
  const candidates = [];

  for (let leftIndex = 0; leftIndex < blocks.length; leftIndex += 1) {
    const left = blocks[leftIndex];
    for (let rightIndex = leftIndex + 1; rightIndex < blocks.length; rightIndex += 1) {
      const right = blocks[rightIndex];
      if (left.normalized === right.normalized) {
        continue;
      }

      const maximumWords = Math.max(left.words, right.words);
      const minimumWords = Math.min(left.words, right.words);
      if (minimumWords / maximumWords < similarityThreshold) {
        continue;
      }

      const overlap = multisetDiceCoefficient(left.comparisonTokens, right.comparisonTokens);
      if (overlap < Math.max(0, similarityThreshold - 0.12)) {
        continue;
      }

      const distance = wordEditDistance(left.comparisonTokens, right.comparisonTokens);
      const similarity = 1 - distance / maximumWords;
      if (similarity < similarityThreshold) {
        continue;
      }

      const delta = wordDelta(left.tokens, right.tokens);
      candidates.push({
        similarity,
        distance,
        matchedWords: maximumWords - distance,
        left,
        right,
        removed: delta.removed,
        added: delta.added,
      });
    }
  }

  return candidates
    .sort(
      (left, right) =>
        right.matchedWords - left.matchedWords ||
        right.similarity - left.similarity ||
        left.left.filePath.localeCompare(right.left.filePath) ||
        left.left.line - right.left.line,
    )
    .slice(0, limit);
}

export async function buildProseDuplicationReport({
  inputPaths,
  rootForLabels = process.cwd(),
  minWords = 12,
  minChars = 80,
  limit = 30,
  similarityThreshold = 0.86,
  exactOnly = false,
  contextModel = null,
}) {
  const filePaths = await listMarkdownFiles(inputPaths);
  const blocks = [];

  for (const filePath of filePaths) {
    const text = await readFile(filePath, "utf8");
    blocks.push(
      ...extractMarkdownBlocks(text, filePath, { minWords, minChars }).map((block) => ({
        ...block,
        runtimeIds: contextModel?.runtimeIdsFor(filePath) ?? [],
      })),
    );
  }

  const duplicates = findDuplicateBlocks(blocks)
    .map((duplicate) => enrichExactCandidate(duplicate, contextModel))
    .sort(compareContextCandidates)
    .slice(0, limit);
  const similar = exactOnly
    ? []
    : findSimilarBlocks(blocks, { similarityThreshold })
        .map((candidate) => enrichSimilarCandidate(candidate, contextModel))
        .sort(compareContextCandidates)
        .slice(0, limit);
  return {
    filesScanned: filePaths.length,
    blocksCompared: blocks.length,
    minWords,
    minChars,
    similarityThreshold,
    exactOnly,
    duplicates: duplicates.map((duplicate) => ({
      ...duplicate,
      occurrences: duplicate.occurrences.map((occurrence) => ({
        path: relativeLabel(rootForLabels, occurrence.filePath),
        line: occurrence.line,
      })),
    })),
    similar: similar.map((candidate) => ({
      similarity: candidate.similarity,
      distance: candidate.distance,
      matchedWords: candidate.matchedWords,
      context: candidate.context,
      avoidableWords: candidate.avoidableWords,
      left: blockLocation(rootForLabels, candidate.left),
      right: blockLocation(rootForLabels, candidate.right),
      removed: candidate.removed,
      added: candidate.added,
    })),
  };
}

export function formatProseDuplicationReport(report) {
  const allCandidates = [
    ...report.duplicates.map((candidate) => ({ ...candidate, kind: "exact" })),
    ...report.similar.map((candidate) => ({ ...candidate, kind: "similar" })),
  ].sort(compareContextCandidates);
  const categoryCounts = countCategories(allCandidates);
  const lines = [
    "Prose duplication candidates",
    `Scanned: ${report.filesScanned} Markdown files; ${report.blocksCompared} eligible blocks`,
    `Thresholds: ${report.minWords} words; ${report.minChars} characters`,
    `Similarity threshold: ${(report.similarityThreshold * 100).toFixed(1)}%`,
    `Exact candidates: ${report.duplicates.length}`,
    `Similar candidates: ${report.similar.length}${report.exactOnly ? " (disabled)" : ""}`,
    `Context priority: ${formatCategoryCounts(categoryCounts)}`,
  ];

  for (const category of contextCategoryOrder()) {
    const candidates = allCandidates.filter((candidate) => candidate.context.category === category);
    if (candidates.length === 0) {
      continue;
    }

    lines.push("");
    lines.push(`${contextCategoryLabel(category)}:`);
    for (const [index, candidate] of candidates.entries()) {
      lines.push("");
      if (candidate.kind === "exact") {
        formatExactCandidate(lines, candidate, index);
      } else {
        formatSimilarCandidate(lines, candidate, index);
      }
    }
  }

  return lines.join("\n");
}

function normalizeProseBlock(raw) {
  return raw
    .split("\n")
    .map((line) =>
      line
        .trim()
        .replace(/^(?:[-+*]|\d+[.)])\s+/, "• ")
        .replace(/\s+/g, " "),
    )
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenizeWords(text) {
  return text.match(/[\p{L}\p{N}][\p{L}\p{N}'’_-]*/gu) ?? [];
}

function multisetDiceCoefficient(left, right) {
  const counts = new Map();
  for (const token of left) {
    counts.set(token, (counts.get(token) ?? 0) + 1);
  }

  let overlap = 0;
  for (const token of right) {
    const remaining = counts.get(token) ?? 0;
    if (remaining > 0) {
      overlap += 1;
      counts.set(token, remaining - 1);
    }
  }

  return (2 * overlap) / (left.length + right.length);
}

function wordEditDistance(left, right) {
  let previous = Array.from({ length: right.length + 1 }, (_, index) => index);

  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    const current = [leftIndex];
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const substitutionCost = left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1;
      current[rightIndex] = Math.min(
        previous[rightIndex] + 1,
        current[rightIndex - 1] + 1,
        previous[rightIndex - 1] + substitutionCost,
      );
    }
    previous = current;
  }

  return previous[right.length];
}

function wordDelta(left, right) {
  const leftComparable = left.map((token) => token.toLowerCase());
  const rightComparable = right.map((token) => token.toLowerCase());
  const matrix = Array.from({ length: left.length + 1 }, () =>
    Array(right.length + 1).fill(0),
  );

  for (let leftIndex = 0; leftIndex <= left.length; leftIndex += 1) {
    matrix[leftIndex][0] = leftIndex;
  }
  for (let rightIndex = 0; rightIndex <= right.length; rightIndex += 1) {
    matrix[0][rightIndex] = rightIndex;
  }

  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const substitutionCost =
        leftComparable[leftIndex - 1] === rightComparable[rightIndex - 1] ? 0 : 1;
      matrix[leftIndex][rightIndex] = Math.min(
        matrix[leftIndex - 1][rightIndex] + 1,
        matrix[leftIndex][rightIndex - 1] + 1,
        matrix[leftIndex - 1][rightIndex - 1] + substitutionCost,
      );
    }
  }

  const removed = [];
  const added = [];
  let leftIndex = left.length;
  let rightIndex = right.length;

  while (leftIndex > 0 || rightIndex > 0) {
    if (
      leftIndex > 0 &&
      rightIndex > 0 &&
      leftComparable[leftIndex - 1] === rightComparable[rightIndex - 1]
    ) {
      leftIndex -= 1;
      rightIndex -= 1;
    } else if (
      leftIndex > 0 &&
      rightIndex > 0 &&
      matrix[leftIndex][rightIndex] === matrix[leftIndex - 1][rightIndex - 1] + 1
    ) {
      removed.push(left[leftIndex - 1]);
      added.push(right[rightIndex - 1]);
      leftIndex -= 1;
      rightIndex -= 1;
    } else if (
      leftIndex > 0 &&
      matrix[leftIndex][rightIndex] === matrix[leftIndex - 1][rightIndex] + 1
    ) {
      removed.push(left[leftIndex - 1]);
      leftIndex -= 1;
    } else {
      added.push(right[rightIndex - 1]);
      rightIndex -= 1;
    }
  }

  return {
    removed: removed.reverse(),
    added: added.reverse(),
  };
}

function isStructuralBlock(text) {
  return /^(?:#{1,6}\s+[^#]+|[-*_]{3,}|\[[^\]]+\]:\s+\S+)$/.test(text);
}

async function listDirectoryMarkdownFiles(directoryPath) {
  const entries = await readdir(directoryPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.isDirectory() && DEFAULT_IGNORED_DIRECTORIES.has(entry.name)) {
      continue;
    }

    const entryPath = path.join(directoryPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listDirectoryMarkdownFiles(entryPath)));
    } else if (entry.isFile() && path.extname(entry.name).toLowerCase() === ".md") {
      files.push(entryPath);
    }
  }

  return files;
}

function relativeLabel(root, filePath) {
  const relativePath = path.relative(root, filePath);
  return relativePath === "" ? path.basename(filePath) : relativePath;
}

function blockLocation(root, block) {
  return {
    path: relativeLabel(root, block.filePath),
    line: block.line,
    words: block.words,
    text: block.normalized,
  };
}

function truncate(text, maxLength) {
  return text.length <= maxLength ? text : `${text.slice(0, maxLength - 1)}…`;
}

function enrichExactCandidate(candidate, contextModel) {
  const context = classifyContext(contextModel, candidate.occurrences);
  return {
    ...candidate,
    context,
    avoidableWords: candidate.words * context.duplicateCopies,
  };
}

function enrichSimilarCandidate(candidate, contextModel) {
  const context = classifyContext(contextModel, [candidate.left, candidate.right]);
  return {
    ...candidate,
    context,
    avoidableWords: candidate.matchedWords * context.duplicateCopies,
  };
}

function classifyContext(contextModel, occurrences) {
  return (
    contextModel?.classify(occurrences) ?? {
      category: "unclassified",
      contexts: [],
      duplicateCopies: 0,
    }
  );
}

function compareContextCandidates(left, right) {
  return (
    contextCategoryPriority(right.context.category) -
      contextCategoryPriority(left.context.category) ||
    right.avoidableWords - left.avoidableWords ||
    (right.repeatedChars ?? right.matchedWords) -
      (left.repeatedChars ?? left.matchedWords) ||
    (right.similarity ?? 1) - (left.similarity ?? 1)
  );
}

function formatContext(candidate) {
  const contextIds = candidate.context.contexts.slice(0, 3).join(", ");
  const location = contextIds === "" ? candidate.context.category : `${candidate.context.category} in ${contextIds}`;
  const savings = candidate.avoidableWords > 0 ? `; ~${candidate.avoidableWords} avoidable context words` : "";
  return `${location}${savings}`;
}

function countCategories(candidates) {
  const counts = new Map();
  for (const candidate of candidates) {
    counts.set(candidate.context.category, (counts.get(candidate.context.category) ?? 0) + 1);
  }
  return counts;
}

function formatCategoryCounts(counts) {
  const values = contextCategoryOrder()
    .filter((category) => counts.has(category))
    .map((category) => `${category} ${counts.get(category)}`);
  return values.length === 0 ? "none" : values.join("; ");
}

function formatExactCandidate(lines, candidate, index) {
  lines.push(
    `${index + 1}. Exact; ${candidate.words} words; ${candidate.occurrences.length} occurrences; ${formatContext(candidate)}`,
  );
  lines.push(`   ${truncate(candidate.text, 240)}`);
  for (const occurrence of candidate.occurrences) {
    lines.push(`   - ${occurrence.path}:${occurrence.line}`);
  }
}

function formatSimilarCandidate(lines, candidate, index) {
  lines.push(
    `${index + 1}. Similar ${(candidate.similarity * 100).toFixed(1)}%; delta ${candidate.distance} words; ${formatContext(candidate)}`,
  );
  lines.push(`   - ${candidate.left.path}:${candidate.left.line}`);
  lines.push(`     ${truncate(candidate.left.text, 200)}`);
  lines.push(`   - ${candidate.right.path}:${candidate.right.line}`);
  lines.push(`     ${truncate(candidate.right.text, 200)}`);
  if (candidate.removed.length > 0) {
    lines.push(`   removed: ${truncate(candidate.removed.join(" "), 180)}`);
  }
  if (candidate.added.length > 0) {
    lines.push(`   added:   ${truncate(candidate.added.join(" "), 180)}`);
  }
}

function contextCategoryOrder() {
  return ["same-flow", "same-thread", "same-skill", "cross-skill", "maintainer-only", "unclassified"];
}

function contextCategoryLabel(category) {
  return {
    "same-flow": "Same flow — can share one runtime context",
    "same-thread": "Same thread — can accumulate through a handoff",
    "same-skill": "Same skill — currently separated by flow",
    "cross-skill": "Cross skill — not co-loaded by the current context map",
    "maintainer-only": "Maintainer-only or mixed non-runtime text",
    unclassified: "Unclassified context",
  }[category];
}
