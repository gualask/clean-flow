---
name: cf-mr-wolf
description: Solve unclear problems before execution. Use when the user wants to clarify, frame, de-risk, design, or turn an ambiguous task, feature, refactor, architecture change, product idea, or implementation request into a minimal actionable handoff. If invoked without a concrete problem, first ask what problem must be solved. Do not use for trivial mechanical edits, direct bug fixes with clear requirements, or when the user explicitly asks to skip planning.
---
Operate as a focused fixer before implementation: identify the real problem, isolate noise, collect only the context needed, decide whether the context is sufficient, and produce a short handoff.
Do not roleplay, quote, or imitate a fictional character. Keep the tone direct, calm, and operational.

When `cf-start` routes here, treat this as upstream clarification before Cflow assessment or execution.
Do not create or update `.cflow/architecture.md` or `.cflow/refactor-brief.md` here.
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
Format notes for later machine reading: use one finding or candidate per bullet, and do not pack multiple candidates into one long line.
In `evidence tools used`, list only tools and scripts that produced evidence; do not include tools used only to create or update `.cflow/mr-wolf-notes.md`.
Use `Findings` as:

- `confirmed candidates`: evidenced candidates worth carrying forward
- `candidates to verify`: plausible candidates that still need focused checks
- `excluded false positives`: only important false positives that looked relevant but were excluded as noise

Do not list every non-candidate file.
Do not add handoff, next skill, or workflow-decision sections to the notes file.

## Entry Behavior

If the invocation is empty, generic, or only invokes the skill by name, do not inspect the repository yet.
Ask exactly one question: what problem should be solved?

If the user explicitly asks to skip planning, call out the biggest missing requirement or risk in one short note and stop.
Otherwise enter the operating loop.
Do not implement during clarification.

## Operating Loop

Do not implement while the problem is still ambiguous.
Run a small loop until the problem is clear enough to hand off:

1. Problem-framing pass: state the current frame in one or two sentences, including the problem, success criteria, constraints, explicit non-goals, and smallest useful context slice.
2. Context check: inspect only that slice, separate signal from noise, and expand only when more context can change scope, risk, validation, or the handoff.
3. Bounded analysis pass: once the frame or candidate area is clear, use evidence channels that can test the frame and improve the handoff.
4. Sufficiency check: assign an investigation confidence percentage, record the basis in `.cflow/mr-wolf-notes.md`, and ask one focused question only when the next step depends on it.

Scoping questions are part of problem framing.
Ask exactly one focused scoping question before broad inventory when a clear goal still leaves a large work area and the answer can reduce candidate areas, priority, success criteria, constraints, or validation.
Skip it when the target is already bounded, a cheap narrow pass can identify the slice, or the user explicitly asks to proceed despite the broad scope.

Treat context as noise when it cannot affect problem definition, success criteria, scope, constraints, risk, validation, or implementation handoff.
Do not do whole-repository reconnaissance unless the problem is repo-wide or the first narrow pass proves the scope is broader than expected.

For code repositories, derive the context slice from the problem:

- documentation restructure: docs, README, install guides, docs tests, and doc references
- public API change: exported types, entrypoints, tests, and caller examples
- refactor request: touched subsystem, call sites, tests, and architecture artifacts if relevant
- bug with clear area: failing path, relevant tests, logs, and local implementation only

## Evidence Channels

Use available tools for evidence instead of doing mechanical analysis in the model.
Before declaring context sufficient, record the evidence channels used for bounded analysis in `.cflow/mr-wolf-notes.md`; if an important non-specialist high-value channel is skipped, record why.

High-value channels are:

- MCP resources or tools for external systems, repository metadata, tickets, docs, or structured sources
- system commands such as `rg`, test runners, package scripts, language tools, and format or schema checks in read-only or diagnostic mode
- bundled `../_shared/scripts/repo-tree.mjs`; run it with `--help` first when a gitignore-aware repository tree may reduce broad context before selecting files
- temporary `/tmp` scripts for mechanical work across many inputs
- specialist skills that clearly match the bounded problem, such as UI review for a UI critique or API design review for an API shape problem

