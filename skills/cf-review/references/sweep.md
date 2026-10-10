# Sweep

Collect findings only.

Exclude data clumps, primitive obsession, feature envy, temporal coupling, leaky abstractions, and analogous repeated-shape smells. Their remedy propagates across every occurrence, so no nameable unit can clear the finding.

## Bugs And Requirements

### Lens 1 — Bugs

Route: `cf-mr-wolf`

On changed code and the code it calls or that calls it, report code that fails, returns a wrong result, or loses data for an input or state it accepts: unguarded division or arithmetic, missing null or undefined handling, off-by-one bounds, unhandled errors or rejections, mismatched units, races, leaked resources, and analogous project-specific forms. Name the input or state that triggers it and what happens. A behavior a written requirement decides belongs to lens 3; a behavior change under a refactor claim belongs to lens 2.

### Lens 2 — Behavior Drift

Route: `cf-mr-wolf`

For a refactor, cleanup, move, or rename claim in the current request or commit messages, report differences in exported signatures, returns, errors, side effects, evaluation order, or async behavior. Otherwise this lens is not applicable; deliberate behavior changes belong to lens 3 when they contradict an authoritative source.

### Lens 3 — Requirement Alignment

Route: `cf-scenario`

Resolve sources from requirements in the current request or commit messages; linked requirement, product, protocol, or acceptance documents around changed paths; and focused documentation searches for changed public symbols, user-visible commands or events, and distinctive changed domain terms. List checked sources in **Scope**; do not survey unrelated product docs.

Report only a direct contradiction between changed behavior and a locatably connected authoritative source. Quote the rule and identify the narrowest violating path. Do not derive intent from implementation, naming, convention, or product intuition; tests establish intent alone only when designated as acceptance contracts.

Conflicting, ambiguous, or absent sources produce no finding. Mark the lens silent and qualify **Result**; lens 6 separately owns documentation made stale by the change.

## Leftovers And Docs

### Lens 4 — Stale References

Route: `cf-mr-wolf`

On a move-shaped change, each surviving reference to an old name or path in code, configuration, manifests, scripts, tests, or templates, found by the loaded audit, is an audit surface and a finding. A stale reference in documentation or examples belongs to lens 6. Without a move-shaped change this lens is not applicable.

### Lens 5 — Incomplete Change

Route: `cf-mr-wolf`

Report both sides of an incomplete transition: old and replacement entry points still standing, including an old module, function, or route kept only to forward to its replacement; newly parallel flows; callerless compatibility shims; or code made unreachable. Name both sides and their remaining uses.

### Lens 6 — Documentation Drift

Route: `cf-docs`

Check documents that reference changed files. Report each path, symbol, signature, command, or described behavior made stale by the change, with the contradicting code; each checked document is an audit surface.

## Structure

`references/navigation-cost.md` owns thresholds, naming, exemptions, and remedies for lenses 8, 9, and 12.

### Lens 7 — Declared Invariants

Route: `cf-mr-wolf`

Check primary files against the rules the repository states about itself in prose: agent instruction files, contributor guides, README rules, architecture notes, and analogous project-specific declarations.

Exclude rules enforced by a configured linter, formatter, type checker, or test; a rule only expressible in unused configuration remains in scope. Quote the violated prose rule.

### Lens 8 — Structural Pressure

Route: `cf-cognitive` for function-level pressure; `cf-split` for file-level pressure

Apply the nesting, function-length, and file-length hard triggers in `references/navigation-cost.md`. Take file length from bundled `scripts/repo-tree.mjs`, resolved from the active skill root, with `--largest` set to the number of primary files and one `--include` per primary file.

A file trigger produces one file finding; leave its internal inventory to the skill on its route. Report function triggers only for functions with changed code.

### Lens 9 — Placement And Cohesion

Route: `cf-cohesion`

Report a file added, moved, or renamed outside the owner cluster implied by its role, imports, and callers; a workflow spread further across type folders or siblings; or a new file in a catch-all bucket. Apply the placement test from `references/navigation-cost.md`; similar names alone do not establish cohesion.

For every directory where the change set added, moved, or renamed a file, run bundled `scripts/dir-population.mjs`, resolved from the active skill root and never from the project working directory, with one `--include` per such directory; do not write a count of your own. A directory it marks is a finding under the directory-population hard trigger unless a named exemption applies.

### Lens 10 — Dependency Direction And Owner Placement

Route: `cf-architecture`

Report an introduced import, call, or type edge that violates declared dependency direction or binds a lower/domain unit to delivery, infrastructure, sibling-feature, or new global glue. Report the edge only; the skill on its route owns the target architecture.

Report state, cache, run coordination, cancellation, or result-acceptance policy that the change adds to a module bound to one delivery environment (it imports that environment's API or sits in its adapter folder) when more than one entry point uses it. Name the state and the entry points; the skill on its route owns placement.

### Lens 11 — Local Anti-Patterns

Route: `cf-cognitive`

On changed code, report intent-free indirection: restating one-line helpers, pass-through wrappers, role-free or responsibility-gluing names, single-use unpack/fill helpers, hidden side effects, and extractions that obscure one local behavior. Include analogous project-specific forms; preserve consistent local convention.

### Lens 12 — Responsibility And Ownership

Route: `cf-mr-wolf`

Apply the naming test in `references/navigation-cost.md` to functions, files, or directories with changed code. Report one finding per nameable owner that holds unrelated responsibilities; do not propose redistribution.

Report a derived value that a consumer stores, declares, or maintains instead of obtaining it from the owner of the information that determines it. That owner must derive the value and remain its single source of truth; consumers must not redefine it or require coordinated updates.

Lens 9 owns location. Prefer its placement finding unless the unit would retain the wrong responsibilities after any move.
