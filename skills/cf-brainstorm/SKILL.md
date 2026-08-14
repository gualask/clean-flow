---
name: cf-brainstorm
description: "Turn a feature or product idea into an approved design spec before any implementation. Use only when the user explicitly asks to brainstorm, explore, or co-design an idea; never trigger it from implementation requests, bug fixes, refactor work, or other Cflow flows. Do not use for ambiguous requests, approach questions, or worth-building judgments."
---
Operate as a design partner: refine the idea through dialogue, converge on a design, and record it as a durable spec.

Do not write code, scaffold projects, or start implementation until the design has been presented and the user has approved it. No idea is too simple for this gate; a simple idea gets a short design, not a skipped one.

## Boundaries

- Explicit invocation only. If this skill was reached without the user asking to brainstorm, hand back to `cf-mr-wolf`.
- Value judgments about existing code or features belong to `cf-mr-wolf`; refactor planning belongs to `cf-start`.

## Artifacts

- Owns `.cflow/specs/draft.md`: the single working draft — only one brainstorm can be in progress at a time. On user approval it is promoted by renaming it to `.cflow/specs/<YYYY-MM-DD>-<topic>.md`.
- Specs are ephemeral by design — a spec serves the implementation and is discarded once the implementation ships.
- Before creating the draft, create `.cflow/` if needed and write `.cflow/.gitignore` containing a single `*` line if missing; never edit the repository `.gitignore`.
- Do not read, create, or update other `.cflow/*` artifacts.

## Process

Run the phases in order. Do not skip ahead while material questions are open unless the user explicitly asks to proceed.

1. **Resume check**: if `.cflow/specs/draft.md` already exists, stop and ask whether to resume it or discard it and start fresh; never overwrite it silently. On resume, re-read the draft and continue from its oldest open question.
2. **Context**: explore current project state — files, docs, recent commits — before asking anything.
3. **Scope check**: if the idea spans multiple independent subsystems, say so immediately and help decompose it; brainstorm one sub-idea at a time, each with its own spec.
4. **Question plan**: while context is fresh, write only the unresolved decisions needed for a credible design; do not add questions merely to cover a category.
5. **Clarify**: ask one decision-relevant question at a time, each building on prior answers. Append new questions only when answers expose a real decision, and move on when the design is sufficiently determined or the user asks to proceed. Prefer 2-4 options with one recommended default when the answer space is enumerable; go open-ended when depth requires it.
6. **Approaches**: lead with one recommended approach and why. Add alternatives only when the trade-off is genuinely close. Apply YAGNI ruthlessly.
7. **Design**: present and confirm sections in proportion to their complexity; collapse sections for a small design. Cover only the architecture, components, data flow, error handling, and testing that materially shape the idea. Prefer small units with one clear purpose and well-defined interfaces; in an existing codebase, follow current patterns and include only targeted improvements that serve the idea.
8. **Spec**: expand the draft into the full design spec, then promote it by renaming (a user-stated location overrides the default path).
9. **Self-review**: re-read the spec once with fresh eyes and fix inline, without re-reviewing: placeholders or vague requirements, internal contradictions, scope too large for one implementation effort, requirements readable in two ways.
10. **User review**: ask the user to review the spec file; apply requested changes and re-run the self-review. Stop only after explicit approval.

## Working Draft

Long interrogations lose early context, so the draft is the memory, not the conversation.

- Create the draft from `assets/draft.template.md` when the interrogation starts.
- Seed `Questions` while context is fresh; mark each question settled when answered and append new ones as they emerge.
- After each settled answer, append one line to `Decisions`: the question and the chosen answer.
- When an answer sends the conversation into a side exploration, the pending question simply stays open in `Questions`; return to the oldest open question once the side exploration resolves.
- Before proposing approaches and again before promoting the spec, re-read `Decisions` in full and trust it over conversation memory; surface any conflict with a recent answer instead of silently overwriting the recorded decision.

## Terminal State

An approved spec ends this skill. Do not start implementation in the same breath.

- If the design touches existing structure, ownership, or boundaries, recommend `cf-start` as the next step.
- Otherwise recommend `cf-mr-wolf` planning when the user wants an implementation plan, or stop at the spec.
- When the user reports the implementation as shipped, offer to fold the spec's durable knowledge into project docs via `cf-docs`, then delete the spec file.

## Language Rules

Write the draft and the spec in the repository's dominant documentation language; if none exists, use the current conversation language.
