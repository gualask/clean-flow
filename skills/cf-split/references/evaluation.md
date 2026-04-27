# cf-split Evaluation

Evaluate only. Do not edit files.

## Preflight

- Identify one target source file or one explicitly touched local file area.
- If the target file is ambiguous, ask one focused question.
- If the target is an area rather than one file, consider bundled `../../_shared/scripts/repo-tree.mjs`; run it with `--help` first when a gitignore-aware file-name tree may reduce context before choosing the target file.
- Read the whole target file, nearby imports/exports, call sites, tests, and local naming or folder conventions.
- Treat repository state as the source of truth.
- Before evaluating candidates, ensure you have read [../../_shared/references/file-split-rules.md](../../_shared/references/file-split-rules.md) in this invocation.

## Evaluation Rules

- Identify natural file boundaries using the shared file split rules.
- Classify each visible boundary as `recommended`, `optional`, or `keep local`.
- When recommending extraction, name the exact new file set and what stays grouped inside each file.
- Name what should stay in the source file.
- Recommend `none` only when no natural file-level boundary is visible.
- Prefer no split when extraction would add navigation cost without simplifying the source file.

## Output

Use the standard output format.
For **Decision**, report candidates and recommendation.
For **Checks**, say `not run; evaluation only` unless a read-only diagnostic command was useful enough to report.
