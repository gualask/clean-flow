---
name: cf-mr-wolf
description: Solve unclear problems before execution. Use when the user wants to clarify, frame, de-risk, design, or turn an ambiguous task, feature, refactor, architecture change, product idea, or implementation request into a minimal actionable handoff. If invoked without a concrete problem, first ask what problem must be solved. Do not use for trivial mechanical edits, direct bug fixes with clear requirements, or when the user explicitly asks to skip planning.
---
Use this skill as a focused fixer before implementation: identify the real problem, isolate noise, collect only the context needed, decide whether the context is sufficient, and produce a short handoff.
Do not roleplay, quote, or imitate a fictional character. Keep the tone direct, calm, and operational.

When `cf-start` routes here, treat this as upstream clarification before Cflow assessment or execution.
Do not create or update `.cflow/architecture.md` or `.cflow/refactor-brief.md` from this skill.
If Cflow persistence is needed, return a handoff that `cf-start` can use.

## Notes File

Use `.cflow/mr-wolf-notes.md` as the investigation notes file.
Create it from `assets/mr-wolf-notes.template.md` when it is missing.
Create `.cflow/` first if needed.

At the start of every invocation with a concrete problem:

1. Read `.cflow/mr-wolf-notes.md` if it exists.
2. Decide whether the notes are relevant to the current request and repository state.
3. Reuse and update relevant notes.
4. Overwrite stale or unrelated notes with a fresh investigation from the template.

The notes file is a compact source of truth for discovery evidence, not an execution plan or refactor backlog.
Use `Findings` as:

- `confirmed candidates`: evidenced candidates worth carrying forward
- `candidates to verify`: plausible candidates that still need focused checks
- `excluded false positives`: only important false positives that looked relevant but were excluded as noise

Do not list every non-candidate file.
Do not add handoff, next skill, or workflow-decision sections to the notes file.

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

## Evidence Gathering

Use the available tools to gather evidence instead of doing mechanical analysis in the model.

Prefer, when relevant:

- MCP resources or tools for external systems, repository metadata, tickets, docs, or structured sources
- other installed skills when one clearly owns a bounded subtask or follow-up path
- system commands such as `rg`, test runners, package scripts, language tools, and format or schema checkers in read-only or diagnostic mode
- temporary scripts in the system temp directory for deterministic analysis across many inputs

Use temporary scripts only for mechanical work such as parsing, counting, indexing, diffing, grouping, normalizing, extracting metadata, or checking consistency.
Choose Python or Node.js based on the task and available project conventions.
Write these scripts under `/tmp`, keep them disposable, and have them print compact facts or summaries.

Do not use temporary scripts to make product, architecture, or prioritization judgments.
Scripts should produce evidence; the skill still owns interpretation, trade-offs, and the final handoff.

## Cflow Handoff Boundary

When the evidence points to behavior-preserving cleanup, refactor, file splitting, cognitive cleanup, or multiple candidate files, do not jump directly into execution skills such as `cf-file-split` or `cf-cognitive`.

Stop at an evidence-backed handoff:

- summarize the problem frame
- list the evidence gathered and the tools used
- name candidate areas or files with short rationale
- separate confirmed candidates from uncertain ones
- recommend whether the work should enter `cf-start`

If the work is multi-file, ordered, risky, or resumable, ask whether to preserve the discovery in `.cflow/refactor-brief.md` and continue through `cf-start`.
`cf-start` owns that brief, work-unit planning, safety net, execution, review, verification, and resume.

Use `cf-file-split` or `cf-cognitive` directly only when the user asks for one explicit local file-level action and no broader Cflow planning or resume state is needed.

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
- **Notes**: `.cflow/mr-wolf-notes.md` updated, reset, or not used because no problem was provided.
- **Next step**: immediate implementation step, or `cf-start` handoff when the work is Cflow cleanup/refactor.

## Anti-patterns

Avoid:

- treating every idea as a feature request
- proposing unrelated refactors
- adding architecture that the problem does not justify
- inventing requirements to make the solution more impressive
- hiding uncertainty
