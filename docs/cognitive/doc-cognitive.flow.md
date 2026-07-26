# cf-cognitive Flow

## Purpose

Document the runtime flow for `cf-cognitive`, the public local cleanup entrypoint for reducing real cognitive complexity in source files.

## Runtime Inputs

- Public skill: `skills/cf-cognitive/SKILL.md`
- Runtime references: `skills/cf-cognitive/references/discovery.md`, `targeted-evaluation.md`, `execution.md`
- Shared sources vendored into runtime paths: `skills/_shared/references/local-refactor-rules.md`, `navigation-cost.md`; `skills/_shared/scripts/repo-tree.mjs`
- Target artifacts: none

## High-Level Flow

1. Start from the requested file target or discovery area.
2. Choose discovery, targeted evaluation, or execution from the current request.
3. Load every first-level reference from the selected flow in `SKILL.md`; navigation cost owns hard-trigger values, exemptions, remedies, and report/action separation.
4. In discovery, rank at most three evidence-backed candidate files and do not edit.
5. In targeted evaluation, judge explicit files and do not edit unless execution is requested.
6. In execution, read the whole target file plus relevant tests, call sites, and local conventions.
7. Apply shared local refactor rules, edit only real cognitive pressure, and keep behavior stable.
8. Process files sequentially, stopping after the explicit target set or at most three files.
9. Run the smallest relevant check after edits.
10. After editing a target file, route through `cf-split` evaluation only when remaining file-level pressure is demonstrated; otherwise finish the target and continue within the explicit target set.
11. If the remaining readability cost is caused by related files scattered across folders, route through `cf-cohesion` targeted evaluation before continuing to another target.
12. Keep cleanup bounded when a hard trigger's remedy belongs to another flow, but report the complete deferred finding required by the canonical navigation-cost contract.
