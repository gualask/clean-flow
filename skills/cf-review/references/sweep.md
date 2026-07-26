# Sweep

Run every lens below against every file in the change set the consuming contract resolved. A lens that finds nothing reports nothing; no lens is skipped because another one already fired on the same file.

Collect only. Routing and depth are the consuming contract's gates, not decisions to make here.

Close the sweep with a per-lens account, because a pass that ran four lenses and a pass that ran all of them produce the same findings list otherwise. Mark each lens reporting, silent, or not applicable. Only lenses 6 and 8 carry a condition that can make them not applicable — a move-shaped change and a stated behavior-preserving claim — and the mark is valid only when it names the absent condition. Every other lens either reports or is silent; a lens that was not run has no mark to hide behind.

Read `references/navigation-cost.md` before lenses 2, 3, and 9; it owns the threshold values, the naming test, the recognized exemptions, and the remedy rules. Do not restate its numbers here or in the output; cite it and report what the file does against it.

## What Counts As A Finding

- A rule the repository or the pack states, broken by a file in scope.
- Evidence is a path with a line or range, or a command and its output. A claim with no locatable evidence is not reported.
- Pre-existing and newly introduced violations are both findings, at the same weight. Record which one it is, because it decides urgency, never severity.
- When a lens fires but a recognized exemption applies, name the exemption and drop the finding. No named exemption, no absolution.

## Bounded Remedies Only

Report a violation only when its remedy is confined to a unit this finding can name. When the remedy is "every site that uses this shape", the violation does not belong to a change-set pass, however real it is.

This rules out repeated-shape smells by construction: data clumps, primitive obsession, feature envy, temporal coupling, leaky abstractions, and analogous project-specific forms. Do not report them, do not add them as observations, and do not raise one as context beside a finding that is in scope. "The same three arguments travel together everywhere, so this deserves a type" is the rationalization this rule exists to refuse.

Two properties separate them from what belongs here. Their fix propagates: introducing the type or moving the method rewrites every call site, and each rewrite exposes the next instance. And they never converge: a repeated shape is repeated by definition, so no single commit clears it, and reporting it once means reporting it on every pass afterwards until a reader learns to skip the whole output.

A file past a hard trigger is the opposite on both counts — one owner, and silence once it is fixed. That is the shape a finding must have to be worth reporting here.

## Lens 1 — Declared Invariants

Route: `cf-mr-wolf`

Check the files in scope against the rules the repository states about itself in prose: agent instruction files, contributor guides, README rules, architecture notes, and analogous project-specific declarations.

Leave out any rule the repository already enforces mechanically through a linter, formatter, type checker, or a test that asserts it. Machine-enforced rules are better run than read, and re-deriving one by hand buys a slower answer with a worse error rate. Naming the tool that owns the rule is what makes that exclusion valid: a rule merely expressible as configuration nobody wired up is still prose, and still in scope. Do not run those tools here to find out — read what the repository configures and runs.

What remains is the lens with the lowest false-positive cost, because the rule is written down and the check is a comparison. Run it first and quote the declared rule in the evidence.

## Lens 2 — Structural Pressure

Route: `cf-cognitive` for function-level pressure; `cf-split` for file-level pressure

Against the canonical hard triggers in `references/navigation-cost.md`: file length, nesting depth, and function or method length.

Take file length from bundled `scripts/repo-tree.mjs` rather than estimating it: resolve it from the active skill root, never from the project working directory, and run it with `--help` first.

A file past the file-length trigger is one finding. Do not open it to enumerate its long functions; that inventory belongs to the receiving skill. Report function-level pressure only for functions the change set actually touches.

## Lens 3 — Placement And Cohesion

Route: `cf-cohesion`

A file added, moved, or renamed by the change set that lands outside the owner cluster its name, imports, and callers imply. Also: a workflow the change set spreads further across type folders or sibling areas, and a new file dropped into a catch-all bucket.

Judge placement by whether a maintainer could guess the location, per `references/navigation-cost.md`. Similar names alone are not cohesion.

## Lens 4 — Dependency Direction

Route: `cf-start`

An import, call, or type reference the change set introduces that crosses a boundary the wrong way: a lower layer reaching up into a higher one, a domain unit depending on delivery or infrastructure detail, two sibling features binding directly to each other, or new global glue that gives an area a dependency it did not have. Whatever direction the repository's own layering declares counts the same way.

Report the edge, not the architecture. Naming the target shape belongs to the receiving skill.

## Lens 5 — Local Anti-Patterns

Route: `cf-cognitive`

Against the `Avoid` list in `references/local-refactor-rules.md`, on code the change set adds or rewrites: helpers whose name restates their body, pass-through wrappers, generic role-free names, names that glue separate responsibilities together, and helpers that hide side effects. Analogous project-specific forms count.

Preserve local convention: a form the surrounding code already uses consistently is a convention question, not an anti-pattern finding.

## Lens 6 — Stale References

Route: `cf-mr-wolf`

When the change set moved, renamed, split, merged, removed, or re-exported anything, run the category searches in `references/reference-audit.md` against the old names and paths. Report each surviving reference as its own finding.

This lens fires only on a move-shaped change. Skip it when nothing was relocated or renamed.

## Lens 7 — Incomplete Change

Route: `cf-simplify`

The change set left both sides of a transition standing: an old path alive beside its replacement, a second flow that now does nearly what the new one does, a compatibility shim with no remaining caller, or code the change made unreachable. Any other form of a transition stopped halfway counts too.

Evidence is the pair — name both the old and the new, and where each is still used.

## Lens 8 — Behavior Drift

Route: `cf-scenario`

When the change set presents itself as behavior-preserving, check what `references/local-refactor-rules.md` requires kept: exported signatures, return values, thrown errors, side effects, evaluation order, and async behavior. Report each observable difference.

Take the behavior-preserving claim from where the change states it: the current request for pending work, the commit messages for a history range. This lens fires only on a change framed as a refactor, cleanup, move, or rename. A deliberate behavior change is not a finding.

## Lens 9 — Responsibility And Ownership

Route: `cf-mr-wolf`

A unit in scope that holds work it should not own: a name claiming ownership the code does not have, a bucket accumulating unrelated responsibilities, an owner that has quietly become the place everything lands, or a boundary that exists by accident rather than by decision.

The trigger is the naming test in `references/navigation-cost.md` — a unit that cannot be named by its result or role without "and", "or", or a list of steps holds more than one responsibility. Apply it to the unit as it stands after the change, at whatever level the change set reached: function, file, or directory.

Name the owner and the responsibilities it carries. One finding per owner, never one per responsibility, and no proposed redistribution: which responsibility moves where is a decision, which is why this routes to a decision skill instead of a cleanup one.

This lens asks what a unit owns; lens 3 asks where a file sits. When both fire on one file, the placement finding is the one to report unless the unit would still hold the wrong work after any move.

It stays inside the bounding rule above because every finding names one owner and goes quiet once that owner is fixed. A responsibility problem with no nameable owner is out of scope here.

## Lens 10 — Documentation Drift

Route: `cf-docs`

Documentation that the change set made wrong: a path, symbol, signature, command, or described behavior that no longer matches the code in scope. Check the docs that reference the touched files, not the whole documentation set.

Report the stale statement and the code that now contradicts it.
