# Execution

Use this reference for safety locks, bounded structural execution, and local post-structural simplification.

## Shared Preflight

- Requires current architecture context.
- Without a brief, continue only with an explicit, local, behavior-preserving scope.
- Re-check the touched area before editing.
- Do not broaden scope beyond one bounded work unit or cohesive local unit unless the user explicitly asks.

## Safety Net

Use before structural edits, not before discovery.

Name exactly what the next move may disturb:

- current work unit if a brief exists
- cohesive local unit if using the local fast lane
- touched workflow, module, or feature area
- observable behavior that must remain stable

Prefer existing protection before adding anything:

1. existing targeted tests
2. existing broader tests that already lock relevant behavior
3. targeted characterization tests
4. narrow smoke checks or explicit invariants when automated tests are not practical

Return `go` only when the lock is credible for the planned move.
Return `no-go` when behavior cannot be checked reasonably or the uncovered surface is too risky for structural execution.

## Split Execution

Use when concentration pressure has a clear split direction.

Before splitting, name:

- the workflow that should stay visible
- the responsibility currently hiding it
- what moves
- what stays

Rules:

- Preserve behavior unless a behavior change was explicitly requested.
- Split only when the caller, entry point, or main workflow becomes visibly simpler, or when the moved responsibility gets a real local owner.
- If callers still need the same branching, mapping, or integration detail after the split, the boundary did not reduce pressure.
- Make the smallest structural move that gives a responsibility a clearer home.
- Add a file, module, type, or helper only when it reduces real complexity.
- Prefer local named ownership over generic utilities or fake layers.
- Avoid names like `helper`, `utils`, `common`, `shared`, `manager`, or `service` unless local convention gives them clear meaning.
- Read `../../_shared/references/file-split-rules.md` before choosing placement.
- If placement is not obvious, ask one focused question before editing.

## Consolidation Execution

Use when fragmentation pressure has a clear consolidation direction.

Before consolidating, name:

- the workflow that currently takes too many jumps to understand
- the artificial boundary to collapse

Rules:

- Preserve behavior unless a behavior change was explicitly requested.
- Consolidate only when at least one reader-visible hop disappears, or caller-side branching, mapping, or pass-through code becomes simpler.
- Keep the resulting file or module focused on one readable primary reason to exist.
- Prefer one meaningful merge or collapse at a time.
- Avoid replacing over-fragmentation with a god file.
- Keep a boundary when it carries real domain vocabulary, integration or lifecycle ownership, dependency direction, or test isolation.
- Move ownership only when the caller gets simpler in a visible way.

## Local Simplification

Use after a bounded structural step, not before.

Before editing, read:

- `../../_shared/references/local-readability-review.md`
- `../../_shared/references/local-refactor-rules.md`

Rules:

- Preserve behavior.
- Keep simplification local to the touched area.
- Improve naming, control flow, and helper shape; do not reopen architecture.
- Do not create new files or abstractions unless they clearly reduce local complexity.
- Stop if simplification would reopen structural choices.

## Before Finishing

Run at least one relevant verification when available:

- targeted tests
- lint
- typecheck
- build
- narrow smoke check

If no relevant verification is available, say that explicitly.

If files or symbols moved, renamed, split, merged, removed, or re-exported, read `../../_shared/references/reference-audit.md` and audit touched names and paths.

Report discovered bugs separately unless the user explicitly asked for a behavior fix.

## Artifact Updates

Use `artifacts.md` for brief creation and execution-state rules.
Record phase-specific changes in:

- `Work units` status labels
- `Safety net` if assumptions changed
- `Verification`
- `Execution state`
- `Handoff notes`
- `Unknowns to re-check`

If implementation changed understanding, also update:

- `Concentration pressure` or `Fragmentation pressure`
- `Target direction`
- `Alignment notes`

For local simplification with an existing brief, update:

- `Review notes`
- `Verification` when checks ran
- `Execution state`
- `Handoff notes`

## Output

Return current state, work executed or simplifications applied, checks run, artifacts updated, what remains, and next action.
