# Target Shape

Do not implement in this phase.
First bias to defeat: do not protect existing code from change. Integrating around the current shape to avoid touching it is how architecture rots; the cleanest target decides, and current code is inventory, not a constraint.

## Goal

Select the reference architecture and define target ownership, boundaries, and packaging before work-unit planning.

## Required Inputs

- current repository structure, established in this session
- assessment result or current request that justifies target-shape planning
- enough scope, constraints, and risk appetite to propose one standard reference target or identify the custom-deviation decision that blocks it

## Rules

- If required inputs are missing, stop with `Artifact decision: not updated; target-shape inputs missing`.
- Stop after the proposal. No brief, no work units, no code.
- Ask whether to pursue the proposed standard reference target or intentionally define custom deviations before artifact-backed planning.

## Decision Order

1. Locate the critical complexity before naming an architectural style.
2. Select the closest recognized reference architecture that fits those forces, using its pragmatic variant.
3. Propose the standard reference target by default. Use custom top-level roles only when the standard cannot express a real ownership, dependency, or runtime boundary; surface that as the standard-vs-custom decision.
4. Define the clean end state for the assessed scope. Do not shrink target-shape to a hotspot because full migration is risky; scoped areas become migration units after target approval.
5. Place current folders, shared buckets, protocol surfaces, boundary DTOs, event ports, adapters, infrastructure implementations, and analogous forms into the selected reference roles. Keep a current bucket only when it belongs to the target or is an accepted custom deviation.
6. Name the false owners or dirty boundaries removed, the boundary model, the packaging direction, rejected alternatives, and the target tree when packaging changes.
7. State the most fragile assumption behind the proposed target: what must hold, what breaks if it does not, and the cheapest check that would confirm it before migration.

## Output format

Return sections: **Critical complexity**, **Reference target**, **Standard vs custom decision**, **Current-code migration map**, **Rejected alternatives**, **Target tree**, **Fragile assumption**, **Artifact decision**, **Recommended next action**.

## Artifact updates

Do not update `.cflow/refactor-brief.md` while proposing target shape.
Use `Artifact decision: not updated; awaiting target approval`.
