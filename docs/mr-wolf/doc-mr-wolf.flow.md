# cf-mr-wolf Flow

## Purpose

Document the runtime flow for `cf-mr-wolf`, the public entrypoint for clarifying unclear problems, feature ideas, refactors, architecture changes, and implementation tasks before execution.

## Runtime Inputs

- Public skill: `skills/cf-mr-wolf/SKILL.md`
- Current conversation and user request
- Focused repository context selected from the problem frame
- Notes artifact: `.cflow/mr-wolf-notes.md`, created from `skills/cf-mr-wolf/assets/mr-wolf-notes.template.md`

## Flow

1. Trigger `cf-mr-wolf` directly, or route from `cf-start` when the upstream problem is too unclear for Cflow assessment.
2. If no concrete problem or task is present, ask exactly one question: what problem should be solved.
3. If a problem exists, read `.cflow/mr-wolf-notes.md` when present, or create it from the template when missing.
4. Decide whether existing notes are relevant to the current request and repository state; reuse relevant notes or overwrite stale/unrelated notes.
5. Frame the apparent goal, uncertainty, likely scope, and success criteria.
6. Choose the smallest context slice that can confirm or reject the frame.
7. Use available MCP resources, relevant skills, system commands, or deterministic `/tmp` scripts when they can gather evidence more reliably than model-only analysis.
8. Inspect only the selected evidence, then separate signal from noise and update the notes.
9. Recap whether the context is sufficient to continue.
10. If context is insufficient, ask one focused question or inspect the next smallest justified slice.
11. If the evidence points to cleanup/refactor candidates, stop at evidence-backed handoff and recommend `cf-start` instead of jumping directly to execution skills.
12. Once clear enough, recommend a direction or present 2-3 options with trade-offs.
13. Return a concise implementation handoff in chat.
14. For Cflow cleanup/refactor work, ask whether to preserve the discovery through `.cflow/refactor-brief.md` and continue with `cf-start`; do not create that brief directly from `cf-mr-wolf`.

## Contracts

| Situation | Required behavior | May edit code |
| --- | --- | --- |
| invoked without a problem | ask what problem must be solved before inspecting repository context | no |
| invoked with a problem | read or create `.cflow/mr-wolf-notes.md`, then reuse or reset it based on relevance | no |
| ambiguous problem | inspect only the smallest relevant context slice, recap sufficiency, ask one focused question if needed | no |
| many deterministic inputs | use tools or temporary `/tmp` scripts for mechanical analysis, then interpret the compact output | no |
| cleanup/refactor candidate list | summarize evidence and hand off to `cf-start`; do not route straight to `cf-file-split` or `cf-cognitive` unless the user requested one explicit local action | no |
| clear enough for options | present recommended direction first, with only real alternatives and trade-offs | no |
| false positives | record only important excluded false positives, not every non-candidate file | no |
| explicit skip | note the biggest missing requirement or risk briefly, then hand off or proceed as authorized | only after handoff |
| routed from `cf-start` | clarify upstream problem and return a handoff; keep notes current but do not write `.cflow/architecture.md` or `.cflow/refactor-brief.md` | no |

## Review Checks

- The skill is a pragmatic problem fixer, not a generic planning worksheet.
- It asks for the problem first when invoked without instructions.
- It narrows context before reading, and avoids whole-repository scans by default.
- It uses available tools and deterministic temporary scripts instead of making the model do mechanical analysis.
- It keeps `.cflow/mr-wolf-notes.md` as compact investigation notes, not an execution plan.
- It records `confirmed candidates`, `candidates to verify`, and `excluded false positives`, not exhaustive rejected lists.
- It states what context was excluded as noise and why.
- It hands multi-file cleanup/refactor discovery to `cf-start` rather than starting execution skills directly.
- It does not create large specs for small tasks.
- It does not create or update `.cflow/architecture.md` or `.cflow/refactor-brief.md`.
- `cf-start` remains the controller for Cflow assessment, planning, execution, review, verification, feedback intake, and resume.
