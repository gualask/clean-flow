import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { rm, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

import { makeTempWorkspace } from "./support/helpers.mjs";

const execFileAsync = promisify(execFile);
const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SCRIPT_PATH = path.join(REPO_ROOT, "shared", "scripts", "tree-check.mjs");

// A minimal SCIP (protobuf) encoder: enough for documents, occurrences and their ranges.
const varint = (n) => {
  const out = [];
  do {
    let b = n & 0x7f;
    n = Math.floor(n / 128);
    if (n) b |= 0x80;
    out.push(b);
  } while (n);
  return Buffer.from(out);
};
const field = (num, wire, payload) =>
  Buffer.concat([varint((num << 3) | wire), wire === 2 ? Buffer.concat([varint(payload.length), payload]) : varint(payload)]);
const packed = (ints) => Buffer.concat(ints.map(varint));
const message = (fields) => Buffer.concat(fields);

const SYMBOL = (path, descriptor) => `t . pkg 1 ${path.replace(/\.ts$/, "").split("/").map((p) => `${p}/`).join("")}${descriptor}`;

// typed: write the ranges in the typed fields of newer indexers (single-line 8 and 10, multi-line 11).
function occurrence({ range, symbol, def = false, enclosing = null }, typed) {
  const parts = [];
  if (typed) parts.push(field(8, 2, message([field(1, 0, range[0]), field(2, 0, range[1]), field(3, 0, range[2])])));
  else parts.push(field(1, 2, packed(range)));
  parts.push(field(2, 2, Buffer.from(symbol)), field(3, 0, def ? 1 : 0));
  if (enclosing) {
    if (typed) parts.push(field(11, 2, message(enclosing.map((v, i) => field(i + 1, 0, v)))));
    else parts.push(field(7, 2, packed(enclosing)));
  }
  return message(parts);
}
function index(documents, { typed = false, withRanges = true } = {}) {
  return message(
    documents.map(({ path, occurrences }) =>
      field(2, 2, message([
        field(1, 2, Buffer.from(path)),
        ...occurrences.map((o) => field(2, 2, occurrence(withRanges ? o : { ...o, enclosing: null }, typed))),
      ])),
    ),
  );
}

// Two files whose top-level types use each other: src/a/x.ts#A uses B, src/b/y.ts#B uses A and A::run().
const A = SYMBOL("src/a/x.ts", "A#");
const RUN = SYMBOL("src/a/x.ts", "A#run().");
const B = SYMBOL("src/b/y.ts", "B#");
const DOCS = [
  {
    path: "src/a/x.ts",
    occurrences: [
      { range: [0, 6, 7], symbol: A, def: true, enclosing: [0, 0, 9, 1] },
      { range: [2, 2, 5], symbol: RUN, def: true, enclosing: [2, 0, 4, 1] },
      { range: [3, 10, 11], symbol: B },
    ],
  },
  {
    path: "src/b/y.ts",
    occurrences: [
      { range: [0, 6, 7], symbol: B, def: true, enclosing: [0, 0, 9, 1] },
      { range: [3, 10, 11], symbol: A },
    ],
  },
  { path: "src/b/y_test.ts", occurrences: [{ range: [1, 0, 1], symbol: RUN }] },
];

async function check(tree, docs = DOCS, options = {}) {
  const dir = await makeTempWorkspace("tree-check-");
  try {
    await writeFile(path.join(dir, "index.scip"), index(docs, options));
    await writeFile(path.join(dir, "tree.txt"), tree);
    const { stdout } = await execFileAsync(process.execPath, [SCRIPT_PATH, path.join(dir, "index.scip"), path.join(dir, "tree.txt")]);
    return stdout;
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

test("tree-check reports a cycle between modules with the elements that cause it, and leaves test files out", async () => {
  const out = await check("[M]\na src/a\nb src/b\n");
  assert.match(out, /Index: 2 source files/);
  assert.match(out, /Cycles: 1\n- a, b/);
  assert.match(out, /a -> b\n {4}B \(src\/b\/y\.ts\), used in src\/a\/x\.ts/);
  assert.match(out, /b -> a\n {4}A \(src\/a\/x\.ts\), used in src\/b\/y\.ts/);
  assert.match(out, /Module edges: 2 \(--edges lists them\)/);
});

test("tree-check reports a use against the order of the groups", async () => {
  const out = await check("[Shared]\nb src/b\n[Modules]\na src/a\n");
  assert.match(out, /Uses against the direction of the groups: 1\n {2}\[Shared\] uses \[Modules\]:\n {2}b -> a/);
});

test("moving one element clears the cycle, and one method can move alone", async () => {
  assert.match(await check("[M]\na src/a\nb src/b\na src/b/y.ts#B\n"), /Cycles: none/);
  const out = await check("[M]\na src/a\nb src/b\nb src/a/x.ts#A::run()\n");
  assert.match(out, /Tree lines that match no code: none/);
});

test("a port line names its port, turns the use, and flags a line that turns none", async () => {
  const out = await check("[M]\na src/a\nb src/b\nport a BPort src/b/y.ts#B\nport b Unused src/a/x.ts#A::run()\n");
  assert.match(out, /Ports the tree introduces: 2\n {2}BPort \(owned by a\)\n {4}B \(src\/b\/y\.ts\): turns a <- b in src\/a\/x\.ts/);
  assert.match(out, /Unused \(owned by b\)\n {4}A::run\(\) \(src\/a\/x\.ts\): TURNS NO USE/);
  assert.match(out, /Cycles: none/);
});

test("tree lines that match no code are listed with what the file defines, and the old port form is refused", async () => {
  const out = await check("[M]\na src/a\nb src/b\na src/b/y.ts#C\nport a src/b/y.ts#B\n");
  assert.match(out, /line 4: src\/b\/y\.ts#C\n {4}src\/b\/y\.ts defines: B/);
  assert.match(out, /line 5: a port line is `port <module> <Port> <path>#<element>`/);
  assert.match(out, /Cycles: 1/);
});

test("typed ranges of newer indexers give the same result", async () => {
  assert.match(await check("[M]\na src/a\nb src/b\n", DOCS, { typed: true }), /Cycles: 1\n- a, b/);
});

test("an index without definition ranges stops the check instead of reporting no cycle", async () => {
  await assert.rejects(check("[M]\na src/a\nb src/b\n", DOCS, { withRanges: false }), (error) => {
    assert.equal(error.code, 3);
    assert.match(error.stderr, /gives no definition ranges/);
    return true;
  });
});
