# Structural Closure

Use before finishing split or consolidation execution.

## Verification

Run risk-proportionate verification when available. Start targeted, and broaden when the structural move touches public API, file placement, lifecycle behavior, persistence, cross-flow behavior, or multiple owners.

Useful checks include targeted tests, lint, typecheck, build, and runtime smoke checks.

If no relevant verification is available, say that explicitly in `Checks run` or `What remains`.

## Reference Audit

If files or symbols were moved, renamed, split, merged, removed, relocated, or re-exported, read ../../_shared/references/reference-audit.md, then audit the touched names and paths.

## Output Format

Return sections: **Current state**, **Work unit executed**, **Checks run**, **Artifacts updated**, **What remains**, **Next action**.

## Artifact Updates

Apply `artifacts.md` before stopping when execution changes resumable state.
Update:

- `Work units` status labels
- `Safety net` if assumptions changed
- `Verification`
- `Unknowns to re-check` for concrete follow-up questions
