# File Split Rules

Use this reference when evaluating or executing a behavior-preserving file-level extraction.

## Candidate Review

A file-level split candidate is a natural owner that can be named without describing implementation steps.
Evaluate split value on two axes: source readability and maintenance navigation.
Maintenance navigation means a maintainer new to this area can use file names and local module structure to choose the likely file for a bug fix or feature change without first reading the whole source file.
A split can be worthwhile when it materially improves either axis.

Good candidates include:

- custom hooks
- dialogs or modals
- adapters
- parsers or formatters
- substantial self-contained subcomponents
- focused policy or domain logic with a stable name

Do not recommend extraction just because a file is long, a helper exists, or a small component could technically live elsewhere.

Classify each visible boundary:

- `recommended`: extraction would materially improve source readability or maintenance navigation now
- `optional`: ownership is clear, but keeping it local is also reasonable
- `keep local`: the boundary is visible but too small, too coupled, or not worth a file yet

Use `none` only when no natural file-level boundary is visible.

## Grouping

When recommending or executing a split, name the exact new file set.

Keep extracted hooks, helpers, constants, and small private units inside the extracted owner file when that remains one readable local concern.
If that owner file would still be too large or would contain multiple stable units, split those units into additional local files instead of promoting them upward.
During review of a completed split, apply this rule to the extracted owner too. A behavior-preserving move is not enough evidence that the extracted owner is finished when it still hides multiple named lifecycle, policy, orchestration, or integration units.

Do not promote code to shared, global hooks, common, or utils locations only to reduce file size.
Use those locations only when reuse already exists, the extracted owner is truly cross-feature, or repository convention clearly places that kind of owner there.

## Placement

Place new files by nearest existing ownership, not by generic type.
Choose placement for the resulting local cluster, not only for the one file being created now.
For placement counts, a real source file is a non-generated implementation source file in the target language. Do not count `mod.rs`, `index.ts`, barrel or re-export-only files, generated files, snapshots, fixtures, or tests.

Default to flat placement next to the source file.
Create a new local subfolder only when all of these checks pass:

- the owner group that would move into the subfolder contains at least three real source files
- after moving that owner group, the parent directory would still contain at least two other direct real source-file peers
- before the move, the parent directory contains at least six direct real source files

If any check fails, keep the files flat in the parent directory.
Use shared or global locations only when the grouping rules justify promotion.

Do not create a new top-level architectural folder during a local split.
Do not move to `shared`, `common`, or `utils` because reuse is only theoretical.

After every executed split, re-check the containing directory:

- if the new subfolder checks pass, move the owner group into one local subfolder
- if the new subfolder checks fail, keep or return the owner group flat in the parent directory
- if a previous split left one extracted file flat, move it only when the current split makes the full owner group pass the new subfolder checks

If more than one placement is plausible, ask one focused question before editing.
Offer only applicable options: flat next to the caller, an existing subfolder, or a new subfolder, with a recommendation.
