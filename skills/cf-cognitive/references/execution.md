# cf-cognitive Execution

Execute local cognitive cleanup only for explicit target files or a confirmed discovery candidate.

## Preflight

- Use up to three target files per session, processed one file at a time.
- Read each whole target file, relevant tests or call sites, and local helper/error/async/performance conventions before editing.

## Execution Rules

- Keep changes inside the target file unless the current request explicitly asks otherwise.
- Do not move responsibilities to new files or shared utilities.
- Do not continue past the target files or past three files in one session.
- Flatten the target function's main path first. For nested async actions, prefer a shallow caller that performs guards and invokes a named same-file task; move result-to-toast/error branching into a small same-file helper when that exposes the orchestration.
- Treat anonymous callbacks passed to registration/lifecycle APIs as part of the local cognitive load when they contain branching, state changes, cleanup-sensitive behavior, or multiple side effects.
- Prefer named local handlers or a shallow subscription helper when that makes setup, teardown, and effect order easier to scan.
- Do not evaluate placement or execute extraction in this skill.

- After editing a target file, route to `cf-split` evaluation before advancing only when remaining file-level pressure is demonstrated by a canonical file-length trigger without a recognized exemption or a stable named owner or boundary that still raises navigation cost. Otherwise finish the target and continue within the explicit target set.
- After editing a target file, if the remaining readability cost is caused by related files scattered across folders, route to `cf-cohesion` targeted evaluation for that local workflow before advancing to another target file or suggesting another cognitive candidate.
- Apply the report/action separation in references/navigation-cost.md to every qualifying hard trigger.

## Verification

Run the smallest relevant check: targeted tests, typecheck or compile, lint, or a narrow smoke check.
Use native success criteria; do not require `failed=0` unless that is how the runner reports results.
If a relevant check fails, decide whether the refactor caused it, fix refactor-caused failures, and re-run the check.
If no relevant check can be run, say that explicitly.

## Output

Use the standard output format.
For **Changes**, summarize hotspots addressed and refactors applied.
For **Deferred**, after edits use the finding content required by references/navigation-cost.md.
For **Result**, include behavior preservation, remaining risk, and `cf-split` or `cf-cohesion` next step when relevant.
