# cf-mr-wolf Flow

## Purpose

Document the runtime flow for `cf-mr-wolf`, the public entrypoint for clarifying unclear problems, feature ideas, refactors, architecture changes, and implementation tasks before execution.

## Runtime Inputs

- Public skill: `skills/cf-mr-wolf/SKILL.md`
- Current conversation and user request
- Focused repository context selected from the problem frame
- Optional target artifact: `.cflow/mr-wolf-brief.md` in the target repository

## Flow

1. Trigger `cf-mr-wolf` directly, or route from `cf-start` when the upstream problem is too unclear for Cflow assessment.
2. If no concrete problem or task is present, ask exactly one question: what problem should be solved.
3. If a problem exists, frame the apparent goal, uncertainty, likely scope, and success criteria.
4. Choose the smallest context slice that can confirm or reject the frame.
5. Inspect only that slice, then separate signal from noise.
6. Recap whether the context is sufficient to continue.
7. If context is insufficient, ask one focused question or inspect the next smallest justified slice.
8. Once clear enough, recommend a direction or present 2-3 options with trade-offs.
9. Return a concise implementation handoff in chat.
10. If a persistent brief would materially help, ask whether the user wants `.cflow/mr-wolf-brief.md` or whether the chat handoff is enough.
11. Create `.cflow/mr-wolf-brief.md` only after the user chooses the artifact.

## Contracts

| Situation | Required behavior | May edit code |
| --- | --- | --- |
| invoked without a problem | ask what problem must be solved before inspecting repository context | no |
| ambiguous problem | inspect only the smallest relevant context slice, recap sufficiency, ask one focused question if needed | no |
| clear enough for options | present recommended direction first, with only real alternatives and trade-offs | no |
| non-trivial handoff | provide chat handoff and ask whether to create `.cflow/mr-wolf-brief.md` when persistence is useful | no |
| explicit skip | note the biggest missing requirement or risk briefly, then hand off or proceed as authorized | only after handoff |
| routed from `cf-start` | clarify upstream problem and return a handoff; do not write `.cflow/*` artifacts | no |

## Review Checks

- The skill is a pragmatic problem fixer, not a generic planning worksheet.
- It asks for the problem first when invoked without instructions.
- It narrows context before reading, and avoids whole-repository scans by default.
- It states what context was excluded as noise and why.
- It does not create large specs for small tasks.
- It creates `.cflow/mr-wolf-brief.md` only after asking the user.
- It does not create or update `.cflow/architecture.md` or `.cflow/refactor-brief.md`.
- `cf-start` remains the controller for Cflow assessment, planning, execution, review, verification, feedback intake, and resume.
