---
name: cf-cognitive
description: Find or refactor local source-file cognitive complexity hotspots while preserving behavior. Use when a function or file is hard to read or reason about — overloaded functions, deep nesting, tangled branching, local readability pressure — with or without explicit file targets. Do not use to split a file into new files (cf-split) or for repository-wide refactors (cf-start).
---
Reduce real cognitive complexity in local source files while preserving behavior.
Use this for up to three source files per session, processed one file at a time.
Do not bootstrap or require `.cflow/` artifacts.

Before applying any flow, read references/navigation-cost.md; it owns the hard-trigger values, exemptions, and remedy rules.
Use numeric thresholds only when native tooling can measure them; otherwise report qualitatively.

Route elsewhere instead of working here: `cf-split` for file-level split review or extraction from one source file; `cf-cohesion` for cross-file placement, navigation cost, or related files that may need a local feature slice; `cf-start` for repository structure, module boundaries, ownership moves, or broad multi-file refactors.

## Flow Selection

Choose exactly one flow.
Discovery and targeted evaluation flows do not edit repository files.
If the target, flow, or requested outcome is ambiguous, ask one focused question.
Do not infer execution from words like "review", "check", "is this complex", or "should we clean this up".

**Discovery** — use when no explicit file target was provided. Do discovery only. Do not edit files.
Default to the bundled `scripts/repo-tree.mjs` before manual exploration: resolve it from the active skill root, never from the project working directory, run it with `--help` first, then use its gitignore-aware tree with LOC to rank candidate files.
Rank from evidence, applying the canonical hard triggers first and using that LOC for the file-length trigger.
Keep a ranked shortlist of at most three files, and do not add weak candidates just to reach three.
Keep a candidate that fires a hard trigger on the shortlist unless a recognized exemption clears it.
If there is no real hotspot, report that no good local candidate was found.

**Targeted evaluation** — use when explicit file targets were provided and the request asks to review, assess, evaluate, or decide whether cleanup is worthwhile. Do not edit files.
Classify each target as `recommended`, `optional`, `keep as-is`, or `route`.
Default to `recommended` whenever a hard trigger is past its threshold; use `optional` or `keep as-is` for such a target only by naming one of its recognized exemptions.
When the file-length trigger fires, include an explicit file-size verdict: `route` to `cf-split`, or the named exemption that justifies its size.

**Execution** — use when the request explicitly asks to refactor, reduce, clean up, fix cognitive complexity, or proceed on explicit target files or a confirmed discovery candidate. Read references/local-refactor-rules.md.
Keep changes inside the target file unless the request explicitly asks otherwise, and do not move responsibilities to new files or shared utilities.
Do not continue past the target files or past three files in one session.
Flatten the target function's main path first, and treat anonymous callbacks passed to registration or lifecycle APIs as part of the local cognitive load when they carry real behavior.
Run the smallest relevant check and report its result; if no relevant check can be run, say so explicitly.
Apply the report/action separation in references/navigation-cost.md to every qualifying hard trigger.

## Output Format

Return only:

- **Scope**: flow and target files, or discovery area.
- **Assessment**: candidates, target decision, or hotspots addressed.
- **Changes**: edits made, or `none` for discovery/evaluation.
- **Checks**: commands run and pass/fail result, or why no check ran.
- **Defects**: behavior defects noticed while reading the target, with file and line. `none` is a claim that the code you moved matches its documented rules — name what you checked it against.
- **Deferred**: only after execution edits; findings required by the report/action rule in references/navigation-cost.md. Omit this section when no cleanup ran and in discovery or targeted evaluation.
- **Result**: behavior preservation, remaining risk, and `cf-split` or `cf-cohesion` next step when relevant.
