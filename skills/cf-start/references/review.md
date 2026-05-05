# Review

Do review only. Do not introduce new structural changes in this phase unless the user explicitly asks.

## Preflight

- Require current `.cflow/architecture.md`; if missing, stop and route to `cf-architecture`.
- Read architecture plus existing `.cflow/refactor-brief.md`.
- If the completed step or touched area is not clear enough to review, stop and route to `cf-start` first.
- Re-check the touched area and treat repository state as the source of truth.
- For closure-challenge reviews, treat recorded `done`, `verified`, `safe stopping point`, and previous review notes as claims to test, not conclusions.
- For closure-challenge reviews, rebuild the review from current files, including untracked files and the densest extracted owners.

## Goal

Judge whether the refactor improved structure in a proportionate way.

## Review lens

Ensure you have read [local-readability-review.md](../../_shared/references/local-readability-review.md) in this invocation before judging local readability.
If the completed step moved, split, grouped, or renamed files, also ensure you have read [file-split-rules.md](../../_shared/references/file-split-rules.md) before judging final placement and owner shape.

Judge the result on four questions:

- Did it reduce the pressure it was meant to reduce?
- Did it keep boundaries and ownership clearer than before?
- Did it avoid fake layers, dead wrappers, cleanup mania, and unnecessary scope growth?
- Is the remaining risk structural, or mostly a verification gap?

## Closure Sweep

Before recommending closure for a non-trivial refactor, run a second pass using the lenses suggested by the actual change shape:

- moved, renamed, newly related, or newly private files -> placement and cohesion
- touched owner folders, nearby feature folders, or call sites with suspicious ownership vocabulary -> cohesion scan for separate cleanup candidates
- large or dense extracted owners -> split and local readability
- public API, exports, imports, or barrel changes -> reference audit
- async, lifecycle, persistence, user-visible, or cross-flow behavior -> verification or `cf-scenario`

Use judgment to follow evidence beyond the initially touched files when the repository shape points there.
Report separate cleanup candidates apart from same-unit closure; do not treat them as blockers unless they belong to the completed unit.
The sweep may still conclude no further action, but only after naming the lenses considered and the reason no blocking follow-up remains.

## Recommendation rules

- `verify`: use when structure is acceptable and only factual closure is missing.
- `continue`: use when the closure sweep finds one concrete residual in the touched scope; name the exact next phase or action instead of generic follow-up.
- `stop`: use only when the closure sweep found no blocking structural, placement, readability, safety-net, behavioral, lifecycle, user-visible, or cross-flow follow-up. Optional follow-up must be labeled optional.

For closure challenges, do not treat worktree finalization as the only remaining work until the sweep has ruled out blocking follow-up.

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
