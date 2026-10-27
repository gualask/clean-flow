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
3b. Clarification measured (2026-10-21, CSV export idea on a VS Code extension, gpt-6.1-sol high): one question per turn with 2–3 options and a recommended default, each answer appended to `Decisions`; on "proceed" with two questions open they stay open as working defaults and the draft expands to the full design (4 turns from the idea to the architecture recommendation). The same model without the pack decides everything in one turn and, on "proceed", implements (20 files). Two independent ideas in one request: one draft, the second idea recorded as deferred (1 run); without the pack both are designed together.
3c. Boundaries under explicit invocation: whether a named change is worth it goes to `cf-scenario`, a symptom with no named change to `cf-mr-wolf` (1 run each); the earlier text sent value judgments to `cf-mr-wolf`, which its own description excludes, and the model followed the descriptions.
3d. A shipped spec: the lifecycle offers `cf-docs` and deletes the spec only once the docs are updated or the offer is declined (1 run under brainstorm, 1 under architecture); the earlier "offer …, then delete" deleted first (1 run).
7. Otherwise self-review and ask the user to review the draft. After explicit approval, rename it to the approved spec and end the turn with the spec path, without planning or implementing.
