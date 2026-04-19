---
name: cf-start
description: Main entrypoint for Cflow. Use to start or resume most cleanup and refactor work. Analyze the repository, read or create architecture.md, stop only for material user alignment when needed, and otherwise continue as far as safely possible.
---

This is the normal entrypoint for the pack.

Do not behave like a router that only suggests another skill.
Advance the workflow yourself whenever the direction is clear.

## Goal

Drive the work through:

- **Phase A — analysis and definition**
- **Phase B — execution**

Stop only when one of these is true:

- a material cleanup decision needs user input
- the user explicitly asked for analysis only
- the user's intent after Phase A is still unclear
- the next structural step would be unsafe without a stronger behavior lock

## Language rules

- Use the user's language for conversational output.
- Use the repository's dominant documentation language for `architecture.md` and `refactor-brief.md`.
- If the repository has no dominant documentation language, use the user's language for those artifacts too.

## Preflight

1. Read `AGENTS.md`.
2. Read `architecture.md` if it exists.
3. Read `refactor-brief.md` if it exists.
4. Re-check the repository state.
5. Treat the repository as the source of truth.

## Intent inference

Infer the current intent from the user's prompt.

Use these modes:

- **analyze-only**
- **analyze-and-decide**
- **analyze-and-execute-first-unit**

Heuristics:

- If the user explicitly says analyze, map, assess, compare, or decide -> use `analyze-only` or `analyze-and-decide`.
- If the user explicitly says proceed, refactor, clean up, implement, or execute -> use `analyze-and-execute-first-unit`.
- If the prompt is ambiguous:
  - for a non-trivial repository or scope, default to `analyze-and-decide`
  - for a tiny explicit local scope, default to `analyze-and-execute-first-unit`

If the intent remains unclear after Phase A, ask once whether to stop at artifacts or continue into the first bounded work unit.

## Phase A responsibilities

Internally perform the work of discovery.

Determine:

- repository context
- domain gravity
- external boundaries
- current boundary model
- current packaging model
- architecture fit
- premise check
- main pressure points at a repo level
- whether the right path is soft or hard
- whether a brief is needed
- whether user brainstorming is needed

Rules:

- Keep discovery repo-level.
- Do not dive into work-unit detail yet unless the first work unit is already obvious and bounded.
- Update or create `architecture.md` whenever it is missing, stale, or materially incomplete.
- For non-trivial work, create or refresh `refactor-brief.md`.
- Prefer soft cleanup by default.
- Recommend hard refactor only when the repository shape itself is the recurring cause of friction.

## Brainstorming gate

If a material decision is still open after discovery:

- switch into a lightweight brainstorming mode
- ask one focused question at a time
- offer at most two concrete options with trade-offs and a recommendation
- stop there and wait for the answer

Only ask when the answer would materially change:

- soft vs hard
- scope boundaries
- architectural direction
- migration appetite
- non-goals or invariants

Do not ask what can already be inferred from the repository.

## Phase B responsibilities

If the direction is clear and the current intent allows execution, continue into the first bounded work unit.

For a **soft** path:

1. map the current work unit
2. establish the smallest credible safety net
3. apply the bounded structural cleanup
4. simplify locally only if that still improves the touched area
5. review
6. verify

For a **hard** path:

1. define the target direction
2. break the work into bounded migration units
3. execute only the first bounded unit unless the user explicitly asked for a broader pass

## Execution limits

- Do not execute more than one bounded work unit per invocation unless the user explicitly asked for a broader pass.
- Stay within the current local pressure seam.
- Do not silently widen from soft to hard.
- Do not silently fold unrelated bug fixes into a structural refactor.

## Output rules

When you stop after Phase A, provide:

1. **Phase A summary**
2. **Artifacts updated**
3. **Recommended path**
4. **Why you are stopping**
5. **Next action**

When you complete one bounded work unit, provide:

1. **Phase A summary**
2. **Bounded work unit executed**
3. **Checks run**
4. **Artifacts updated**
5. **What remains**
6. **Next action**

When you stop for user alignment, end with exactly one focused question.

## Artifact update requirements

If `architecture.md` exists or is created, update it when repository understanding or guidance materially changed.

If `refactor-brief.md` exists or is created, update at least:

- `Context`
- `Premise check`
- `Mode`
- `Alignment notes`
- `Current pressure`
- `Constraints`
- `Execution state`
- `Handoff notes`

Update these too when they changed:

- `Target direction`
- `Work units`
- `Safety net`
- `Verification`
- `Review notes`
- `Unknowns to re-check`

Do not wait for the user to ask you to update the artifacts.
