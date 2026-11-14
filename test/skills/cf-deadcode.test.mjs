import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { SKILLS_ROOT } from "../support/skill-contract-helpers.mjs";

test("cf-deadcode runs the tools, then pairs the names that cross a boundary", async () => {
  const contract = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-deadcode", "SKILL.md"),
    "utf8",
  );
  // With the table alone the pass stopped running the project's tool and lost a
  // file only its test reached, which the bare model found; with the tool but
  // without the second run it lost it again. With both: found 4 of 4.
  assert.match(
    contract,
    /Run the dead-code tool the project configures, or the standard one for its language, and run it again in the mode that leaves tests out when it has one: a name only tests reach is dead\./,
  );
  // A request about one file checked 48 names of the whole repository; scoped, 2.
  assert.match(
    contract,
    /build the table in `references\/string-boundaries\.md` from the repository, or, when the request names files, only for the names those files send or receive\./,
  );
  // A gap is stated, not guessed: a script written by the model called a live
  // function dead.
  assert.match(
    contract,
    /for each language whose tool has no such mode, a line saying that code only tests reach was not checked there\./,
  );
  const shipped = await fs.readdir(
    path.join(SKILLS_ROOT, "cf-deadcode", "references"),
  );
  assert.deepEqual(shipped, ["string-boundaries.md"]);
});
