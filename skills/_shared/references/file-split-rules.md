# File Split Rules

Use this reference when evaluating or executing a behavior-preserving file-level extraction.

## Candidate Review

A file-level split candidate is a natural owner that can be named without describing implementation steps.

Good candidates include:

- custom hooks
- dialogs or modals
- adapters
- parsers or formatters
- substantial self-contained subcomponents
- focused policy or domain logic with a stable name

Do not recommend extraction just because a file is long, a helper exists, or a small component could technically live elsewhere.

Classify each visible boundary:

- `recommended`: extraction would make the source file easier to scan now
- `optional`: ownership is clear, but keeping it local is also reasonable
- `keep local`: the boundary is visible but too small, too coupled, or not worth a file yet

Use `none` only when no natural file-level boundary is visible.

## Placement

Place new files by nearest existing ownership and repository convention, not by generic type.

Choose placement in this order:

- an existing local path or subfolder when it already owns the same seam
- flat next to the caller when creating one local extracted file
- a new local subfolder when the split creates at least two related files that should stay together
- shared locations only when reuse already exists or the extracted owner is truly cross-feature

Do not create a new top-level architectural folder during a local split.
Do not move to `shared`, `common`, or `utils` because reuse is only theoretical.

If more than one placement is plausible, ask one focused question before editing.
Offer only applicable options: flat next to the caller, an existing subfolder, or a new subfolder, with a recommendation.
