# cf-cohesion Targeted Evaluation

Evaluate without editing; this reference never edits files.

## Goal

Decide whether already-related files should stay where they are or live together in a local slice.

## Preflight

- Run the reference audit for each candidate before finalizing the cohesion map.

## Cohesion Map

Build a compact map with:

- owner cluster: files that belong to the same local behavior
- outliers: similarly named files that should not move
- shared files: reusable utilities, adapters, or framework glue that should stay outside
- nearby precedent: local folders or conventions that support or weaken regrouping
- navigation cost: how much a reader must read to follow the behavior, and which likely bugs or changes should point to the candidate folder or file names before reading implementation

## Placement Convention

Before naming destination folders, state the smallest local convention that would make the area easier to navigate.

- Do not create `common`, `shared`, `utils`, or similar generic folders just to make every file live below one subdirectory.

## Decision Rules

- If placement is plausible but not clear, ask one focused question instead of inventing a folder.

## Exit

When targeted evaluation is the selected flow, use the standard output format.
For **Checks**, say `not run; evaluation only` unless a read-only diagnostic command was useful enough to report.
For **Result**, name the exact regrouping candidate only when it is `recommended` or `optional`.

When loaded as execution preflight, emit no intermediate output; pass the cohesion map and decision to the execution gate in SKILL.md.
