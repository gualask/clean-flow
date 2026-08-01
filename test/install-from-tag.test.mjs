import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";

import {
  installFromTag,
  validateTag,
} from "../src/lib/install-from-tag.mjs";

test("tag install fetches an exact tag and runs its packaged installer", async () => {
  const calls = [];
  const removed = [];
  const io = makeIo();
  const temporaryRoot = path.join(path.sep, "tmp", "cflow-tag-test");
  const packageRoot = path.join(temporaryRoot, "clean-flow");

  const exitCode = await installFromTag({
    tag: "0.0.1",
    installArgs: ["install", "--global", "--dry-run"],
    io,
    dependencies: {
      makeTemporaryDirectory: async () => temporaryRoot,
      removeTemporaryDirectory: async (target) => removed.push(target),
      repository: "https://example.test/clean-flow.git",
      nodeExecutable: "test-node",
      runCommand: async (command, args, commandIo) => {
        calls.push({ command, args, io: commandIo });
        return command === "test-node" ? 9 : 0;
      },
    },
  });

  assert.equal(exitCode, 9);
  assert.deepEqual(
    calls.map(({ command, args }) => ({ command, args })),
    [
      {
        command: "git",
        args: ["init", "--quiet", packageRoot],
      },
      {
        command: "git",
        args: [
          "-C",
          packageRoot,
          "remote",
          "add",
          "origin",
          "https://example.test/clean-flow.git",
        ],
      },
      {
        command: "git",
        args: [
          "-C",
          packageRoot,
          "fetch",
          "--quiet",
          "--depth",
          "1",
          "origin",
          "refs/tags/0.0.1",
        ],
      },
      {
        command: "git",
        args: [
          "-C",
          packageRoot,
          "checkout",
          "--quiet",
          "--detach",
          "FETCH_HEAD",
        ],
      },
      {
        command: "test-node",
        args: [
          path.join(packageRoot, "bin", "cflow-skills.mjs"),
          "install",
          "--global",
          "--dry-run",
        ],
      },
    ],
  );
  assert.ok(calls.every((call) => call.io === io));
  assert.deepEqual(removed, [temporaryRoot]);
  assert.equal(io.stdout.output, "Selected tag: 0.0.1\n");
});

test("tag install cleans its temporary checkout when fetch fails", async () => {
  const removed = [];
  const io = makeIo();

  await assert.rejects(
    () =>
      installFromTag({
        tag: "0.0.1",
        installArgs: ["install", "--global"],
        io,
        dependencies: {
          makeTemporaryDirectory: async () => "/tmp/cflow-tag-failure",
          removeTemporaryDirectory: async (target) => removed.push(target),
          runCommand: async (_command, args) =>
            args.includes("fetch") ? 128 : 0,
        },
      }),
    /Could not fetch Clean Flow tag 0\.0\.1 \(exit code 128\)/,
  );

  assert.deepEqual(removed, ["/tmp/cflow-tag-failure"]);
});

test("tag validation accepts release names and rejects unsafe refs", () => {
  for (const tag of ["0.0.1", "v1.2.3-rc.1", "stable/0.0.1"]) {
    assert.doesNotThrow(() => validateTag(tag));
  }

  for (const tag of [
    "",
    "../main",
    "release@{1}",
    "tag.lock",
    "stable/tag.lock",
    "-branch",
  ]) {
    assert.throws(() => validateTag(tag), /Invalid Git tag/);
  }
});

function makeIo() {
  return {
    stdout: makeWritableBuffer(),
    stderr: makeWritableBuffer(),
  };
}

function makeWritableBuffer() {
  return {
    output: "",
    write(chunk) {
      this.output += chunk;
    },
  };
}
