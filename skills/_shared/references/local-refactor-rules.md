# Local Refactor Rules

Use this reference only while editing local code for readability, cognitive load, or post-structural cleanup.

## Behavior

- Preserve exported APIs, return values, errors, side effects, evaluation order, and async behavior unless explicitly asked to change them.
- Prefer the smallest change that makes the main flow easier to read.
- Keep changes local unless the active skill explicitly allows broader movement.
- Do not fix discovered behavior bugs inside a refactor unless the user asks; report them separately.

## When To Simplify

Prefer simplification when the touched code has real local pressure:

- functions that are hard to scan, roughly more than 20-30 logical lines
- nesting deeper than function -> block -> block
- nested try/catch blocks, unless language or framework constraints force them
- try/catch blocks or loop bodies long enough to hide their main purpose
- framework, runtime, or infrastructure wiring blocks that mix setup/teardown with nested callbacks containing real behavior, especially event subscriptions, observers, lifecycle hooks, timers, middleware, transactions, or scheduler callbacks
- branching that hides the main path
- complex boolean expressions, regex construction, parsing, or small algorithms that are hard to read inline
- repeated non-trivial local logic

Avoid edits when the code is merely imperfect but still easy to follow.

## Extraction

- Extract validation, error creation, difficult local algorithms, parser or regex setup, domain calculations, long try/catch bodies, long loop bodies, or case-specific handling from a long branch or switch.
- Prefer a shallow orchestrator: the caller shows the main sequence, and helpers are understandable without following a deep call chain.
- Keep extracted functions file-local and near callers unless local convention says otherwise.
- Extract from hot paths only when the readability gain clearly outweighs call-boundary, allocation, or extra-pass costs.
- After editing, re-read the caller or target function first; inline or narrow helpers that do not make it easier to read.

## Operational Checks

- Before extracting, name the branch, loop, try/catch body, policy decision, or invariant that the extraction will make easier to see.
- Prefer guard clauses, clearer names, or local reshaping before adding helpers when those make the main path clear enough.
- A helper is justified only when its name carries useful intent that the code did not already express.
- Keep important side effects visible at the level where ordering matters.
- Treat anonymous callbacks passed to registration/lifecycle APIs as local cognitive load when they contain branching, state changes, cleanup-sensitive behavior, or multiple side effects.
- Prefer named local handlers or a shallow subscription helper when that makes setup, teardown, and effect order easier to scan.
- For lifecycle, registration, framework/runtime wiring, and infrastructure APIs, keep setup, teardown, cancellation, and ordering visible at the call site.
- Extract inline callback behavior into named file-local handlers only when the name makes the local behavior easier to scan without hiding ordering-sensitive side effects.

## Naming

- Use intention-revealing names that describe the result or domain action, not every algorithm step.
- Avoid `And` / `Or` glued names; split separate responsibilities instead.
- Keep helper names short and domain-first when the language style allows it.

## Avoid

- one-line helpers whose name merely restates the code
- pass-through wrappers
- generic `process`, `handle`, `helper`, `util`, or `common` names
- todo-list names like `promoteAndFinalizeCreate` or `loadOrCleanupIfMissing`
- many tiny helpers
- single-use helpers that only unpack a regex or match result
- single-use helpers that only loop over a range to push or add into a caller-owned collection
- helpers that hide important side effects
- splits that make the call flow harder to follow
- extractions that force several layers to understand one local behavior
