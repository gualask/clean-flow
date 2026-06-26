# Local Simplify

This phase belongs after split or consolidation execution.

Do not reopen repository architecture in this phase.

## Required Inputs

- recently completed bounded structural step, or explicit local touched area
- clear local simplification scope

If required inputs are missing, stop with `Next action: return to planning or review`.

## Goal

Improve local readability without changing the chosen structural direction.

When deciding whether simplification is warranted, use references/local-readability-review.md.
Before editing code, ensure you have read references/local-refactor-rules.md in this invocation.

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
