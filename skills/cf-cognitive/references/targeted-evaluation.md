# cf-cognitive Targeted Evaluation

Evaluate only. Do not edit files.

## Goal

Decide whether the explicit target files have real local cognitive pressure worth cleaning up.

## Preflight

- Ensure you have read references/navigation-cost.md in this invocation; it owns the test that decides whether cleanup is worth it.
- Use explicit file targets only, up to three per session.
- Read each whole target file, relevant tests or call sites, and local helper/error/async/performance conventions.
- Process target files sequentially.

## Evaluation Rules

- Classify each target as `recommended`, `optional`, `keep as-is`, or `route`.
- Default to `recommended` whenever a hard trigger from `references/navigation-cost.md` is past its threshold; use `optional` or `keep as-is` for such a target only by naming one of its recognized exemptions.
- When the target file is past the roughly-300-LOC bell, include an explicit file-size verdict in **Result**: `route` to `cf-split`, or the named exemption that justifies its size.
- Do not minimize findings past a hard trigger with qualifiers like "light", "minor", "not yet serious", or "someday"; state the hotspot plainly and name the remedy.
- Use `recommended` only when local control flow, nesting, callbacks, parsing, branching, or repeated non-trivial logic materially slows reading.
- Use `recommended`, not `optional`, when a function's main path is hidden behind multiple indentation layers such as guard or branch -> runner/callback -> try/catch -> result branching, and a same-file task or result helper would make the caller read as guard plus orchestration.
- When lifecycle, registration, framework/runtime wiring, or infrastructure callbacks contain real behavior such as branching, multiple state updates, mutable state changes, cleanup-sensitive ordering, or promise/error handling, do not classify the target as `keep as-is` only because it is not split-worthy.
- Use `recommended` when a same-file named handler or shallow local helper would make the outer block read as setup, teardown, or orchestration without hiding ordering-sensitive side effects.
- Use `optional` when cleanup could help but current code is already clear enough to follow.
- Use `keep as-is` when the code is merely imperfect or stylistically noisy.
- Use `route` when the right next step is `cf-split`, `cf-cohesion`, or `cf-start`.
- Do not suggest edits that would move responsibilities to new files or shared utilities from this skill.

## Output

Use the standard output format.
For **Changes**, report `none`.
For **Checks**, say `not run; evaluation only` unless a read-only diagnostic command was useful enough to report.
For **Result**, name the next step only when cleanup is `recommended`, `optional`, or `route`.
