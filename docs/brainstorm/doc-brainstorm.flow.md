# cf-brainstorm Flow

## Purpose

Maintainer summary for the explicit-only design flow that turns one feature or product idea into an approved spec without starting implementation.

## Runtime Inputs

- Public skill: `skills/cf-brainstorm/SKILL.md`
- Shared references: `design-spec-lifecycle.md` (draft → spec cycle and draft format), `architecture-principles.md` and `navigation-cost.md`, vendored with the latter's `repo-tree.mjs` helper
- Working artifact: `.cflow/specs/draft.md`
- Approved artifact: `.cflow/specs/<YYYY-MM-DD>-<topic>.md`

## High-Level Flow

1. Resume or replace an existing draft explicitly, checking `.cflow/specs` with `ls` because the directory is git-ignored and search tools skip it.
2. Inspect current project context and decompose independent ideas.
3. Record only decision-relevant questions and answers in the draft; a question is settled only by the user's answer, and an assumption used to proceed stays open as the working default.
4. Recommend an approach, adding alternatives only for real trade-offs.
5. When the idea introduces or revises structural decisions, including through later feedback, load the shared architecture and navigation-cost criteria. Reuse suitable existing patterns and justify changes needed by the idea. Keep one design assignment.
6. Present a design proportionate to the idea, complete the spec in the draft, and self-review it there.
7. Ask the user to review the draft. After explicit approval, rename it to the approved spec and end the turn with the spec path and the next skill for the user to invoke, without opening it, planning, or implementing.
