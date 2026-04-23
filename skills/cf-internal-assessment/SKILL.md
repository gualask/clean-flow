---
name: cf-internal-assessment
description: Repository-level assessment for Cflow. Evaluate premise check, candidate intervention areas, and plausible intervention modes using existing architecture context, without implementing code.
---
Do assessment only. Do not implement, move files, or write patches.

## Goal

Decide the right **repository-level intervention frame** using the current architecture map.

You must determine:

- whether intervention is actually justified
- candidate intervention areas worth carrying forward
- which intervention modes are plausible
- whether `.cflow/refactor-brief.md` must be created or refreshed in this pass

## Preflight

1. If `.cflow/architecture.md` is missing, stop and route to `cf-architecture-map` first.
2. Read `.cflow/architecture.md`.
3. Read `.cflow/refactor-brief.md` if it exists.
4. Re-check the repository.
5. If current repository state makes `.cflow/architecture.md` stale or materially incomplete for assessment, stop and route to `cf-architecture-map` first.
6. Treat the repository as the source of truth.

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

Do not create or refresh `.cflow/architecture.md` in this skill.
If the map is missing or stale, route to `cf-architecture-map` first.

Update or create `.cflow/refactor-brief.md` when the work is non-trivial, risky, multi-step, or needs resumable handoff state.

If assessment identifies candidate intervention areas worth carrying forward and the brief is missing, create it before returning.

## Output format

Provide exactly these sections:

1. **Premise check**
2. **Candidate intervention areas**
3. **Plausible intervention modes**
4. **Artifact decision**
5. **Recommended next action**

## Anti-goals

- Do not implement.
- Do not dive into work-unit splitting yet.
- Do not rewrite the architecture map from this skill.
