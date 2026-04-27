# cf-cognitive Execution

Execute local cognitive cleanup only for explicit target files or a confirmed discovery candidate.

## Preflight

- Use up to three target files per session, processed one file at a time.
- Read each whole target file, relevant tests or call sites, and local helper/error/async/performance conventions before editing.
- Before editing any target file, ensure you have read [../../_shared/references/local-refactor-rules.md](../../_shared/references/local-refactor-rules.md) in this invocation.

## Execution Rules

- Keep changes inside the target file unless the user explicitly asks otherwise.
- Do not move responsibilities to new files or shared utilities.
- Do not continue past the target files or past three files in one session.
- Flatten the target function's main path first. For nested async actions, prefer a shallow caller that performs guards and invokes a named same-file task; move result-to-toast/error branching into a small same-file helper when that exposes the orchestration.
- Treat anonymous callbacks passed to registration/lifecycle APIs as part of the local cognitive load when they contain branching, state changes, cleanup-sensitive behavior, or multiple side effects.
- Prefer named local handlers or a shallow subscription helper when that makes setup, teardown, and effect order easier to scan.
- If local cleanup reveals possible file-level extraction, report `cf-split` as the next step with the target file and obvious candidate names.
- If local cleanup reveals that the remaining cognitive cost is related files scattered across folders, report `cf-cohesion` as the next step with the local feature or workflow name.
- Do not evaluate placement or execute extraction in this skill.

## Verification

Run the smallest relevant check: targeted tests, typecheck or compile, lint, or a narrow smoke check.
Use native success criteria; do not require `failed=0` unless that is how the runner reports results.
If a relevant check fails, decide whether the refactor caused it, fix refactor-caused failures, and re-run the check.
If no relevant check can be run, say that explicitly.

## Output

Use the standard output format.
For **Changes**, summarize hotspots addressed and refactors applied.
For **Result**, include behavior preservation, remaining risk, and `cf-split` or `cf-cohesion` next step when relevant.
