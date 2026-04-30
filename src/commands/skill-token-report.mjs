#!/usr/bin/env node

import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import process from "node:process";

import {
  buildSkillTokenReport,
  formatSkillTokenReport,
  skillTokenBudgetsFromEnv,
} from "../lib/skill-token-report.mjs";
import {
  DEFAULT_TOKEN_MODEL,
  resolveTokenEncoding,
} from "../lib/token-count.mjs";

let tiktoken;
try {
  tiktoken = await import("tiktoken");
} catch (error) {
  if (error?.code === "ERR_MODULE_NOT_FOUND" || error?.code === "MODULE_NOT_FOUND") {
    console.error("Missing dependency: tiktoken");
    console.error("Install project dependencies with: pnpm install");
    process.exit(2);
  }
  throw error;
}

const PACKAGE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const DEFAULT_SKILLS_ROOT = path.join(PACKAGE_ROOT, "skills");

const require = createRequire(import.meta.url);
const modelToEncoding = require("tiktoken/model_to_encoding.json");

const HELP_TEXT = `Usage:
  node src/commands/skill-token-report.mjs [skill-name] [--skills-root <path>] [--model <model>] [--encoding <encoding>] [--show-encoding]
  node src/commands/skill-token-report.mjs --help

Defaults:
  --skills-root ${path.relative(process.cwd(), DEFAULT_SKILLS_ROOT) || "."}
  --model ${DEFAULT_TOKEN_MODEL}

Environment budgets:
  CFLOW_SKILL_NAME_CHAR_WARNING             default 64
  CFLOW_SKILL_DESCRIPTION_CHAR_WARNING      default 1024
  CFLOW_SKILL_METADATA_TOKEN_WARNING        default 100
  CFLOW_SKILL_MD_TOKEN_WARNING              default 4000
  CFLOW_SKILL_MD_TOKEN_HARD_WARNING         default 5000
  CFLOW_SKILL_RESOURCE_TOKEN_WARNING        default 2000
`;

function parseArgs(argv) {
  const options = {
    skillsRoot: DEFAULT_SKILLS_ROOT,
    model: DEFAULT_TOKEN_MODEL,
    encoding: null,
    showEncoding: false,
    skillName: null,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--") {
      continue;
    }

    if (arg === "--help" || arg === "-h") {
      return { ...options, help: true };
    }

    if (arg === "--show-encoding") {
      options.showEncoding = true;
      continue;
    }

    if (arg === "--skills-root" || arg === "--model" || arg === "--encoding") {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) {
        throw new Error(`${arg} requires a value`);
      }
      options[arg.slice(2).replace(/-([a-z])/g, (_, char) => char.toUpperCase())] = value;
      index += 1;
      continue;
    }

    if (arg.startsWith("-")) {
      throw new Error(`Unknown option: ${arg}`);
    }

    if (options.skillName !== null) {
      throw new Error(`Pass at most one skill name`);
    }

    options.skillName = arg;
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

  let resolved;
  try {
    resolved = resolveTokenEncoding({
      tiktoken,
      modelToEncoding,
      model: options.model,
      encoding: options.encoding,
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return 2;
  }

  try {
    const skillsRoot = path.resolve(options.skillsRoot);
    const report = await buildSkillTokenReport({
      skillsRoot,
      rootForLabels: PACKAGE_ROOT,
      encoder: resolved.encoder,
      budgets: skillTokenBudgetsFromEnv(),
      skillName: options.skillName,
    });

    process.stdout.write(
      formatSkillTokenReport(report, {
        model: options.model,
        encodingName: resolved.encodingName,
        source: resolved.source,
      }),
    );

    if (options.showEncoding && resolved.note) {
      process.stdout.write(`\nEncoding note: ${resolved.note}\n`);
    }

    return 0;
  } finally {
    resolved.encoder.free();
  }
}

process.exitCode = await main();
