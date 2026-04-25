# Assessment

Do assessment only. Do not implement, move files, or write patches.

## Goal

Decide the right **repository-level intervention frame** using the current architecture map.

You must determine:

- whether intervention is actually justified
- candidate intervention areas worth carrying forward
- which intervention modes are plausible
- whether `.cflow/refactor-brief.md` must be created or refreshed in this pass

## Preflight

1. Require current `.cflow/architecture.md`; if missing, stale, or materially incomplete, stop and route to `cf-architecture-map`.
2. Read architecture plus existing `.cflow/refactor-brief.md`.
3. Re-check the repository and treat it as the source of truth.

## Premise check

Answer these honestly:

1. What concrete problem is this intervention solving now?
2. What is the cost of leaving the current shape as-is for now?
3. Why is the intervention proportionate rather than architecture theater?

For hard restructure also answer:

4. Is repository shape itself the recurring cause of friction?
5. Would a good soft intervention likely remove most of the pain anyway?

## Intervention mode framing

Do not choose the final mode yet, but identify what is plausible:

- soft-split
- soft-consolidate
- soft-mixed
- hard-restructure
- no-structural-refactor

Treat `soft-mixed` as a repository-level outcome only.
Later work units must still choose `split` or `consolidate`.

## Artifact behavior

Do not create or refresh `.cflow/architecture.md` in this phase.
If the map is missing or stale, route to `cf-architecture-map` first.

Update or create `.cflow/refactor-brief.md` when the work is non-trivial, risky, multi-step, or needs resumable handoff state.

If assessment identifies candidate intervention areas worth carrying forward and the brief is missing, create it before returning.

## Output format

Return sections: **Premise check**, **Candidate intervention areas**, **Plausible intervention modes**, **Artifact decision**, **Recommended next action**.

## Anti-goals

- Do not implement.
- Do not dive into work-unit splitting yet.
- Do not rewrite the architecture map from this phase.
