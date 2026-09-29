# cf-brainstorm Flow

## Purpose

Maintainer summary for the explicit-only design flow that turns one feature or product idea into an approved spec without starting implementation.

## Runtime Inputs

- Public skill: `skills/cf-brainstorm/SKILL.md`
- Shared reference: `design-spec-lifecycle.md` (draft → spec cycle, draft format, handoff)
- Working artifact: `.cflow/specs/draft.md`
- Approved artifact: `.cflow/specs/<YYYY-MM-DD>-<topic>.md`

## High-Level Flow

1. Resume or replace an existing draft explicitly, checking `.cflow/specs` with `ls` because the directory is git-ignored and search tools skip it.
2. Inspect current project context and decompose independent ideas.
3. Record only decision-relevant questions and answers in the draft; a question is settled only by the user's answer, and an assumption used to proceed stays open as the working default.
4. Recommend an approach, adding alternatives only for real trade-offs.
5. Present a design proportionate to the idea (behavior, components, data flow, errors, testing) and complete it in the draft.
6. When the design adds or changes state, coordination, a contract, or an entry point in existing code, hand the draft to `cf-architecture` and end the turn naming it for the user to invoke: brainstorm does not decide which module owns them. Measured: architecture opened in brainstorm's own turn kept the state in the adapter (1 adapter, 1 borderline); opened fresh on the same handed-over draft it chose the capability 2/2. Measured (2026-09-29, LOC feature on Termetrix): brainstorm with the architecture principles loaded put the shared per-root result in the VS Code adapter; cf-architecture put it in the capability 2/2, and the same prompt without skills left it in the adapter.
7. Otherwise self-review and ask the user to review the draft. After explicit approval, rename it to the approved spec and end the turn with the spec path and the next skill for the user to invoke, without opening it, planning, or implementing.
