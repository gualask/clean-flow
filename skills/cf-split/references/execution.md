# cf-split Execution

Execute exactly one cohesive behavior-preserving file-level split.

## Preflight

- Identify one target source file or one explicitly touched local file area.
- If the target file or placement is ambiguous, ask one focused question before editing.
- If the target is an area rather than one file, consider bundled `../../_shared/scripts/repo-tree.mjs`; run it with `--help` first when a gitignore-aware file-name tree may reduce context before choosing the target file.
- Read the whole target file, nearby imports/exports, call sites, tests, and local naming or folder conventions.
- Treat repository state as the source of truth.
- Before choosing placement, ensure you have read [../../_shared/references/file-split-rules.md](../../_shared/references/file-split-rules.md) in this invocation.

## Execution Rules

- Preserve behavior, public API, exports, side effects, evaluation order, and async behavior.
- Move only the selected owned unit or related group.
- Keep the source file as the readable entry point for the local workflow.
- Follow shared grouping and placement rules before creating files, and choose placement for the resulting local cluster rather than only for the new file.
- After the split, re-check whether the containing directory is now an unhealthy flat cluster. If this split creates or extends a related group of two or more files, move that group into a local subfolder in the same execution step when the placement is clear.
- If a previous split left one extracted file flat and the current split makes it part of a larger owner cluster, include that earlier extracted file in the placement adjustment.
- Do not promote code to shared, global hooks, common, or utils locations unless the shared grouping rules justify it.
- After moving code, ensure you have read [../../_shared/references/reference-audit.md](../../_shared/references/reference-audit.md) in this invocation, then audit moved names and paths.

## Verification

Run the smallest relevant check: targeted tests, typecheck or compile, lint, or a narrow smoke check.
If a relevant check fails, decide whether the split caused it, fix split-caused failures, and re-run the check.
If no relevant check can be run, say that explicitly.

## Output

Use the standard output format.
For **Decision**, report the split performed.
For **Result**, include behavior preservation, final placement decision, remaining risk, and next action.
