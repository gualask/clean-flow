import { spawn } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

export const CLEAN_FLOW_REPOSITORY = "https://github.com/gualask/clean-flow.git";

export async function installFromTag({
  tag,
  installArgs,
  io,
  dependencies = {},
}) {
  validateTag(tag);

  const makeTemporaryDirectory =
    dependencies.makeTemporaryDirectory ?? defaultMakeTemporaryDirectory;
  const removeTemporaryDirectory =
    dependencies.removeTemporaryDirectory ?? defaultRemoveTemporaryDirectory;
  const runCommand = dependencies.runCommand ?? defaultRunCommand;
  const repository = dependencies.repository ?? CLEAN_FLOW_REPOSITORY;
  const nodeExecutable = dependencies.nodeExecutable ?? process.execPath;

  const temporaryRoot = await makeTemporaryDirectory();
  const packageRoot = path.join(temporaryRoot, "clean-flow");
  const tagRef = `refs/tags/${tag}`;

  try {
    await runRequiredCommand(
      runCommand,
      "git",
      ["init", "--quiet", packageRoot],
      io,
      `Could not prepare the temporary checkout for tag ${tag}`,
    );
    await runRequiredCommand(
      runCommand,
      "git",
      ["-C", packageRoot, "remote", "add", "origin", repository],
      io,
      `Could not configure the Clean Flow repository for tag ${tag}`,
    );
    await runRequiredCommand(
      runCommand,
      "git",
      ["-C", packageRoot, "fetch", "--quiet", "--depth", "1", "origin", tagRef],
      io,
      `Could not fetch Clean Flow tag ${tag}`,
    );
    await runRequiredCommand(
      runCommand,
      "git",
      ["-C", packageRoot, "checkout", "--quiet", "--detach", "FETCH_HEAD"],
      io,
      `Could not check out Clean Flow tag ${tag}`,
    );

    io.stdout.write(`Selected tag: ${tag}\n`);
    return await runCommand(
      nodeExecutable,
      [path.join(packageRoot, "bin", "cflow-skills.mjs"), ...installArgs],
      io,
    );
  } finally {
    await removeTemporaryDirectory(temporaryRoot);
  }
}

export function validateTag(tag) {
  if (
    typeof tag !== "string" ||
    tag.length === 0 ||
    tag.length > 128 ||
    !/^[A-Za-z0-9][A-Za-z0-9._/-]*$/.test(tag) ||
    tag.includes("..") ||
    tag.includes("@{") ||
    tag.endsWith("/") ||
    tag.endsWith(".") ||
    tag.includes("//") ||
    tag.split("/").some((component) => component.endsWith(".lock"))
  ) {
    throw new Error(`Invalid Git tag: ${JSON.stringify(tag)}`);
  }
}

async function runRequiredCommand(runCommand, command, args, io, message) {
  const exitCode = await runCommand(command, args, io);
  if (exitCode !== 0) {
    throw new Error(`${message} (exit code ${exitCode})`);
  }
}

async function defaultMakeTemporaryDirectory() {
  return await mkdtemp(path.join(os.tmpdir(), "cflow-install-"));
}

async function defaultRemoveTemporaryDirectory(temporaryRoot) {
  await rm(temporaryRoot, { recursive: true, force: true });
}

async function defaultRunCommand(command, args, io) {
  return await new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: ["ignore", "pipe", "pipe"],
    });

    child.stdout.on("data", (chunk) => io.stdout.write(chunk));
    child.stderr.on("data", (chunk) => io.stderr.write(chunk));
    child.on("error", reject);
    child.on("close", (code, signal) => {
      if (signal) {
        reject(new Error(`${command} terminated by signal ${signal}`));
        return;
      }
      resolve(code ?? 1);
    });
  });
}
