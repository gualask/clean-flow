# cf-split Execution

Execute exactly one cohesive behavior-preserving file-level split.

## Preflight

- Identify one target source file or one explicitly touched local file area.
- If the target file or placement is ambiguous, ask one focused question before editing.
- If the target is an area rather than one file, run bundled `repo-tree.mjs` (resolve `../../_shared/scripts/repo-tree.mjs` from this reference file's own directory, never from the project working directory; run `--help` first) and use its gitignore-aware file-name tree to choose the target file before reading implementation.
- Read the whole target file, nearby imports/exports, call sites, tests, and local naming or folder conventions.
- Treat repository state as the source of truth.
- Before choosing placement, ensure you have read ../../_shared/references/file-split-rules.md in this invocation.

## Execution Rules

- Preserve behavior, public API, exports, side effects, evaluation order, and async behavior.
- Move only the selected owned unit or related group.
- Keep the source file as the readable entry point for the local workflow.
- Follow shared grouping and placement rules before creating files, and choose placement for the resulting local cluster rather than only for the new file.
- Do not promote code to shared, global hooks, common, or utils locations unless the shared grouping rules justify it.
- After moving code, ensure you have read ../../_shared/references/reference-audit.md in this invocation, then audit moved names and paths.

## Verification

Run the smallest relevant check: targeted tests, typecheck or compile, lint, or a narrow smoke check.
Use native success criteria; do not require `failed=0` unless that is how the runner reports results.
If a relevant check fails, decide whether the split caused it, fix split-caused failures, and re-run the check.
If no relevant check can be run, say that explicitly.

## Output

Use the standard output format.
For **Decision**, report the split performed.
For **Result**, include behavior preservation, final placement decision, remaining risk, and next action.
