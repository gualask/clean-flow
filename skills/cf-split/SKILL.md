---
name: cf-split
description: Evaluate or execute a behavior-preserving file-level split from one source file into nearby owned files. Use when the current request asks whether a file should be split or asks to perform a scoped extraction into files. Route regrouping of multiple related files to cf-cohesion and repository-level restructuring to cf-start.
---
Use this skill for local file-level split review and execution.

Use this when the current request asks whether a source file should be split into files, or asks to execute a specific local file-level extraction.
Do not use this for cognitive cleanup inside one file; use `cf-cognitive` for that.
Do not use this for regrouping already-split related files; use `cf-cohesion` for that.
For repository structure, module boundaries, cross-feature ownership moves, or broad multi-file refactors, route to `cf-start`.

Do not bootstrap or require `.cflow/` artifacts.

## Preflight

- Identify one target source file or one explicitly touched local file area.
- If the target, flow, or requested outcome is ambiguous, ask one focused question.
- Treat repository state as the source of truth.

## Flow Selection

Choose exactly one flow:
Evaluation flow does not edit repository files.

### Evaluation Flow

Use when the current request asks whether a split is worthwhile.
Read references/evaluation.md.

### Execution Flow

Use when the current request explicitly asks to perform the split.
Read references/execution.md.

Do not infer execution from words like "review", "check", "is this worth splitting", or "should this be extracted".

## Output Format

Return only:

- **Scope**: target file and selected flow.
- **Decision**: candidates and recommendation, or split performed.
- **Checks**: commands run and pass/fail result, or why no check ran.
- **Result**: behavior preservation, final placement decision, remaining risk, and next action.
