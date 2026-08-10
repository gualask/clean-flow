# cf-mr-wolf Flow

## Purpose

Maintainer summary for `cf-mr-wolf`. Runtime behavior belongs to `skills/cf-mr-wolf/SKILL.md`; keep this file descriptive, not authoritative.

`cf-mr-wolf` is a gate, not a pipeline. It performs one classification, then hands off, steps aside, or investigates and stops. It carries no runtime references, no workflow phases, no output contracts, and no artifact of its own.

## Runtime Inputs

- Public skill: `skills/cf-mr-wolf/SKILL.md`
- Current conversation and request
- Repository context, on the third branch below only

Nothing else. The classification itself is made from the request text alone; the skill reads the repository only once that classification has sent it to the investigate branch, and it commits to no direction there until the user has answered.

## Classification

The first decision is whether the request names a **decidable target**: a component, flow, contract, mechanism, or file put under decision, together with alternatives that are technical states of that thing.

| Case | Behavior |
| --- | --- |
| Decidable target owned by a specialist | One-line handoff naming the skill and preserving the problem |
| Decidable target no specialist owns | Abstain — answer directly, as if the skill had not been invoked |
| No decidable target | Investigate, report what was found in the user's terms, say it does not know which part matters, ask, and stop |

**Made from the request text alone, before anything is read.** In the version shipped until 2026-08-09 this held as a side effect of a blanket ban on repository inspection; once turn 1 was allowed to read code, the handoff branch investigated instead of routing. It is now stated explicitly and pinned by `test/workflow-skill-contracts.test.mjs`, so do not weaken it while editing the third branch.

Two constraints carry the third branch. It **names no choice and offers no alternatives** — any choice it names is a menu of one, and can only return what it already covers. And it produces no recommendation, plan, or implementation until the user answers.

The skill is also forbidden from reporting a confidence level or judging whether it is sure enough to skip the step. That is deliberate — a self-assessed threshold is satisfied nominally and produces a thorough answer to the wrong question.

There is deliberately **no closing section telling the skill to stand down after the user answers**. Four such lines were deleted on 2026-08-09 after being measured in three places and earning nothing in any of them; the arm committed 6/6 without them.

## Maintainer Notes

- The skill carries **no routing table**. Handoff to a specialist is left to the host, which selects from the installed descriptions. Case 9 measured this directly: with and without an in-body table, all twelve runs opened exactly one specialist `SKILL.md`, and routing was correct **12 of 12 in both arms** once conditioned on the lens the user actually picked. The one apparent divergence sat in the arm that *had* the table, and it was a correct handoff to the skill matching the option that arm had offered.
- Consequently `cf-mr-wolf` enumerates no siblings. It names the owning skill in the handoff line, but it holds no catalogue of its own. If a specialist stops being reached, fix its `description`, not this file.
- `.cflow/refactor-brief.md` remains owned by `cf-start`. `cf-mr-wolf` owns no artifact.
- The skill has no vendored shared files and no entry in `skills/_shared/vendor.json`.
- Keep this doc aligned with runtime files, but do not rely on it at runtime.

## Why the previous flow was removed

The framing, evidence, de-risking, outcome, planning, and evaluation references were removed after the value trial for this skill:

- Across seven cases on `glm-5.2` and two replicated on `gpt-5.6-sol`, the reasoning scaffold never produced a better decision than no skill at all.
- The payload was verified loaded rather than assumed: every skill-bearing run read all eight references, every no-skill run read none. What it bought was measurable in the wrong direction — the skill-bearing arm inspected *less* of the repository than its control in seven of eight pairs. One line of `decomposition.md` forbade agent-based exploration unless the user had authorized it, and the shared prompt never did; on Case 3 that meant 18 files against the control's 76.
- Ten prompt candidates were written and tested against frozen oracles. None was promoted.
- The one measured benefit is the question itself. On Case 8 — an underspecified request answered through a scripted responder — runs that asked scored 4.67/6 against 2.67/6 for runs that did not, with perfect separation, p = 0.0011. No no-skill run asked, in four attempts.

**One quantitative claim is withdrawn and must not be cited from here or from the trial**: "skill-bearing arms score about two points below the no-skill arm, p = 0.053". The no-skill arm moved 1.75 points between sessions under identical conditions, and a retest with the whole pack installed gave +0.33, p = 0.50. The basis for removal is the *absence of an observed benefit* across many underpowered comparisons, plus a certain cost in context and the exploration suppression above — not a measured penalty.

The gate is kept because it produces a behavior the baseline does not. Everything it used to carry is not.

### Removed without evidence either way

Two removals rest on cost and on the gate's shape, not on measurement, and the record should not suggest otherwise:

- `assets/mr-wolf-notes.template.md` — durable cross-session handoff memory. [`trial-method.md`](../skill-value-trials/trial-method.md) rules out a single-run A/B for value that exists across sessions and requires such a claim to be marked untested. It never was tested.
- `references/derisk-agent-brief.md` — delegated counter-evidence. The delegation hypothesis is untested, not refuted: Case 7 could not test it because no arm delegated on that repository.

Both stay removed on cost, and both are recoverable from Git. Neither was measured and found wanting.

**The original rationale no longer holds and is not being reused.** It was *"a gate that restates and stops has no phase in which either could run"* — true of the branch shipped until 2026-08-09, and false of the current one. The third branch now reads the repository before it reports, so it has exactly the phase delegation would occupy, and the report it produces is exactly the kind of material notes would carry. What survives is the narrower argument: neither buys anything inside a single turn that ends in a stop, both cost context in every invocation including the two branches that never investigate, and delegation still has no case that can test it — it needs one whose answer depends on a survey wider than one agent's sequential reading. Treat both as open, not closed.

