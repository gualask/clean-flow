# Local Simplify

Use this after split-execution or consolidation-execution, not before.

Do not reopen repository architecture in this phase.

## Preflight

- Require current `.cflow/architecture.md`; if missing, stop and route to `cf-architecture`.
- Read architecture plus existing `.cflow/refactor-brief.md`.
- If the touched area is not clearly anchored in a recently completed bounded structural step, stop and route to `cf-start` first.
- Without a brief, continue only with an explicit, local touched area; otherwise route to `cf-start` or the correct Cflow phase.
- Re-check the touched area and repository state before acting.
- Do not broaden scope in this step.

## Goal

Improve local readability without changing the chosen structural direction.

When deciding whether simplification is warranted, use [../../_shared/references/local-readability-review.md](../../_shared/references/local-readability-review.md).
Before editing code, ensure you have read [../../_shared/references/local-refactor-rules.md](../../_shared/references/local-refactor-rules.md) in this invocation.

## Rules

- Preserve behavior.
- Keep the simplification local to the touched area.
- Improve local readability, not architecture labels.
- Apply the shared local refactor rules for naming, control flow, helper shape, and hot-path caution.
- Do not create new files or abstractions unless they clearly reduce local complexity.
- Do not split files just to make them shorter.
- Stop if the simplification would reopen structural choices.
- After editing code, run at least one lightweight relevant check when one is available.

## Output format

Return sections: **Current state**, **Local simplifications applied**, **Checks run**, **Artifacts updated**, **What remains**, **Next action**.

## Artifact updates

If a brief exists, update before stopping:

- `Verification` if any checks were run
- `Review notes`
- `Execution state`
- `Handoff notes`

If work unit status changed, update:

- `Work units`
