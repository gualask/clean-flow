# Review

Do review only. Do not make structural edits unless explicitly asked.

## Required Inputs

- completed step or touched area
- current files relevant to the completed work

If required inputs are missing, stop with `Recommended next action: return to planning or verification`.
For closure challenges, review current files, untracked files, and dense extracted owners.

## Goal

Judge whether the refactor improved structure proportionately.

## Review lens

Read [local-readability-review.md](../../_shared/references/local-readability-review.md) before judging readability.
If files moved, split, grouped, or renamed, read [file-split-rules.md](../../_shared/references/file-split-rules.md) before judging placement.

Judge the result on four questions:

- Did it reduce the pressure it was meant to reduce?
- Are boundaries and ownership clearer?
- Did it avoid fake layers, dead wrappers, cleanup mania, and scope growth?
- Is the remaining risk structural, or mostly a verification gap?

## Closure Sweep

Before closure, run a second pass shaped by the actual change:

- moved, renamed, newly related, or newly private files -> placement and cohesion
- touched owner folders, nearby feature folders, or suspicious call-site vocabulary -> cohesion scan
- large or dense extracted owners -> split and local readability
- public API, exports, imports, or barrel changes -> reference audit
- async, lifecycle, persistence, user-visible, or cross-flow behavior -> verification / `cf-scenario`

Follow evidence beyond touched files when shape points there.
Separate same-unit blockers from optional cleanup.
Closure is allowed only after naming checked lenses and why no blocker remains.

## Recommendation rules

- `verify`: use when structure is acceptable and only factual closure is missing.
- `continue`: one concrete residual remains in touched scope; name the exact next phase/action.
- `stop`: no blocking structural, placement, readability, safety, behavior, lifecycle, user-visible, or cross-flow follow-up remains. Label optional work as optional.

For closure challenges, worktree finalization is not enough until the sweep rules out blockers.

## Output format

Return sections: **What improved**, **Closure sweep**, **What is still mixed or unclear**, **Over-engineering check**, **Boundary clarity check**, **Fragmentation / indirection check**, **Risk check**, **Recommended next action**.

For **Closure sweep**, include:

- lenses checked
- blocking same-unit follow-up
- separate cleanup candidates
- optional follow-up

## Artifact updates

Apply `artifacts.md` before stopping when review changes resumable state.
Phase-specific fields:

- `Review notes`

If review changes confidence in the target direction, also update:

- `Target direction`
- `Unknowns to re-check`
- `Decision notes`
