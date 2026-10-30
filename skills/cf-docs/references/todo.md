# Todo file

A todo file is a working list, not documentation of the code.

Record the session's decisions as given: do not check, reword, or check off a task against the code. A rationale never goes in the todo file.

- The todo file is `todo.md` at the repository root unless the request names another path or a todo file already exists. Extend an existing one in its own shape: add tasks and open questions where its structure puts them and keep its sections; never create a second todo file for the same work.
- When a task lacks an observable done criterion, ask for the criterion and do not write that task until it is given.
- A new todo file has a header line naming the topic and the session it comes from, then two sections:
  - Next steps — the decided actions, as GFM checkboxes: `- [ ] <action> — done when: <done criterion> (<ref>)`. Order is priority; no explicit priority field.
  - Open questions — items not yet decided: one-line problem, then indented lines for what is needed to decide.

## Lifecycle

No done/closed sections, no completion dates, no changelog notes.

- On task completion, check the task (`- [x]`) and keep it in place.
- If at least one existing task is unchecked, keep every existing task, including checked tasks, then add the new tasks.
- Checked-task rollover: if every existing task is checked, remove those checked tasks only as part of the same update that adds new tasks.
- When an open question is decided, remove it and add the tasks it produces to Next steps; they count as new tasks for the checked-task rollover. Preserve other open questions. When its rationale has durable consequences, name in **Changes** the doc that should record it.

Route deciding how to close an open question to `cf-mr-wolf`; this pass only records the outcome.

## Output Format

Return only:

- **Scope**: target file and operation (create, add, check off, update).
- **Changes**: tasks added, checked, promoted from an open question, or removed by checked-task rollover.
- **Result**: unchecked tasks and open questions remaining, and the next action; when every task is checked and no new task was added, say that the checked tasks were retained.
