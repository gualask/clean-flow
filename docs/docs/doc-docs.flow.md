# cf-docs Flow

## Purpose

Document the runtime flow for `cf-docs`, the public entrypoint for writing documentation — authoring, updating, trimming, or restructuring it — and for auditing existing docs against the code, so they stay accurate, lean, and free of duplicated concepts.

The routing boundary is one rule: use the skill when the request writes a Markdown file outside `.cflow/`, or asks to audit existing docs against the code; do not use it otherwise. Files under `.cflow/` belong to the Cflow skill that wrote them.

## Runtime Inputs

- Public skill: `skills/cf-docs/SKILL.md`
- Runtime references: `skills/cf-docs/references/review.md`, `generate.md`
- Target artifacts: none

## High-Level Flow

1. Start from the docs the request targets, or the thing to be documented.
2. Choose the review or generate flow from the current request.
3. Ask one focused question if the target docs, flow, or outcome is ambiguous.
4. Apply the core rules in both flows: accuracy, duplication, leanness, implementation detail, structure, scope.
5. In review, run the accuracy, duplication, leanness, and structure passes; report findings and edit only when fixes or trimming are requested. Trimming removes restated content, history, and decoration, never a fact no other doc or source comment carries.
6. Leave implementation detail in the doc and report it as a candidate move to a source comment unless the request authorizes source edits.
7. In generate, ground content in the code, choose one doc purpose, write in the language of the repository's existing docs, place each concept once, and say where the new doc should be linked from.
8. Verify concrete claims against the code and validate links and anchors before finishing.
9. Report scope and flow, findings (including duplication across and within docs), changes with the owner doc for each duplicated concept and where the facts of each removed passage now live, checks, and next action.
