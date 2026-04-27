# Real-Repo Trial Rules

This document is the collaboration protocol for validating Cflow on real target repositories.

It is separate from [maintaining-this-pack.md](/Users/blazar/Dev/clean-flow/docs/maintaining-this-pack.md) because real-repo trials are not just pack maintenance.
They are a joint debugging and validation loop between:

- the user running or observing Cflow on a real repository
- the LLM working on this pack and deciding whether the observed behavior requires a skill change

Use this document when the pack is being exercised on real code and the user reports what actually happened.

## Suggested Local Workspace

Keep local trial notes under `.local-trials/` in this repository.

That directory is meant for:

- per-repository trial logs
- copied output snippets
- local conclusions that are not ready to become pack rules

Do not treat `.local-trials/` as pack documentation.
Promote something from there into committed docs only after it survives trial validation.

## What This Document Is For

Use this protocol to answer questions like:

- did the skill behave correctly on a real repository?
- is the reported problem a real skill problem or a repo-specific edge case?
- does the fix belong in one `SKILL.md`, in a flow doc, in the maintainer rules, or nowhere?
- is the proposed fix a local wording improvement or a contract change?

Do not use this document as the source of truth for skill contracts.
For that, use:

- the relevant per-public-skill flow doc under `docs/<public-skill>/doc-*.flow.md`
- [maintaining-this-pack.md](/Users/blazar/Dev/clean-flow/docs/maintaining-this-pack.md)
- the relevant `skills/*/SKILL.md`

## Trial Model

A real-repo trial is a pair-debugging loop.

The user contributes:

- the real repository context
- the actual prompt or invocation
- the observed behavior
- the mismatch between expected and actual behavior
- any extra repository facts the LLM cannot infer from the pack alone

The LLM contributes:

- contract checking against the current pack
- classification of the observed problem
- verification of whether the report is skill-valid, repo-specific, or inconclusive
- the smallest justified pack change
- the follow-up trial to confirm the fix

Neither side should skip its part.
If the user gives only conclusions with no evidence, the LLM risks overfitting.
If the LLM edits the pack without checking the current contract, the fix risks breaking the flow elsewhere.

## Trial Input Packet

Before suggesting a skill change, collect as much of this packet as possible:

- target repository identity or short description
- user goal in that repository
- exact invocation path:
  - `cf-start`
  - `cf-mr-wolf`
  - `cf-architecture`
  - `cf-trace`
  - `cf-cognitive`
  - `cf-split`
  - `cf-cohesion`
  - `cf-start` phase reached from flow, such as assessment, planning, mapping, execution, closure
- exact user prompt or the closest faithful paraphrase
- whether `.cflow/architecture.md` existed
- whether `.cflow/refactor-brief.md` existed
- relevant `Work units`, `Execution state`, or `Target direction` if a brief existed
- Codex UI trace when available, for example `Explored -> Read SKILL.md (...)`
- what the skill actually did
- what the user expected it to do instead
- concrete output snippets or artifact changes when relevant

If a field is unknown, mark it as unknown rather than guessing.

## Trial Procedure

1. Restate the report in pack terms.
2. Identify the active skill or likely active skill.
3. Check the current contract in:
   - the skill file
   - the relevant per-public-skill flow doc
   - [maintaining-this-pack.md](/Users/blazar/Dev/clean-flow/docs/maintaining-this-pack.md)
4. Separate:
   - observed facts
   - repository-specific inferences
   - suspected pack defects
5. Classify the issue before proposing changes.
6. Propose the smallest justified change.
7. Name the next trial that would confirm or falsify the fix.

Do not jump from "the user disliked the outcome" to "the skill contract is wrong".

## Issue Classification

Classify every reported problem before changing text.

Use one primary label:

- `routing`
- `gate`
- `prerequisite assumption`
- `artifact behavior`
- `analysis depth`
- `execution overreach`
- `output shape`
- `wording ambiguity`
- `contract gap`
- `repo-specific edge case`
- `not a pack issue`

Add a secondary label only when it materially changes the fix.

## Evidence Rules

- Observed behavior beats theory.
- One repository can reveal a real contradiction in the current contract.
- One repository does not automatically justify a general new rule.
- If the report depends on missing context, treat it as inconclusive until that context is supplied.
- When Codex shows `Read SKILL.md (...)` in the UI trace, treat that as evidence that the skill instructions were loaded for that pass. Do not overstate it as proof of a formal handoff model unless the trace shows more than that.
- Prefer exact output, artifact diffs, or precise paraphrases over broad summaries.

## LLM Responsibilities

When the user reports a real-repo trial, the LLM must:

- restate the report in Cflow terms
- verify it against the current skill contract before suggesting edits
- distinguish state problems from wording problems
- distinguish local prompt ambiguity from true skill ambiguity
- say explicitly when a conclusion is inferred rather than observed
- prefer the smallest textual delta that fixes the proven problem
- avoid turning one repo's local preference into a pack-wide rule without evidence

If one focused clarification is truly needed, ask one only.

## User Responsibilities

During real-repo trials, the user should report:

- what was invoked
- what repository state existed at that moment
- what was surprising or wrong
- what outcome would have been correct
- enough repository evidence for the LLM to validate the claim

The user does not need to translate the problem into pack language first.
That translation is the LLM's job.

## Fix Scope Rules

Apply the smallest change that matches the proven problem.

Typical outcomes:

- `No change`: the pack behaved correctly and the issue was expectation mismatch or missing context.
- `Wording change`: the skill behavior is right but the text misleads.
- `Gate change`: the skill proceeds or stops under the wrong conditions.
- `Output change`: the behavior is right but the output contract is too weak or too loose.
- `Artifact change`: the skill updates, assumes, or creates the wrong artifact state.
- `Contract change`: the current pack model itself is wrong and runtime sources plus flow docs must change.

Do not rewrite a full skill when the defect is one sentence.

## Anti-Overfitting Rules

- Do not generalize from one repository unless the current wording is clearly contradictory.
- Check at least one opposite or neighboring scenario before locking in a pack-wide rule.
- Prefer state-based rules over repository-shaped rules.
- If the fix makes one scenario cleaner but weakens the main flow, reject it or narrow it.

## Required Sync After A Confirmed Change

If a real-repo trial changes the actual skill contract, update all relevant sources:

- the affected `skills/*/SKILL.md`
- the affected `docs/<public-skill>/doc-*.flow.md`
- [maintaining-this-pack.md](/Users/blazar/Dev/clean-flow/docs/maintaining-this-pack.md) when maintainer rules changed

If the trial changes only local wording and not the contract, update only the necessary file.

## Recommended Trial Output

After evaluating a reported trial, the LLM should answer using this structure:

1. `Observed behavior`
2. `Current contract check`
3. `Problem classification`
4. `Recommended pack change`
5. `Why this is the smallest valid fix`
6. `Next confirmation trial`

This keeps real-repo trial work reviewable and avoids fuzzy "it felt wrong" edits.