## Why it names no choice and offers no alternatives

Measured, not preferred. A question can only return what its options already cover, and the scripted-responder cases show the failure directly: in Case 12 the single run that recovered the requirement held only by the user is the one whose options happened to include it, and in Case 13 the run that offered four invented lenses — none of them the user's — scored 2/5 while its siblings scored 5/5. An open report has no span to get wrong.

It also removes a step rather than adding one. An earlier version classified who held the answer, and misrouted defect reports into remedy menus in roughly four cases out of ten across two independent prompts. That classifier is gone.

## Why it investigates before asking

The branch shipped until 2026-08-09 restated the request and stopped, with no repository inspection at all. It was replaced on that date by the current text, which reads the code first and reports what it found before saying it does not know which part matters. Provenance and the reasoning that outlives the wording are kept with the trial record.

Two things it buys, and one it does not. A user who never replies gets the work instead of one line. And the report is what the user corrects, so the conversation starts from evidence rather than from a paraphrase. It bought **nothing measurable** on either frozen bed against the text it replaced: n = 1 per bed against that text's 3, and nothing separated them on outcome. The case for it is the turn-1 product property, not a score.

## Where the gate earns its place

Measured, not assumed. The gate pays off when the current behavior is a **deliberate choice the user disagrees with** — the deciding information is in the user's head, the model cannot derive it, and the unaided guess is confidently wrong. Case 8, twelve runs grouped by behavior rather than by arm: runs that asked scored 4.67/6 against 2.67/6 for runs that did not, p = 0.0011. The two skill-bearing runs that happened not to ask scored exactly like the no-skill arm.

It is neutral when the request has one sensible reading. Case 12 asked 4/4 and every no-skill run reached the same lens unaided; the case is void by its own preregistered rule and shows no effect.

It is not needed when the problem is hard but **well posed**. Case 10: four of four no-skill runs found the defect and the fix shape without any help.

It matters most when a problem is hard **and** ambiguous, the cell Case 10 tried and failed to reach. Two beds fill it, both measured on the shipped text on 2026-08-09 with treatment and control in one batch and one session:

| Bed | Treatment | Control |
| --- | :---: | :---: |
| Case 13 — six independently shipped defects coexist and the user's goal decides which one counts | `T` 3/3 | 0/3 |
| Case 14 — the holdout, built after the text was frozen, on a repository that wrote none of the copy | `R` 3/3 | 0/3 |

p = 0.05 each, the minimum attainable at 3v3, and both discriminators are disjoint rather than graded. The control's failure is not search: on Case 14 a control located a cost no treatment run found, and on Case 13 a control opened the already-recording check itself without noticing what runs before it. Better analysis, of a question the user did not ask.

Earlier rubric figures for Case 13 (4.00 and 4.67 against 0/5, p = 0.012) were read against a superseded endpoint and are **not** comparable to the labels above — see the Case 13 record.

### Where the value comes from, and what that means for editing this skill

Measured 2026-08-09: a control handed the user's deciding sentence *without having asked for it* reaches the same endpoints 6/6, level with the skill. The whole effect therefore sits in eliciting that sentence — the skill asks 12/12 where a bare model asks 1/12 across three repositories, including one it did not write. **So rules about how to handle the user's answer buy nothing and have twice failed to; anything affecting whether it asks carries the entire effect and cannot be edited without re-measuring.**

## The one measured harm, and what defends against it

Anyone editing this skill should know what it costs before touching the text. Same bed as Case 14, same prompt; the only change is the user. Full record in the Case 14 file.

**A user who asserts a cause with certainty gets the remedy they ask for.** Three runs of three: the user says the slowdown happens because indexing is still running and asks for the call to wait for it; the function does not touch the index, and the source says so in a comment every run read. All three accepted the premise, proposed reversing that deliberate design, and dropped every finding their own turn 1 had produced. Two of the three wrote that the bypass was intentional and proposed to reverse it anyway.

Score it as **dropping its own findings and reversing a deliberate design without stating the trade-off**, not as failing to contradict the user: the user's *cause* is defensible and only the *remedy* reverses the design, so an endpoint demanding the run call the premise false asks for something ground truth does not license.

**What defends is `references/pushback.md`**, read on demand at turn 2 — 12 of 12 harm components at baseline against 3 of 12 with it, blind scorer, arms in one batch, and the legitimate correction still reaching its endpoint 3/3. The reason it works and the same text in `SKILL.md` does not is a property of the format, recorded once in `docs/golden-rules.md`: resident text is not re-read in a later turn, and a triggered reference is. Two things remain unproven — the reference did not separate from the resident version at three runs per arm, and the shipped English wording is a rewrite of the text those numbers came from.

Two properties of the harm itself are worth keeping in view. **The control cannot suffer it**: it has no second turn for the claim to enter, so the harm is produced by the mechanism the skill exists for. And **verification switches off rather than degrades** — one reproduction read *zero files* at turn 2 before rewriting its conclusion around the user's premise.

**The opposite user is handled well, and the contrast is the point.** When the user genuinely does not know and can add nothing, the same text commits to neither branch 3/3 — it diagnoses, proposes making the phenomenon measurable, and declines to put the burden back on the user. Commitment tracks what the user actually holds: information delivered → the right branch 3/3; nothing to deliver → no commitment 3/3; never asked → the wrong branch.
