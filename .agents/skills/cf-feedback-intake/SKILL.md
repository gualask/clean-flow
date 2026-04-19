---
name: cf-feedback-intake
description: Evaluate review feedback against the codebase and current refactor direction before changing code. Use when human or automated review feedback arrives after implementation or post-review.
---

Do not implement in this skill unless the user explicitly asks.

## Preflight

- Read `architecture.md`.
- Read `refactor-brief.md` if it exists.
- Re-check the relevant repository state.

## Goal

Understand review feedback before acting on it.

## Rules

- Do not accept feedback blindly.
- Distinguish between:
  - clearly valid structural feedback
  - valid but lower-priority cleanup feedback
  - ambiguous feedback
  - feedback that conflicts with the agreed path
  - style-only feedback that does not justify churn
- If one clarification is truly needed, ask one focused question only.

## Output format

Provide exactly these sections:

1. **Feedback summary**
2. **Verified findings**
3. **Ambiguous or disputed points**
4. **Impact on current path or work units**
5. **Recommended next action**

## Artifact updates

If a brief exists, update before stopping:

- `Review notes`
- `Execution state`
- `Handoff notes`

If the feedback changes the plan, also update:

- `Work units`
- `Alignment notes`
- `Unknowns to re-check`
