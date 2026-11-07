#!/usr/bin/env node
// pnpm vendor: copy each shared/ file into the skills that shared/vendor.json maps it to.
// pnpm vendor -- --check: exit 1 when a copy is missing or differs, without writing.

import path from "node:path";
import { fileURLToPath } from "node:url";

import { findVendorDrift, vendorSharedFiles } from "../lib/vendor.mjs";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const ROOTS = { skillsRoot: path.join(REPO_ROOT, "skills"), sharedRoot: path.join(REPO_ROOT, "shared") };

const check = process.argv.slice(2).includes("--check");

if (check) {
  const problems = await findVendorDrift(ROOTS);
  for (const { path: filePath, problem } of problems) {
    process.stderr.write(`${path.relative(process.cwd(), filePath)}: ${problem}\n`);
  }
  process.exitCode = problems.length > 0 ? 1 : 0;
} else {
  const written = await vendorSharedFiles(ROOTS);
  for (const copy of written) {
    process.stdout.write(`vendored ${path.relative(process.cwd(), copy.copyPath)}\n`);
  }
  process.stdout.write(written.length === 0 ? "vendored copies up to date\n" : "");
}
