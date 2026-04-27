---
name: cf-cognitive
description: Find or refactor up to three source files per session, one file at a time, to reduce real cognitive complexity from long functions, deep nesting, nested or oversized try/catch blocks, long loops, or hard-to-read local logic while preserving behavior. Use with or without explicit file targets.
---
Use this skill for local file-level cognitive complexity refactors.

Use this for up to three source files per session, processed one file at a time.
Do not bootstrap or require `.cflow/` artifacts.
If no file is provided, discover candidate files, propose up to three justified targets, and start with the best first file unless the user asked only for recommendations.
For file-level split review or extraction from one source file, route to `cf-file-split` instead.
For repository structure, module boundaries, ownership moves, or broad multi-file refactors, route to `cf-start` instead.

Reduce real cognitive complexity in each target file while preserving behavior.
Use numeric thresholds only when native tooling can measure them; otherwise report qualitatively.

## Target Selection

- Use explicit file targets when provided, up to three per session.
- Otherwise rank candidates from evidence: long functions, deep nesting, long loops, nested or oversized try/catch blocks, complexity reports, recent user-mentioned or changed files, and nearby test coverage.
- For broad no-file discovery, consider bundled `../_shared/scripts/repo-tree.mjs`; run it with `--help` first when a gitignore-aware tree with LOC may reduce context before selecting candidate files.
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
- nested try/catch blocks that make control flow hard to follow; simplify when possible unless language or framework constraints force them
- try/catch blocks or loop bodies long enough to hide their main purpose
- branching that makes the main path hard to see
- complex boolean expressions, regex construction, parsing, or small algorithms that are hard to read inline
- repeated non-trivial local logic

## Local Refactor Rules

Before editing any target file, ensure you have read [../_shared/references/local-refactor-rules.md](../_shared/references/local-refactor-rules.md) in this invocation.

Apply that reference with these extra constraints:

- keep changes inside the target file unless the user explicitly asks otherwise
- do not move responsibilities to new files or shared utilities
- do not continue past the shortlisted files or past three files in one session

## Post-refactor extraction candidates

If local cleanup reveals possible file-level extraction, report `cf-file-split` as the next step with the target file and obvious candidate names.
Do not evaluate placement or execute extraction in this skill.

## Verification

Run the smallest relevant check: targeted tests, typecheck or compile, lint, or a narrow smoke check.
Use native success criteria; do not require `failed=0` unless that is how the runner reports results.
If a relevant check fails, decide whether the refactor caused it, fix refactor-caused failures, and re-run the check.
If no relevant check can be run, say that explicitly.

## Output Format

Return only:

- **Files**: target files touched, plus remaining shortlist when relevant.
- **Changes**: hotspots addressed and refactor applied.
- **Checks**: commands run and pass/fail result, or why no check ran.
- **Result**: behavior preservation, remaining risk, and `cf-file-split` next step when file-level extraction should be reviewed.
