# Todo — pack evolution

## Next steps

- [ ] Rewrite the pack's weak reference pointers in the form that loads — done when: `cf-review` L39, `cf-split` L34, and `cf-start` L92 and L112 each name the reference as the subject of its own sentence, link it, say what it holds and when to read it, and insist on reading it; and each rewrite is checked on one run whose trace is read for the reference's *content*, excluding any wording the pointer sentence itself contains (docs/golden-rules.md "Runtime Skill Text")
- [ ] Test whether a condition inside a pointer actually gates loading in the pack's remaining skills — done when: a run has been made on an area that genuinely lacks the property the condition names and the trace shows whether the conditional pointer stays silent. A crisp condition — a fact about the edit just made — was measured gating correctly, 3/3 against 0/3; the open shape is the vague one, a condition that asks the model for a judgement about the area, which fired 4 of 9 across three beds on identical input
- [ ] Decide where an overengineering finding lands now that `cf-simplify` is gone — done when: it is known whether a prompt about structure that is hard to read *because the behaviour behind it is overengineered* reaches `cf-mr-wolf`, and whether `cf-cognitive` needs an explicit exit for it. `cf-cognitive` routes only to `cf-split`, `cf-cohesion` and `cf-start`, and its `Result` slot offers only a `cf-split` or `cf-cohesion` next step, so a case whose remedy is dropping a lifecycle rather than a guard clause has no behavior-preserving owner. The routing battery answers the entry half — it greps the trace for the **first** `SKILL.md` opened; whether an exit fires needs a `cf-cognitive` run on that shape with the trace read for the destination it names
- [ ] Resolve the one-level reference rule against the pack's own carve-out — done when: `docs/golden-rules.md` states which of L13 and L31 governs a reference that loads another reference, and the two pointers that neither rule permits are fixed. L31 records that OpenAI *"forbids nesting references below one level"*; L13 permits runtime behavior to live in *"a vendored shared reference loaded by an active runtime reference"*, which is nesting below one level and is the shape `cf-start`'s whole controller architecture depends on — its `SKILL.md` loads only phase references, and every shared reference (`navigation-cost`, `file-split-rules`, `reference-audit`, `regression-handling`, `local-readability-review`) is loaded from inside a phase. A pack-wide grep found roughly 30 reference-to-reference pointers; nearly all fall under the L13 carve-out and must not be stripped, or the controller/phase separation collapses. Only two are skill-owned → skill-owned, which no rule covers: `cf-start/references/target-shape.md` L18 and `cf-start/references/assessment.md` L26, both pointing at `source-orientation.md`. Decide whether the carve-out is deliberate (then annotate L31 with it and give the two outliers a first-level home) or whether the vendor constraint wins (then `cf-start` needs a different shape, which is a much larger change)


### What is established

**The sentence form is what makes a reference load. The section it sits in is not.**

The finding was bought on a skill since removed from the pack, and it is kept because it is a rule about
authoring pointers rather than about that skill. It named a `references/parallel-flows.md` from inside
workflow step 2 with this sentence:

> When the request involves duplicated logic or parallel near-identical flows, read references/parallel-flows.md before classifying drivers; it owns the accidental-vs-essential divergence judgment.

That sentence loaded the reference in **1 of 7 treatment runs** across five beds — and **not** on the bed built to be exactly its trigger, where the prompt asked outright whether two near-identical scan flows should be unified.

(The first reading of this said "never loaded". It was wrong, and it was caught only when the run answers were archived out of `/tmp` and the measured `SKILL.md` was checked against each trace. Archive before concluding.)

Moving the pointer into an always-resident Core Rule loaded it. But so did putting it **back in step 2**, unchanged in position, rewritten in the shape `cf-mr-wolf` uses for `references/pushback.md`:

> [references/parallel-flows.md](references/parallel-flows.md) is how to tell an accidental divergence from an essential one, and what shape a consolidation may take. Read it before classifying drivers whenever the area holds duplicated logic or near-identical parallel flows. Read it every time that is true, including when the divergence looks obviously essential.

Four traits separate the form that loads from the form that does not: **the reference is the subject of its own sentence** rather than the object of a conditional clause; it is **linked**, not a bare path; it gets **its own paragraph** ahead of the step's other content; and it carries an **explicit insistence to read it**.

**1 of 7 with the old sentence, 5 of 5 with the rewritten ones** (2 as a Core Rule, 3 back in step 2 in the new form). Fisher exact p ≈ 0.015, descriptive only — the runs sit on different beds and other parts of the skill changed between them. So the remedy for the rest of the pack is a rewrite, not a restructure.

Cross-check: `cf-mr-wolf`'s `pushback.md`, written this way, was already measured loading at turn 2 in every run of two repositories.

**Read loading from the trace by the reference's content, never by its file name.** The name echoes into every trace from `SKILL.md` itself, so counting it reports references as loaded that nobody ever opened. This mistake was made once here and inverted the first reading of the result.

## Open questions

- **A vague condition inside a pointer is still unmeasured**, and the design error is worth not repeating: a bed meant as the negative control has to be verified to lack the property the condition names, found rather than assumed, or it is not a control at all.
- The cost of getting this wrong is asymmetric and should shape how much is spent on it: a reference loaded when it is not needed costs ~79 lines of context; a reference that loads 1 time in 7 means the judgment it owns is absent from most passes.
