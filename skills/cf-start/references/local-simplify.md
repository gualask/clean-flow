# Local Simplify

This phase belongs after split or consolidation execution.

Do not reopen repository architecture in this phase.

## Preflight

Use standard phase preflight.
- If the touched area is not clearly anchored in a recently completed bounded structural step, stop and route to `cf-start` first.
- Without a brief, require an explicit local touched area.
- Do not broaden scope in this step.

## Goal

Improve local readability without changing the chosen structural direction.

When deciding whether simplification is warranted, use [local-readability-review.md](../../_shared/references/local-readability-review.md).
Before editing code, ensure you have read [local-refactor-rules.md](../../_shared/references/local-refactor-rules.md) in this invocation.

## Rules

- Preserve behavior.
- Keep the simplification local to the touched area.
- Improve local readability, not architecture labels.
- Apply the shared local refactor rules for naming, control flow, helper shape, and hot-path caution.
- Do not create new files or abstractions unless they clearly reduce local complexity.
- Do not split files just to make them shorter.
- Stop if the simplification would reopen structural choices.
- After editing code, run at least one targeted relevant check when one is available.

## Output format

Return sections: **Current state**, **Local simplifications applied**, **Checks run**, **Artifacts updated**, **What remains**, **Next action**.

## Artifact updates

Apply `artifacts.md` before stopping when this step changes resumable state.
Phase-specific fields:

- `Verification` if any checks were run
- `Review notes`

If work unit status changed, update:

- `Work units`
