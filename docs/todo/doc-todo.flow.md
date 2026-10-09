# cf-todo Flow

## Purpose

Document the runtime flow for `cf-todo`, the public entrypoint for creating and maintaining a lightweight, user-owned todo file that tracks next steps and open questions produced by an analysis or working session.

## Runtime Inputs

- Public skill: `skills/cf-todo/SKILL.md`
- Runtime references: none
- Target artifacts: the todo file (`todo.md` at the repository root by default; a path in the request or an existing todo file overrides it)

The skill triggers only on requests that change the file. Reading it, reporting what it still contains, or answering a question from it stays outside the pack.

## High-Level Flow

1. Locate the target todo file; extend an existing one in its own shape instead of creating a second todo file for the same work. The two-section shape applies to a new file.
2. Write in the language of the repository's existing docs, even when the request uses another language.
3. Record only what the session produced: decided actions as tasks with an observable done criterion, undecided items as open questions with what is needed to decide, plus impact and a hypothesized direction only when the session stated them. When a task has no observable done criterion, ask for it and do not write that task.
4. On task completion, check the task and keep it in place.
5. When adding new tasks while at least one existing task is unchecked, preserve every existing task, including checked tasks.
6. When adding new tasks and every existing task is checked, remove those checked tasks as part of the same update (checked-task rollover); never remove them when no new task is being added.
7. When an open question is decided, remove it, count the tasks it produces as new tasks for the rollover, and preserve other open questions. A durable rationale never goes in the todo file; the report names the ADR or owning doc for it, routed to `cf-docs`. Deciding how to close a question routes to `cf-mr-wolf`.
8. Report scope, changes, remaining unchecked tasks and open questions, and the next action; when every task is checked and no new task was added, report that the checked tasks were retained.
