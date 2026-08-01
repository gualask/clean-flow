---
name: cf-cognitive
description: Find or refactor local source-file cognitive complexity hotspots while preserving behavior. Use when a function or file is hard to read or reason about — overloaded functions, deep nesting, tangled branching, local readability pressure — with or without explicit file targets. Do not use to split a file into new files (cf-split) or for repository-wide refactors (cf-start).
---
Use this skill for local file-level cognitive complexity refactors.

Use this for up to three source files per session, processed one file at a time.
Do not bootstrap or require `.cflow/` artifacts.
For file-level split review or extraction from one source file, route to `cf-split` instead.
For cross-file cohesion, placement, navigation cost, or related files that may need a local feature slice, route to `cf-cohesion` instead.
For repository structure, module boundaries, ownership moves, or broad multi-file refactors, route to `cf-start` instead.

Reduce real cognitive complexity in each target file while preserving behavior.
Before applying any flow, read references/navigation-cost.md; it owns the hard-trigger values, exemptions, and remedy rules.
Use numeric thresholds only when native tooling can measure them; otherwise report qualitatively.

## Flow Selection

Choose exactly one flow:
Discovery and targeted evaluation flows do not edit repository files.

### Discovery Flow

Use when no explicit file target was provided.
Read references/discovery.md.

### Targeted Evaluation Flow

Use when one or more explicit file targets were provided and the current request asks to review, assess, evaluate, or decide whether cleanup is worthwhile.
Read references/targeted-evaluation.md.

### Execution Flow

Use when the current request explicitly asks to refactor, reduce, clean up, fix cognitive complexity, or proceed on explicit target files or a confirmed discovery candidate.
Read references/execution.md and references/local-refactor-rules.md.

If the target, flow, or requested outcome is ambiguous, ask one focused question.
Do not infer execution from words like "review", "check", "is this complex", or "should we clean this up".

## Output Format

Return only:

- **Scope**: flow and target files, or discovery area.
- **Assessment**: candidates, target decision, or hotspots addressed.
- **Changes**: edits made, or `none` for discovery/evaluation.
- **Checks**: commands run and pass/fail result, or why no check ran.
- **Deferred**: only after execution edits; findings required by the report/action rule in references/navigation-cost.md. Omit this section when no cleanup ran and in discovery or targeted evaluation.
- **Result**: behavior preservation, remaining risk, and `cf-split` or `cf-cohesion` next step when relevant.
