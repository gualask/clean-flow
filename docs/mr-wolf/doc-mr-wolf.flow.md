# cf-mr-wolf Flow

## Purpose

Maintainer summary for `cf-mr-wolf`. Runtime behavior belongs to `skills/cf-mr-wolf/SKILL.md` and its linked references; keep this file descriptive, not authoritative.

## Runtime Inputs

- Public skill: `skills/cf-mr-wolf/SKILL.md`
- Runtime references: `skills/cf-mr-wolf/references/framing.md`, `decomposition.md`, `evidence.md`, `dynamic-agents.md`, `derisk.md`, `derisk-agent-brief.md`, `outcomes.md`, `planning.md`, `evaluation.md`
- Shared source vendored into runtime paths: `skills/_shared/scripts/repo-tree.mjs`
- De-risk agent prompt template: `skills/cf-mr-wolf/references/derisk-agent-brief.md`, dispatched to any available read-only subagent
- Current conversation and request
- Focused repository context selected from the clarified request and bounded perimeter
- Optional notes artifact: `.cflow/mr-wolf-notes.md`, created from `skills/cf-mr-wolf/assets/mr-wolf-notes.template.md` when evidence or decisions need durable handoff context

## Maintainer Notes

- Runtime routing for ambiguity, indecision, alternatives, planning, and evaluation stays in `skills/cf-mr-wolf/SKILL.md`.
- Framing, evidence, de-risking, outcome, planning, and evaluation rules stay in linked references.
- Planning flow owns generic decision-complete plans only; repository-level refactor planning routes to `cf-start`, and code-structure value judgments route to `cf-simplify`.
- A request naming a change set to review routes to `cf-review` and is exempt from the unconfirmed-lens hard stop: a rubric-driven skill answers "which lens" with "all of them", so the question has no content. The exemption is keyed to the named change set, not to the request sounding like a review.
- Dynamic delegation receives the active frame, bounded context, exclusions, and an evidence question or candidate findings. Retained notes are included only when they exist and matter to the pass.
- The de-risk agent is terminal: it does not activate skills, route prerequisites, or delegate again. It gathers counter-evidence and never confirms a candidate; classification stays with the controller, which holds the full problem frame. A pass where the agent returns nothing leaves its candidates unconfirmed.
- `.cflow/mr-wolf-notes.md` is optional handoff memory.
- `.cflow/refactor-brief.md` remains owned by `cf-start`.
- Keep this doc aligned with runtime files, but do not rely on it at runtime.
