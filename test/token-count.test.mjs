import assert from "node:assert/strict";
import test from "node:test";

import {
  DEFAULT_TOKEN_MODEL,
  findLocalModelEncodingOverride,
  lineCount,
  resolveTokenEncoding,
  tokenCountRow,
} from "../src/lib/token-count.mjs";

function makeTiktokenStub({ knownModels = {} } = {}) {
  return {
    encoding_for_model(model) {
      const encodingName = knownModels[model];
      if (!encodingName) {
        throw new Error(`unknown model: ${model}`);
      }
      return makeEncoder(encodingName);
    },
    get_encoding(encodingName) {
      return makeEncoder(encodingName);
    },
  };
}

function makeEncoder(name) {
  return {
    name,
    encode(text) {
      return Array.from(text);
    },
    free() {},
  };
}

test("token model defaults to GPT-5.5", () => {
  assert.equal(DEFAULT_TOKEN_MODEL, "gpt-5.5");
});

test("token encoding resolves known models through tiktoken first", () => {
  const resolved = resolveTokenEncoding({
    tiktoken: makeTiktokenStub({ knownModels: { "gpt-5": "o200k_base" } }),
    modelToEncoding: { "gpt-5": "o200k_base" },
    model: "gpt-5",
    encoding: null,
  });

  assert.equal(resolved.encodingName, "o200k_base");
  assert.equal(resolved.encoder.name, "o200k_base");
  assert.equal(resolved.source, "model");
  assert.equal(resolved.note, null);
});

test("token encoding uses explicit encoding before model resolution", () => {
  const resolved = resolveTokenEncoding({
    tiktoken: makeTiktokenStub(),
    model: "unknown-model",
    encoding: "cl100k_base",
  });

  assert.equal(resolved.encodingName, "cl100k_base");
  assert.equal(resolved.source, "explicit");
});

test("token encoding locally maps GPT-5.5 and GPT-5.4 family variants", () => {
  for (const model of [
    "gpt-5.5",
    "gpt-5.5-mini",
    "gpt-5.5-nano",
    "gpt-5.5-chat-latest",
    "gpt-5.5-2026-04-28",
    "gpt-5.4",
    "gpt-5.4-mini",
    "gpt-5.4-nano",
  ]) {
    const resolved = resolveTokenEncoding({
      tiktoken: makeTiktokenStub(),
      model,
      encoding: null,
    });

    assert.equal(resolved.encodingName, "o200k_base", model);
    assert.equal(resolved.source, "local-override", model);
    assert.match(resolved.note, /temporary GPT-5\.[45] family override/, model);
  }
});

test("token encoding rejects unknown models without an override", () => {
  assert.throws(
    () =>
      resolveTokenEncoding({
        tiktoken: makeTiktokenStub(),
        model: "unknown-model",
        encoding: null,
      }),
    /tiktoken does not know model/,
  );
});

test("local model override only matches GPT-5.5 and GPT-5.4 model families", () => {
  assert.equal(findLocalModelEncodingOverride("gpt-5.5-mini")?.encodingName, "o200k_base");
  assert.equal(findLocalModelEncodingOverride("gpt-5.4-mini")?.encodingName, "o200k_base");
  assert.equal(findLocalModelEncodingOverride("not-gpt-5.5"), null);
  assert.equal(findLocalModelEncodingOverride("gpt-5.50"), null);
});

test("token count rows include stable text metrics", () => {
  const row = tokenCountRow({ label: "example.md", text: "ab\nc" }, makeEncoder("test"));

  assert.deepEqual(row, {
    path: "example.md",
    lines: 2,
    chars: 4,
    bytes: 4,
    tokens: 4,
  });
  assert.equal(lineCount(""), 0);
  assert.equal(lineCount("a\n"), 1);
  assert.equal(lineCount("a\nb"), 2);
});
