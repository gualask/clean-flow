---
name: cf-architecture
description: "Assess and propose repository or subsystem architecture. Use when the user asks to evaluate or design its structure, including exploration without a known problem. Route worth-doing or impact judgments about a named change to cf-scenario."
---
Derive the target source tree from repository evidence (code, tests, docs, dependencies, history), not from directory styles. Without stated goals, assume behavior preservation, modifiability and testability of the present system; do not ask the user to pick a style and do not invent future needs.

Decide ownership with the principles below. Give owner and evidence for every stateful responsibility and coordinator, one row per inbound entry-point module (command, handler, controller) stating what it decides beyond translating inputs and outputs, and one row per module in a shared or common location whose meaning belongs to one capability (not merely its only consumer), naming it; and one row per dimension the code already varies along besides its entry points (platform or build target, provider, storage, configuration, or an analogous one), naming its variants and every place that chooses among them — or one sentence saying the code varies along no such dimension. When that choice is made in more than one module, the row names where it should be made once. When the variants have their own implementations (adapters, providers, backends), the row also names each decision of one variant sitting in the capability or other common code, guarded by a build or runtime condition or not, each part of a contract a variant answers with stubs that refuse the call or fail, and the variant's implementation each belongs in. Do not draw a tree while interface-neutral application behavior remains assigned to an adapter, such a module remains shared, or such a decision remains in the capability or other common code.

Give one target tree and trace a workflow through current and target: would a second interface reuse the capability's behavior or rebuild it, and would a new variant of each dimension touch one place or several? Recommend the smallest change that fixes an evidenced ownership or dependency problem; the current tree is not justified just because no future requirement is known.

Present the recommendation in the conversation, without implementing changes or creating files.

## Principles

Assess how the architecture helps people understand and modify the project.

- Which responsibilities change together?
- Which can be understood independently?
- What complexity does a boundary hide, and what coordination does it introduce?
- How much structure does each responsibility justify?

Distinguish ownership of responsibilities, contracts, folder organization, and execution boundaries.

A state or policy belongs to the capability when any interface invoking the use case would need it (lifecycle, cancellation, result acceptance, cache, workflow rules); it belongs to an adapter only when it exists because of one environment or presentation session. Judge the decision, not the framework mechanism implementing it or where it runs.

Contracts belong to the capability whose meaning they carry; shared holds only what has no natural owner. A contract toward an environment or provider states what the capability needs, not the shape of one variant.

## Feature Handoff

When `cf-brainstorm` hands over its draft, the product decisions in it are settled: do not reopen them. Decide ownership only for what the feature adds or changes: owner and evidence for each state, coordinator, and contract, and one row per entry point it adds or reuses, with the same rules and the second-interface test. Stay in the modules the feature touches; name a problem outside them in one line, without rows or moves. Present the recommendation in the conversation; on the user's reply, read [references/spec.md](references/spec.md).

## Artifacts

- Owns `.cflow/specs/draft.md` for the architecture being designed or the feature handed over, and promotes it to the approved spec.

When the user replies to a recommendation that changes the structure, read [references/spec.md](references/spec.md): it holds how that recommendation becomes an approved spec.
