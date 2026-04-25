# Closure

Use this reference for review, verification, and feedback intake after a bounded cleanup or refactor step.

Do not introduce new structural changes here unless the user explicitly asks.

## Shared Preflight

- Require current `.cflow/architecture.md`; if missing, route to `cf-architecture-map`.
- Read architecture plus existing `.cflow/refactor-brief.md`.
- If completed unit, touched area, feedback target, or current path is unclear, return to assessment or resume routing first.
- Re-check the touched area and treat repository state as source of truth.

## Review

Judge whether the refactor improved structure in a proportionate way.

Before judging local readability, read `../../_shared/references/local-readability-review.md`.

Review on these questions:

- Did it reduce the pressure it was meant to reduce?
- Did it keep boundaries and ownership clearer than before?
- Did it avoid fake layers, dead wrappers, cleanup mania, and unnecessary scope growth?
- Is remaining risk structural, or mostly a verification gap?

Recommendation rules:

- If structure is acceptable and only factual closure is missing, move to verification.
- If one more bounded pass is needed, name the exact next phase or step rather than generic more work.
- If the result is proportionate and remaining issues are local or acceptable, recommend stopping structural work for this unit.

## Verification

Collect factual evidence that the touched area still works.

Rules:

- Run the smallest relevant verification available.
- Prefer repository-native commands.
- Use the safety net and planned checks when they exist.
- If the project has no formal checks, use the narrowest credible smoke test or inspection available.
- Never finish without either running at least one factual check or stating exactly why no factual check could be run.

Verification sources:

- targeted tests
- package or module tests
- lint
- typecheck
- build
- smoke commands
- narrow runtime checks
- diff inspection for dangerous drift
- reference audit when names or files moved

If a move, rename, split, merge, or re-export happened, read `../../_shared/references/reference-audit.md` and audit touched names and paths.

## Feedback Intake

Turn feedback into a verified next action instead of a reflex edit.

Rules:

- Restate feedback in repository terms.
- Verify whether code and artifacts support it.
- Place the feedback in exactly one primary assessment bucket before recommending action.
- Ask one focused clarification only when truly needed.
- If accepting or narrowing feedback, name the exact next phase instead of generic follow-up work.

Feedback buckets:

- clearly valid feedback
- valid but lower-priority cleanup feedback
- plausible but unverified feedback
- ambiguous feedback
- style-only feedback that does not justify churn
- feedback that conflicts with repository evidence or agreed constraints

## Artifact Updates

For review, update:

- `Review notes`
- `Execution state`
- `Handoff notes`

If review changes confidence in target direction, also update:

- `Target direction`
- `Unknowns to re-check`
- `Alignment notes`

For verification, update:

- `Verification`
- `Execution state`
- `Handoff notes`

If verification changes confidence in completion, also update:

- `Review notes`

For feedback, update:

- `Review notes`
- `Execution state`
- `Handoff notes`

If feedback changes the plan, also update:

- `Work units`
- `Alignment notes`
- `Unknowns to re-check`

## Output

For review, return what improved, what is still mixed or unclear, over-engineering check, boundary clarity check, fragmentation or indirection check, risk check, and recommended next action.

For verification, return checks attempted, checks passed, checks not run, confidence and remaining risk, and recommended next action.

For feedback, return feedback restatement, repository evidence, assessment, impact on current path or work units, and recommended next action.
