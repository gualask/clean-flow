# Assessment

Do assessment only. Do not implement, move files, or write patches.
First bias to defeat: do not protect existing code from change. Integrating around the current shape to avoid touching it is how architecture rots; the cleanest target decides, and current code is inventory, not a constraint.

## Goal

Decide the right **repository-level intervention frame** from current repository structure.

Determine:

- whether intervention is actually justified
- plausible intervention modes
- whether target-shape must come before planning/execution
- whether artifact-backed planning should follow user approval
- how domain ownership, constraints, risk, and ceremony shape the path

## Required Inputs

- current repository structure, established under the controller's Source Orientation rules
- clear repository or subsystem assessment scope
- concrete problem, evaluation lens, or framed decision to assess

## Source Orientation

Read `references/source-orientation.md` and establish current structure before assessment.

## Premise check

Answer these honestly:

1. Where does the repository's critical complexity live, and what evidence shows that?
2. What problem is this solving now?
3. Which ownership, boundary, dependency, workflow, or packaging decisions matter after that diagnosis?
4. Why is intervention proportionate, considering the cost of doing nothing?
5. What constraints, risk appetite, ceremony, or non-goals did the user state?

For hard restructure also answer:

6. Is repository shape itself the recurring cause of friction?
7. Would a soft intervention fix the pain without preserving false ownership, accidental buckets, or unclear dependency direction?

## Intervention mode framing

Identify plausible modes, not the final unit:

- soft-split
- soft-consolidate
- soft-mixed
- hard-restructure
- no-structural-refactor

Use churn only to stage migration, never to rank targets.
Open with the critical complexity location before candidate areas or intervention modes.

State `Target-shape need`:

- `required`: unresolved ownership, boundary model, dependency direction, organizing axis, false ownership, accidental buckets, or packaging blocks cleanup.
- `not required`: the next step preserves the current ownership/packaging, or is only containment.

When `Target-shape need` is `required`, the recommended next action must be target-shape for the assessed scope. Do not recommend work units, local cleanup, or a smaller target-shape first.
If both containment and structural cleanup are plausible, show both paths and ask. Do not call containment the cleanup target.

`soft-mixed` is repository-level only. Later units must be `split` or `consolidate`.

## Artifact behavior

Do not write `.cflow/refactor-brief.md`.
Do not create, rewrite, or reprioritize work units.

## Output format

Return sections: **Critical complexity**, **Premise check**, **Domain**, **Target-shape need**, **Candidate intervention areas**, **Plausible intervention modes**, **Artifact decision**, **Recommended next action**.

## Anti-goals

- Do not run tests, lint, typecheck, format checks, build commands, or `git diff --check`; passing checks are not architecture assessment evidence unless a concrete verification risk was part of the confirmed frame.
- Do not dive into work-unit splitting yet.
