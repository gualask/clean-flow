---
name: cf-cohesion
description: Evaluate or execute behavior-preserving local regrouping of already-related files into a cohesive feature or workflow slice. Use when the problem is navigation cost, placement, scattered files, feature-slice cohesion, or whether related files should live together. Do not use for non-code content; route single-file splits to cf-split and repository-level restructuring to cf-start.
---
Use this skill for local cross-file cohesion review and regrouping.

Use this when related files already exist but are scattered across type folders, sibling areas, or local conventions in a way that raises navigation cost.
Do not use this for cognitive cleanup inside one file; use `cf-cognitive` for that.
Do not use this for extracting responsibilities out of one source file; use `cf-split` for that.
For repository structure, module boundaries, cross-feature ownership moves, or broad multi-step refactors, route to `cf-start`.

Do not bootstrap or require `.cflow/` artifacts.

## Flow Selection

Choose exactly one flow:
Discovery and targeted evaluation flows do not edit repository files.

### Discovery Flow

Use when no explicit feature, workflow, or file area was provided.
Do discovery only; do not edit files.
Find likely cross-file cohesion candidates without turning the whole repository into a refactor hunt.
For **Checks**, say `not run; discovery only` unless a read-only diagnostic command was useful enough to report.
For **Result**, name the best next targeted evaluation candidate or `none`.

### Targeted Evaluation Flow

Use when an explicit feature, workflow, file cluster, or local area was provided, but the current request does not explicitly ask to move files.

### Execution Flow

Use when the current request explicitly asks to regroup, move, reorganize, or apply the cohesion fix for a bounded target.
Complete or refresh the targeted evaluation before editing.
Continue only when its decision is `recommended` or `optional`; the request that selected this flow authorizes an optional regrouping.
For `keep as-is` or `route`, stop without editing and use the targeted-evaluation output.

If the target, flow, or requested outcome is ambiguous, ask one focused question.
Do not infer execution from words like "review", "check", "is this right", or "should these live together".

## References

[references/targeted-evaluation.md](references/targeted-evaluation.md) holds the cohesion map fields, the placement convention that keeps a proposed folder from becoming a generic bucket, and the output shape for this flow. Read it in the targeted evaluation flow, and in the execution flow before any edit.

[references/reference-audit.md](references/reference-audit.md) holds the repository-wide search categories for consumers of a moved file or symbol, and what to do with a stale reference in a read-only pass and in an editing one. Read it in the targeted evaluation and execution flows, before the cohesion map and again for moved names and paths after editing.

[references/navigation-cost.md](references/navigation-cost.md) holds the navigation-cost test that ranks every cohesion signal, the hard triggers, and the report/action separation. Read it in the targeted evaluation and execution flows.

The discovery flow reads none of them.

## Shared Preflight

- Do not create or update `.cflow/*`.
- Keep the scope local unless the current request explicitly asks for repository-level planning.
- If the work crosses repository boundaries, creates a new architectural layer, or needs ordered multi-step migration, route to `cf-start`.

## Decision Labels

Use these labels in discovery or evaluation:

- `recommended`: a local slice would make one workflow cleaner to find and follow now
- `optional`: cohesion is real, but current placement is already clear enough to navigate
- `keep as-is`: grouping would hide ownership or reduce clarity more than it helps
- `route`: the move crosses repository boundaries or needs broader planning through `cf-start`

## Output Format

Return only:

- **Scope**: target feature, workflow, or local area and selected flow.
- **Cohesion map**: files considered, owner cluster, outliers, and nearby precedent; or discovery shortlist.
- **Decision**: keep as-is, optional regrouping, recommended regrouping, discovery candidates, or regrouping performed.
- **Checks**: commands run and pass/fail result, or why no check ran.
- **Deferred**: only after execution edits; findings required by the report/action rule in references/navigation-cost.md. Omit this section when no regrouping ran and in discovery or targeted evaluation.
- **Result**: behavior preservation, final placement decision, remaining risk, and next action.
