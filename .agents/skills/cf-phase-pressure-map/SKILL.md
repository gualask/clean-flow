---
name: cf-phase-pressure-map
description: Analyze the current bounded work unit in detail. Use in Phase B to map workflows, mixed responsibilities, role boundaries, and the safest local split direction before structural changes.
---

Use this when the current work unit or touched area feels dense enough that the safe split still needs local mapping.

Do analysis first. Do not implement in this skill.

## Preflight

- Read `architecture.md`.
- Read `refactor-brief.md` if it exists.
- If no brief exists, this skill may still run only when the prompt already gives an explicit local scope.
- Re-check the repository.
- Treat the repository as the source of truth.

## Goal

Map the **pressure** inside the current bounded work unit.

You are looking for:

- hidden workflows
- mixed responsibilities
- orchestration vs integration confusion
- scattered I/O
- pure logic trapped inside orchestration
- god-file pressure
- names that hide intent

## Analyze in this order

1. Identify the distinct workflows hiding in the touched area.
2. Identify which responsibilities are currently mixed.
3. Identify what coordinates the workflow.
4. Identify what talks to external systems.
5. Identify what is deterministic logic and could stand alone.
6. Identify what should stay local instead of being promoted to shared utilities.
7. Identify the safest split direction for this work unit.

## Classify the touched area

Classify relevant code into:

- entry points
- orchestration
- integrations
- pure logic

## Output format

Provide exactly these sections:

1. **Touched area summary**
2. **Workflow map**
3. **Responsibility mix**
4. **Role classification**
5. **Safe split direction**
6. **Refactor risks**
7. **Recommended next action**

## Artifact updates

If a brief exists or is created, update:

- `Current pressure`
- `Work units` if the current unit needs refinement
- `Execution state`
- `Handoff notes`
- `Unknowns to re-check`

If local analysis changes structural understanding, also update:

- `Target direction`
- `Alignment notes`
