---
name: cf-step-local-simplify
description: Simplify naming, control flow, and local helpers after a structural refactor. Use after boundaries are already better and the remaining problem is local cognitive load.
---

Use this after `cf-step-boundary-apply`, not before.

Do not reopen high-level architecture in this skill.

## Preflight

- Read `architecture.md`.
- Read `refactor-brief.md` first if it exists.
- If no brief exists, only continue when the prompt already gives an explicit, local touched area.
- If no brief exists and the touched area is not explicit and local, stop before edits and route to `cf-start` or `cf-phase-discovery`.
- Verify the repository state before acting.
- Do not broaden scope in this step.

## Goal

Make the touched code easier to read and follow without broadening scope.

Focus on:

- naming that reveals intent
- clearer local helper boundaries
- smaller narrative steps in the main flow
- reduced incidental branching and nesting
- tighter side-effect scope
- fewer vague names and generic utility patterns

## Rules

- Preserve behavior.
- Improve local readability, not architecture labels.
- Prefer small local helpers over new shared modules.
- Do not split files just to make them shorter.
- If a function name needs multiple verbs or responsibilities, consider splitting it.
- Avoid names like `manager`, `processor`, `util`, `helper`, or `common` unless the role is truly narrow and explicit.

## Output format

Provide exactly these sections:

1. **Main readability issues**
2. **Simplifications applied**
3. **What was intentionally left unchanged**
4. **Remaining readability risks**
5. **Recommended next action**

## Artifact updates

If a brief exists, update before stopping:

- `Verification` if any checks were run
- `Review notes` if simplification surfaced concerns
- `Execution state`
- `Handoff notes`

If work unit status changed, update:

- `Work units`
