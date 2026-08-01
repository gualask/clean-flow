#!/usr/bin/env node

import path from "node:path";
import process from "node:process";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import {
  buildProseDuplicationReport,
  formatProseDuplicationReport,
} from "../lib/prose-duplication.mjs";
import { buildProseContextModel } from "../lib/prose-duplication-context.mjs";

const PACKAGE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const DEFAULT_SKILLS_ROOT = path.join(PACKAGE_ROOT, "skills");
const DEFAULT_CONTEXT_MAP = fileURLToPath(
  new URL("./skill-token-report.context.json", import.meta.url),
);
const DEFAULT_VENDOR_CONFIG = path.join(DEFAULT_SKILLS_ROOT, "_shared", "vendor.json");

const HELP_TEXT = `Usage:
  node src/commands/prose-duplication-report.mjs [options] [path ...]

Options:
  --min-words <count>  Minimum normalized block length in words (default: 12)
  --min-chars <count>  Minimum normalized block length in characters (default: 80)
  --limit <count>      Maximum candidates to print (default: 30)
  --similarity <ratio> Minimum fuzzy similarity from 0 to 1 (default: 0.86)
  --exact-only         Skip fuzzy comparison
  --skills-root <path> Source skills root used for runtime bindings
  --context-map <path> Flow context map
  --vendor-config <path> Shared vendoring configuration
  --json               Print the report as JSON
  --help                Show this help

Defaults:
  Paths: skills
  Context map: src/commands/skill-token-report.context.json

Notes:
  - A block is delimited by a blank Markdown line, not by every newline.
  - Whitespace, wrapping, and list marker style are normalized before comparison.
  - Frontmatter, fenced code, HTML comments, headings, and short blocks are ignored.
  - This exploratory report always exits successfully when candidates are found.
`;

function parseArgs(argv) {
  const options = {
    inputPaths: [],
    skillsRoot: DEFAULT_SKILLS_ROOT,
    contextMapPath: DEFAULT_CONTEXT_MAP,
    vendorConfigPath: DEFAULT_VENDOR_CONFIG,
    minWords: 12,
    minChars: 80,
    limit: 30,
    similarityThreshold: 0.86,
    exactOnly: false,
    json: false,
    help: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--") {
      continue;
    }

    if (arg === "--help" || arg === "-h") {
      options.help = true;
      continue;
    }

    if (arg === "--json") {
      options.json = true;
      continue;
    }

    if (arg === "--exact-only") {
      options.exactOnly = true;
      continue;
    }

    if (arg === "--similarity") {
      const rawValue = argv[index + 1];
      const value = Number(rawValue);
      if (!rawValue || !Number.isFinite(value) || value <= 0 || value > 1) {
        throw new Error(`${arg} requires a number greater than 0 and at most 1`);
      }
      options.similarityThreshold = value;
      index += 1;
      continue;
    }

    if (["--skills-root", "--context-map", "--vendor-config"].includes(arg)) {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) {
        throw new Error(`${arg} requires a path`);
      }
      const optionName = {
        "--skills-root": "skillsRoot",
        "--context-map": "contextMapPath",
        "--vendor-config": "vendorConfigPath",
      }[arg];
      options[optionName] = path.resolve(value);
      index += 1;
      continue;
    }

    if (["--min-words", "--min-chars", "--limit"].includes(arg)) {
      const rawValue = argv[index + 1];
      const value = Number(rawValue);
      if (!/^\d+$/.test(rawValue ?? "") || !Number.isSafeInteger(value) || value < 1) {
        throw new Error(`${arg} requires a positive integer`);
      }
      options[toOptionName(arg)] = value;
      index += 1;
      continue;
    }

    if (arg.startsWith("--")) {
      throw new Error(`Unknown option: ${arg}`);
    }

    options.inputPaths.push(arg);
  }

  if (options.inputPaths.length === 0) {
    options.inputPaths = [options.skillsRoot];
  }

  return options;
}

async function main() {
  let options;
  try {
    options = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error(`Error: ${error.message}\n\n${HELP_TEXT}`);
    return 1;
  }

  if (options.help) {
    console.log(HELP_TEXT.trimEnd());
    return 0;
  }

  try {
    const [contextMap, vendorConfig] = await Promise.all([
      readJson(options.contextMapPath),
      readJson(options.vendorConfigPath),
    ]);
    const contextModel = buildProseContextModel({
      skillsRoot: options.skillsRoot,
      contextMap,
      vendorConfig,
    });
    const report = await buildProseDuplicationReport({ ...options, contextModel });
    console.log(options.json ? JSON.stringify(report, null, 2) : formatProseDuplicationReport(report));
    return 0;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return 1;
  }
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

function toOptionName(arg) {
  return arg.replace(/^--/, "").replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

process.exitCode = await main();
