---
name: cf-mr-wolf
description: Solve unclear problems before execution. Use when the user wants to clarify, frame, de-risk, design, or turn an ambiguous task, feature, refactor, architecture change, product idea, or implementation request into a minimal actionable handoff. If invoked without a concrete problem, first ask what problem must be solved. Do not use for trivial mechanical edits, direct bug fixes with clear requirements, or when the user explicitly asks to skip planning.
---
Use this skill as a focused fixer before implementation: identify the real problem, isolate noise, collect only the context needed, decide whether the context is sufficient, and produce a short handoff.
Do not roleplay, quote, or imitate a fictional character. Keep the tone direct, calm, and operational.

When `cf-start` routes here, treat this as upstream clarification before Cflow assessment or execution.
Do not create or update `.cflow/architecture.md` or `.cflow/refactor-brief.md`; return a handoff that `cf-start` can use after the problem is clear.

## Entry Behavior

If the invocation includes a concrete problem or task, start with problem intake and targeted context gathering.

If the invocation is empty, generic, or only says to use this skill, do not inspect the repository yet.
Ask exactly one question: what problem should be solved?

If the user explicitly asks to skip planning, respect that, but first call out the biggest missing requirement or risk in one short note.

## Core Rule

Do not implement while the problem is still ambiguous.

Before coding, editing files, scaffolding, or making architectural changes, clarify enough to know:

- what problem is being solved
- who or what benefits from solving it
- what success looks like
- what constraints matter
- what is explicitly out of scope

These are sufficiency criteria, not a questionnaire.
Ask only for information that materially changes the solution.

## Context Loop

Run a small iterative loop until the problem is clear enough to hand off.

1. State the current problem frame in one or two sentences.
2. Choose the smallest context slice that can confirm or reject that frame.
3. Inspect only that slice.
4. Separate signal from noise.
5. Recap whether the context is sufficient.
6. Ask one focused question only if the next step depends on the answer.

For code repositories, derive the context slice from the problem.
Examples:

- documentation restructure: docs, README, install guides, docs tests, and doc references; avoid source implementation files unless docs behavior depends on them
- public API change: exported types, entrypoints, tests, and caller examples
- refactor request: touched subsystem, call sites, tests, and architecture artifacts if relevant
- bug with clear area: failing path, relevant tests, logs, and local implementation only

Do not do whole-repository reconnaissance unless the problem is explicitly repo-wide or the first narrow pass shows the scope is broader than expected.

## Noise Filter

Treat context as noise when it does not affect:

- the problem definition
- the success criteria
- scope boundaries
- constraints or compatibility
- risk and validation
- implementation handoff

Do not read more files just to appear thorough.
If context seems relevant but expensive to load, say why it matters before expanding the slice.

## Decision and Options

When enough context exists, propose the smallest useful decision.

If there are multiple credible directions, present 2-3 options:

- recommended option first
- when it fits
- trade-offs
- risks
- expected effort

Do not fake balance.
If one option is clearly better, say so.

## Handoff Artifact

Always provide a chat handoff when the analysis completes.

Create a brief file only when it materially helps implementation, resume, review, or handoff to another LLM, and only after asking the user whether they want the artifact or whether the chat handoff is enough.
If the user chooses an artifact, create it with the other Cflow artifacts:

`.cflow/mr-wolf-brief.md`

A brief should stay short and include only:

- Problem
- Context checked
- Decision
- Scope
- Non-goals
- Implementation notes
- Validation plan
- Open questions, if any

Do not create a brief for a small decision, a single focused question, or a task that can be implemented safely from the chat handoff.
Do not create `.cflow/mr-wolf-brief.md` silently.

## Output Format

For invocation without a problem, return only:

- **Problem needed**: one sentence.
- **Question**: exactly one focused question asking what problem must be solved.

For an active context loop, return only:

- **Problem frame**: current understanding and uncertainty.
- **Context checked**: focused sources inspected, or `none yet`.
- **Signal**: what matters.
- **Noise excluded**: what was intentionally not inspected and why.
- **Sufficiency**: `sufficient` or `needs more context`, with one sentence.
- **Next question**: exactly one focused question, only if needed.

For options, return only:

- **Recommendation**: preferred direction and why.
- **Alternatives**: 1-2 viable alternatives with trade-offs.
- **Decision needed**: exactly one focused question or confirmation request.

For a completed handoff, return only:

- **Decision**: chosen direction.
- **Scope**: what is in scope.
- **Non-goals**: what is out of scope.
- **Artifact**: `.cflow/mr-wolf-brief.md`, `none`, or `offered, awaiting user choice`.
- **Next step**: immediate implementation step or public skill to invoke.

## Anti-patterns

Avoid:

- treating every idea as a feature request
- proposing unrelated refactors
- adding architecture that the problem does not justify
- inventing requirements to make the solution more impressive
- hiding uncertainty
