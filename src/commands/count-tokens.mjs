#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import process from "node:process";

import {
  DEFAULT_TOKEN_MODEL,
  resolveTokenEncoding,
  tokenCountRow,
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

const require = createRequire(import.meta.url);
const modelToEncoding = require("tiktoken/model_to_encoding.json");

const HELP_TEXT = `Usage:
  node src/commands/count-tokens.mjs [--model <model>] [--encoding <encoding>] [--show-encoding] [file ...]
  node src/commands/count-tokens.mjs --help

Defaults:
  --model ${DEFAULT_TOKEN_MODEL}

Notes:
  - Uses the tiktoken package.
  - gpt-5.5* and gpt-5.4* use a local o200k_base override until tiktoken maps them.
  - If tiktoken and the local overrides do not know a model, pass --encoding explicitly.
  - Use "-" or omit files to read stdin.
`;

function parseArgs(argv) {
  const options = {
    model: DEFAULT_TOKEN_MODEL,
    encoding: null,
    showEncoding: false,
    paths: [],
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

    if (arg === "--model" || arg === "--encoding") {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) {
        throw new Error(`${arg} requires a value`);
      }
      options[arg.slice(2)] = value;
      index += 1;
      continue;
    }

    if (arg.startsWith("--")) {
      throw new Error(`Unknown option: ${arg}`);
    }

    options.paths.push(arg);
  }

  return options;
}

async function readInput(pathname) {
  if (pathname === "-") {
    return {
      label: "stdin",
      text: await readStdin(),
    };
  }

  return {
    label: pathname,
    text: await readFile(pathname, "utf8"),
  };
}

async function readStdin() {
  let text = "";
  process.stdin.setEncoding("utf8");
  for await (const chunk of process.stdin) {
    text += chunk;
  }
  return text;
}

function printTable(rows) {
  const headers = ["path", "lines", "chars", "bytes", "tokens"];
  const widths = Object.fromEntries(
    headers.map((header) => [
      header,
      Math.max(header.length, ...rows.map((row) => String(row[header]).length)),
    ]),
  );

  console.log(headers.map((header) => header.padEnd(widths[header])).join("  "));
  console.log(headers.map((header) => "-".repeat(widths[header])).join("  "));

  for (const row of rows) {
    console.log(
      headers
        .map((header) => {
          const value = String(row[header]);
          return header === "path" ? value.padEnd(widths[header]) : value.padStart(widths[header]);
        })
        .join("  "),
    );
  }
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
    const inputs = await Promise.all((options.paths.length > 0 ? options.paths : ["-"]).map(readInput));
    const rows = inputs.map((input) => tokenCountRow(input, resolved.encoder));

    if (options.showEncoding) {
      console.log(`encoding: ${resolved.encodingName}`);
      console.log(`model: ${options.model}`);
      console.log(`source: ${resolved.source}`);
      if (resolved.note) {
        console.log(`note: ${resolved.note}`);
      }
      console.log();
    }

    printTable(rows);
    return 0;
  } finally {
    resolved.encoder.free();
  }
}

process.exitCode = await main();
