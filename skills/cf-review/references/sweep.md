# Sweep

Collect candidates only. Use `references/navigation-cost.md` for lenses 2, 3, and 9; it owns thresholds, naming, exemptions, and remedies.

Exclude data clumps, primitive obsession, feature envy, temporal coupling, leaky abstractions, and analogous repeated-shape smells. Their remedy propagates across every occurrence, so no nameable unit can clear the finding.

## Lens 1 — Declared Invariants

Route: `cf-mr-wolf`

Check the files in scope against the rules the repository states about itself in prose: agent instruction files, contributor guides, README rules, architecture notes, and analogous project-specific declarations.

Exclude rules enforced by a configured linter, formatter, type checker, or test; a rule only expressible in unused configuration remains in scope. Quote the violated prose rule.

## Lens 2 — Structural Pressure

Route: `cf-cognitive` for function-level pressure; `cf-split` for file-level pressure

Apply the hard triggers in `references/navigation-cost.md`. Take file length from bundled `scripts/repo-tree.mjs`, resolved from the active skill root after running it with `--help`.

A file trigger produces one file finding; leave its internal inventory to the receiving skill. Report function triggers only for touched functions.

## Lens 3 — Placement And Cohesion

Route: `cf-cohesion`

Report a file added, moved, or renamed outside the owner cluster implied by its role, imports, and callers; a workflow spread further across type folders or siblings; or a new file in a catch-all bucket. Apply the placement test from `references/navigation-cost.md`; similar names alone do not establish cohesion.

## Lens 4 — Dependency Direction

Route: `cf-start`

Report an introduced import, call, or type edge that violates declared dependency direction or binds a lower/domain unit to delivery, infrastructure, sibling-feature, or new global glue. Report the edge only; the receiving skill owns the target architecture.

## Lens 5 — Local Anti-Patterns

Route: `cf-cognitive`

On added or rewritten code, report intent-free indirection: restating one-line helpers, pass-through wrappers, role-free or responsibility-gluing names, single-use unpack/fill helpers, hidden side effects, and extractions that obscure one local behavior. Include analogous project-specific forms; preserve consistent local convention.

## Lens 6 — Stale References

Route: `cf-mr-wolf`

On an applicable move-shaped change, each surviving reference to an old name or path found by the loaded audit is an audit surface and finding. Otherwise this lens is not applicable.

## Lens 7 — Incomplete Change

Route: `cf-simplify`

Report both sides of an incomplete transition: old and replacement paths still standing, newly parallel flows, callerless compatibility shims, or code made unreachable. Name both sides and their remaining uses.

## Lens 8 — Behavior Drift

Route: `cf-scenario`

For a refactor, cleanup, move, or rename claim in the current request or commit messages, report differences in exported signatures, returns, errors, side effects, evaluation order, or async behavior. Otherwise this lens is not applicable; deliberate behavior changes belong to Lens 11 when they contradict authoritative intent.

## Lens 9 — Responsibility And Ownership

Route: `cf-mr-wolf`

Apply the naming test in `references/navigation-cost.md` to touched functions, files, or directories. Report one finding per nameable owner that holds unrelated responsibilities; do not propose redistribution.

Report a derived value that a consumer stores, declares, or maintains instead of obtaining it from the owner of the information that determines it. That owner must derive the value and remain its single source of truth; consumers must not redefine it or require coordinated updates.

Lens 3 owns location. Prefer its placement finding unless the unit would retain the wrong responsibilities after any move.

## Lens 10 — Documentation Drift

Route: `cf-docs`

Check documents that reference touched files. Report each path, symbol, signature, command, or described behavior made stale by the change, with the contradicting code; each checked document is an audit surface.

## Lens 11 — Business Requirement Alignment

Route: `cf-scenario`

Resolve sources from requirements in the current request or commit messages; linked requirement, product, protocol, or acceptance documents around touched paths; and focused documentation searches for changed public symbols, user-visible commands or events, and distinctive changed domain terms. List checked sources in **Scope**; do not survey unrelated product docs.

Report only a direct contradiction between changed behavior and a locatably connected authoritative source. Quote the rule and identify the narrowest violating path. Do not derive intent from implementation, naming, convention, or product intuition; tests establish intent alone only when designated as acceptance contracts.

Conflicting, ambiguous, or absent sources produce no finding. Mark the lens silent and qualify **Result**; Lens 10 separately owns documentation made stale by the change.
