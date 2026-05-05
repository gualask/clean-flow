# cf-cohesion Targeted Evaluation

Evaluate only. Do not edit files.

## Goal

Decide whether already-related files should stay where they are or live together in a local slice.

## Preflight

- Read the local directory tree around the target.
- Read candidate files, imports/exports, call sites, tests, and nearby grouping conventions.
- Identify the current owner area and any sibling feature folders that set precedent.

## Cohesion Map

Build a compact map with:

- owner cluster: files that belong to the same local behavior
- outliers: similarly named files that should not move
- shared files: reusable utilities, adapters, or framework glue that should stay outside
- nearby precedent: local folders or conventions that support or weaken regrouping
- navigation cost: how many locations a reader must visit to follow the behavior

## Decision Rules

- Recommend regrouping only when it removes real navigation cost now.
- Prefer `optional` when cohesion is real but current placement is still easy to follow.
- Prefer `keep as-is` when the target folder would become a grab bag or current type-folder convention is stronger.
- Use `route` when the move crosses repository boundaries, changes module ownership, or needs ordered planning through `cf-start`.
- If placement is plausible but not clear, ask one focused question instead of inventing a folder.

## Output

Use the standard output format.
For **Checks**, say `not run; evaluation only` unless a read-only diagnostic command was useful enough to report.
For **Result**, name the exact regrouping candidate only when it is `recommended` or `optional`.
