---
name: cf-test
description: "Report assertion-quality findings for pending tests, a named history range, explicit tests, or the existing suite. Use when the request asks to review assertion quality, coverage against invariants, brittle or over-specified tests, implementation-detail coupling, negative assertions, or invalid domain states representable by the project's types or schemas. Do not use to run or fix tests or to review production code generally; route structural change-set review to cf-review and ambiguous expected behavior to cf-mr-wolf."
---
Report assertion-quality candidates against observable contracts and invariants. Do not edit repository files other than the batched pass's recap, run the test suite, or turn test style preferences into candidates.

## Scope

Resolve exactly one test scope:

- **Pending tests**, the default when no target is named and the working tree holds test changes: existing test files selected by staged, unstaged, and untracked work together.
- **The existing suite**, when no target is named and the working tree holds no test change: every existing test file. A clean checkout does not make a request about tests unanswerable; it makes the whole suite the subject.
- **A named history range**: existing test files selected by the requested commits, range, or branch.
- **Explicit tests**: the named test files or directories, whether changed or unchanged.

Treat every selected test file as a **primary test** and inspect it as a whole. Treat changed production files in the same change set, production files directly imported by explicit tests, and identified authoritative sources as **contract surfaces**. Requirements, product or domain documentation, and acceptance criteria are **authoritative sources** only when they name the tested behavior; path proximity alone is insufficient. Contract surfaces provide evidence but are not themselves review targets.

Exclude generated, vendored, ignored, fixture-only, snapshot-output, and deleted files unless an authoritative source makes one directly relevant. If the repository holds no test file at all, report that and stop. Never widen a test scope to production files.

## Hard Gates

- No invariant or observable contract, no candidate. A preference is not an invariant.
- Report one candidate per test case or test table. Do not turn one candidate into a repository-wide pattern inventory.
- Keep every candidate at status `candidate`. Confirming expected behavior or a domain-model redesign belongs to the user or the Handoff destination.
- Complete both lens groups before routing or assigning actions.

## Flow

1. Resolve primary tests, contract surfaces, and authoritative sources by path without loading the corpus in full.
2. Read `references/dynamic-agents.md`. Run the installed-local context gate against every primary test and already-selected contract surface. Follow its policy exactly; when it is not `local`, read `references/delegated-execution.md` and follow it.
3. Read `references/assertion-quality.md` and run both declared lens groups. For `local`, run them sequentially. For `subagent-1`, `subagent-2`, or `batched`, also read `references/test-agent-brief.md` and fill every placeholder with bounded contract surfaces. Every assignment applies both lens groups. The shared reference owns assignment and completion.
4. De-risk every candidate against the cited primary test, contract surface, and authoritative source. Inspect only the cited evidence needed to accept, narrow, or exclude it.
5. Route once after the complete pass. Route ambiguous expected behavior, and a domain-model redesign such as making invalid domain states unrepresentable, to `cf-mr-wolf`.

## Artifacts

- Owns `.cflow/cf-test-recap.md`: the batched pass's recap, written under the Recap File contract in `references/delegated-execution.md`. It is the pass's one repository write.
- When it already exists and the request is about it, work through it under the same contract instead of running the Flow.
- Create or update no other repository file, including any other `.cflow/*` file and todo files. Persisting candidates elsewhere belongs to `cf-todo`.

## Output Format

Return only:

- **Scope**: resolved scope, primary tests, contract surfaces, authoritative sources, and exclusions.
- **Context budget**: measured files, LOC, estimated tokens, selected policy, consent source, and actual model or `runtime default`; use `local` when no agent ran.
- **Lenses**: every lens from `references/assertion-quality.md`, marked reporting, silent, or not applicable with the absent condition.
- **Findings**: candidates grouped by the action their lens names, in the order `remove`, `rewrite`, `strengthen`, `redesign`, and by severity within each group. A test case that does not pay for itself is the answer to a different question than a test case that covers too little, and burying the first under the second answers neither. Each candidate carries id, primary test, claim, evidence, invariant or observable contract, concrete regression or behavior-preserving change, severity, confidence with its basis, false-positive check, route (`cf-mr-wolf` or `none`), status `candidate`, and unknowns.
- **Handoff**: destination mapped to candidate ids, recommended first action, or `none`.
- **Result**: `clear` or `candidates found`, opening with how many test cases are proposed for `remove`; then state that confirmation is still needed, that no files were modified except the recap when written, and the next action.
