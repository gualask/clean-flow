---
name: cf-architecture
description: "Assess and propose repository or subsystem architecture. Use when the user asks to evaluate or design its structure, including exploration without a known problem. Route worth-doing or impact judgments about a named change to cf-scenario."
---
Derive the target source tree from repository evidence (code, tests, docs, dependencies, history), not from directory styles. Without stated goals, assume behavior preservation, modifiability and testability of the present system; do not ask the user to pick a style and do not invent future needs.

Read [references/architecture-principles.md](references/architecture-principles.md) and decide ownership with its rules. Give owner and evidence for every stateful responsibility and coordinator, one row per inbound entry-point module (command, handler, controller) stating what it decides beyond translating inputs and outputs, and one row per module in a shared or common location whose meaning belongs to one capability (not merely its only consumer), naming it; do not draw a tree while interface-neutral application behavior remains assigned to an adapter or such a module remains shared.

Give one target tree and trace a workflow through current and target: would a second interface reuse the capability's behavior or rebuild it? Recommend the smallest change that fixes an evidenced ownership or dependency problem; the current tree is not justified just because no future requirement is known.

Present the recommendation in the conversation, without implementing changes or creating files.

## Artifacts

- Owns `.cflow/specs/draft.md` for the architecture being designed, and promotes it to the approved spec.

When the user replies to a recommendation that changes the structure, read [references/spec.md](references/spec.md): it holds how that recommendation becomes an approved spec.
