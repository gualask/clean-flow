---
name: cf-cognitive
description: Find or refactor up to three source files per session, one file at a time, to reduce real cognitive complexity from long functions, deep nesting, nested or oversized try/catch blocks, long loops, or hard-to-read local logic while preserving behavior. Use with or without explicit file targets.
---
This is a supported public entrypoint for local file-level cognitive complexity refactors.

Use this for up to three source files per session, processed one file at a time.
Do not bootstrap or require `.cflow/` artifacts.
If no file is provided, discover candidate files, propose up to three justified targets, and start with the best first file unless the user asked only for recommendations.
For repository structure, module boundaries, ownership moves, or broad multi-file refactors, route to `cf-start` instead.

Reduce real cognitive complexity in each target file while preserving behavior.
Use numeric thresholds only when native tooling can measure them; otherwise report qualitatively.

## Target Selection

- Use explicit file targets when provided, up to three per session.
- Otherwise rank candidates from evidence: long functions, deep nesting, long loops, nested or oversized try/catch blocks, complexity reports, recent user-mentioned or changed files, and nearby test coverage.
- In discovery mode, keep a ranked shortlist of at most three files; do not add weak candidates just to reach three.
- Process shortlisted files sequentially, best first, and verify after each file.
- If only one file is fixed in this invocation, report remaining shortlisted candidates so the user can continue without rediscovery.
- After three files, stop and let the user decide whether to start a new session.
- If selection is ambiguous between similarly safe files, ask one focused question.
- Read the whole target file, relevant tests/call sites, and local helper/error/async/performance conventions before editing.
- If there is no real hotspot, stop and report that no good local candidate was found.

## Refactor Triggers

Refactor only when the target has clear local cognitive pressure:

- functions or methods that are hard to scan, roughly more than 20-30 logical lines
- nesting deeper than function -> block -> block
- nested try/catch blocks; prohibit unless language or framework constraints force them
- try/catch blocks or loop bodies long enough to hide their main purpose
- branching that makes the main path hard to see
- complex boolean expressions, regex construction, parsing, or small algorithms that are hard to read inline
- repeated non-trivial local logic

## Rules

Prefer the smallest change that makes the main flow easier to read.
Readability is the goal; the complexity metric is only a guardrail.

Allowed moves:

- reduce indentation with guard clauses when behavior stays the same
- extract validation, error creation, difficult local algorithms, parser or regex setup, domain calculations, long try/catch bodies, long loop bodies, or case-specific handling from a long branch or switch
- rename local variables or helpers when that clarifies intent
- keep extracted functions file-local and near callers unless local convention says otherwise
- prefer a shallow orchestrator: caller shows the main sequence, helpers are understandable without following a deep call chain

Naming:

- prefer intention-revealing names that describe the result or domain action, not every algorithm step
- avoid `And` / `Or` glued names; split separate responsibilities instead
- keep helper names short and domain-first when the language style allows it

Do not:

- change exported API, errors, side effects, return values, evaluation order, or async behavior unless the user explicitly asks
- move responsibilities to new files or shared utilities
- extract from a hot path when the extra call boundary or allocation could plausibly affect performance; prefer inline simplification there
- extract only because code can be extracted
- continue past the shortlisted files or past three files in one session
- fix discovered behavior bugs unless the user explicitly asks

Avoid:

- one-line helpers whose name merely restates the code
- pass-through wrappers
- generic `process`, `handle`, `helper`, or `util` methods
- todo-list names like `promoteAndFinalizeCreate` or `loadOrCleanupIfMissing`
- many tiny helpers
- single-use helpers that only unpack a regex or match result
- single-use helpers that only loop over a range to push or add into a caller-owned collection
- helpers that hide important side effects
- splits that make the call flow harder to follow
- extractions that force several layers to understand one local behavior

After editing, do one cleanup pass. Inline any extracted helper that does not make the caller easier to read.

## Verification

Run the smallest relevant check: targeted tests, typecheck or compile, lint, or a narrow smoke check.
Use native success criteria; do not require `failed=0` unless that is how the runner reports results.
If a relevant check fails, decide whether the refactor caused it, fix refactor-caused failures, and re-run the check.
If no relevant check can be run, say that explicitly.

## Output Format

Return sections: **Candidate selection**, **Target file(s)**, **Complexity hotspots**, **Refactor applied**, **Behavior preservation**, **Checks run**, **Complexity result and remaining risk**.
