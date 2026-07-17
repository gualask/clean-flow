#!/usr/bin/env node

import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";
import process from "node:process";

import {
  buildSkillTokenReport,
  formatSkillTokenReport,
  skillTokenBudgetsFromEnv,
} from "../lib/skill-token-report.mjs";
import { createMaterializedSkills } from "../lib/materialize-skills.mjs";
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
const DEFAULT_CONTEXT_MAP = fileURLToPath(
  new URL("./skill-token-report.context.json", import.meta.url),
);

const require = createRequire(import.meta.url);
const modelToEncoding = require("tiktoken/model_to_encoding.json");

const HELP_TEXT = `Usage:
  node src/commands/skill-token-report.mjs [skill-name] [--skills-root <path>] [--context-map <path>] [--model <model>] [--encoding <encoding>] [--show-encoding]
  node src/commands/skill-token-report.mjs --help

Defaults:
  --skills-root ${path.relative(process.cwd(), DEFAULT_SKILLS_ROOT) || "."}
  --context-map ${path.relative(process.cwd(), DEFAULT_CONTEXT_MAP) || "."} for the packaged skills root
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
    contextMap: null,
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

    if (
      arg === "--skills-root" ||
      arg === "--context-map" ||
      arg === "--model" ||
      arg === "--encoding"
    ) {
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
    const contextMapPath =
      options.contextMap !== null
        ? path.resolve(options.contextMap)
        : skillsRoot === DEFAULT_SKILLS_ROOT
          ? DEFAULT_CONTEXT_MAP
          : null;
    const contextMap = await readContextMap(contextMapPath);
    const materialized = await createMaterializedSkills(skillsRoot);

    try {
      const report = await buildSkillTokenReport({
        skillsRoot: materialized.skillsRoot,
        rootForLabels: materialized.skillsRoot,
        encoder: resolved.encoder,
        budgets: skillTokenBudgetsFromEnv(),
        skillName: options.skillName,
        contextMap,
      });

      process.stdout.write(
        formatSkillTokenReport(report, {
          model: options.model,
          encodingName: resolved.encodingName,
          source: resolved.source,
        }),
      );
    } finally {
      await materialized.cleanup();
    }

    if (options.showEncoding && resolved.note) {
      process.stdout.write(`\nEncoding note: ${resolved.note}\n`);
    }

    return 0;
  } finally {
    resolved.encoder.free();
  }
}

async function readContextMap(filePath) {
  if (filePath === null) {
    return null;
  }

  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch (error) {
    throw new Error(`Cannot load skill context map ${filePath}: ${error.message}`);
  }
}

process.exitCode = await main();
