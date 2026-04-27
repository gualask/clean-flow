---
name: cf-file-split
description: Evaluate or execute a behavior-preserving file-level split from one source file into nearby owned files. Use when the user asks whether a file should be split or asks to perform a scoped extraction into files.
---
Use this skill for local file-level split review and execution.

Use this when the user asks whether a source file should be split into files, or asks to execute a specific local file-level extraction.
Do not use this for cognitive cleanup inside one file; use `cf-cognitive` for that.
For repository structure, module boundaries, cross-feature ownership moves, or broad multi-file refactors, route to `cf-start`.

Do not bootstrap or require `.cflow/` artifacts.

## Preflight

- Identify one target source file or one explicitly touched local file area.
- If the target file is ambiguous, ask one focused question.
- If the target is an area rather than one file, consider bundled `../_shared/scripts/repo-tree.mjs`; run it with `--help` first when a gitignore-aware file-name tree may reduce context before choosing the target file.
- Read the whole target file, nearby imports/exports, call sites, tests, and local naming or folder conventions.
- Treat repository state as the source of truth.

Before evaluating candidates or choosing placement, ensure you have read [../_shared/references/file-split-rules.md](../_shared/references/file-split-rules.md) in this invocation.

## Modes

If the user asks whether a split is worthwhile, evaluate only.
Do not edit files in evaluation mode.

If the user explicitly asks to perform the split, execute exactly one cohesive file-level split.
If the target or placement is not clear enough, ask one focused question before editing.

## Evaluation Rules

- Identify natural file boundaries using the shared file split rules.
- Classify each visible boundary as `recommended`, `optional`, or `keep local`.
- When recommending extraction, name the exact new file set and what stays grouped inside each file.
- Name what should stay in the source file.
- Recommend `none` only when no natural file-level boundary is visible.
- Prefer no split when extraction would add navigation cost without simplifying the source file.

## Execution Rules

- Preserve behavior, public API, exports, side effects, evaluation order, and async behavior.
- Move only the selected owned unit or related group.
- Keep the source file as the readable entry point for the local workflow.
- Follow shared grouping and placement rules before creating files, and choose placement for the resulting local cluster rather than only for the new file.
- After the split, re-check whether the containing directory is now an unhealthy flat cluster. If this split creates or extends a related group of two or more files, move that group into a local subfolder in the same execution step when the placement is clear.
- If a previous split left one extracted file flat and the current split makes it part of a larger owner cluster, include that earlier extracted file in the placement adjustment.
- Do not promote code to shared, global hooks, common, or utils locations unless the shared grouping rules justify it.
- After moving code, ensure you have read [../_shared/references/reference-audit.md](../_shared/references/reference-audit.md) in this invocation, then audit moved names and paths.

## Verification

Run the smallest relevant check: targeted tests, typecheck or compile, lint, or a narrow smoke check.
If a relevant check fails, decide whether the split caused it, fix split-caused failures, and re-run the check.
If no relevant check can be run, say that explicitly.

## Output Format

Return only:

- **Scope**: target file and mode, evaluation or execution.
- **Decision**: candidates and recommendation, or split performed.
- **Checks**: commands run and pass/fail result, or why no check ran.
- **Result**: behavior preservation, final placement decision, remaining risk, and next action.
