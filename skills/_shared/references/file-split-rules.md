# File Split Rules

Scope: behavior-preserving file-level extraction evaluation or execution.

## Candidate Review

Before reviewing candidates, read `references/navigation-cost.md`; it owns the hard-trigger values and exemptions, and its test decides split value ahead of churn, file count, or flat-placement defaults.
A file-level split candidate is a natural owner that can be named without describing implementation steps.

Good candidates include:

- custom hooks
- dialogs or modals
- adapters
- parsers or formatters
- substantial self-contained subcomponents
- focused policy or domain logic with a stable name

File length alone does not pick what to extract, but past the canonical file-length trigger the default verdict is that a boundary exists: conclude `none` or `keep local` only by naming a recognized exemption.
The canonical file-length trigger is not a minimum split threshold: below it, recommend extraction when a stable named owner, subcomponent, policy, or workflow would materially lower navigation cost; do not extract code just because a helper exists or a small component could technically live elsewhere.

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
When files are private children of one owner file, component, workflow, adapter, or analogous local owner, and the same parent also contains unrelated sibling owners, group that owner and its children in a named owner directory.
Do not apply this owner-directory rule when the child files are shared across owners, the parent already belongs only to that owner, or framework/local convention forbids the folder.
Use shared or global locations only when the grouping rules justify promotion.

Do not create a new top-level architectural folder during a local split.
Do not move to `shared`, `common`, or `utils` because reuse is only theoretical.

After every executed split, re-check the containing directory:

- if the owner group now passes the bug-localization test and either the placement guardrails or a concrete exception to them, move it into one local subfolder
- if the owner group is still not stable or the folder would add navigation cost, keep or return the files flat in the parent directory
- if a previous split left one extracted file flat, move it only when the current split makes the full owner group pass the same owner and placement checks

If more than one placement is plausible, ask one focused question before editing.
Offer only applicable options: flat next to the caller, an existing subfolder, or a new subfolder, with a recommendation.
