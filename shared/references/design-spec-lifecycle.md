# Design Spec Lifecycle

The draft → spec cycle shared by the skills that turn a design conversation into an approved spec. The skill running this cycle is the draft's owner.

## Files

- One working draft, `.cflow/specs/draft.md`, whichever skill owns it: only one design can be in progress at a time.
- On explicit approval of the draft, promote it by renaming it to `.cflow/specs/<YYYY-MM-DD>-<topic>.md`; a user-stated location overrides this path.
- Before creating the draft, create `.cflow/` if needed and write `.cflow/.gitignore` containing a single `*` line if missing; never edit the repository `.gitignore`.
- Specs are ephemeral by design: a spec serves the implementation and is discarded once the implementation ships. When the user reports it shipped, offer to fold the spec's durable knowledge into project docs via `cf-docs`; delete the spec file once the docs are updated or the user declines the offer.
- Do not read, create, or update other `.cflow/*` artifacts.

## Resume Check

Run it first, before anything else in the cycle: `ls -a .cflow/specs`; the directory is git-ignored, so search tools such as `rg` skip it. Resume only a draft this skill owns; on resume, re-read the draft and continue from its oldest open question.

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

## Writing the Draft

Write the draft once the design is settled, not while the conversation runs, from the conversation:

- `Questions`: every decision-relevant question raised; settled only when the user answered it. An assumption you proceeded with stays open, noted as the working default.
- `Decisions`: one line per settled answer, the question and the chosen answer, in the order given.

Once the draft exists, append later answers to `Decisions` and never rewrite a recorded one. Before promoting, re-read `Decisions` in full and surface any conflict with a recent answer instead of silently overwriting the recorded decision.

## Handoff

An owner may hand its draft to the skill that finishes it: set `owner` to the receiver, add `- handed off by: <skill>` under `Subject`, and end the turn naming the receiver for the user to invoke; do not open the receiver in the same turn. The receiver resumes a draft it owns that records `handed off by` without asking, keeps every decision, and runs review and promotion.

## Review and Promotion

1. **Self-review**: re-read the draft once with fresh eyes and fix inline, without re-reviewing: placeholders or vague requirements, internal contradictions, scope too large for one implementation effort, requirements readable in two ways.
2. **User review**: ask the user to review the draft; apply requested changes and re-run the self-review.
3. **Promotion**: after explicit approval, promote the draft and end the turn with the spec path. Do not start implementing: approving the spec is not a request to implement it.

## Language

Write the draft and the spec in the repository's dominant documentation language; if none exists, use the current conversation language.
