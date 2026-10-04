# cf-cognitive Flow

## Purpose

Document the runtime flow for `cf-cognitive`, the public local cleanup entrypoint for reducing real cognitive complexity in source files.

## Runtime Inputs

- Public skill: `skills/cf-cognitive/SKILL.md`, which carries all three flows in its own body since 2026-08-16
- Runtime references: none of its own
- Shared sources vendored into runtime paths: `skills/_shared/references/local-refactor-rules.md`, `navigation-cost.md`; `skills/_shared/scripts/repo-tree.mjs`
- Target artifacts: none

## High-Level Flow

1. Start from the requested file target or discovery area.
2. Choose discovery, targeted evaluation, or execution from the current request.
3. Read `navigation-cost.md` before applying any flow; it owns hard-trigger values, exemptions, remedies, and report/action separation.
4. In discovery, run `repo-tree.mjs --depth 3` for the layout and `--largest 15` for candidate files, then rank at most three evidence-backed functions, not files, and do not edit. On fyler-ui `src/` (2026-10-03) the full file tree was 26.7k characters and `--largest 15` 1.1k; Discovery input fell from 537k and 303k tokens to 233k and 177k. Without the script (2026-10-04) shortlists were as good but input was 1,734k and 1,197k against 911k and 419k.
5. In targeted evaluation, judge explicit files and do not edit.
   In both, a file past the file-length trigger gets a verdict on where its length comes from: long functions → `cf-cognitive first`, length checked again after slimming; distinct responsibilities → `cf-split` now. Slimming grows a file (linqode `status.go` 292 → 307–333 LOC), so splitting before slimming can force a second split. On fyler-ui the pack routed both a 302-LOC hook with a 98-line function and a 330-LOC multi-responsibility model to `cf-split`; with the verdict, the hook went `cf-cognitive first` and the model `cf-split` (2026-10-03).
6. In execution, load `local-refactor-rules.md`, edit only real cognitive pressure, and keep behavior stable.
7. Process files sequentially, stopping after the explicit target set or at most three files; with more than three named targets, ask which three before editing (without the line the pack chose three of four on its own, 2026-10-03).
8. Run the smallest relevant check after edits, then the tests that cover the target with the repository's test runner; claim behavior preservation only when that test command passed. Codex's base instructions for gpt-6-luna say not to run tests unless the user asks; without these lines the test ran 1 of 3 on Termetrix and 0 of 1 on Go, with them 2 of 3 on Go and the third run said `tests not run` instead of claiming preservation.
9. Route to `cf-split` or `cf-cohesion` when the request is theirs rather than local, and name that next step in the result when it is relevant. An explicit request to extract into a new file runs `cf-split` in the same turn (2/2 on linqode, 2026-10-04); a line forbidding it held 0 of 2 and the model then extracted without moving tests, so the token report counts that handoff.
10. Keep cleanup bounded when a hard trigger's remedy belongs to another flow, but report the complete deferred finding required by the canonical navigation-cost contract.

The two post-edit conditional routes — re-evaluating for `cf-split` after each edited file, and handing a scattered local workflow to `cf-cohesion` — were dropped with the merge. Trial material records a vague condition inside a pointer firing 4 of 9 times on identical input, and no bed ever exercised either clause.
