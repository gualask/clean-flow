---
name: cf-verify
description: Verify a refactor with factual evidence such as tests, lint, typecheck, build, or smoke checks. Use at the end of a bounded cleanup or migration unit.
---

Use this at the end of a completed bounded unit.

## Preflight

- Read `architecture.md`.
- Read `refactor-brief.md` if it exists.
- Re-check the touched area and the repository state.

## Goal

Collect factual evidence that the touched area still works.

## Rules

- Do not merely say the work is fine.
- Run the smallest relevant verification available.
- Prefer repository-native commands when possible.
- Use the safety net and planned checks when they exist.
- If the project has no formal checks, use the narrowest credible smoke test or inspection you can.
- If you cannot verify, say exactly what is missing.

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

If move, rename, or split work happened, search the relevant reference categories separately rather than relying on one broad search.

## Output format

Provide exactly these sections:

1. **Checks attempted**
2. **Checks passed**
3. **Checks not run**
4. **Confidence and remaining risk**
5. **Recommended next action**

## Artifact updates

If a brief exists, update before stopping:

- `Verification`
- `Execution state`
- `Handoff notes`

If verification changes confidence in completion, also update:

- `Review notes`
