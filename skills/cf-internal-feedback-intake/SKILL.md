---
name: cf-internal-feedback-intake
description: Intake review feedback safely. Use when refactor feedback already exists and you want to verify it before acting.
---
Do not implement feedback blindly in this skill.

## Goal

Turn feedback into a verified next action instead of a reflex edit.

## Preflight

- If `.cflow/architecture.md` is missing, stop and route to `cf-architecture-map` first.
- Read `.cflow/architecture.md`.
- Read `.cflow/refactor-brief.md` if it exists.
- If the feedback target or current path is too unclear to verify, stop and route to `cf-start` first.
- Re-check the touched area and repository state.
- Treat the repository as the source of truth.

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
- Place the feedback in exactly one primary assessment bucket before recommending the next action.
- If one clarification is truly needed, ask one focused question only.
- Only after that recommend whether to:
  - accept it
  - narrow it
  - reject it
  - route back to another Cflow skill
- If you recommend accepting or narrowing the feedback, name the exact next Cflow skill instead of suggesting generic follow-up work.

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
