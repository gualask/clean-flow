# Target Shape

Do not implement in this phase.

## Goal

Define target ownership, boundaries, and packaging before work-unit planning.

## Required Inputs

- current architecture map
- assessment result or current request that justifies target-shape planning
- enough scope, constraints, and risk appetite to choose one target

## Rules

- If required inputs are missing, stop with `Artifact decision: not updated; target-shape inputs missing`.
- Start from domain ownership and workflows, not current folders.
- Let current packaging constrain migration order, not the target.
- Define concepts, invariants, boundaries, dependencies, and ownership before patterns or folders.
- Use the least ceremony that removes the real friction.
- Name the false owner or dirty boundary being removed.
- Do not keep catch-all `shared`, `common`, `core`, `models`, or layer buckets unless the name has one stable role.
- Classify boundary representations before placing them.
- Pick one target boundary model and one packaging direction.
- Include a target tree when packaging changes; otherwise say no tree change.
- Name rejected alternatives for non-obvious decisions.
- Stop after the proposal. No brief, no work units, no code.
- Ask whether to accept the target and move to artifact-backed planning.

## Output format

Return sections: **Target-shape rationale**, **Ownership model**, **Organizing axis**, **Boundary representation roles**, **Rejected alternatives**, **Target boundary model**, **Target packaging direction**, **Target tree**, **Migration constraints**, **Artifact decision**, **Recommended next action**.

## Artifact updates

Do not update `.cflow/refactor-brief.md` while proposing target shape.
Use `Artifact decision: not updated; awaiting target approval`.
