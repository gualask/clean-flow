---
name: cf-todo
description: Create or update a lightweight todo file tracking next steps and open questions from an analysis or working session. Use when the request asks to write, add to, update, or check off a todo.md, or to record remaining work and open questions in a todo file. Do not use to read an existing todo file or to answer what it contains. Do not use for Cflow execution plans or resume state (cf-execute owns them), or for project documentation (cf-docs).
---
Operate as the keeper of a lightweight todo file and keep it current.

Record only what the session produced. When a task lacks an observable done criterion, ask for the criterion and do not write that task until it is given.

## Artifacts

- Owns the todo file: a user-owned, committed repository file, `todo.md` at the repository root by default; a path stated in the request or an existing todo file overrides the default.
- If a todo file already exists, extend it in its own shape: add tasks and open questions where its structure puts them and keep its sections; do not create a second todo file for the same work.
- Do not read, create, or update `.cflow/*` artifacts; they belong to other Cflow skills.

## File Shape

Write in the language of the repository's existing docs, even when the request uses another language; use the request's language only when the repository has no docs.

A new todo file has two sections:

- Next steps — tasks, the decided actions, as GFM checkboxes: `- [ ] <action> — done when: <done criterion> (<ref>)`. Order is priority; no explicit priority field.
- Open questions — items not yet decided: one-line problem, then indented lines for what is needed to decide and, only when the session stated them, impact and possible direction (stated as a hypothesis).

A header line naming the topic and the session it comes from is enough; no other sections.

## Lifecycle

No done/closed sections, no completion dates, no changelog notes.

- On task completion, check the task (`- [x]`) and keep it in place.
- Before adding new tasks, inspect the existing task list.
- If at least one existing task is unchecked, keep every existing task, including checked tasks, then add the new tasks.
- Checked-task rollover: if every existing task is checked, remove those checked tasks only as part of the same update that adds new tasks.
- When an open question is decided, remove it and add the tasks it produces to Next steps; they count as new tasks for the checked-task rollover. Preserve other open questions. A rationale with durable consequences never goes in the todo file.

Route deciding how to close an open question to `cf-mr-wolf`; this pass only records the outcome.

## Output Format

Return only:

- **Scope**: target file and operation (create, add, check off, update).
- **Changes**: tasks added, checked, promoted from an open question, or removed by checked-task rollover; for a decided open question whose rationale has durable consequences, the ADR or owning doc that should record it, routed to `cf-docs`.
- **Result**: unchecked tasks and open questions remaining, and the next action; when every task is checked and no new task was added, say that the checked tasks were retained.
