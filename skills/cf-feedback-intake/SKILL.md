---
name: cf-feedback-intake
description: Intake review feedback safely. Use when a human or another agent gave refactor feedback and you want to verify it before acting.
---

Do not implement feedback blindly in this skill.

## Goal

Turn feedback into a verified next action instead of a reflex edit.

## Preflight

- Read `.cflow/architecture.md`.
- Read `.cflow/refactor-brief.md` if it exists.
- Re-check the touched area and repository state.

## Rules

- First restate the feedback in repository terms.
- Then verify whether the code and artifacts support it.
- Separate:
  - clearly valid feedback
  - valid but lower-priority cleanup feedback
  - plausible but unverified feedback
  - ambiguous feedback
  - style-only feedback that does not justify churn
  - feedback that conflicts with repository evidence or agreed constraints
- If one clarification is truly needed, ask one focused question only.
- Only after that recommend whether to:
  - accept it
  - narrow it
  - reject it
  - route back to another Cflow skill

## Output format

Provide exactly these sections:

1. **Feedback restatement**
2. **Repository evidence**
3. **Assessment**
4. **Impact on current path or work units**
5. **Recommended next action**

## Artifact updates

If a brief exists, update:

- `Review notes`
- `Execution state`
- `Handoff notes`

If the feedback changes the plan, also update:

- `Work units`
- `Alignment notes`
- `Unknowns to re-check`
