# cf-docs Flow

## Purpose

Document the runtime flow for `cf-docs`, the public entrypoint for changing documentation — writing, updating, trimming, or restructuring it — so it stays accurate against the code, lean, and free of conceptual duplication.

The routing boundary is one rule: use the skill when the request requires a write operation on a Markdown file; do not use it otherwise.

## Runtime Inputs

- Public skill: `skills/cf-docs/SKILL.md`
- Runtime references: `skills/cf-docs/references/review.md`, `generate.md`
- Target artifacts: none

## High-Level Flow

1. Use `standard` implementation-detail mode by default; use `conservative` only when requested, and never widen the authorized edit scope to move detail into source comments.
2. Start from the docs the request targets, or the thing to be documented.
3. Choose the review or generate flow from the current request.
4. Ask one focused question if the target docs, flow, or outcome is ambiguous.
5. In review, run the accuracy, redundancy, leanness, and structure passes; report findings and edit only when fixes are requested.
6. In generate, ground content in the code, choose one doc purpose, place each concept once, and keep the text lean.
7. Verify concrete claims against the code and validate links and anchors before finishing.
8. Report scope, selected mode, findings or plan, changes with single-source-of-truth decisions, checks, and next action.
