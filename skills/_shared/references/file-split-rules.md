# File Split Rules

Scope: behavior-preserving file-level extraction evaluation or execution.

## Candidate Review

Judge every candidate with `references/navigation-cost.md`; that test decides split value, ahead of churn, file count, or flat-placement defaults.
A file-level split candidate is a natural owner that can be named without describing implementation steps.

Good candidates include:

- custom hooks
- dialogs or modals
- adapters
- parsers or formatters
- substantial self-contained subcomponents
- focused policy or domain logic with a stable name

File length alone does not pick what to extract, but past the roughly-300-LOC bell in `references/navigation-cost.md` the default verdict is that a boundary exists: conclude `none` or `keep local` for such a file only by naming one of its recognized exemptions.
Below that bell, do not recommend extraction just because a helper exists or a small component could technically live elsewhere.

Classify each visible boundary:

- `recommended`: extraction would materially lower navigation cost now
- `optional`: ownership is clear, but keeping it local is also reasonable
- `keep local`: the boundary is visible but too small, too coupled, or not worth a file yet

Use `none` only when no natural file-level boundary is visible.

## Grouping

When recommending or executing a split, name the exact new file set.

Keep extracted hooks, helpers, constants, and small private units inside the extracted owner file when that remains one readable local concern.
If that owner file would still be too large or would contain multiple stable units, split those units into additional local files instead of promoting them upward.
Prefer one local file per stable subunit when the subunit name is a likely bug or change target. Use a single local file for tiny fragments that are tightly coupled, not independently searchable, and unlikely to be edited by name.
During review of a completed split, apply this rule to the extracted owner too. A behavior-preserving move is not enough evidence that the extracted owner is finished when it still hides multiple named lifecycle, policy, orchestration, or integration units.
After extracting multiple local units from one owner, run a second cohesion pass before finishing. If the remaining source file and extracted files now form a stable owner with clear internal bug targets, group them as that owner instead of leaving the result as unrelated flat siblings.

Do not promote code to shared, global hooks, common, or utils locations only to reduce file size.
Use those locations only when reuse already exists, the extracted owner is truly cross-feature, or repository convention clearly places that kind of owner there.

## Placement

Place new files by nearest existing ownership, not by generic type.
Choose placement for the resulting local cluster, not only for the one file being created now.
For placement counts, a real source file is a non-generated implementation source file in the target language. Do not count `mod.rs`, `index.ts`, barrel or re-export-only files, generated files, snapshots, fixtures, or tests.

Default to flat placement next to the source file when the extracted set is not yet a stable named owner or a folder would not reduce bug-localization cost.
Create a new local subfolder when the owner group is stable, the folder name is the likely place a maintainer would inspect for bugs in that local behavior, and the parent remains easier to scan after the move.
Use these placement counts as guardrails, not hard overrides for a stable owner with concrete bug-localization gain:

- the owner group that would move into the subfolder contains at least three real source files
- after moving that owner group, the parent directory would still contain at least two other direct real source-file peers
- before the move, the parent directory contains at least six direct real source files

If a guardrail fails and the bug-localization gain is not concrete, keep the files flat.
A concrete exception can be a named local owner folder containing several subunit files whose names match likely bug reports or change requests. This is locality, not file sprawl, when the parent directory becomes easier to scan and the owner folder is the obvious inspection point.
Use shared or global locations only when the grouping rules justify promotion.

Do not create a new top-level architectural folder during a local split.
Do not move to `shared`, `common`, or `utils` because reuse is only theoretical.

After every executed split, re-check the containing directory:

- if the owner group now passes the bug-localization test and either the placement guardrails or a concrete exception to them, move it into one local subfolder
- if the owner group is still not stable or the folder would add navigation cost, keep or return the files flat in the parent directory
- if a previous split left one extracted file flat, move it only when the current split makes the full owner group pass the same owner and placement checks

If more than one placement is plausible, ask one focused question before editing.
Offer only applicable options: flat next to the caller, an existing subfolder, or a new subfolder, with a recommendation.
