# cf-mr-wolf Outcomes

Produce the smallest useful result.
Do not turn framing into an implementation plan.

## Handoff

When evidence points to cleanup, refactor, splitting, cognitive cleanup, cohesion work, or multiple candidate files, stop at a compact handoff:

- problem frame
- scope and non-goals
- evidence checked
- confirmed, uncertain, reduced, or excluded findings when relevant
- recommended next skill or decision
- confidence and remaining uncertainty

Use `cf-start` for multi-file, ordered, risky, or resumable work.
Say that `cf-start` should read `.cflow/mr-wolf-notes.md` when notes were updated.
Do not imply `.cflow/refactor-brief.md` was written here.

Use direct execution skills only when the current request is one explicit local action and no broader planning or resume state is needed.

Before recommending a fix for a confirmed behavioral risk, ensure the handoff includes a concrete scenario check:

- use `cf-scenario` when the answer should explain impact now
- recommend `cf-scenario` as the next check when the current pass has not verified impacted and non-impacted flows
- skip only when the scenario is already evident from the checked code path, and say why briefly

## Options

When multiple credible directions remain, present 2-3 real options:

- recommendation first
- when each option fits
- trade-offs and risks
- expected effort, if useful

Do not fake balance.
Name a specialized skill only when it clearly owns the next step.
