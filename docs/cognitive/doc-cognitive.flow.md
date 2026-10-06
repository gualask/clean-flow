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
2. Choose discovery, targeted evaluation, or execution from the current request. A file named with no outcome is ambiguous and gets one question: when execution also covered "proceed on explicit target files", a bare path was edited (0 of 1 asked); with "says to proceed on named targets" 2 of 2 asked and an explicit "simplify" still executed (2026-10-06).
3. Read `navigation-cost.md` before applying any flow; it owns hard-trigger values, exemptions, remedies, and report/action separation. Nesting counts every control block, including an `if` that only guards a `break`: on linqode `liveRows` (`for` → `if` → `if` with `break`) targeted evaluation named the nesting 0 of 5 without that line and 3 of 4 with it (2026-10-06).
4. In discovery, run `repo-tree.mjs --depth 3` for the layout and `--largest 15` for candidate files, then rank at most three evidence-backed functions, not files, by both length and nesting depth, and do not edit. Without "nesting depth" two functions three levels deep in linqode `internal/logs` were missed with all files read (0 of 1, 2026-10-06); with it, 2 of 2. "Measure each function" instead sent the model to Biome complexity scores and an AST scan of all fyler-ui `src/`, at 1,144k input against a 167k floor. On fyler-ui `src/` (2026-10-03) the full file tree was 26.7k characters and `--largest 15` 1.1k; Discovery input fell from 537k and 303k tokens to 233k and 177k. Without the script (2026-10-04) shortlists were as good but input was 1,734k and 1,197k against 911k and 419k.
5. In targeted evaluation, judge explicit files and do not edit.
   In both, a file past the file-length trigger goes to `cf-split` or names its exemption. A `cf-cognitive first` branch (slim long functions, then measure again) was tried and removed (2026-10-05): slimming in place grew the 302-LOC fyler-ui hook to 309–353 LOC in 3 of 3 runs, so it always ended in `cf-split`, and in discovery it also covered a 330-LOC model with distinct responsibilities. The split pieces of that hook were 82–114 LOC.
6. In execution, load `local-refactor-rules.md`, edit only real cognitive pressure, and keep behavior stable. A command measures the target before any edit; when nothing fires a hard trigger the turn makes no edit and asks. On linqode `catalog.go` (functions up to 13 lines) "Simplify" was edited 2 of 2 without that step and 0 of 2 with it; a prohibition without the prior measurement held 0 of 2 (2026-10-06). A target at the edge of the 20–30 band is still read as firing and edited.
7. Process files sequentially, stopping after the explicit target set or at most three files; with more than three named targets, ask which three before editing (without the line the pack chose three of four on its own, 2026-10-03).
8. Run the smallest relevant check after edits, then the tests that cover the target with the repository's test runner; claim behavior preservation only when that test command passed. Codex's base instructions for gpt-6-luna say not to run tests unless the user asks; without these lines the test ran 1 of 3 on Termetrix and 0 of 1 on Go, with them 2 of 3 on Go and the third run said `tests not run` instead of claiming preservation.
9. Route to `cf-split`, `cf-cohesion`, or `cf-architecture` when the request is theirs rather than local, and name that next step in the result when it is relevant. Moving code into another package goes to `cf-architecture` even when the request names the destination. A routed turn edits nothing and ends: without that line the model named `cf-architecture`, opened it, and moved the package itself (linqode, 2026-10-06); with it 2 of 2 routed with no edits, and an explicit extraction now stops at the `cf-split` route instead of running it in the same turn ("do not open it" had held 0 of 2 on 2026-10-04).
10. Keep cleanup bounded when a hard trigger's remedy belongs to another flow, but report the complete deferred finding required by the canonical navigation-cost contract. After the edits a command prints each function's logical lines and nesting in every modified file; nested callbacks count as their own units. With only "apply the report/action separation", a 62-line function left in the edited linqode `logs.go` was deferred 0 of 3; with the command, 3 of 3 (2026-10-06).

The two post-edit conditional routes — re-evaluating for `cf-split` after each edited file, and handing a scattered local workflow to `cf-cohesion` — were dropped with the merge. Trial material records a vague condition inside a pointer firing 4 of 9 times on identical input, and no bed ever exercised either clause.
