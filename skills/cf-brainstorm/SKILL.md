---
name: cf-brainstorm
description: "Turn a feature or product idea into an approved design spec before any implementation. Use only when the user explicitly asks to brainstorm, explore, or co-design an idea; never trigger it from implementation requests, bug fixes, refactor work, or other Cflow flows. Do not use for ambiguous requests, approach questions, or worth-building judgments."
---
Do not write code, scaffold projects, or start implementation until the design has been presented and the user has approved it.

## Boundaries

- Whether a named change is worth it belongs to `cf-scenario`; the goal behind a symptom or an undecided change belongs to `cf-mr-wolf`; restructuring existing code belongs to `cf-architecture`.

## Ownership Handoff

In an existing codebase, this skill does not decide which module owns new state, coordination, or contracts. When the design adds or changes state, coordination, a contract, or an entry point in existing code, hand the draft to `cf-architecture` after step 6 through the lifecycle's handoff, instead of step 7.

## Artifacts

- Owns `.cflow/specs/draft.md` for the idea being designed, and promotes it to the approved spec.

[references/design-spec-lifecycle.md](references/design-spec-lifecycle.md) holds the draft → spec cycle: file paths, resume check, draft format, when and how to write the draft, review, and promotion. Read it before the resume check and follow it for the draft and the spec.

## Process

Run the phases in order. Do not skip ahead while decision-relevant questions are open unless the user explicitly asks to proceed.

1. **Resume check**: run the lifecycle's resume check.
2. **Scope check**: if the idea spans multiple independent subsystems, say so immediately and help decompose it; brainstorm one sub-idea at a time, each with its own spec.
3. **Clarify**: ask one decision-relevant question at a time, each building on prior answers; do not add questions merely to cover a category, only when answers expose a real decision. After a side exploration, return to the oldest open question; move on when the design is sufficiently determined or the user asks to proceed.
4. **Approaches**: lead with one recommended approach and why.
5. **Design**: present and confirm sections in proportion to their complexity; collapse sections for a small design. Cover only the behavior, components, data flow, error handling, and testing that materially shape the idea.
6. **Spec**: write the draft, then expand it into the full design spec.
7. **Review and promotion**: unless handed off, run the lifecycle's self-review, user review, and promotion.

## Terminal State

An approved spec ends this skill.
