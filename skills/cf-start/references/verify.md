# Verify

## Preflight

- Require current `.cflow/architecture.md`; if missing, stop and route to `cf-architecture`.
- Read architecture plus existing `.cflow/refactor-brief.md`.
- If the completed unit or touched area is not clear enough to verify, stop and route to `cf-start` first.
- Re-check the touched area and treat repository state as the source of truth.

## Goal

Collect risk-proportionate factual evidence that the touched area still works.

## Rules

- Do not merely say the work is fine.
- Choose verification from the actual change shape, affected contracts, and plausible failure modes.
- Prefer targeted checks first, but expand when the change touches public API, file placement, async/lifecycle behavior, persistence, cross-flow behavior, or multiple owners.
- Prefer repository-native commands when possible.
- Use the safety net and planned checks when they exist.
- Passing checks prove factual behavior, not structural closure; if the user asks whether a refactor is truly concluded, route to review for closure judgment.
- Do not stop at the first passing check when another available check covers a materially different risk.
- If the project has no formal checks, use credible smoke tests, inspections, or scenario checks that match the risk being verified.
- If you cannot verify, say exactly what is missing.
- Never finish without either running at least one factual check or stating exactly why no factual check could be run.

## Verification sources

Use whichever are relevant and available:

- targeted tests
- package or module tests
- lint
- typecheck
- build
- smoke commands
- runtime checks
- diff inspection for obviously dangerous drift
- reference audit when names or files moved

If a move, rename, split, merge, or re-export happened, ensure you have read [reference-audit.md](../../_shared/references/reference-audit.md) in this invocation, then run that audit for the touched names and paths.

## Output format

Return sections: **Checks attempted**, **Checks passed**, **Checks not run**, **Confidence and remaining risk**, **Recommended next action**.

## Artifact updates

Apply `artifacts.md` before stopping when verification changes resumable state.
Phase-specific fields:

- `Verification`

If verification changes confidence in completion, also update:

- `Review notes`
