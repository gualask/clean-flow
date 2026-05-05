# cf-cognitive Discovery

Do discovery only. Do not edit files.

## Goal

Find likely local source-file cognitive complexity hotspots without starting a broad refactor hunt.

## Preflight

- For broad no-file discovery, consider bundled `../../_shared/scripts/repo-tree.mjs`; run it with `--help` first when a gitignore-aware tree with LOC may reduce context before selecting candidate files.
- Rank candidates from evidence: long functions, deep nesting, long loops, nested or oversized try/catch blocks, framework/runtime/infrastructure wiring blocks with behavior-heavy callbacks, complexity reports, recent user-mentioned or changed files, and nearby test coverage.
- Read only enough context to validate the strongest candidates.

## Discovery Rules

- Keep a ranked shortlist of at most three files.
- Do not add weak candidates just to reach three.
- If selection is ambiguous between similarly safe files, ask one focused question.
- If the apparent cognitive cost is cross-file placement or navigation, route to `cf-cohesion` instead of ranking it as a local source-file hotspot.
- If the apparent fix is extracting responsibilities from one source file, route to `cf-split`.
- If there is no real hotspot, report that no good local candidate was found.

## Output

Use the standard output format.
For **Changes**, report `none`.
For **Checks**, say `not run; discovery only` unless a read-only diagnostic command was useful enough to report.
For **Result**, name the best next target for evaluation or execution, or `none`.
