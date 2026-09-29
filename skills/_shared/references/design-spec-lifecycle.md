# Design Spec Lifecycle

The draft → spec cycle shared by the skills that turn a design conversation into an approved spec. The skill running this cycle is the draft's owner.

## Files

- One working draft, `.cflow/specs/draft.md`, whichever skill owns it: only one design can be in progress at a time.
- On explicit approval of the presented spec, promote the draft by renaming it to `.cflow/specs/<YYYY-MM-DD>-<topic>.md`; a user-stated location overrides this path.
- Before creating the draft, create `.cflow/` if needed and write `.cflow/.gitignore` containing a single `*` line if missing; never edit the repository `.gitignore`.
- Specs are ephemeral by design: a spec serves the implementation and is discarded once the implementation ships. When the user reports it shipped, offer to fold the spec's durable knowledge into project docs via `cf-docs`, then delete the spec file.
- Do not read, create, or update other `.cflow/*` artifacts.

## Resume Check

Before creating the draft, run `ls -a .cflow/specs`: the directory is git-ignored, so search tools such as `rg` skip it. If `.cflow/specs/draft.md` already exists and is not a draft handed to this skill, stop and ask whether to resume it or discard it and start fresh, naming its owner; never overwrite it silently. Resume only a draft this skill owns; on resume, re-read the draft and continue from its oldest open question.

## Draft Format

Create the draft with these sections, then add the sections the owner's spec requires:

```markdown
# .cflow/specs/draft.md

## Subject

- owner: the skill running this cycle
- topic:
- origin: what the user asked for, in their words
- scope decisions: decomposition applied, parts deferred

## Questions

<!-- One line per question. Append new questions as answers raise them; never delete a settled one. -->

- [ ] question:
- [x] settled question:

## Decisions

<!-- One line per settled answer: the question and the chosen answer. Appended in order, never rewritten. -->

- question -> chosen answer
```

## Working the Draft

Long conversations lose early context, so the draft is the memory, not the conversation.

- Seed `Questions` while context is fresh; mark a question settled only when the user answers it, and append new ones as they emerge. An assumption you proceed with stays open, noted as the working default.
- After each settled answer, append one line to `Decisions`: the question and the chosen answer.
- When an answer sends the conversation into a side exploration, the pending question stays open in `Questions`; return to the oldest open question once the side exploration resolves.
- Before proposing approaches and again before promoting the spec, re-read `Decisions` in full and trust it over conversation memory; surface any conflict with a recent answer instead of silently overwriting the recorded decision.

## Handoff

An owner may hand its draft to the skill that finishes it: set `owner` to the receiver, add `- handed off by: <skill>` under `Subject`, and end the turn naming the receiver for the user to invoke; do not open the receiver in the same turn. The receiver resumes a draft it owns that records `handed off by` without asking, keeps every settled decision, and runs review and promotion.

## Review and Promotion

1. **Self-review**: re-read the draft once with fresh eyes and fix inline, without re-reviewing: placeholders or vague requirements, internal contradictions, scope too large for one implementation effort, requirements readable in two ways.
2. **User review**: ask the user to review the draft; apply requested changes and re-run the self-review.
3. **Promotion**: after explicit approval, promote the draft and end the turn. Reply with the spec path and the skill that plans its implementation, for the user to invoke. Do not open that skill or start planning: approving the spec is not a request to plan or implement it.

## Language

Write the draft and the spec in the repository's dominant documentation language; if none exists, use the current conversation language.
