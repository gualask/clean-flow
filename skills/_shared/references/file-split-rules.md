# File Split Rules

Scope: behavior-preserving file-level extraction evaluation or execution.

## Candidate Review

The hard-trigger values and exemptions come from `references/navigation-cost.md`; apply its test ahead of churn, file count, or flat-placement defaults.
A file-level split candidate is a natural owner that can be named without describing implementation steps.

Good candidates include:

- custom hooks
- dialogs or modals
- adapters
- parsers or formatters
- substantial self-contained subcomponents
- focused policy or domain logic with a stable name

File length alone does not pick what to extract.
The canonical file-length trigger is not a minimum split threshold: below it, recommend extraction when a stable named owner, subcomponent, policy, or workflow would materially lower navigation cost; do not extract code just because a helper exists or a small component could technically live elsewhere.

Classify each visible boundary:

- `recommended`: extraction would materially lower navigation cost now
- `optional`: ownership is clear, but keeping it local is also reasonable
- `keep local`: the boundary is visible but too small, too coupled, or not worth a file yet

Use `none` only when no natural file-level boundary is visible. Past the canonical file-length trigger, `none` or `keep local` for the whole file also needs a recognized exemption named.

## Grouping

When recommending or executing a split, name the exact new file set.

Keep extracted hooks, helpers, constants, and small private units inside the extracted owner file when that remains one readable local concern.
If that owner file would still be too large or would contain multiple stable units, split those units into additional local files instead of promoting them upward.
Prefer one local file per stable subunit when the subunit name is a likely bug or change target. Use a single local file for tiny fragments that are tightly coupled, not independently searchable, and unlikely to be edited by name.
During review of a completed split, apply this rule to the extracted owner too. A behavior-preserving move is not enough evidence that the extracted owner is finished when it still hides multiple named lifecycle, policy, orchestration, or integration units.

Do not promote code to shared, global hooks, common, or utils locations only to reduce file size.
Use those locations only when reuse already exists, the extracted owner is truly cross-feature, or repository convention clearly places that kind of owner there.

## Placement

Place new files by nearest existing ownership, not by generic type.
When an approved spec or plan names the target location, use it. Otherwise create extracted files flat next to the source file, then settle their final placement with the post-split re-check below.
Choose placement for the resulting local cluster, not only for the one file being created now.
For placement counts, a real source file is a non-generated implementation source file in the target language. Do not count `mod.rs`, `index.ts`, barrel or re-export-only files, generated files, snapshots, fixtures, or tests.

Keep the files flat when the extracted set is not yet a stable named owner or a folder would not reduce bug-localization cost.
Create a new local subfolder when the owner group is stable, the folder name is the likely place a maintainer would inspect for bugs in that local behavior, and the parent remains easier to scan after the move.
Use these placement counts as guardrails; when one fails, keep the files flat unless the owner group is stable with a concrete bug-localization gain or the owner-directory rule below applies:

- the owner group that would move into the subfolder contains at least three real source files
- after moving that owner group, the parent directory would still contain at least two other direct real source-file peers
- before the move, the parent directory contains at least six direct real source files

When files are private children of one owner file, component, workflow, adapter, or analogous local owner, and the same parent also contains unrelated sibling owners, group that owner and its children in a named owner directory, even when a placement count fails.
Do not apply this owner-directory rule when the child files are shared across owners, the parent already belongs only to that owner, or framework/local convention forbids the folder.
When a folder would change module or package boundaries (for example, a new Go package) and no approved spec or plan decides that boundary, keep the files flat and report the owner group as a deferred finding routed to `cf-architecture`; this overrides both the guardrails and the owner-directory rule.

Do not create a new top-level architectural folder during a local split.

After every executed split whose location no approved spec or plan fixed, re-check the containing directory and apply the placement rules above to the full owner group: the remaining source file, the extracted files, and any file a previous split left flat. When they now form a stable owner with clear internal bug targets, group them as that owner instead of leaving unrelated flat siblings.

