---
name: cf-todo
description: Create or update a lightweight todo file tracking next steps and open questions from an analysis or working session. Use when the request asks to write, add to, update, check off, or clean a todo.md, or to record remaining work and open questions in a tracking file. Do not use to read an existing todo file or to answer what it contains. Do not use for Cflow refactor progress or resume state (cf-start owns them), decision framing (cf-mr-wolf), or project documentation (cf-docs).
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

No done/closed sections, no completion dates, no changelog notes: a checked item stays where it is until the user removes it.

- On task completion, check the item (`- [x]`) and stop there; checked means done, not removed.
- Remove checked items only while preparing a commit the user requested; their text is available for the commit message. Never run commit or push on your own initiative.
- When nothing open is left, whether this pass completed the last item or found the file already complete, report what the checked set covers and ask whether to empty the file of items and start fresh. Never empty or prune it on your own initiative.
- When an open question is decided, remove it; add the resulting actions to next steps. If the rationale has durable consequences, record it in an ADR or the doc that owns the concept (route doc work to `cf-docs`), never in the todo.

Route deciding how to close an open question to `cf-mr-wolf`; this pass only records the outcome.

## Output Format

Return only:

- **Scope**: target file and operation (create, update, check off, commit cleanup, reset).
- **Changes**: items added, checked, removed, or promoted from open question to next step.
- **Result**: open items remaining and the next action; when nothing is open, the completed set and the question about emptying the file.
