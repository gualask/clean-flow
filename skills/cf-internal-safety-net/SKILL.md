---
name: cf-internal-safety-net
description: Establish a behavior lock before structural changes. Use after the current work unit or cohesive local unit is clear and before bounded structural edits.
---
Use this before a structural move, not before discovery.

## Preflight

- Require current `.cflow/architecture.md`; if missing, stop and route to `cf-architecture-map`.
- Read architecture plus existing `.cflow/refactor-brief.md`.
- Without a brief, continue only with an explicit, local, behavior-preserving scope; otherwise route to `cf-start` or the correct internal skill.
- If a brief exists but the current work unit, cohesive local unit, or refactoring surface is still too unclear to name the behavior to lock, stop and route back to the correct planning or map skill before designing checks.
- Do not invent a broader cleanup direction in this skill.

## Goal

Lock the smallest credible amount of behavior before structural changes.

Use the narrowest believable protection that materially reduces refactor risk.

## Phase 1: identify the refactoring surface

Identify exactly what is about to change:

- current work unit if a brief exists
- cohesive local unit if using the local fast lane
- touched workflow, module, or feature area
- relevant boundaries that could be disturbed
- behavior that must remain stable

If you cannot describe the refactoring surface clearly, route back instead of guessing.

## Phase 2: prefer existing protection first

Use this preference order:

1. existing targeted tests
2. existing broader tests that already lock the relevant behavior
3. targeted characterization tests
4. narrow smoke checks or explicit invariants when automated tests are not practical

Rules:

- Prefer the smallest credible lock.
- Do not broaden into full test design work.
- Characterization tests lock current behavior, not ideal behavior.
- Do not weaken or rewrite tests just to make a refactor pass.
- If the area has no credible lock and cannot be checked reasonably, say so explicitly.
- If remaining gaps make the structural move too risky, return a `no-go` outcome and do not route directly into execution.

## Phase 3: coverage audit

For each part of the refactoring surface, ask:

- What observable behavior is already locked?
- What behavior is still uncovered?
- Is unit-level locking realistic here, or is an integration-level lock safer?
- Which gaps are acceptable for now, and which make the structural move too risky?

## Required output

Return sections: **Refactoring surface**, **Behavior to lock**, **Existing protections**, **Added or recommended protections**, **Remaining gaps**, **Go / no-go and recommended next action**.

## Artifact updates

If `.cflow/refactor-brief.md` is missing and this pass produces resumable safety-net state, create it before returning.

If a brief exists or you create one, update before stopping:

- `Safety net`
- `Verification`
- `Execution state`
- `Handoff notes`

If this changes what is safe to do next, also update:

- `Work units`
- `Unknowns to re-check`
