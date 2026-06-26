# cf-cognitive Discovery

Do discovery only. Do not edit files.

## Goal

Find likely local source-file cognitive complexity hotspots without starting a broad refactor hunt.

## Preflight

- For broad no-file discovery, default to bundled `scripts/repo-tree.mjs` (resolve it from the active skill root, never from the project working directory) before manual exploration: run it with `--help` first, then use its gitignore-aware tree with LOC to rank candidate files. Skip it only when the script cannot run or the candidate area is already explicit and small enough to read directly.
- Ensure you have read references/navigation-cost.md in this invocation; its hard triggers rank above every other piece of evidence.
- Rank candidates from evidence, hard triggers first: nesting deeper than function -> block -> block, functions past the 20-30 logical-line bell, and files past the roughly-300-LOC bell from `scripts/repo-tree.mjs` output; then long loops, nested or oversized try/catch blocks, framework/runtime/infrastructure wiring blocks with behavior-heavy callbacks, complexity reports, recent user-mentioned or changed files, and nearby test coverage.
- Read only enough context to validate the strongest candidates.

## Discovery Rules

- Keep a ranked shortlist of at most three files.
- Do not add weak candidates just to reach three.
- If selection is ambiguous between similarly safe files, ask one focused question.
- If the apparent cognitive cost is cross-file placement or navigation, route to `cf-cohesion` instead of ranking it as a local source-file hotspot.
- If the apparent fix is extracting responsibilities from one source file, route to `cf-split`.
- If there is no real hotspot, report that no good local candidate was found.
- Do not dismiss a candidate past a hard trigger as "light", "minor", or "not yet serious"; either rank it as a real hotspot or name the `references/navigation-cost.md` exemption that clears it.

## Output

Use the standard output format.
For **Changes**, report `none`.
For **Checks**, say `not run; discovery only` unless a read-only diagnostic command was useful enough to report.
For **Result**, name the best next target for evaluation or execution, or `none`.