Use specialist skills only after the problem frame or candidate area is bounded.
Before declaring context sufficient in the bounded analysis pass, check the currently available skill names and descriptions; when one clearly matches, apply its `SKILL.md` and directly linked references as a review lens over the selected context slice or a narrower one.
Record only specialist skills actually used, with the reason.
Specialist evidence informs the handoff; it must not implement changes, expand the investigation into a broad audit, or replace direct repository evidence.

When MCP tools are available and the question depends on code structure, symbols, semantic relationships, repository metadata, tickets, or docs, use a relevant MCP tool unless a narrower non-MCP source is clearly enough; record the reason when MCP is skipped.

For repo-wide, many-input, or multi-candidate analysis, use deterministic commands or a temporary script unless a single standard command already produces the needed fact.
Use temporary scripts only for mechanical evidence:

- parse, count, index, diff, group, normalize, extract metadata, or check consistency
- choose Python or Node.js by project convention
- write scripts under `/tmp`
- print compact facts or summaries
- do not make product, architecture, or prioritization judgments

## Sufficiency Gate

Use `sufficient` only at 80% confidence or higher.
The percentage estimates confidence that the problem frame and candidate set are good enough for the next decision, not confidence that an implementation will succeed.

For repo-wide, multi-file, or multi-candidate investigations, keep confidence below 80% unless the evidence includes:

- broad inventory from commands or a temporary script to find likely search space and obvious noise
- narrowing pass with focused verification of the strongest candidates or representative clusters
- false-positive checks for important exclusions that looked relevant at first
- notes for used evidence channels, important skipped non-specialist high-value channels, and only specialist skills actually used

Below 80%, continue the operating loop or ask one focused question.
If a user asks to proceed below 80%, state the remaining uncertainty in the handoff.

## Cflow Handoff Boundary

When the evidence points to behavior-preserving cleanup, refactor, file splitting, cognitive cleanup, or multiple candidate files, do not jump directly into execution skills such as `cf-file-split` or `cf-cognitive`.

Stop at an evidence-backed handoff:

- summarize the problem frame
- list the evidence gathered and evidence-producing tools used
- name candidate areas or files with short rationale
- separate confirmed candidates from uncertain ones
- include the investigation confidence percentage
- recommend whether `cf-start` should own the next work

If the work is multi-file, ordered, risky, or resumable, ask whether to preserve the discovery in `.cflow/refactor-brief.md` and continue through `cf-start`.
`cf-start` owns that brief, work-unit planning, safety net, execution, review, verification, and resume.
When handing off, say that `cf-start` should read `.cflow/mr-wolf-notes.md` as discovery input; do not imply that `.cflow/refactor-brief.md` will be written here.

Use `cf-file-split` or `cf-cognitive` directly only when the user asks for one explicit local file-level action and no broader Cflow planning or resume state is needed.
When the evidence points to an unclear multi-step path, ordering risk, state gap, or workflow flaw but not yet to a specific refactor, recommend `cf-trace`.

## Decision and Options

When enough context exists, propose the smallest useful decision.
If multiple credible directions remain, present 2-3 real options:

- recommendation first
- when each option fits
- trade-offs
- risks
- expected effort

Do not fake balance.

For a completed handoff, make `Next step` a short recommendation with a reason, and name a specialized available skill when it clearly owns the best follow-up.

## Output Format

For invocation without a problem, return only:

- **Problem needed**: one sentence.
- **Question**: exactly one focused question asking what problem must be solved.

For an active context loop, return only:

- **Problem frame**: current understanding and uncertainty.
- **Context checked**: focused sources inspected, or `none yet`.
- **Signal**: what matters.
- **Noise excluded**: what was intentionally not inspected and why.
- **Confidence**: percentage plus basis.
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
- **Confidence**: percentage plus remaining uncertainty, if any.
- **Notes**: `.cflow/mr-wolf-notes.md` updated, reset, or not used because no problem was provided.
- **Next step**: short recommendation plus why, naming a specialized available skill when it is the best follow-up.

## Anti-patterns

Avoid:

- treating every idea as a feature request
- proposing unrelated refactors
- adding architecture that the problem does not justify
- inventing requirements to make the solution more impressive
- hiding uncertainty
