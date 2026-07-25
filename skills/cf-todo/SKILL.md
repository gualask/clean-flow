---
name: cf-todo
description: Create or update a lightweight todo file tracking next steps and open questions from an analysis or working session. Use when the request asks to write, add to, update, or check off a todo.md, or to record remaining work and open questions in a tracking file. Do not use to read an existing todo file or to answer what it contains. Do not use for Cflow refactor progress or resume state (cf-start owns them), decision framing (cf-mr-wolf), or project documentation (cf-docs).
---
Operate as the keeper of a lightweight tracking file: capture next steps and open questions the current conversation or analysis already produced, and keep the file current.

Enter only when the current request changes the file. Reading the file, reporting what it still contains, or answering a question from it needs no skill.

Record only what the conversation or analysis produced; do not invent tasks, impacts, directions, or done criteria. When a decided action lacks an observable done criterion, ask for it or record the item as an open question instead.

## Artifacts

- Owns the todo file: a user-owned, committed repository file, `todo.md` at the repository root by default; a path stated in the request or an existing tracking file overrides the default.
- If a todo file already exists, extend it; do not create a second tracking file for the same work.
- Do not read, create, or update `.cflow/*` artifacts: refactor progress and resume state belong to `cf-start`, design drafts to `cf-brainstorm`.

## File Shape

Two sections, in the repository's dominant documentation language (conversation language if none):

- Next steps — decided actions as GFM checkboxes: `- [ ] <action> — done when: <observable criterion> (<ref>)`. Order is priority; no explicit priority field.
- Open questions — items not yet decided: one-line problem, then indented lines for impact, possible direction (stated as a hypothesis), and what is needed to decide.

A header line naming the topic and the source analysis is enough; no other sections.

## Lifecycle

No done/closed sections, no completion dates, no changelog notes.

- On task completion, check the item (`- [x]`) and keep it in place.
- Before adding new tasks, inspect the existing task list.
- If at least one existing task is unchecked, keep every existing task, including checked tasks, then add the new tasks.
- If every existing task is checked, remove those completed tasks only as part of the same update that adds new tasks.
- If the update adds no new task, never remove checked tasks, even when every task is complete.
- When an open question is decided, remove it and add the resulting actions to next steps; treat those actions as new tasks for the cleanup rule above. Preserve other open questions. If the rationale has durable consequences, record it in an ADR or the doc that owns the concept (route doc work to `cf-docs`), never in the todo.

Route deciding how to close an open question to `cf-mr-wolf`; this pass only records the outcome.

## Output Format

Return only:

- **Scope**: target file and operation (create, update, add, check off).
- **Changes**: items added, checked, promoted from an open question, or removed during completed-task rollover.
- **Result**: open items remaining and the next action; when every task is complete and no new task was added, say that the completed tasks were retained.
