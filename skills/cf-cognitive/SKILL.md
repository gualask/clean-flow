---
name: cf-cognitive
description: Find or refactor local source-file cognitive complexity hotspots while preserving behavior. Use when a function or file is hard to read or reason about — overloaded functions, deep nesting, tangled branching, local readability pressure — with or without explicit file targets. Do not use to split a file into new files (cf-split) or for repository-wide refactors (cf-architecture).
---
Reduce real cognitive complexity in local source files while preserving behavior.
Use this for up to three source files per session, processed one file at a time.
Do not bootstrap or require `.cflow/` artifacts.

Before applying any flow, read references/navigation-cost.md; it owns the hard-trigger values, exemptions, and remedy rules.
Count nesting as the control blocks inside a function — every `if`, loop, `switch`, `select`, or `try`, including one that only guards a `break` or `return`; a third nested block fires the trigger.

Route elsewhere instead of working here: `cf-split` for file-level split review or extraction from one source file; `cf-cohesion` for cross-file placement, navigation cost, or related files that may need a local feature slice; `cf-architecture` for repository structure, module boundaries, moving code into another package or module, ownership moves, or broad multi-file refactors, even when the request names the destination.
When routing, do not edit files: name the route and the reason in **Result**, and end the turn.

## Flow Selection

Choose exactly one flow.
Discovery and targeted evaluation flows do not edit repository files.
If the target, flow, or requested outcome is ambiguous, ask one focused question.
If the request names more than three target files, ask which three to take before editing.
Do not infer execution from words like "review", "check", "is this complex", or "should we clean this up".

**Discovery** — use when no explicit file target was provided. Do discovery only. Do not edit files.
Default to the bundled `scripts/repo-tree.mjs` before manual exploration: resolve it from the active skill root, never from the project working directory. Run it with `--depth 3` for the layout, then with `--largest 15`, adding `--include` for the source directories, for the candidate files.
Read the candidate files and rank functions, not files, by both function triggers, length and nesting depth: keep a ranked shortlist of at most three functions, each with file, line, and the hard trigger it fires, and do not add weak candidates just to reach three.
Give the file-length verdict for each candidate file past that trigger.
Keep a candidate that fires a hard trigger on the shortlist unless a recognized exemption clears it.
If there is no real hotspot, report that no good local candidate was found.

**Targeted evaluation** — use when explicit file targets were provided and the request asks to review, assess, evaluate, or decide whether cleanup is worthwhile. Do not edit files.
Classify each target as `recommended`, `optional`, `keep as-is`, or `route`.
Default to `recommended` whenever a hard trigger is past its threshold; use `optional` or `keep as-is` for such a target only by naming one of its recognized exemptions.
When the file-length trigger fires, include an explicit file-size verdict: `route` to `cf-split` or the named exemption that justifies its size.

**Execution** — use when the request explicitly asks to refactor, reduce, clean up, fix cognitive complexity, or says to proceed on named targets or a confirmed discovery candidate. Read references/local-refactor-rules.md.
Before editing, run a command that prints the logical lines and deepest nesting of every function in the target file; if none fires a hard trigger, do not edit: say so in **Assessment** and ask whether a minor cleanup is still wanted.
Keep changes inside the target file, and do not move responsibilities to new files or shared utilities.
Do not continue past the target files or past three files in one session.
Flatten the target function's main path first, and treat anonymous callbacks passed to registration or lifecycle APIs as part of the local cognitive load when they carry real behavior.
Run the smallest relevant check: targeted tests, typecheck or compile, lint, or a narrow smoke check.
Then run the tests that cover the target with the repository's test runner.
After the edits, run a command that prints the logical lines and deepest nesting of every function in each modified file, and the file's line count; apply the report/action separation in references/navigation-cost.md to every hard trigger still firing.

## Output Format

Return only:

- **Scope**: flow and target files, or discovery area.
- **Assessment**: candidates, target decision, or hotspots addressed.
- **Changes**: edits made, or `none` for discovery/evaluation.
- **Checks**: commands run and pass/fail result; the test command and its result, or `tests not run` with the reason.
- **Defects**: behavior defects noticed while reading the target, with file and line. `none` is a claim that the code you read matches its documented rules — name what you checked it against.
- **Deferred**: only after execution edits; findings required by the report/action rule in references/navigation-cost.md. Omit this section when no cleanup ran and in discovery or targeted evaluation.
- **Result**: behavior preservation, remaining risk, and `cf-split` or `cf-cohesion` next step when relevant. Claim behavior preservation only when that test command passed; otherwise say it is not verified by tests.
