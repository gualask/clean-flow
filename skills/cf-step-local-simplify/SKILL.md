---
name: cf-step-local-simplify
description: Simplify naming, control flow, and helper shape inside the touched area without reopening architecture. Use after a bounded structural step when local readability can still improve.
---
Use this after `cf-step-boundary-apply` or `cf-step-consolidate-seam`, not before.

Do not reopen repository architecture in this skill.

## Preflight

- If `.cflow/architecture.md` is missing, stop and route to `cf-start` first.
- Read `.cflow/architecture.md`.
- Read `.cflow/refactor-brief.md` first if it exists.
- If no brief exists, only continue when the prompt already gives an explicit, local touched area.
- If no brief exists and the touched area is not explicit and local, stop before edits and route to `cf-start` or the correct `cf-phase-*` skill.
- Re-check the touched area and repository state.
- Verify the repository state before acting.
- Do not broaden scope in this step.

## Goal

Improve local readability without changing the chosen structural direction.

## Rules

- Preserve behavior.
- Keep the simplification local to the touched area.
- Improve local readability, not architecture labels.
- Prefer intention-revealing names.
- Flatten control flow when it improves readability.
- Keep helpers single-purpose.
- Prefer small local helpers over new shared modules.
- Do not create new files or abstractions unless they clearly reduce local complexity.
- Do not split files just to make them shorter.
- Avoid vague names like `manager`, `processor`, `util`, `helper`, or `common` unless the role is genuinely narrow and explicit.
- Stop if the simplification would reopen structural choices.

## Output format

Provide exactly these sections:

1. **Current state**
2. **Local simplifications applied**
3. **Checks run**
4. **Artifacts updated**
5. **What remains**
6. **Next action**

## Artifact updates

If a brief exists, update before stopping:

- `Verification` if any checks were run
- `Review notes`
- `Execution state`
- `Handoff notes`

If work unit status changed, update:

- `Work units`
