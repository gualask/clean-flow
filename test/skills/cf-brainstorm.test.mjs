import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { SHARED_REFERENCES_ROOT, SKILLS_ROOT } from "../support/skill-contract-helpers.mjs";

test("brainstorm hands feature ownership to architecture through the shared lifecycle", async () => {
  const read = (...parts) => fs.readFile(path.join(...parts), "utf8");
  const brainstorm = await read(SKILLS_ROOT, "cf-brainstorm", "SKILL.md");
  const architecture = await read(SKILLS_ROOT, "cf-architecture", "SKILL.md");
  const lifecycle = await read(SHARED_REFERENCES_ROOT, "design-spec-lifecycle.md");

  assert.match(brainstorm, /## Ownership Handoff\n[\s\S]*hand the draft to `cf-architecture`/);
  assert.doesNotMatch(brainstorm, /architecture-principles\.md|navigation-cost\.md/);
  assert.match(architecture, /## Feature Handoff\n[\s\S]*Stay in the modules the feature touches/);
  assert.match(lifecycle, /## Handoff\n[\s\S]*handed off by: <skill>/);
  assert.match(lifecycle, /end the turn naming the receiver for the user to invoke; do not open the receiver in the same turn/);
});

test("brainstorm writes the draft only once the design is settled", async () => {
  const read = (...parts) => fs.readFile(path.join(...parts), "utf8");
  const brainstorm = await read(SKILLS_ROOT, "cf-brainstorm", "SKILL.md");
  const lifecycle = await read(SHARED_REFERENCES_ROOT, "design-spec-lifecycle.md");

  assert.match(lifecycle, /Write the draft once the design is settled, not while the conversation runs/);
  assert.doesNotMatch(lifecycle, /draft is the memory|while context is fresh/);
  assert.match(brainstorm, /\*\*Spec\*\*: write the draft, then expand it/);
  assert.doesNotMatch(brainstorm, /create the draft|\*\*Question plan\*\*/);
});
