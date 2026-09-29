# cf-architecture Flow

## Purpose

Assess and propose repository or subsystem architecture, including exploration without a known problem. Worth-doing or impact judgments about a named change belong to `cf-scenario`.

## Runtime Contract

[SKILL.md](../../skills/cf-architecture/SKILL.md) holds the analysis procedure and, in its `## Principles` section, the ownership and contract rules (152 tokens; inline because a read reference did not change later turns: under user pushback both placements conceded 2/2, and the reference was re-read without effect).

Derive the target tree from repository evidence, not directory styles. With no stated goal, assume behavior preservation, modifiability and testability of the present system; do not ask for a style or invent future needs.

Ownership follows the principles: capability for state and policy any invoking interface needs, adapter for what one environment causes; contracts with the capability whose meaning they carry. Owner and evidence for every stateful responsibility and coordinator, one row per inbound entry-point module stating what it decides beyond translating inputs and outputs, and one row per shared or common module whose meaning belongs to one capability (not merely its only consumer). No tree while interface-neutral application behavior sits in an adapter or such a module stays shared.

One target tree; trace a workflow through current and target and ask whether a second interface would reuse or rebuild the capability's behavior. Recommend the smallest change that fixes an evidenced ownership or dependency problem; lack of a confirmed future requirement does not justify the current tree.

The first answer is a recommendation in the conversation and creates no files; a recommendation to keep the structure ends there. When the user replies to a recommendation that changes the structure, the skill reads its private [spec reference](../../skills/cf-architecture/references/spec.md), which runs the shared draft → spec cycle ([design-spec-lifecycle.md](../../skills/_shared/references/design-spec-lifecycle.md)) with that reply as the first settled decision. The spec adds ownership rows, target tree, traced workflow, a `Moves` table (what moves, from → to, the decision it carries with file:line, the evidence its current owner is wrong; no evidence, no move; only moves from the approved recommendation, while a change found while writing becomes an open question) and the migration order. An approved spec ends the skill: promotion ends the turn with the spec path and `cf-execute` named for the user to invoke, without opening it or starting to plan. The skill does not implement changes.

Feature handoff: when `cf-brainstorm` hands over its draft, product decisions are settled. The skill decides ownership only for the state, coordinators, contracts, and entry points the feature adds or changes, within the modules it touches; a problem outside them is one line, without rows or moves. The spec keeps brainstorm's sections and adds ownership rows, the touched target tree, and `Moves` only for existing code the feature must relocate. Measured: without the scope limit, one of two runs inventoried every `shared` module.
