import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import {
  SKILLS_ROOT,
  parseBody,
  parseFrontmatter,
} from "../support/skill-contract-helpers.mjs";

test("todo rolls completed tasks over only when adding new work", async () => {
  const docsContract = await fs.readFile(path.join(SKILLS_ROOT, "cf-docs", "SKILL.md"), "utf8");
  const todoContract = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-docs", "references", "todo.md"),
    "utf8",
  );
  for (const text of [todoContract]) {
    assert.match(text, /at least one existing task is unchecked/);
    assert.match(text, /every existing task is checked/);
    assert.match(text, /add(?:s|ing)? new tasks?/);
    assert.match(text, /no new task/);
    assert.doesNotMatch(text, /preparing a .*commit|ask whether to empty|commit cleanup|reset/);
  }
  assert.match(docsContract, /checks off a todo\.md recording remaining work and open questions/);
  assert.match(docsContract, /### Todo Flow/);
  assert.match(docsContract, /Read only `references\/todo\.md`/);
  assert.match(docsContract, /even when the request uses another language/);
  assert.match(docsContract, /Todo Flow keeps only Language and Scope/);
  assert.match(todoContract, /Record the session's decisions as given/);
  assert.match(todoContract, /do not write that task until it is given/);
  assert.match(todoContract, /indented lines for what is needed to decide\./);
  assert.match(todoContract, /in its own shape/);
  assert.doesNotMatch(todoContract, /tracking file/);
});

test("cf-docs routes by Markdown write intent or an audit request", async () => {
  const skillFile = path.join(SKILLS_ROOT, "cf-docs", "SKILL.md");
  const skill = await fs.readFile(skillFile, "utf8");
  const label = "skills/cf-docs/SKILL.md";
  const description = parseFrontmatter(skill, label).description;
  const body = parseBody(skill, label);
  for (const contract of [description, body]) {
    assert.match(contract, /writes a Markdown file/);
    assert.match(contract, /audit (?:or fact-check )?(?:existing )?(?:docs|them) against the code/i);
    assert.match(contract, /do not use (?:it )?otherwise/i);
  }
});
