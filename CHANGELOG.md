# Changelog

## 2026-08-20

- Split `_shared/references/dynamic-agents.md` at its reading threshold. It was 2,092 tokens read at step 2 of every `cf-test` and `cf-review` pass, before the policy is known, and the policy is `local` in 18 of the archive's first 18 runs. The Context Gate stays; the seven delegated sections move verbatim into `delegated-execution.md`, opened only when the gate returns something other than `local`. 313 tokens read always, 1,819 when delegating. Cutting 71 words from the same file had already been refused: that arm kept both planted ends and lost a whole redundancy family and two thirds of its recap. Moving the text cost nothing.
- Made the consuming skill the only router. No reference names another reference in either direction, which is how every other reference in this pack is reached — three from `cf-test`, six from `cf-review`, twenty-one from `cf-start`. One sentence in `SKILL.md` proved enough where the first version stated the pointer twice, and the restraint field came back above the unsplit baseline rather than below it.
- Redefined the recap as the pass's outstanding work rather than a report of it: one entry per candidate finding, written as the final output shows it, and the pass is done when no findings remain, whatever headings the file still carries. On `cf-review` the same text turned 407 lines of per-batch ledgers into 33 self-contained entries. On `cf-test` it did not, twice — that skill still groups by action, and its recap has no entries to work through.
- Added a contract for working through a recap one entry at a time: load only the evidence that entry cites, report what it shows, and remove the entry once the user has decided. Measured end to end — the verification step costs 3,058 tokens against the 80,102 of re-reading the corpus, the entry leaves on a rejection as surely as on a confirmation, and a stale recap does not hijack a request for a new review.
- Put all three recap instructions together in each skill's Artifacts section. The first version put the entry line alone above the Flow, where it named no file; the contract it pointed at was never opened, only listed by `rg --files`, and the one rule the model could not improvise — remove the entry once decided — was the one that failed.
- Ran `cf-review` as the skill under test for the first time in this archive, on a real Tauri/React refactor. It found a stale documentation reference that the previous run and the operator's own check had both missed, and reported behavioural contract changes inside a commit labelled a refactor, against the repository's own rule that refactors keep behavior identical.
- Recorded that a source's silence is not evidence, and that `cf-test` may take the existing suite as its scope when the working tree holds no test change.

## 2026-08-16

- Merged `cf-cognitive`'s three flow reference files into `SKILL.md`. Discovery, targeted evaluation and execution now live in its body: 49 lines in one file against 150 across four. On a writable bed the merged text wrote less than the shipped one and produced the only two runs in six that stopped and said what they would touch before editing.
- Dropped the two post-edit conditional routes to `cf-split` and `cf-cohesion`. Routing is stated once, on what the request is, and named again in the result. The vague condition inside a pointer had been measured firing 4 of 9 times on identical input, and no trial ever exercised either clause.
- Cut `_shared/references/local-refactor-rules.md` from 64 lines to 32, which also lightens `cf-start`. Two of its lines were convicted on a bed built for them: removing "do not fix discovered behavior bugs inside a refactor" and "preserve exported APIs, return values, errors, side effects, evaluation order" changed nothing measurable. The rest was standard refactoring knowledge, one rule stated five times, and two blocks duplicating `navigation-cost.md` — including the nesting threshold, identical character for character, in a file whose single source of truth is asserted by a test.
- Added a `Defects` slot to `cf-cognitive`'s output. Given a refactoring request on a function carrying a real defect, the bare model corrected the behaviour in 3 of 3 trial runs while every version of the pack left it intact and said nothing about it in 8 of 8. The slot reports it instead: 2 of 3 with the first wording, 3 of 3 with the shipped one, without ever fixing it.
- Made `none` a claim in that slot rather than a silence. The first wording once filled the field with a bare `none` over a live defect, which asserts more than saying nothing; `none` now names what the code was checked against. On a case with the defect removed the slot stayed quiet in 3 of 3 runs and named the standard every time.

## 2026-08-15

- Moved `cf-scenario` off explanation and onto deciding a named change against the scenarios it touches. Asked what happens, the bare model already named a boundary outside the reported path unprompted in every trial run, so the skill now starts where a change is on the table and its cost elsewhere is unknown.
- Rewrote `cf-mr-wolf`'s description to match the boundary: it owns the shape of a change nobody has decided yet, and stops owning a request that names both its target and the change to make to it. "Show me what happens in this case" now belongs to no skill, deliberately.
- Cut `cf-scenario` from 52 lines to 21. Eight of twelve guardrails and the whole output-style block were removed after they measured level with the full text on every declared field; the impact-boundary line and the behavior-pinning line were then isolated one at a time and neither separated from its absence.
- Kept two guardrails: state what happens to rows that already exist when a change alters stored data, which is the one line measured to pay for itself, and the `cf-review` handoff contract.
- Removed the behavior-pinning line from `cf-mr-wolf` as well, on the same measurement.
- Added a third golden rule to the trial method: an endpoint settled by a fact in the source is read against a written criterion in the open, and only an endpoint that ranks the arms against each other is blinded.
- Added `docs/skill-value-trials/aiming-errors.md` for the failures where the instrument was sound and the trial was pointed at the wrong question.
- Recorded the pack-wide description budget in the authoring rules: the host's initial skills list is capped near 8,000 characters and truncates on overflow.

