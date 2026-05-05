import assert from "node:assert/strict";
import test from "node:test";

import { main } from "../src/index.mjs";

test("top-level help exits successfully", async () => {
  const io = makeIo();

  const exitCode = await main(["--help"], io);

  assert.equal(exitCode, 0);
  assert.match(io.stdout.output, /Usage:/);
  assert.equal(io.stderr.output, "");
});

test("short top-level help exits successfully", async () => {
  const io = makeIo();

  const exitCode = await main(["-h"], io);

  assert.equal(exitCode, 0);
  assert.match(io.stdout.output, /Usage:/);
  assert.equal(io.stderr.output, "");
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
