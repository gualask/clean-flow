# Aiming Errors — the trial measured the wrong thing

Companion to [trial-method.md](./trial-method.md). That file's numbered errors are
**instrument** errors: the reading was wrong. These are **aiming** errors: the reading was
fine and the trial was pointed somewhere the claim does not live. They are more expensive,
because an instrument error is usually visible in the output and an aiming error produces a
clean, defensible number about the wrong question.

All five below were made on 2026-08-14 in the first three beds built for `cf-scenario`, by
the same author, in one session. Each was caught by the skill's owner in one sentence, never
by the harness.

## A1 — The claim was read off the skill's own text instead of the failure it prevents

`cf-scenario`'s file is written largely by prohibition: do not implement, do not move files,
and `Do not use ... for deciding what to do about the impact — approach, alternatives, worth`.
That line was taken as the boundary of the *task*, so the prompt ended with *"voglio capire il
comportamento, non sistemarlo adesso"* — removing the exact moment the skill exists to protect.
The owner's one-line statement of purpose was the opposite: the model must not recommend a
solution without having weighed the impact on the other scenarios running through that code.

**Rule**: before writing any prompt, get one sentence from whoever owns the skill naming the
failure it prevents — *without this, the model does X wrong* — and check that X is a failure
someone has actually seen. A skill's description says what it **covers**; it does not say what
it **prevents**, and a trial can only measure the second. A boundary of responsibility inside
the skill ("this skill does not decide") is not a boundary of the task: something downstream
still decides, and the skill exists so that decision is not blind.

## A2 — The bed's shape was inherited from the harness instead of the claim

The case recipe in the method opens with *find a shipped commit that resolved a product
decision*. Commits make diagnosis beds easy, so a diagnosis bed came out — twice — while the
claim was about a recommendation. The recipe was followed correctly and produced the wrong
experiment.

**Rule**: derive the task class from the claim first, then go looking for material. When the
existing recipe does not reach the claim, the recipe is wrong for that bed, not the claim. Ask
what the user is DOING when the skill would pay: asking, deciding, editing, reviewing. Build
that.

## A3 — Separation-hunting after the first endpoint saturated

The first endpoint was reachable without the skill, so the second was chosen where the bare
model's floor looked thin — an endpoint with the *power to separate the arms*, not one that
measured the purpose. This is the dangerous one: it works. It finds a real difference, produces
a real number, and reports as the skill's value whatever side effect happened to be separable.

**Rule**: an endpoint is justified by the claim, never by its separating power. If the only
defence is *"the control does not do this"*, the trial is measuring a side effect. Where task
selection was informed by knowing the floor, say so and limit the population accordingly.

## A4 — The ban on framing was over-extended to the request itself

*Never state the suspicion, never state the defect* was stretched until any prompt that asked
for a change looked like framing. It is not. Asking *"come lo sistemiamo?"* gives the control
arm nothing: what must stay hidden is the cause, the files, and the alternatives. A change
request is what users actually type, and for a claim about recommendations it is the only
prompt that reaches the endpoint.

**Rule**: hide the cause, the file list and the alternatives. Do not hide the user's intent to
act.

## A5 — The measurement was aimed at description, where the floor is already at the ceiling

Measured on this repository, bare answers with no skill: **3 of 3** named a boundary outside
the reported path unprompted, citing file and line; **2 of 2** got both halves of a
shared-writer-versus-divergent-timestamp question right, with the correct citations. The same
model, asked the same subject as a **decision** — *how do we fix it* — proposed a schema change
introduced with the words *"la correzione corretta è"* and declared **none of the 5** impacts
verifiable in the code, including one that would have emptied the very view the user was
complaining about.

**Rule**: measure where the model must COMMIT, not where it must DESCRIBE. Grounded description
of existing code is close to saturated in current models; the failures live in commitment — what gets
recommended, what gets skipped, what gets asserted without checking. If an endpoint can be
satisfied by a good explanation, expect no room and check the floor with one run before buying
anything.

## A6 — The prompt handed over the diagnosis the trial was meant to measure

A bed on a 129-line function opened with *"un match a cinque rami con dentro un altro match, e
in mezzo scritture sullo store, emissione di eventi e gestione della coda"*. All of that is
work: locating the hotspot, naming what is tangled in it, deciding it is the thing to fix. A
prompt that supplies it starts every arm past the part where they would have differed, and the
endpoint can then only compare execution.

The user who reports a problem has seen the **shape**, not the substance — *"il file mi sembra
incasinato"*. Written that way the same endpoint measures one thing more, for free: whether the
arm aimed at the right place at all, since nobody told it where that was.

**Rule**: write the prompt as the person who has not read the code closely. State the symptom
and the intent to act; never the structure, the cause, or the fix. This is A4's other half —
A4 says do not hide the intent, A6 says do not hand over the analysis.

## What all six cost, and what would have prevented them

Six runs: three control answers on a model that was superseded mid-session, and three more on
an endpoint already known to be saturated. Nothing about the instrument was wrong in any of
them.

One question, asked before the first prompt was written, would have prevented all five:
**"which failure did you see without this skill?"**
