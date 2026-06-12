# cf-split Evaluation

Evaluate only. Do not edit files.

## Preflight

- Identify one target source file or one explicitly touched local file area.
- If the target file is ambiguous, ask one focused question.
- If the target is an area rather than one file, run bundled `repo-tree.mjs` (resolve `../../_shared/scripts/repo-tree.mjs` from this reference file's own directory, never from the project working directory; run `--help` first) and use its gitignore-aware file-name tree to choose the target file before reading implementation.
- Read the whole target file, nearby imports/exports, call sites, tests, and local naming or folder conventions.
- Treat repository state as the source of truth.
- Before evaluating candidates, ensure you have read ../../_shared/references/file-split-rules.md in this invocation.

## Evaluation Rules

- Identify natural file boundaries using the shared file split rules.
- Classify each visible boundary as `recommended`, `optional`, or `keep local`.
- When recommending extraction, name the exact new file set and what stays grouped inside each file.
- Name what should stay in the source file.
- Recommend `none` only when no natural file-level boundary is visible; when the file is past the roughly-300-LOC bell, `none` also requires naming a recognized exemption from navigation-cost.md.
- Prefer no split when extraction would add navigation cost without improving source readability or maintenance navigation.
- When the dominant cost is cross-file placement or repository structure rather than boundaries inside this file, say so and name `cf-cohesion` or `cf-start` as the next action in **Result**.

## Output

Use the standard output format.
For **Decision**, report candidates and recommendation.
For **Checks**, say `not run; evaluation only` unless a read-only diagnostic command was useful enough to report.
