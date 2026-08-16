# Local Refactor Rules

Scope: local code edits for readability, cognitive load, or post-structural cleanup.
The hard-trigger values, exemptions, and remedy rules come from `references/navigation-cost.md`; apply that contract before the soft signals below.
For function-level pressure, prefer remedies in this order: guard clauses or early returns first, then named same-file helpers when flattening is not enough.

## Scope Of The Edit

- Keep changes local unless the active skill explicitly allows broader movement.
- Prefer the most focused change that makes the main flow cleaner and clearer.

## When To Simplify

- functions that are hard to scan even when no canonical hard trigger fires
- nested try/catch blocks that make control flow hard to follow, unless language or framework constraints force them
- try/catch blocks or loop bodies long enough to hide their main purpose
- branching that hides the main path, or repeated non-trivial local logic
- framework, runtime, or infrastructure wiring blocks whose callbacks carry real behavior: branching, state changes, cleanup-sensitive ordering, or multiple side effects. Prefer named local handlers when that makes setup, teardown, and effect order easier to scan, and keep ordering-sensitive side effects visible at the call site.

## Extraction

- Before extracting, name the branch, loop, try/catch body, policy decision, or invariant that the extraction will make clearer.
- A helper is justified only when its name carries useful intent that the code did not already express.
- Extract from hot paths only when the readability gain clearly outweighs call-boundary, allocation, or extra-pass costs.
- After editing, re-read the caller or target function first; inline or narrow helpers that do not make it clearer.

## Avoid

- single-use helpers that only unpack a regex or match result
- single-use helpers that only loop over a range to push or add into a caller-owned collection
- helpers that hide important side effects
- extractions that force several layers to understand one local behavior
