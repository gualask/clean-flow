# Sweep

Collect findings only.

Exclude data clumps, primitive obsession, feature envy, temporal coupling, leaky abstractions, and analogous repeated-shape smells. Their remedy propagates across every occurrence, so no nameable unit can clear the finding.

## Leftovers And Docs

### Lens 1 — Stale References

Route: `cf-mr-wolf`

On a move-shaped change, each surviving reference to an old name or path in code, configuration, manifests, scripts, tests, or templates, found by the loaded audit, is an audit surface and a finding. A stale reference in documentation or examples belongs to lens 3. Without a move-shaped change this lens is not applicable.

### Lens 2 — Incomplete Change

Route: `cf-mr-wolf`

Report both sides of an incomplete transition: old and replacement entry points still standing, including an old module, function, or route kept only to forward to its replacement; parallel flows for the same job; callerless compatibility shims; or code made unreachable. Name both sides and their remaining uses.

### Lens 3 — Documentation Drift

Route: `cf-docs`

Check documents that reference primary files. Report each path, symbol, signature, command, or described behavior the code contradicts, with the contradicting code; each checked document is an audit surface.

## Structure

`references/navigation-cost.md` owns thresholds, the naming test, exemptions, and remedies for lenses 5, 6, and 9.

### Lens 4 — Declared Invariants

Route: `cf-mr-wolf`

Check primary files against the rules the repository states about itself in prose: agent instruction files, contributor guides, README rules, architecture notes, and analogous project-specific declarations.

Exclude rules enforced by a configured linter, formatter, type checker, or test; a rule only expressible in unused configuration remains in scope. Quote the violated prose rule.

### Lens 5 — Structural Pressure

Route: `cf-cognitive` for function-level pressure; `cf-placement` for file-level pressure

Apply the nesting and file-length hard triggers in `references/navigation-cost.md`. Report each function with changed code past 20 logical lines as a function finding routed to `cf-cognitive`, which decides whether anything moves; length is not a hard trigger, so it does not hold the result. Take file length from bundled `scripts/repo-tree.mjs`, resolved from the active skill root, with `--largest` set to the number of primary files and one `--include` per primary file.

A file trigger produces one file finding; leave its internal inventory to the skill on its route.

### Lens 6 — Placement And Cohesion

Route: `cf-placement`

Report a file outside the owner implied by its role, imports, and callers; a workflow spread across type folders or siblings; or a file in a catch-all bucket. On a change target, judge only files the change added, moved, or renamed. Judge it with the test in `references/navigation-cost.md`; similar names alone do not establish cohesion.

Run bundled `scripts/dir-population.mjs`, resolved from the active skill root and never from the project working directory, with one `--include` per directory to check: on a change target, each directory where the change added, moved, or renamed a file; otherwise each directory holding primary files. Do not write a count of your own. A directory it marks is a finding under the directory-population hard trigger unless a named exemption applies.

### Lens 7 — Dependency Direction And Owner Placement

Route: `cf-architecture`

Report an import, call, or type edge in changed code that violates declared dependency direction or binds a lower/domain unit to delivery, infrastructure, sibling-feature, or new global glue. Report the edge only; the skill on its route owns the target architecture.

Report state, cache, run coordination, cancellation, or result-acceptance policy in changed code of a module bound to one delivery environment (it imports that environment's API or sits in its adapter folder) when more than one entry point uses it. Name the state and the entry points; the skill on its route owns placement.

### Lens 8 — Local Anti-Patterns

Route: `cf-cognitive`

On changed code, report intent-free indirection: restating one-line helpers, pass-through wrappers, role-free or responsibility-gluing names, single-use unpack/fill helpers, hidden side effects, and extractions that obscure one local behavior. Include analogous project-specific forms; preserve consistent local convention.

### Lens 9 — Responsibility And Ownership

Route: `cf-mr-wolf`

Apply the naming test in `references/navigation-cost.md` to functions, files, or directories with changed code. Report one finding per nameable owner that holds unrelated responsibilities; do not propose redistribution.

Report each piece of knowledge that primary files represent in more than one place: a derived value, rule, constant, format, validation, mapping, or algorithm that cannot change in one place without the same change in another. Name the place that should own it and every copy with its `file:line`. Code that reads alike but would change for different reasons is not a copy; code written differently that encodes the same rule is.

A derived value that a consumer stores, declares, or maintains instead of obtaining it from the owner of the information that determines it is a copy. That owner must derive the value and remain its single source of truth; consumers must not redefine it or require coordinated updates.

For each function, constant, pattern, or format that changed code defines, search the repository for an existing one encoding the same knowledge, by its distinctive literals and by the names of the concept. A match is a copy, even when the two share no text.

## Dead Names

### Lens 10 — String Boundaries

Route: `cf-deadcode`

Build the table in `references/string-boundaries.md` for the names that primary files send or receive. Each row with an empty cell is a finding.
