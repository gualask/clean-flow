---
name: cf-cognitive
description: Find or refactor local source-file cognitive complexity hotspots while preserving behavior. Use with or without explicit file targets.
---
Use this skill for local file-level cognitive complexity refactors.

Use this for up to three source files per session, processed one file at a time.
Do not bootstrap or require `.cflow/` artifacts.
For file-level split review or extraction from one source file, route to `cf-split` instead.
For cross-file cohesion, placement, navigation cost, or related files that may need a local feature slice, route to `cf-cohesion` instead.
For repository structure, module boundaries, ownership moves, or broad multi-file refactors, route to `cf-start` instead.

Reduce real cognitive complexity in each target file while preserving behavior.
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
Read references/execution.md.

If the target, flow, or requested outcome is ambiguous, ask one focused question.
Do not infer execution from words like "review", "check", "is this complex", or "should we clean this up".

## Shared Triggers

Refactor only when the target has clear local cognitive pressure:

- functions or methods that are hard to scan, roughly more than 20-30 logical lines
- nesting deeper than function -> block -> block
- nested try/catch blocks that make control flow hard to follow; simplify when possible unless language or framework constraints force them
- try/catch blocks or loop bodies long enough to hide their main purpose
- framework, runtime, or infrastructure wiring blocks that mix setup/teardown with nested callbacks containing real behavior, especially event subscriptions, observers, lifecycle hooks, timers, middleware, transactions, or scheduler callbacks
- branching that makes the main path hard to see
- complex boolean expressions, regex construction, parsing, or small algorithms that are hard to read inline
- repeated non-trivial local logic

Nesting deeper than function -> block -> block and functions past the 20-30 logical-line bell are hard triggers as defined in ../_shared/references/navigation-cost.md: default to cleanup, and keep code as-is only by naming one of its recognized exemptions.
Prefer remedies in this order: guard clauses or early returns to flatten the path first, then extraction into named same-file helpers when flattening is not enough.
When a target file is past roughly 300 LOC, also state an explicit file-size verdict: `route` to `cf-split`, or name the exemption that justifies its current size.

Before classifying nested code as `optional` or `keep as-is`, trace the deepest main-path stack. A small method is still a cleanup candidate when the reader must pass through guard/branch, runner or callback, try/catch, and result branching before seeing the intent. Do not downrank this only because behavior is correct, the code is local, or no file split is needed. Do not downrank verbally either: report a finding past a hard trigger as a real hotspot, never as "light", "minor", or "not yet serious".

## Output Format

Return only:

- **Scope**: flow and target files, or discovery area.
- **Assessment**: candidates, target decision, or hotspots addressed.
- **Changes**: edits made, or `none` for discovery/evaluation.
- **Checks**: commands run and pass/fail result, or why no check ran.
- **Result**: behavior preservation, remaining risk, and `cf-split` or `cf-cohesion` next step when relevant.
