---
name: cf-mr-wolf
description: Clarify ambiguous problem framing before implementation or Cflow assessment. Use for requests to shape goals, success criteria, scope, constraints, risks, options, feature ideas, architecture changes, refactor intent, or implementation direction; skip when the requested edit or bug fix is already clear and bounded.
---
Operate as a lightweight technical framing skill before implementation.
Identify the real problem, calibrate scope to the current request's goal and risk appetite, collect only decision-relevant context, and recommend a credible next step.

Do not implement code changes.

## Artifacts

- Owns `.cflow/mr-wolf-notes.md` when evidence or decisions need to survive handoff.
- May read `.cflow/architecture.md` and `.cflow/trace.md`; never create or update them.
- Never creates `.cflow/refactor-brief.md`; `cf-start` owns that artifact.
- Before creating `.cflow/mr-wolf-notes.md`, create `.cflow/` if needed and add `.cflow/` to `.gitignore`.

## Core Rules

- If no concrete problem is provided, ask exactly one question: what problem should be solved?
- If the request is materially ambiguous, ask one focused question with a recommended default.
- Inspect only the context needed to reduce uncertainty or support the handoff.
- Do not equate "smallest useful" with "lowest churn". Architectural cleanliness is the default for cleanup/refactor framing, even when the current request does not spell it out.
- Do not recommend the easier or lower-impact option when evidence supports a cleaner structural option.
- For architecture or refactor framing, separate target cleanliness from migration safety: the recommended target may be broad while the first execution step remains bounded.
- For architecture or shared-layer framing, make ownership model and organizing axis explicit before naming packaging; define project-specific architectural terms only when relying on them.
- For code questions, use orientation tools before broad file reads: prefer MCP code-intelligence tools, then bundled/custom scripts, then focused system commands.
- Treat orientation-tool output as direction, not truth; verify important conclusions against the relevant source paths.
- Prefer concrete examples or `cf-scenario` when the problem is understandable but still abstract.
- Before a definitive fix recommendation for a behavioral risk, use or recommend `cf-scenario` if a concrete impacted/non-impacted flow has not already been checked.
- Keep static signals, detector output, preferences, and process observations separate from behavioral findings.
- Do not confirm a finding until reachability, counter-evidence, scope fit, and likely fix fit have been checked enough for the decision being made.
- Use agents or packaged reconnaissance only when allowed by the current runtime or explicit authorization; otherwise keep the local pass bounded or ask for authorization when needed.

## Workflow

Read reference files only when their phase becomes active.

1. Frame the request and perimeter. [framing](references/framing.md)
2. Read or update `.cflow/mr-wolf-notes.md` when context, evidence, or a handoff should be retained. [framing](references/framing.md)
3. If the framed request is broad, split it into a small evidence slice map. [decomposition](references/decomposition.md)
4. Gather focused evidence for the active scope or slice. [evidence](references/evidence.md), [dynamic agents](references/dynamic-agents.md)
5. De-risk candidate findings that affect the final answer. [derisk](references/derisk.md)
6. Recommend the most scope-appropriate route or decision. [outcomes](references/outcomes.md)

## Routing

Choose the first route that fits current evidence and uncertainty:

1. `cf-architecture`: repository shape, ownership, entrypoints, or boundaries are unclear enough to block framing.
2. `cf-simplify`: the current request asks whether an area has too many files, unnecessary complexity, overengineering, or whether changing behavior/UX could enable a cleaner simplification.
3. `cf-start`: the next work is multi-step cleanup/refactor, risky, ordered, or should be resumable.
4. `cf-scenario`: one or two concrete code-grounded scenarios would clarify real impact or compare similar flows.
5. `cf-trace`: one concrete workflow/path needs ordered reconstruction for state, failure, resume, or ownership.
6. `cf-split`, `cf-cognitive`, or `cf-cohesion`: one bounded local cleanup action clearly belongs to that skill.
7. Direct bounded handoff or options: the problem is clear enough and no specialized route owns the next step.

## Output

Default to 2-5 short bullets.

For missing problem context, return only:

- **Problem needed**: one sentence.
- **Question**: one focused question.

For options, return:

- **Recommendation**: preferred direction and why.
- **Alternatives**: 1-2 alternatives with trade-offs.
- **Decision needed**: one focused question or confirmation request.

For a completed handoff, keep it compact:

- **Decision**: chosen direction.
- **Scope**: what is in scope and what is not.
- **Evidence**: what was checked, if anything.
- **Confidence**: rough confidence plus the main remaining uncertainty.
- **Next step**: recommended route or action.
