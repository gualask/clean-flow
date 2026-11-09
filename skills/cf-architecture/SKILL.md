---
name: cf-architecture
description: "Assess and propose repository or subsystem architecture. Use when the user asks to evaluate or design its structure, including exploration without a known problem."
---
Propose the cleanest practical architecture for this repository: the form it should have, then the target tree that form gives. The current structure is evidence and migration inventory, not the target to preserve; what the change costs is decided only in the migration order.

Produce these in order, each from the one before, reading the code, tests, docs, dependencies and history.

## Drivers

List what the structure has to serve: what is hard to get right here, the invariants the system must guarantee, the state, the external systems, and what changes in it. In that list:

- The kinds of client that invoke the system's operations, and each entry point (controller, command, handler) that must keep more than one persistent store consistent.
- Ownership: who decides what, and whether the same decision is made in more than one place; when it is, name where it should be made once.
- For each dimension the code varies along (platform or build target, provider, storage, configuration, or an analogous one), name its variants and every place that decides among them, in code, build conditions and UI, and where that decision should be made once. Where the variants have implementations of their own, run the bundled `scripts/variant-history.mjs`, resolved from the active skill root and never from the project working directory, with `--repo .` and the directories of those implementations: for every commit that added one it lists the files changed outside it. Cite that list and the commit as evidence; do not write your own count.
- Where the repository states its structure (an architecture doc, dependency rules, a layering), check the code against it: every import or call that crosses a stated boundary the wrong way is a finding, and so is every cycle between modules; name each with its `file:line`.

## Form

Name the form the code has, in the vocabulary of architectural styles, and compare it with at least two forms that differ from it in what they make the unit of the code or in the direction of its dependencies. Judge each form, the current one included, only on the drivers, and name at least one drawback of each, the form that wins included, with `file:line` or a commit. How much code moves, how long the migration takes, how much of the current structure survives and how well the code follows its current form are not reasons for or against a form.

## Boundaries

For the form that wins, check these splits in order. A split enters the tree, or stays in it, only when its condition holds in this repository, shown by a `file:line`, a commit or a stated requirement; otherwise skip it and go on.

1. Entry points and business logic: always.
2. Business logic and persistence or external systems: when the code has either.
3. Modules by capability, each with its own layers: when a layer has grown too big to work on as one unit, or the same term means different things in two parts of the code.
4. One thin application service outside the capabilities, which depends on them and on which they do not depend: when a second kind of client invokes the same operations, or an entry point must keep more than one persistent store consistent.
5. Ports and adapters: only to separate variants the code already implements in separate modules, or to keep the form's dependency direction where inner code would otherwise name outer code.
6. Separate crates, packages or deployables: only for a defect, a stated requirement or a cost that recurs in the history. Build or packaging convenience is none of these.

Any other boundary names the change it isolates or the problem it solves: a defect, a stated requirement or a cost that recurs in the history, each shown by a `file:line` or a commit. A boundary with neither does not enter the tree.

A state or policy belongs to the capability when any kind of client invoking the operation would need it (lifecycle, cancellation, result acceptance, cache, workflow rules, or an analogous one); to an adapter only when it exists because of one environment or presentation session. Judge the decision, not the framework mechanism implementing it or where it runs. Do not draw the tree while a state or policy that belongs to a capability remains assigned to an adapter.

## Target tree

Present one target tree in the conversation.

When the user asks to check the tree before approving it, read [references/tree-check.md](references/tree-check.md); that request does not start the spec.

## Feature Handoff

When `cf-brainstorm` hands over its draft, its product decisions are settled: do not reopen them. The repository's form stays: `Drivers` and `Form` do not apply. Decide ownership only for what the feature adds or changes, with the rules in `Boundaries`, as the target tree of the touched modules. Stay in the modules the feature touches; name a problem outside them in one line, outside the tree. When the tree needs a capability that no dependency in the project's manifests provides, do not pick a library from memory: name the capability with the tree and ask the user whether to search online for current candidates; until they choose, it stays an open question in the draft. Present the tree in the conversation; on the user's reply, read [references/spec.md](references/spec.md).

## Artifacts

- Owns `.cflow/specs/draft.md` for the architecture being designed or the feature handed over, and promotes it to the approved spec.

When the user replies to a tree that changes the structure, read [references/spec.md](references/spec.md): it holds how that tree becomes an approved spec.

## Output Format

Return only:

- **Drivers**: the list above, with the `file:line` of each; omitted for a feature handoff.
- **Forms compared**: the form the code has and the alternatives, each with what it would change here, its drawback and the evidence; omitted for a feature handoff.
- **Target tree**: one tree; under each directory, what it owns, the change it isolates or the problem it solves, and the `file:line` that proves it.
- **Unchanged**: the existing boundaries whose condition in `Boundaries` holds, with the same evidence.
