---
name: cf-architecture
description: "Assess and propose repository or subsystem architecture. Use when the user asks to evaluate or design its structure, including exploration without a known problem."
---
Propose the cleanest practical architecture for this repository: the form it should have, then the target tree that form gives.

Produce these in order, each from the one before, reading the code, tests, docs, dependencies and history.

## Drivers

List what the structure has to serve: what is hard to get right here, the invariants the system must guarantee, the state, the external systems, and what changes in it. In that list:

- The kinds of client that invoke the system's operations, and each entry point (controller, command, handler) that must keep more than one persistent store consistent.
- Ownership: who decides what, and whether the same decision is made in more than one place; when it is, name where it should be made once.
- For each dimension the code varies along (platform or build target, provider, storage, configuration, or an analogous one), name its variants and every place that decides among them, in code, build conditions and UI, and where that decision should be made once. Where the variants have implementations of their own, run the bundled `scripts/variant-history.mjs`, resolved from the active skill root and never from the project working directory, with `--repo .` and the directories of those implementations: for every commit that added one it lists the files changed outside it. Cite that list and the commit as evidence; do not write your own count.
- Where the repository states its structure (an architecture doc, dependency rules, a layering), check the code against it: every import or call that crosses a stated boundary the wrong way is a finding, and so is every cycle between modules; name each with its `file:line`.

## Form

Read [references/forms.md](references/forms.md): the forms a tree can take, each with its unit, its direction, when it wins and its tree. Name the form the code has, as one of those forms or a nesting of them, and compare it with at least two other forms that differ from it in what they make the unit of the code or in the direction of its dependencies. Judge each form, the current one included, only on the drivers, and name at least one drawback of each, the form that wins included, with `file:line` or a commit. How much code moves, how long the migration takes, how much of the current structure survives and how well the code follows its current form are not reasons for or against a form.

For each form compared, list the facts its **When** names and, for each, whether it holds here, with a `file:line`, a number or a commit. Then check again, in the files they cite, only the facts that separate the form that wins from the next one, and correct any that does not hold. A fact that holds for both forms, as when one nests inside the other, does not separate them. When the checked facts do not separate the two forms, the drawback that breaks a stated requirement (a dependency rule, a documented invariant) decides, named with its source; when no drawback does, do not choose: present both, name the fact that would decide, and ask the user which driver weighs more; draw the target tree after the answer.

## Boundaries

For the form that wins, check these splits in order. A split enters the tree, or stays in it, only when its condition holds in this repository, shown by a `file:line`, a commit or a stated requirement; otherwise skip it and go on.

1. Entry points and business logic: always.
2. Business logic and persistence or external systems: when the code has either.
3. Modules by capability, shaped as the modular monolith in `references/forms.md`: when a layer has grown too big to work on as one unit, or the same term means different things in two parts of the code.
4. A thin application service, which depends on the capabilities it composes and which none of them uses, placed as `references/forms.md` places it for the form of the tree: when a second kind of client invokes the same operations, or an entry point must keep more than one persistent store consistent.
5. Ports and adapters: only to separate variants the code already implements in separate modules, or to keep the form's dependency direction where inner code would otherwise name outer code.
6. Separate crates, packages or deployables: only for a defect, a stated requirement or a cost that recurs in the history. Build or packaging convenience is none of these.

Any other boundary names the change it isolates or the problem it solves: a defect, a stated requirement or a cost that recurs in the history, each shown by a `file:line` or a commit. A boundary with neither does not enter the tree.

A state or policy belongs to the capability when any kind of client invoking the operation would need it (lifecycle, cancellation, result acceptance, cache, workflow rules, or an analogous one); to an adapter only when it exists because of one environment or presentation session. Judge the decision, not the framework mechanism implementing it or where it runs. Do not draw the tree while a state or policy that belongs to a capability remains assigned to an adapter.

## Target tree

Present one target tree in the conversation, in the shape of the winning form's entry in `references/forms.md`; where it has layers, their names come from one convention, named.

Before presenting it, check its dependencies when a SCIP indexer for the code's language runs here (`rust-analyzer scip`, `scip-typescript`, `scip-python`, or the one for that language). Write the index outside the repository; write, also outside it, a file that assigns the current code to the tree's modules, with the form's groups in the order of its direction; run the bundled `scripts/tree-check.mjs`, resolved from the active skill root and never from the project working directory, with the index and that file: its first lines give the file's format and what it reports. Correct the tree until it reports no cycle, no use against the direction and no unassigned code; when one element causes a use, move that element, not its file. When the tree adds a port so that a module stops naming an element of another, declare it with a `port` line that names the port instead; every port the script lists appears in the tree under that name, with the condition in `Boundaries` that justifies it. When no indexer runs, say under the tree that its dependencies are not checked.

When the user asks to check the tree before approving it, read [references/tree-check.md](references/tree-check.md); that request does not start the spec.

## Feature Handoff

When `cf-brainstorm` hands over its draft, its product decisions are settled: do not reopen them. The repository's form stays: `Drivers` and `Form` do not apply. Decide ownership only for what the feature adds or changes, with the rules in `Boundaries` and the entry of [references/forms.md](references/forms.md) for the form the code has, as the target tree of the touched modules. Stay in the modules the feature touches; name a problem outside them in one line, outside the tree. When the tree needs a capability that no dependency in the project's manifests provides, do not pick a library from memory: name the capability with the tree and ask the user whether to search online for current candidates; until they choose, it stays an open question in the draft. Present the tree in the conversation; on the user's reply, read [references/spec.md](references/spec.md).

## Routed Finding

When the request carries a finding another skill routed here (a dependency against the declared direction, a state or policy held by an adapter, files that would become a new package or module, code to move into another module), the repository's form stays: `Drivers` and `Form` do not apply. Decide only where the code the finding names belongs, with the rules in `Boundaries`, and stay in the modules the finding touches; name a problem outside them in one line. When an indexer runs, check the move with `scripts/tree-check.mjs` as `Target tree` says, the code assigned as it is with the move applied. Return the finding, where its code goes with the `file:line` that proves it, the elements that move, and the last output of the script or the line saying the move is not checked.

## Artifacts

- Owns `.cflow/specs/draft.md` for the architecture being designed or the feature handed over, and promotes it to the approved spec.

When the user replies to a tree that changes the structure, read [references/spec.md](references/spec.md): it holds how that tree becomes an approved spec.

## Output Format

Return only:

- **Drivers**: the list above, with the `file:line` of each; omitted for a feature handoff or a routed finding.
- **Forms compared**: the form the code has and the alternatives, each with the facts of its **When** and whether they hold, what it would change here, its drawback and the evidence; then the facts checked again and the form they decide, or the question when they decide none; omitted for a feature handoff or a routed finding.
- **Target tree**: once a form is decided, one tree; under each directory, what it owns, the change it isolates or the problem it solves, and the `file:line` that proves it; then the elements the tree moves out of their current file, and the last output of `scripts/tree-check.mjs`, or the line saying the dependencies are not checked.
- **Unchanged**: the existing boundaries whose condition in `Boundaries` holds, with the same evidence.
