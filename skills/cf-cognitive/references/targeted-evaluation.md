# cf-cognitive Targeted Evaluation

Evaluate only. Do not edit files.

## Goal

Decide whether the explicit target files have real local cognitive pressure worth cleaning up.

## Preflight

- Use explicit file targets only, up to three per session.
- Read each whole target file, relevant tests or call sites, and local helper/error/async/performance conventions.
- Process target files sequentially.

## Evaluation Rules

- Classify each target as `recommended`, `optional`, `keep as-is`, or `route`.
- Use `recommended` only when local control flow, nesting, callbacks, parsing, branching, or repeated non-trivial logic materially slows reading.
- Use `optional` when cleanup could help but current code is still easy enough to follow.
- Use `keep as-is` when the code is merely imperfect or stylistically noisy.
- Use `route` when the right next step is `cf-split`, `cf-cohesion`, or `cf-start`.
- Do not suggest edits that would move responsibilities to new files or shared utilities from this skill.

## Output

Use the standard output format.
For **Changes**, report `none`.
For **Checks**, say `not run; evaluation only` unless a read-only diagnostic command was useful enough to report.
For **Result**, name the next step only when cleanup is `recommended`, `optional`, or `route`.
