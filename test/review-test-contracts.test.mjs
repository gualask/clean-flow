import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import {
  REPO_ROOT,
  SHARED_REFERENCES_ROOT,
  SKILLS_ROOT,
  parseFrontmatter,
} from "./support/skill-contract-helpers.mjs";

test("cf-clean owns reference loading and remains read-only", async () => {
  const cleanContract = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-clean", "SKILL.md"),
    "utf8",
  );
  const cleanMetadata = parseFrontmatter(
    cleanContract,
    "skills/cf-clean/SKILL.md",
  );
  const sweep = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-clean", "references", "sweep.md"),
    "utf8",
  );
  const handoff = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-clean", "references", "handoff.md"),
    "utf8",
  );
  const referenceAudit = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-clean", "references", "reference-audit.md"),
    "utf8",
  );
  const stringBoundaries = await fs.readFile(
    path.join(SHARED_REFERENCES_ROOT, "string-boundaries.md"),
    "utf8",
  );
  const contextMap = JSON.parse(
    await fs.readFile(
      path.join(REPO_ROOT, "src", "commands", "skill-token-report.context.json"),
      "utf8",
    ),
  );
  const cleanFlow = contextMap.skills["cf-clean"].flows.default;

  // Triggered by name or a Cflow cleanup, never by a generic review.
  assert.match(cleanMetadata.description, /^Check code against what the Cflow skills ask\b/);
  assert.match(
    cleanMetadata.description,
    /Use only when the request names cf-clean or asks for a Cflow cleanup or alignment pass on pending work, commits, a path, or the repository\./,
  );
  assert.match(cleanMetadata.description, /Do not use for a generic code review, a bug hunt, or test assertion quality/);
  assert.doesNotMatch(
    cleanMetadata.description,
    /\b(?:evidence|candidate|owning routes|sweep|lens|reference|handoff|audit surface|primary file)\b/i,
  );

  // Any target; pending work by default, the repository when nothing is pending.
  assert.match(cleanContract, /\*\*Pending work\*\*/);
  assert.match(cleanContract, /\*\*A named history range\*\*/);
  assert.match(cleanContract, /\*\*Paths\*\*/);
  assert.match(cleanContract, /\*\*The repository\*\*/);
  assert.match(cleanContract, /With no target named, take pending work; with nothing pending, take the repository\./);
  assert.doesNotMatch(cleanContract, /never widen the pass to the repository/);
  assert.match(cleanContract, /`introduced` does not apply/);
  assert.match(cleanContract, /Primary files/);
  assert.match(cleanContract, /Deleted entries/);
  assert.match(cleanContract, /Audit surfaces/);

  // No focus: every lens runs; bugs are listed when seen, never hunted.
  assert.doesNotMatch(cleanContract, /\bfocus\b/i);
  assert.match(cleanContract, /The pass does not hunt bugs\. A bug seen while reading goes under \*\*Bugs seen\*\*/);
  assert.match(cleanContract, /`bugs not searched for`/);
  assert.match(cleanContract, /reporting, silent, or not applicable/);

  assert.match(
    cleanContract,
    /Check whether `\.cflow\/cf-clean-map\.md` exists by testing that path directly: `\.cflow\/` is git-ignored, so a file search that honors ignore files does not list it\. When the target is the repository, an area of that map, or a request to continue from it, read `references\/map\.md`, which .+ Otherwise read `references\/context-gate\.md`, which/,
  );
  assert.match(
    cleanContract,
    /Read `references\/sweep\.md` for .+, `references\/navigation-cost\.md` for .+, and `references\/string-boundaries\.md` for /,
  );
  assert.match(cleanContract, /When the target is a move-shaped change, also read `references\/reference-audit\.md` for /);
  assert.match(cleanContract, /When the sweep produced at least one finding, read `references\/handoff\.md`, which /);
  assert.match(
    cleanContract,
    /With no findings, do not read it: report `Findings: none`, `Handoff: none`, and `Result: clear for the completed sweep`/,
  );
  assert.match(cleanContract, /Do not edit repository files other than the recap and the map under `\.cflow\/`\./);
  assert.match(cleanContract, /Owns `\.cflow\/cf-clean-map\.md`/);
  assert.match(cleanContract, /When the recap already exists and the request is about it/);
  assert.match(cleanContract, /When `references\/map\.md` builds the map or stops on an existing one, return only what it names\. Otherwise return only:/);
  assert.match(cleanContract, /\*\*Coverage\*\*: when the pass swept an area of the map/);
  assert.match(cleanContract, /Owns `\.cflow\/cf-clean-recap\.md`/);
  assert.match(cleanContract, /Create or update no other repository file/);
  assert.match(cleanContract, /For `batched`, every batch applies every lens\./);
  assert.match(cleanContract, /shared reference owns batching and completion/);
  assert.match(cleanContract, /not assessed in this pass/);
  assert.match(cleanContract, /Do not classify tests, report a test count/);
  assert.match(cleanContract, /never unqualified `clear` or `commit-ready`/);
  assert.match(cleanContract, /Persisting findings in a todo file belongs to `cf-docs`/);
  assert.doesNotMatch(cleanContract, /cf-scenario/);

  for (const [lens, route] of [
    ["1 — Stale References", "cf-mr-wolf"],
    ["2 — Incomplete Change", "cf-mr-wolf"],
    ["3 — Documentation Drift", "cf-docs"],
    ["4 — Declared Invariants", "cf-mr-wolf"],
    ["6 — Placement And Cohesion", "cf-placement"],
    ["7 — Dependency Direction And Owner Placement", "cf-architecture"],
    ["8 — Local Anti-Patterns", "cf-cognitive"],
    ["9 — Responsibility And Ownership", "cf-mr-wolf"],
    ["10 — String Boundaries", "cf-deadcode"],
  ]) {
    assert.match(sweep, new RegExp(`### Lens ${lens}\\n\\nRoute: \`${route}\``));
  }
  assert.doesNotMatch(sweep, /Bugs|Behavior Drift|Requirement Alignment/);
  assert.match(sweep, /A stale reference in documentation or examples belongs to lens 3/);
  assert.match(sweep, /run bundled `scripts\/dir-population\.mjs`, resolved from the active skill root/i);
  assert.match(sweep, /Report each function with changed code past 20 logical lines as a function finding routed to `cf-cognitive`/);
  assert.match(sweep, /it does not hold the result/);
  assert.match(sweep, /Build the table in `references\/string-boundaries\.md`/);
  assert.doesNotMatch(sweep, /\bRead `?references\//);
  assert.doesNotMatch(sweep, /## (?:Contents|What Counts As A Finding|Bounded Remedies)/);
  assert.match(
    sweep,
    /Exclude data clumps, primitive obsession, feature envy, temporal coupling, leaky abstractions/,
  );
  assert.match(stringBoundaries, /\| name \| consumer file:line \| producer file:line \|/);

  for (const contract of [sweep, handoff]) {
    assert.doesNotMatch(contract, /cf-todo/);
    assert.doesNotMatch(contract, /local-refactor-rules\.md/);
  }
  assert.doesNotMatch(handoff, /severity/i);
  assert.doesNotMatch(handoff, /cf-scenario/);
  assert.match(handoff, /introduced a finding from lens 1 or 7, a lens 5 hard trigger, or a lens 2 transition/);
  assert.match(handoff, /hold for confirmation/);
  assert.match(handoff, /proceed with follow-up/);
  assert.match(handoff, /On a path or the repository, report the finding count per route and the first finding to open/);
  assert.doesNotMatch(handoff, /- \*\*clear\*\*/);
  assert.match(referenceAudit, /Report each surviving stale reference and do not modify it/);

  assert.deepEqual(cleanFlow.required, [
    "references/context-gate.md",
    "references/sweep.md",
    "references/navigation-cost.md",
    "references/string-boundaries.md",
  ]);
  assert.deepEqual(cleanFlow.conditional, [
    "references/map.md",
    "references/batched-execution.md",
    "references/reference-audit.md",
    "references/handoff.md",
  ]);
  assert.equal(cleanFlow.handoffs, undefined);
});

test("cf-test owns assertion quality with a deterministic context gate", async () => {
  const testContract = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-test", "SKILL.md"),
    "utf8",
  );
  const metadata = parseFrontmatter(testContract, "skills/cf-test/SKILL.md");
  const assertionQuality = await fs.readFile(
    path.join(SKILLS_ROOT, "cf-test", "references", "assertion-quality.md"),
    "utf8",
  );
  const contextGate = await fs.readFile(
    path.join(SHARED_REFERENCES_ROOT, "context-gate.md"),
    "utf8",
  );
  // The gate is read at step 2 of every pass, the batched contract only when
  // the policy is `batched`. Assertions follow
  // the text they belong to, so the gate keeps its own coverage.
  const batchedExecution = await fs.readFile(
    path.join(SHARED_REFERENCES_ROOT, "batched-execution.md"),
    "utf8",
  );
  const contextMap = JSON.parse(
    await fs.readFile(
      path.join(REPO_ROOT, "src", "commands", "skill-token-report.context.json"),
      "utf8",
    ),
  );
  const flow = contextMap.skills["cf-test"].flows.default;

  assert.match(metadata.description, /assertion-quality findings/);
  assert.match(metadata.description, /cf-clean/);
  assert.match(metadata.description, /ambiguous expected behavior to cf-mr-wolf/);
  assert.match(testContract, /primary test/);
  assert.match(testContract, /contract surfaces/);
  assert.match(testContract, /path proximity alone is insufficient/);
  assert.doesNotMatch(testContract, /adjacent repository docs/);
  assert.match(testContract, /Read `references\/context-gate\.md`/);
  assert.match(testContract, /Read `references\/assertion-quality\.md`/);
  assert.match(testContract, /For `batched`, every batch applies every lens group/);
  assert.match(testContract, /shared reference owns batching and completion/);
  assert.doesNotMatch(testContract, /complete path-only manifest|compact report|reconcile cross-batch references/);
  // The recap is the pass's one repository write, declared in the pack's own
  // ownership idiom, and every other write stays banned.
  assert.match(testContract, /Owns `\.cflow\/cf-test-recap\.md`/);
  assert.match(testContract, /Create or update no other repository file/);
  assert.match(
    testContract,
    /Do not edit repository files other than the batched pass's recap/,
  );
  assert.doesNotMatch(testContract, /assign one lens group to each/);
  for (const slot of ["Scope", "Context budget", "Lenses", "Findings", "Handoff", "Result"]) {
    assert.match(
      testContract,
      new RegExp(`^- \\*\\*${slot}\\*\\*:` , "m"),
      `cf-test output contract must retain ${slot}`,
    );
  }
  assert.match(testContract, /status `candidate`/);
  assert.match(testContract, /confidence with its basis/);

  for (const lens of [
    "Missing Observable Invariant",
    "Absence Without An Invariant",
    "Invalid Domain States Remain Representable",
    "Redundant Assertion",
    "Over-Specified Test",
    "Brittle String Assertion",
    "Implementation-Detail Coupling",
    "Duplicated Setup",
    "Nondeterministic Test",
    "Cross-Layer Repetition",
  ]) {
    assert.match(assertionQuality, new RegExp(lens));
  }
  assert.match(
    assertionQuality,
    /No locatable source and no concrete regression or behavior-preserving change means no candidate/,
  );
  assert.match(assertionQuality, /language-agnostic/);
  assert.match(contextGate, /policy.*authoritative/s);
  assert.match(contextGate, /`batched`/);
  // The gate names no other reference: the consuming skill is the only router.
  assert.doesNotMatch(contextGate, /batched-execution\.md/);
  assert.doesNotMatch(contextGate, /## Recap File/);
  assert.match(batchedExecution, /Read this when the context gate returns `batched`/);
  assert.doesNotMatch(batchedExecution, /context-gate\.md/);
  assert.match(batchedExecution, /Batching changes source loading, never the logical scope/);
  assert.match(batchedExecution, /create no other repository or temporary artifact/);
  assert.match(batchedExecution, /missing batch report or unresolved cross-batch check cannot produce a clear result/);
  // The recap is a deliverable, owned by each skill that batches, and never
  // overwritten without asking.
  assert.match(batchedExecution, /## Recap File/);
  assert.match(batchedExecution, /The consuming skill owns its own recap at the path its Artifacts contract names/);
  // One recap per skill, at `.cflow/<skill>-recap.md`, named by each skill's own
  // Artifacts contract: the shared text names no path, so two batching skills
  // never collide on one file.
  assert.doesNotMatch(batchedExecution, /`\.cflow\/recap\.md`/);
  assert.match(batchedExecution, /Each batching skill has its own recap and writes no other skill's/);
  assert.match(batchedExecution, /never overwrite it silently/);
  assert.doesNotMatch(batchedExecution, /narrower-scope fallback for/);
  for (const contract of [contextGate, batchedExecution]) {
    assert.doesNotMatch(contract, /\bagents?\b|delegat/i);
  }

  assert.deepEqual(flow.required, [
    "references/context-gate.md",
    "references/assertion-quality.md",
  ]);
  assert.deepEqual(flow.conditional, ["references/batched-execution.md"]);
});
