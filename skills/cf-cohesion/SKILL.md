---
name: cf-cohesion
description: Evaluate or execute behavior-preserving local regrouping of already-related files into a cohesive feature or workflow slice. Use when the problem is navigation cost, placement, scattered files, feature-slice cohesion, or whether related files should live together. Do not use for non-code content; route single-file splits to cf-split and repository-level restructuring to cf-architecture.
---
Use this when related files already exist but are scattered across type folders, sibling areas, or local conventions in a way that raises navigation cost.
Route cognitive cleanup inside one file to `cf-cognitive`.
Route extracting responsibilities out of one source file to `cf-split`.
Route to `cf-architecture` when regrouping would change repository structure or module boundaries, move ownership across features, create a folder that the language or build would treat as a new package or module, add an architectural layer, or need an ordered multi-step migration, even when the request asks for the move.
When routing, do not edit files: name the route and the reason in **Result**, and end the turn.
Do not create, update, or require `.cflow/` artifacts.

## Flow Selection

Choose exactly one flow.
Discovery and targeted evaluation do not edit files.

### Discovery Flow

Use when the request names no target area.
Find likely regrouping candidates without turning the whole repository into a refactor hunt.
Count with the bundled `scripts/dir-population.mjs`, resolved from the active skill root and never from the project working directory; do not write your own count. A directory it marks at 10 or more with no sub-grouping is a candidate unless its files already form one owner cluster or no owner cluster in it has three or more members.
For **Result**, name the best candidate for a targeted evaluation, or `none`.

### Targeted Evaluation Flow

Use when the request names a target area (feature, workflow, file cluster, or directory) but does not explicitly ask to move files.

### Execution Flow

Use when the request explicitly asks to regroup, move, reorganize, or apply the cohesion fix for a named target area.
Complete or refresh the targeted evaluation before editing.
Continue only when its decision is `recommended` or `optional`; the request that selected this flow authorizes an optional regrouping.
For `keep as-is` or `route`, stop without editing and use the targeted evaluation output.
Move only the files of the owner cluster the evaluation named and update their references; do not split, merge, or rewrite file contents, which is `cf-split` work, and do not add barrel or re-export files.
After moving, run the typecheck or compile and the tests that import the moved files with the repository's test runner.

If the target area, flow, or requested outcome is ambiguous, ask one focused question.
Do not infer execution from words like "review", "check", "is this right", or "should these live together".

## References

[references/targeted-evaluation.md](references/targeted-evaluation.md) holds the cohesion map fields, the placement convention that keeps a proposed owner folder from becoming a generic bucket, and the output rules for targeted evaluation. Read it in targeted evaluation, and in execution before any edit.

[references/reference-audit.md](references/reference-audit.md) holds the repository-wide search categories for consumers of a moved file or symbol, and what to do with a stale reference in a read-only pass and in an editing one. Read it in targeted evaluation and execution, before the cohesion map and again for moved names and paths after moving.

[references/navigation-cost.md](references/navigation-cost.md) holds the navigation-cost test that ranks every cohesion signal, the hard triggers, and the report/action separation. Read it in targeted evaluation and execution.

Discovery reads none of them.

## Decision Labels

Give one label in targeted evaluation and execution:

- `recommended`: moving the owner cluster into one owner folder would make one workflow cleaner to find and follow now
- `optional`: the owner cluster is real, but its current placement is already clear enough to navigate
- `keep as-is`: regrouping would hide ownership or reduce clarity more than it helps
- `route`: regrouping needs `cf-architecture` for one of the reasons above

## Output Format

Return only:

- **Scope**: target area, or the repository in discovery, and the selected flow.
- **Cohesion map**: files considered, owner cluster, outliers, and nearby precedent; in discovery, the candidate shortlist with each directory's count.
- **Decision**: the decision label; in discovery, `candidates` or `none`; after execution, `regrouped`.
- **Checks**: commands run and pass/fail result, or why no check ran.
- **Deferred**: only after execution edits; findings required by the report/action rule in references/navigation-cost.md. Omit this section when no regrouping ran and in discovery or targeted evaluation.
- **Result**: behavior preservation, final placement decision, remaining risk, and next action. Claim behavior preservation only when those tests passed; otherwise say it is not verified by tests.
