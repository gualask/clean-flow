---
name: cf-step-boundary-apply
description: Apply one bounded structural refactor step while preserving behavior. Use only after the current work unit is clear and a credible safety net exists.
---

Use this to apply a bounded structural cleanup or hard-path migration unit.

## Preflight

- Read `architecture.md`.
- Read `refactor-brief.md` first if it exists.
- If no brief exists, continue only when the prompt already gives an explicit, local, behavior-preserving scope.
- If no brief exists and the scope is not explicit and local, stop before implementation and route to `cf-start` or `cf-phase-discovery`.
- Re-check the touched area before moving code.
- Verify the repository state before trusting the brief or the prompt.
- Treat the repository as the source of truth.

## Goal

Apply the current bounded work unit without widening scope.

## Core rules

- Preserve behavior unless behavior change is explicitly requested.
- Reduce god-file pressure by separating responsibilities, not by mechanically splitting files.
- Do not invent fake layers or abstractions with no concrete job.
- Do not leave external-system access scattered through orchestration code.
- Extract pure logic only when it is genuinely autonomous.
- Prefer local, clear helpers over generic utilities.
- Add a new file, module, or type only if it reduces real complexity.
- Avoid dead code, workaround logic, and speculative abstractions.
- Preserve dataflow and avoid unnecessary allocations, clones, or object reshaping.

## Structural step discipline

- Stay within one bounded work unit unless the user explicitly broadens scope.
- Record meaningful drift between the brief and the codebase.
- Prefer one meaningful structural move at a time when practical.
- If the safety lock breaks after a move, stop and investigate before stacking more changes on top.
- If you discover a bug while refactoring, do not silently fold a behavior fix into the same structural change unless the user explicitly asked for it.

## Cognitive simplicity rules

- Make it obvious where things live and what they do.
- Prefer one clear public orchestrator per workflow.
- Keep helpers single-purpose and side effects tight.
- Flatten control flow when that improves readability.
- Hide mechanical detail so the main flow reads like a narrative.
- Keep resource lifetimes explicit.

## Before finishing

Run the smallest relevant verification you can from this list:

- targeted tests
- lint
- typecheck
- build
- narrow smoke check

If you moved, renamed, split, or re-exported symbols, also run an explicit **reference audit** for the touched names and paths.
Search categories separately when relevant:

- direct calls and type references
- string literals containing old names or paths
- dynamic imports and `require()` paths
- re-exports and barrel files
- tests, fixtures, mocks, and helpers

If you cannot run verification, say so explicitly and record the gap.

## Artifact updates

If a brief exists or you create one, update before stopping:

- `Work units` status labels
- `Safety net` if assumptions changed
- `Verification`
- `Execution state`
- `Handoff notes`
- `Unknowns to re-check`

If the actual implementation changed understanding, also update:

- `Current pressure`
- `Target direction`
- `Alignment notes`

If move, rename, or split work happened, record the reference audit result in:

- `Verification`
- `Handoff notes`