## 2026-08-14

- Removed `cf-simplify` and its flow document. Repeated trials showed it changed how the answer was formatted without changing what the answer found, and in places it narrowed what the bare model would have done.
- Rerouted what pointed at it: `cf-review`'s incomplete-change lens, `cf-start`'s handoff, and `cf-brainstorm`'s value-judgment boundary now name `cf-mr-wolf`.
- Deleted `references/parallel-flows.md`, its only reference with no other consumer. The shared references it vendored stay, since other skills load them.

## 2026-08-10

- Reduced `cf-mr-wolf` to a two-chapter gate routed by one question: does the request name a decidable target? Answer or hand off if it does, investigate and stop if it does not.
- Removed the nine-reference reasoning scaffold, the notes artifact, and the de-risk agent. One triggered reference remains, `references/pushback.md`, read when the user comes back with a cause or a change.
- Rewrote the descriptions of `cf-mr-wolf`, `cf-brainstorm`, `cf-scenario`, `cf-start`, and `cf-todo` to state their own boundaries instead of naming a sibling skill.

## 2026-08-08

- Fixed Codex skill installation to use `.agents`, made `--friction` declarative so omission disables it, kept delegated review agents running unless the user explicitly requests interruption, and made review ownership detect derived values defined outside their authoritative single source of truth.

## 2026-07-27

- Fixed skill discovery boundaries: `cf-docs` now triggers for every Markdown write, `cf-simplify` stays within software implementation, and `cf-cohesion` excludes non-code content.

## 2026-07-26

- Added `cf-review` for uncommitted work or a named history range. It runs eleven lenses across structure, conventions, behavior, documentation, and authoritative business requirements.
- Reviews select whole files, report evidenced candidates, separate severity from when a violation was introduced, and exclude findings whose remedy cannot converge on a nameable unit.
- Review output accounts for every lens, stays read-only, and routes findings only after collection. Reference audit and handoff contracts load only when their conditions apply.
- `cf-mr-wolf` can route a bounded change-set review directly to `cf-review`; business-alignment candidates route to `cf-scenario`.
- Finding contracts now consistently require claim, evidence, severity, impact, confidence, route, and status.
- Navigation-cost, cohesion, split, and cognitive flows now preserve complete deferred findings and audit affected consumers without widening the authorized change.

## 2026-07-25

- Replaced the packaged de-risk agent with a host-provided read-only agent prompt; install and remove now only prune legacy marked agents.
- De-risk agents return evidence states while `cf-mr-wolf` retains final classification.
- Scoped repository-wide orientation in `cf-start` to fresh or materially re-scoped work.
- Clarified `cf-todo` rollover behavior and limited `cf-docs`/`cf-todo` triggering to requests that change their owned files.
- Added deferred hard-trigger findings to `cf-simplify` and enforced `.cflow` artifact ownership.
- Removed `cf-architecture` and `cf-trace`; existing entrypoints now orient and reconstruct relevant paths directly.

## 2026-07-17

- Updated tooling and token reporting for the GPT-5.6 model family.
- Centralized navigation-cost hard-trigger thresholds and limited `cf-cognitive` → `cf-split` routing to remaining file-level pressure.
- Added validated per-flow context stacks, transitive runtime inventories, and same-thread handoff estimates to token reporting.

## 2026-07-14

- Aligned skill discovery descriptions and routing boundaries with the golden rules.
- Added `cf-todo` for lightweight next steps and open questions outside `.cflow`.
- Prevented `cf-docs` from triggering on simple transcription into Markdown.

## 2026-07-05

- Added explicit-only `cf-brainstorm` with resumable draft specs and a no-implementation gate.
- Made `.cflow` self-ignoring and tightened runtime guidance and discovery-description rules.

## 2026-07-04

- Expanded `cf-mr-wolf` into framing, planning, and evaluation flows.
- Added shared regression handling, fragile-assumption checks, and broader skill-contract validation.

## 2026-06-28

- Clarified split/cohesion routing, file-size guidance, and owner-directory grouping.

## 2026-06-26

- Added materialized skill installation with vendored shared resources and introduced `cf-docs`.

## 2026-06-12

- Added canonical navigation-cost hard triggers, exemptions, and guard-clause-first remedies.

## 2026-06-11

- Established navigation cost as the shared cleanup objective, added parallel-flow simplification guidance, and removed `cf-clarify`.

## 2026-05-05

- Initial baseline.
