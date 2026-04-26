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
7. Choose the relevant evidence channels: MCP resources/tools, relevant skills, system commands, and deterministic `/tmp` scripts; use the high-value channels that apply and record why skipped channels are not applicable.
8. Record only evidence-producing tools in `evidence tools used`; do not list note-writing/editing tools as evidence.
9. For repo-wide or multi-candidate work, run broad inventory, narrowing pass, and false-positive check before calling the context sufficient.
10. Inspect only the selected evidence, then separate signal from noise and update the notes.
11. Assign an investigation confidence percentage and record the basis.
12. Recap whether the context is sufficient to continue; `sufficient` requires at least 80% confidence unless the user explicitly accepts the risk, and repo-wide or multi-candidate work stays below 80% if deterministic inventory, focused verification, false-positive checks, or evidence-channel decisions are missing.
13. If context is insufficient, ask one focused question or inspect the next smallest justified slice.
14. If the evidence points to cleanup/refactor candidates, stop at evidence-backed handoff and recommend `cf-start` instead of jumping directly to execution skills.
15. If the evidence points to an unclear multi-step path, ordering risk, state gap, or workflow flaw but not yet to a specific refactor, recommend `cf-trace`.
16. Once clear enough, recommend a direction or present 2-3 options with trade-offs.
17. Return a concise implementation handoff in chat.
18. For Cflow cleanup/refactor work, ask whether to preserve the discovery through `.cflow/refactor-brief.md` and continue with `cf-start`; do not create that brief directly from `cf-mr-wolf`.

## Contracts

| Situation | Required behavior | May edit code |
| --- | --- | --- |
| invoked without a problem | ask what problem must be solved before inspecting repository context | no |
| invoked with a problem | read or create `.cflow/mr-wolf-notes.md`, then reuse or reset it based on relevance | no |
| ambiguous problem | inspect only the smallest relevant context slice, recap sufficiency, ask one focused question if needed | no |
| many deterministic inputs | use commands or temporary `/tmp` scripts for mechanical analysis, then interpret the compact output | no |
| repo-wide or multi-candidate discovery | run broad inventory, narrowing pass, false-positive check, and record confidence before declaring sufficiency | no |
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
- It does not declare discovery sufficient below 80% confidence unless the user accepts the risk.
- It narrows repo-wide investigations through broad inventory, candidate verification, and false-positive checks.
- It keeps `.cflow/mr-wolf-notes.md` as compact investigation notes, not an execution plan.
- It records `confirmed candidates`, `candidates to verify`, and `excluded false positives`, not exhaustive rejected lists.
- It states what context was excluded as noise and why.
- It hands multi-file cleanup/refactor discovery to `cf-start` rather than starting execution skills directly.
- It does not create large specs for small tasks.
- It does not create or update `.cflow/architecture.md` or `.cflow/refactor-brief.md`.
- `cf-start` remains the controller for Cflow assessment, planning, execution, review, verification, feedback intake, and resume.
