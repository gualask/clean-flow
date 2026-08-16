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
4. In discovery, rank at most three evidence-backed candidate files and do not edit.
5. In targeted evaluation, judge explicit files and do not edit unless execution is requested.
6. In execution, load `local-refactor-rules.md`, edit only real cognitive pressure, and keep behavior stable.
7. Process files sequentially, stopping after the explicit target set or at most three files.
8. Run the smallest relevant check after edits.
9. Route to `cf-split` or `cf-cohesion` when the request is theirs rather than local, and name that next step in the result when it is relevant.
10. Keep cleanup bounded when a hard trigger's remedy belongs to another flow, but report the complete deferred finding required by the canonical navigation-cost contract.

The two post-edit conditional routes — re-evaluating for `cf-split` after each edited file, and handing a scattered local workflow to `cf-cohesion` — were dropped with the merge. Trial material records a vague condition inside a pointer firing 4 of 9 times on identical input, and no bed ever exercised either clause.
