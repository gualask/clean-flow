---
name: cf-internal-verify
description: Verify a refactor with factual evidence such as tests, lint, typecheck, build, or smoke checks. Use at the end of a bounded cleanup or migration unit.
---
Use this at the end of a completed bounded unit.

## Preflight

- Require current `.cflow/architecture.md`; if missing, stop and route to `cf-architecture-map`.
- Read architecture plus existing `.cflow/refactor-brief.md`.
- If the completed unit or touched area is not clear enough to verify, stop and route to `cf-start` first.
- Re-check the touched area and treat repository state as the source of truth.

## Goal

Collect factual evidence that the touched area still works.

## Rules

- Do not merely say the work is fine.
- Run the smallest relevant verification available.
- Prefer repository-native commands when possible.
- Use the safety net and planned checks when they exist.
- If the project has no formal checks, use the narrowest credible smoke test or inspection you can.
- If you cannot verify, say exactly what is missing.
- Never finish without either running at least one factual check or stating exactly why no factual check could be run.

## Verification sources

Use whichever are relevant and available:

- targeted tests
- package or module tests
- lint
- typecheck
- build
- smoke commands
- narrow runtime checks
- diff inspection for obviously dangerous drift
- reference audit when names or files moved

If a move, rename, split, merge, or re-export happened, run an explicit reference audit and search these categories separately when relevant rather than relying on one broad search:

- direct calls and type references
- string literals containing old names or paths
- dynamic imports and `require()` paths
- re-exports and barrel files
- tests, fixtures, mocks, and helpers

## Output format

Return sections: **Checks attempted**, **Checks passed**, **Checks not run**, **Confidence and remaining risk**, **Recommended next action**.

## Artifact updates

If a brief exists, update before stopping:

- `Verification`
- `Execution state`
- `Handoff notes`

If verification changes confidence in completion, also update:

- `Review notes`
