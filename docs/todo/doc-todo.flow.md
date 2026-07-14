# cf-todo Flow

## Purpose

Document the runtime flow for `cf-todo`, the public entrypoint for creating and maintaining a lightweight, user-owned todo file that tracks next steps and open questions produced by an analysis or working session.

## Runtime Inputs

- Public skill: `skills/cf-todo/SKILL.md`
- Runtime references: none
- Target artifacts: the todo file (`todo.md` at the repository root by default; request or existing tracking file overrides)

## High-Level Flow

1. Locate the target todo file; extend an existing one instead of creating a second tracking file for the same work.
2. Record only what the conversation or analysis produced: decided actions as checkboxes with an observable done criterion, undecided items as open questions with impact, hypothesized direction, and what is needed to decide.
3. On task completion, check the item; never delete it at completion time.
4. Remove checked items only while preparing a user-requested commit, offering their text for the commit message; never run commit or push autonomously.
5. When an update finds stale checked items from earlier sessions, propose removing them; never prune on a read-only request.
6. When an open question is decided, delete it, promote resulting actions to next steps, and route durable rationale to an ADR or owning doc via `cf-docs`.
7. Delete the file when the last item is removed; git remains the only history.
8. Report scope, changes, remaining open items, and next action.
