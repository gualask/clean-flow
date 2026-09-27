---
name: cf-brainstorm
description: "Turn a feature or product idea into an approved design spec before any implementation. Use only when the user explicitly asks to brainstorm, explore, or co-design an idea; never trigger it from implementation requests, bug fixes, refactor work, or other Cflow flows. Do not use for ambiguous requests, approach questions, or worth-building judgments."
---
Operate as a design partner: refine the idea through dialogue, converge on a design, and record it as a durable spec.

Do not write code, scaffold projects, or start implementation until the design has been presented and the user has approved it. No idea is too simple for this gate; a simple idea gets a short design, not a skipped one.

## Boundaries

- Explicit invocation only. If this skill was reached without the user asking to brainstorm, hand back to `cf-mr-wolf`.
- Value judgments about existing code or features belong to `cf-mr-wolf`; refactor planning belongs to `cf-start`.

## Structural Design

[references/architecture-principles.md](references/architecture-principles.md) holds the criteria for ownership, contracts, dependencies, and organization. Read it when the idea introduces or revises those decisions, including when later user feedback reopens them. Read [references/navigation-cost.md](references/navigation-cost.md) with it to compare reading and placement cost. Apply the criteria within the idea being designed.

## Artifacts

- Owns `.cflow/specs/draft.md` for the idea being designed, and promotes it to the approved spec.

[references/design-spec-lifecycle.md](references/design-spec-lifecycle.md) holds the draft → spec cycle: file paths, resume check, draft format, how to keep the draft as memory, review, and promotion. Read it before the resume check and follow it for the draft and the spec.

## Process

Run the phases in order. Do not skip ahead while material questions are open unless the user explicitly asks to proceed.

1. **Resume check**: run the lifecycle's resume check.
2. **Context**: explore current project state — files, docs, recent commits — before asking anything.
3. **Scope check**: if the idea spans multiple independent subsystems, say so immediately and help decompose it; brainstorm one sub-idea at a time, each with its own spec.
4. **Question plan**: create the draft; while context is fresh, write only the unresolved decisions needed for a credible design; do not add questions merely to cover a category.
5. **Clarify**: ask one decision-relevant question at a time, each building on prior answers. Append new questions only when answers expose a real decision, and move on when the design is sufficiently determined or the user asks to proceed. Prefer 2-4 options with one recommended default when the answer space is enumerable; go open-ended when depth requires it.
6. **Approaches**: lead with one recommended approach and why. Add alternatives only when the trade-off is genuinely close. Apply YAGNI ruthlessly.
7. **Design**: present and confirm sections in proportion to their complexity; collapse sections for a small design. Cover only the architecture, components, data flow, error handling, and testing that materially shape the idea. Prefer small units with one clear purpose and well-defined interfaces; in an existing codebase, reuse suitable patterns and justify structural changes that serve the idea. Existing patterns are evidence, not a reason to preserve a boundary the design needs to change.
8. **Spec**: expand the draft into the full design spec.
9. **Review and promotion**: run the lifecycle's self-review, user review, and promotion.

## Terminal State

An approved spec ends this skill. Do not start implementation in the same breath.

- If the design touches existing structure, ownership, or boundaries, recommend `cf-start` as the next step.
- Otherwise recommend `cf-mr-wolf` planning when the user wants an implementation plan, or stop at the spec.
