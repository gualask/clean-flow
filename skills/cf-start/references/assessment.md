# Assessment

Do assessment only. Do not implement, move files, or write patches.

## Goal

Decide the right **repository-level intervention frame** using the current architecture map.

Determine:

- whether intervention is actually justified
- plausible intervention modes
- whether target-shape must come before planning/execution
- whether artifact-backed planning should follow user approval
- how domain ownership, constraints, risk, and ceremony shape the path

## Required Inputs

- current architecture map
- clear repository or subsystem assessment scope

## Source Orientation

For broad structure assessment, use `repo-tree.mjs` when available before ad hoc inventory. Verify conclusions from source.

## Premise check

Answer these honestly:

1. What problem is this solving now?
2. Which domain concepts, boundaries, invariants, workflows, and dependencies matter?
3. What is the cost of doing nothing?
4. Why is the intervention proportionate?
5. What constraints, risk appetite, ceremony, or non-goals did the user state?

For hard restructure also answer:

6. Is repository shape itself the recurring cause of friction?
7. Are global barrels, shared models, or layers hiding ownership?
8. Would a soft intervention fix the pain without preserving dirty boundaries?

## Intervention mode framing

Identify plausible modes, not the final unit:

- soft-split
- soft-consolidate
- soft-mixed
- hard-restructure
- no-structural-refactor

Do not reject `hard-restructure` just because a softer path has lower churn. Rank by clean target first; use churn to stage migration.
For architecture assessment, present domain, boundaries, invariants, workflows, and dependency rules before candidate areas.

State `Target-shape need`:

- `required`: unresolved ownership, organizing axis, boundary model, domain placement, dependency direction, or packaging blocks cleanup.
- `not required`: the next step preserves the current ownership/packaging, or is only containment.

If both containment and structural cleanup are plausible, show both paths and ask. Do not call containment the cleanup target.

`soft-mixed` is repository-level only. Later units must be `split` or `consolidate`.

## Artifact behavior

Do not write `.cflow/architecture.md` or `.cflow/refactor-brief.md`.
Do not add work units.

## Output format

Return sections: **Premise check**, **Domain**, **Target-shape need**, **Candidate intervention areas**, **Plausible intervention modes**, **Artifact decision**, **Recommended next action**.

## Anti-goals

- Do not implement.
- Do not dive into work-unit splitting yet.
- Do not create, rewrite, or reprioritize work units.
- Do not rewrite the architecture map from this phase.
