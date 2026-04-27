---
name: cf-cohesion
description: Evaluate or execute behavior-preserving local regrouping of already-related files into a cohesive feature or workflow slice. Use when the problem is navigation cost, placement, scattered files, feature-slice cohesion, or whether related files should live together.
---
Use this skill for local cross-file cohesion review and regrouping.

Use this when related files already exist but are scattered across type folders, sibling areas, or local conventions in a way that raises navigation cost.
Do not use this for cognitive cleanup inside one file; use `cf-cognitive` for that.
Do not use this for extracting responsibilities out of one source file; use `cf-split` for that.
For repository structure, module boundaries, cross-feature ownership moves, or broad multi-step refactors, route to `cf-start`.

Do not bootstrap or require `.cflow/` artifacts.

## Entry Modes

Choose exactly one mode:

- **Discovery**: no explicit feature, workflow, or file area was provided. Read [references/discovery.md](references/discovery.md). Do not edit.
- **Targeted evaluation**: an explicit feature, workflow, file cluster, or local area was provided, but the current request does not explicitly ask to move files. Read [references/targeted-evaluation.md](references/targeted-evaluation.md). Do not edit.
- **Execution**: the current request explicitly asks to regroup, move, reorganize, or apply the cohesion fix for a bounded target. Read [references/execution.md](references/execution.md).

If the target, mode, or requested outcome is ambiguous, ask one focused question.
Do not infer execution from words like "review", "check", "is this right", or "should these live together".

## Shared Preflight

- Treat repository state as the source of truth.
- Do not create or update `.cflow/*`.
- Keep the scope local unless the user explicitly asks for repository-level planning.
- If the work crosses repository boundaries, creates a new architectural layer, or needs ordered multi-step migration, route to `cf-start`.

## Cohesion Signals

Use these signals in every mode:

- related files with the same feature, workflow, action, reducer, hook, runner, view, test, adapter, or policy vocabulary
- import and call relationships between those files
- tests and fixtures that belong exclusively to the same local behavior
- nearby sibling folders or local slices that set placement precedent
- files that look related by name but have broader shared ownership
- generic helpers, framework glue, or shared utilities that should stay outside the slice

Strong cohesion signals include:

- four or more related files for one sub-feature or workflow
- files for the same behavior spread across type folders such as components, hooks, reducers, actions, tests, adapters, or helpers
- a reader must jump across several directories to follow one local workflow
- nearby conventions already group comparable local sub-features
- the move would remove navigation cost without changing behavior or introducing a new architecture layer

## Decision Labels

Use these labels in discovery or evaluation:

- `recommended`: a local slice would make one workflow easier to find and follow now
- `optional`: cohesion is real, but current placement is still easy enough to navigate
- `keep as-is`: grouping would add churn or hide ownership more than it helps
- `route`: the move crosses repository boundaries or needs broader planning through `cf-start`

Prefer no move when files are merely similarly named, the current type-folder convention is stronger than the feature cohesion, or the target folder would become a grab bag.
Do not treat "not wrong where it is" as proof that placement is optimal when the user's concern is navigation cost.

## Output Format

Return only:

- **Scope**: target feature, workflow, or local area and mode, discovery, evaluation, or execution.
- **Cohesion map**: files considered, owner cluster, outliers, and nearby precedent; or discovery shortlist.
- **Decision**: keep as-is, optional regrouping, recommended regrouping, discovery candidates, or regrouping performed.
- **Checks**: commands run and pass/fail result, or why no check ran.
- **Result**: behavior preservation, final placement decision, remaining risk, and next action.
