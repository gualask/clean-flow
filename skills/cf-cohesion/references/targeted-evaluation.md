# cf-cohesion Targeted Evaluation

Evaluate only. Do not edit files.

## Goal

Decide whether already-related files should stay where they are or live together in a local slice.

## Preflight

- Ensure you have read references/navigation-cost.md in this invocation; it owns the test that decides regrouping value.
- Read the local directory tree around the target.
- Read candidate files, imports/exports, call sites, tests, and nearby grouping conventions.
- Identify the current owner area and any sibling feature folders that set precedent.

## Cohesion Map

Build a compact map with:

- owner cluster: files that belong to the same local behavior
- outliers: similarly named files that should not move
- shared files: reusable utilities, adapters, or framework glue that should stay outside
- nearby precedent: local folders or conventions that support or weaken regrouping
- navigation cost: how much a reader must read to follow the behavior, and which likely bugs or changes should point to the candidate folder or file names before reading implementation

## Owner Locality

Before reorganizing a type folder, check whether that folder is the right owner.

- Files with one clear feature, workflow, adapter, endpoint, command, screen, or runtime owner should usually live beside that owner, not in a broad type folder.
- Keep a file in the type folder only when it is reused across owners, provides shared infrastructure/runtime behavior, or nearby repository convention explicitly treats that type as shared.
- If an item imports mostly from one owner area or has tests tied to one owner, treat that as evidence for local placement.
- Do not solve a single-owner file by putting it in a more specific subfolder under the broad type folder when colocating with the owner would reduce navigation cost more.

## Placement Convention

Before naming destination folders, state the smallest local convention that would make the area easier to navigate.

- For a flat type folder, prefer this convention when it fits the evidence: root files remain implicitly common/shared, and subfolders exist only for domains, workflows, or stable internal pairs with real cohesion.
- When files are private children of one owner file, component, workflow, adapter, or analogous local owner, and the same parent also contains unrelated sibling owners, recommend grouping that owner and its children in a named owner directory.
- Do not apply this owner-directory rule when the child files are shared across owners, the parent already belongs only to that owner, or framework/local convention forbids the folder.
- Do not create `common`, `shared`, `utils`, or similar generic folders just to make every file live below one subdirectory.
- A proposed folder needs a specific ownership name, such as a domain, workflow, feature, adapter, or tightly coupled mechanism.
- If no file would remain at root, still avoid a generic bucket unless the repository already uses that exact convention nearby.

## Decision Rules

- Recommend regrouping only when it removes real navigation cost now, especially when the request is about where to debug or who owns a behavior.
- Prefer `optional` when cohesion is real but current placement is already clear enough to follow.
- Prefer `keep as-is` when the target folder would become a grab bag or current type-folder convention is stronger.
- Use `route` when the move crosses repository boundaries, changes module ownership, or needs ordered planning through `cf-start`.
- If placement is plausible but not clear, ask one focused question instead of inventing a folder.

## Output

Use the standard output format.
For **Checks**, say `not run; evaluation only` unless a read-only diagnostic command was useful enough to report.
For **Result**, name the exact regrouping candidate only when it is `recommended` or `optional`.
