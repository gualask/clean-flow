---
name: cf-architecture
description: "Assess and propose repository or subsystem architecture. Use when the user asks to evaluate or design its structure, including exploration without a known problem. Route worth-doing or impact judgments about a named change to cf-scenario."
---
Propose the target tree of this repository from its code, tests, docs, dependencies and history, not from directory styles. Without stated goals, assume behavior preservation, modifiability and testability of the present system; do not invent future needs.

Pay particular attention to:

- separation of responsibilities: business logic apart from framework, UI and infrastructure;
- ownership: who decides what, and whether the same decision is made in more than one place; when it is, name where it should be made once;
- coupling and cohesion: dependency direction, things that change together but live apart, and the reverse;
- abstractions: the ones missing and the ones that serve nothing. A new adapter or contract must separate variants the code already implements in separate modules; otherwise do not propose it;
- architectural smells.

A state or policy belongs to the capability when any interface invoking the use case would need it (lifecycle, cancellation, result acceptance, cache, workflow rules, or an analogous one); to an adapter only when it exists because of one environment or presentation session. Judge the decision, not the framework mechanism implementing it or where it runs. Do not draw the tree while such a state or policy remains assigned to an adapter.

For each dimension the code varies along (platform or build target, provider, storage, configuration, or an analogous one), name its variants and every place that decides among them, in code, build conditions and UI, and where that decision should be made once. Where the variants have implementations of their own, run the bundled `scripts/variant-history.mjs`, resolved from the active skill root and never from the project working directory, with `--repo .` and the directories of those implementations: for every commit that added one it lists the files changed outside it. Cite that list and the commit as evidence; do not write your own count.

Present one target tree in the conversation, without implementing changes or creating files.

## Feature Handoff

When `cf-brainstorm` hands over its draft, its product decisions are settled: do not reopen them. Decide ownership only for what the feature adds or changes, in the same form: the target tree of the touched modules. Stay in the modules the feature touches; name a problem outside them in one line, outside the tree. Present the tree in the conversation; on the user's reply, read [references/spec.md](references/spec.md).

## Artifacts

- Owns `.cflow/specs/draft.md` for the architecture being designed or the feature handed over, and promotes it to the approved spec.

When the user replies to a tree that changes the structure, read [references/spec.md](references/spec.md): it holds how that tree becomes an approved spec.

## Output Format

Return only:

- **Target tree**: one tree; under each directory, what it owns and the `file:line` that proves it.
- **Unchanged**: what stays as it is, with the same evidence.
