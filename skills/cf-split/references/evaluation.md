# cf-split Evaluation

## Preflight

- If the target is an area rather than one file, run bundled `scripts/repo-tree.mjs` (resolve it from the active skill root, never from the project working directory; run `--help` first) and use its gitignore-aware file-name tree to choose the target file before reading implementation.
- Read the whole target file, nearby imports/exports, call sites, tests, and local naming or folder conventions.

## Evaluation Rules

- Identify natural file boundaries and classify each one with the shared file split rules.
- Name what should stay in the source file.
- Prefer no split only when `references/navigation-cost.md` shows the candidate would not improve source readability or maintenance navigation.
- When the dominant cost is cross-file placement or repository structure rather than boundaries inside this file, say so and name `cf-cohesion` or `cf-architecture` as the next action in **Result**.

## Output

Use the standard output format.
For **Decision**, report candidates and recommendation.
For **Checks**, say `not run; evaluation only` unless a read-only diagnostic command was useful enough to report.
For **Result**, give the recommendation, remaining risk, and next action.
