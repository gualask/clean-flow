# cf-todo Flow

## Purpose

Document the runtime flow for `cf-todo`, the public entrypoint for creating and maintaining a lightweight, user-owned todo file that tracks next steps and open questions produced by an analysis or working session.

## Runtime Inputs

- Public skill: `skills/cf-todo/SKILL.md`
- Runtime references: none
- Target artifacts: the todo file (`todo.md` at the repository root by default; request or existing tracking file overrides)

The skill triggers only on requests that change the file. Reading it, reporting what it still contains, or answering a question from it stays outside the pack.

## High-Level Flow

1. Locate the target todo file; extend an existing one instead of creating a second tracking file for the same work.
2. Record only what the conversation or analysis produced: decided actions as checkboxes with an observable done criterion, undecided items as open questions with impact, hypothesized direction, and what is needed to decide.
3. On task completion, check the item and keep it in place.
4. When adding new tasks while at least one existing task is unchecked, preserve every existing task, including checked tasks.
5. When adding new tasks and every existing task is checked, remove those completed tasks as part of the same update; never remove them when no new task is being added.
6. When an open question is decided, remove it, treat its resulting actions as new tasks for the cleanup rule, preserve other open questions, and route durable rationale to an ADR or owning doc via `cf-docs`.
7. Report scope, changes, remaining open items, and next action; when every task is complete and no new task was added, report that the completed tasks were retained.
