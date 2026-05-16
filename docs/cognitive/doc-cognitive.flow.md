# cf-cognitive Flow

## Purpose

Document the runtime flow for `cf-cognitive`, the public local cleanup entrypoint for reducing real cognitive complexity in source files.

## Runtime Inputs

- Public skill: `skills/cf-cognitive/SKILL.md`
- Runtime references: `skills/cf-cognitive/references/discovery.md`, `targeted-evaluation.md`, `execution.md`
- Shared references: `skills/_shared/references/local-refactor-rules.md`, `local-readability-review.md`
- Target artifacts: none

## High-Level Flow

1. Start from the requested file target or discovery area.
2. Choose discovery, targeted evaluation, or execution from the current request.
3. In discovery, rank at most three evidence-backed candidate files and do not edit.
4. In targeted evaluation, judge explicit files and do not edit unless execution is requested.
5. In execution, read the whole target file plus relevant tests, call sites, and local conventions.
6. Apply shared local refactor rules, edit only real cognitive pressure, and keep behavior stable.
7. Process files sequentially, stopping after the explicit target set or at most three files.
8. Run the smallest relevant check after edits.
9. After editing a target file, route through `cf-split` evaluation for that file before continuing to another target.
10. If the remaining readability cost is caused by related files scattered across folders, route through `cf-cohesion` targeted evaluation before continuing to another target.
