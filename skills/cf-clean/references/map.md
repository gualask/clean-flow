# Map

The map lets the repository be swept one area at a time, across sessions, with checkable coverage: every file belongs to exactly one area, and every area is swept or excluded with a reason. It lives in `.cflow/cf-clean-map.md`.

- Target is the repository and no map exists, or the user asks to rebuild it: **Build the map**, replacing any earlier map.
- A map exists and the target is one of its areas, or the request asks to continue from the map: **Sweep an area**. To continue, take the first `todo` area in the map's order.
- A map exists and the target is the repository: say that the map exists, with its `Commit:` and `Date:`, name the areas done and the commit of each, and ask whether to continue from it or rebuild it. Stop. Whether the map still fits the code is the user's call.

## Build the map

Do not open source files in full and run no lens. Allowed inputs: bundled `scripts/repo-tree.mjs`, resolved from the active skill root; file and directory names; documentation and the repository's stated rules, which may be read in full.

1. Choose areas: one per app, service, or module the layout declares (a folder under `modules/`, `capabilities/`, `packages/`, `apps/`, `services/`, or the analogous folder this repository uses); the remaining files group by top-level folder.
2. Run `repo-tree.mjs --area <path>` with every area. It assigns each file to exactly one area, by the longest area path that contains it, and lists the files under none as `(rest)`; `(rest)` is an area like the others. Rerun with other areas until the partition is the one you want. Never leave a file out.
3. Mark an area `excluded: <reason>` only when none of its files is source code or configuration: binary assets, or documentation, which every area sweep reads as an audit surface. Every other area is `todo`.
4. Write the map file in the shape below. Before creating it, create `.cflow/` if needed and write `.cflow/.gitignore` containing a single `*` line if missing.
5. Output the map rows and `Coverage`, ask which area to sweep first, and stop.

Map file shape:

- `Commit:` the HEAD commit the map was measured on; `Date:` the day it was built; `Total:` the script's total line.
- One table row per area: the path exactly as passed to `--area` (or `(rest)`), files, LOC, estimated tokens, policy, state (`todo`, `done <commit>`, or `excluded: <reason>`).

## Sweep an area

1. The area's files are the primary files. Run the context gate of `references/context-gate.md` on them, batch when it says `batched`, and continue from `SKILL.md` Flow step 3.
2. For each relation the sweep shows between this area's code and another area's file (a copy, a re-implementation, a value or format another area owns, a single consumer, or an analogous tie), read the other area's cited lines only and decide finding or not.
3. Write the area's findings to `.cflow/cf-clean-recap.md` under `## <area>`, replacing the area's earlier section. Sections of other areas are outstanding work of the same map: keep them, and do not stop to ask about them.
4. Set the area to `done <HEAD commit>`. Add `Coverage` to the output.

`Coverage`: areas done or excluded out of all areas, and files in them out of `Total:`. Coverage is complete when every area is done or excluded; each area's commit says what code it was swept on.
