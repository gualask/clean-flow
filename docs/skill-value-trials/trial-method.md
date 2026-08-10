# Skill Value Trial — Repeatable Method

Purpose: measure whether a Cflow skill produces material value that the same model and tool
environment do not produce without it.

Audience: an LLM agent running a controlled trial with shell access.

This method answers one question only: **does the skill improve the tested outcome enough to justify
its cost?** Invocation precision belongs to a separate trigger trial; coordination, durable state,
and multi-session value need a design that can observe those properties.

## GOLDEN RULE — one run first

**Never propose a multi-run batch as the first test of an idea. Run exactly one, look at what it did,
then decide whether replication is worth buying.**

The first run answers *did anything change at all*. Replication answers *is the change real*, and
that is a second question you only pay for once the first has an interesting answer. A batch bought
up front spends the same money whether the idea moves the endpoint or not — and most do not.

This is also the cheapest way to catch an instrument that cannot see the behaviour: read one raw
output with your own eyes before trusting any classifier over a whole run set (rule 24), and check
the arm you are pushing on actually has the failure you mean to fix. A decision-forcing rule was
nearly aimed at a one-turn baseline that already committed 3 of 3 — an open door, and three runs
would have measured nothing at more cost than one.

Applies to every arm, every candidate rule, every endpoint change. The only thing that earns a batch
without a probe is a comparison whose single-run outcome is already known.

## Trial contract

Write the trial contract before running either arm:

- **Value claim**: the capability or constraint the skill is expected to improve.
- **Population**: the task class to which the verdict may generalize.
- **Tasks**: representative prompts and inputs sampled from that population.
- **Controlled inputs**: model, host, tools, repository or other source material, starting state,
  limits, and user-provided context.
- **Oracle**: the expected facts, properties, changes, or decisions established independently.
- **Metrics**: observable scoring rules tied to the value claim.
- **Replication**: run count and execution order.
- **Stopping rule**: the evidence needed for supported, unsupported, or indeterminate verdicts.

Do not choose metrics, exclusions, or stopping conditions after reading an arm's output.

## When this method applies

Use an A/B value trial when the skill claims to improve a result within one observable run. Re-run
after material model, host, tool, or skill changes.

Do not force a single-run A/B onto value that exists across sessions, coordinates several actors,
persists accepted state, or provides user-facing ceremony. Build a trial that observes the claimed
property, or mark the claim untested.

## Prerequisites

- A fixed model and host with a repeatable way to run the same task.
- A clean, pinnable copy of every repository or input corpus used by the task.
- An isolated scratch root outside the source repository.
- This pack, when materializing the skill under test:
  `node ./bin/cflow-skills.mjs install <skill-host>`.
- A recorded inventory of host-provided skills, tools, and instructions visible to both arms.

## Step 1 — Define the value claim and task population

State what the skill should change and why that difference matters. A skill justified by accuracy,
coverage, safer edits, decision quality, lower variance, or lower cost needs different evidence for
each claim.

Choose tasks squarely inside the declared domain. Use more than one task whenever the verdict is
meant to generalize across materially different repository shapes, inputs, or request forms. A
single task supports a verdict about that task class only.

Write each shared task prompt once and reuse it verbatim in both arms. Do not mention the skill in
the shared prompt.

## Step 2 — Establish the oracle before any run

Determine the expected outcome independently, then save it where trial outputs cannot overwrite it.
Choose the verification surface that fits the task:

- factual answer: required facts and acceptable evidence
- code or document change: expected behavior, allowed scope, invariants, and relevant checks
- review or diagnosis: known issues, non-issues, reachability, and severity boundaries
- plan or decision: required constraints, rejected directions, and observable decision criteria
- generated artifact: required fields, semantic properties, and invalid states

Separate mechanically verifiable claims from external or judgment-dependent claims. Define how the
latter will be evaluated before seeing the outputs. If no credible oracle exists, the trial can
measure cost or consistency but not correctness.

## Step 3 — Prepare equivalent starting state

Pin every controlled input. Use one fresh run directory per arm and replication.

```bash
TRIAL_ROOT=<scratch>/skill-value-trial
SOURCE_REPO=/path/to/target-repo
PIN=<tested-commit>
SKILL=<skill-name>
REPLICATIONS="1 2 3"

# One scratch HOME per arm. The global installer targets $HOME/.agents/skills, so HOME —
# not the host's own config directory — is what separates the arms. Verify by running the
# installer and listing the directory; the failure is silent and inverts the comparison.
for arm in A B; do mkdir -p "$TRIAL_ROOT/home-$arm"; done
HOME="$TRIAL_ROOT/home-A" node ./bin/cflow-skills.mjs install --global

for arm in A B; do
  for i in $REPLICATIONS; do
    RUN_DIR="$TRIAL_ROOT/run-$arm$i"
    git clone --quiet --local "$SOURCE_REPO" "$RUN_DIR"
    git -C "$RUN_DIR" checkout --quiet "$PIN"
  done
done
```

Before running, classify every file or state item not carried by that clone:

- **Task input**: copy it identically into both arms.
- **Prior output of the skill or task**: remove it from both arms unless resuming it is the tested
  scenario.
- **Skill prerequisite**: decide whether it is part of the skill's cost or a task input; document
  the choice and keep the comparison fair.
- **Irrelevant host or repository state**: exclude it from both arms.

Never seed an artifact merely because one tested skill happens to mention it. Any asymmetry in
starting state must be part of the declared intervention, not an accidental convenience.

## Step 4 — Isolate the intervention

Arm A sees the skill under test. Arm B does not. Keep every other skill, instruction, tool, model
setting, permission, and task input identical.

Verify the effective capability inventory in both arms before spending trial runs. A host-provided
skill or global instruction that replaces the tested behavior changes what "without the skill"
means and must be recorded.

Append only the activation instruction to Arm A:

```text
<shared task prompt>

Use the <skill-name> skill for this work.
```

Do not embed answers to one skill's gates in the universal harness. If a skill requires interaction,
either run the interaction normally or define a deterministic response policy in the trial contract.
Record every extra turn and every injected response as part of the intervention cost. If the runner
cannot complete the interaction, count that as an observed limitation rather than silently bypassing
it.

## Step 5 — Execute reproducibly

Run at least three replications per arm for each task unless the contract justifies another count.
Execute one run at a time; interleave or randomize arm order to reduce temporal bias without creating
provider contention.

For every run:

- use the same shared task text, limits, permissions, and starting state
- capture the full output, tool log, elapsed time, exit status, and model/host identifiers
- confirm liveness and completion with the runner's own process or completion signal
- keep incomplete, timed-out, refused, or crashed runs in the result set
- record provider or tool failures that make timing or outcome comparison invalid

Do not retry only the arm that failed. Apply any declared retry policy symmetrically.

## Step 6 — Score against predeclared metrics

Score each run individually. Use only dimensions that the value claim needs, but always include
correctness, harmful error, reliability, and cost when they are observable.

| Dimension | Observable rule |
| --- | --- |
| Correctness | Compare required facts, properties, changes, or decisions with the oracle. |
| Completeness | Mark each predeclared required element as found, partial, or missed. |
| Harmful error | Verify false claims, unsafe edits, scope violations, invented evidence, or broken invariants. |
| Claim-specific value | Measure the exact property named in the value claim with its predeclared check. |
| Reliability | Record variance, incomplete runs, refusals, crashes, and unstable routes or outputs. |
| Cost | Record elapsed time, turns, tool calls, and context or token cost when available. |

Record consumption, not context size. A host's last-turn context total is not cost: it excludes
every earlier turn and collapses whenever an arm delegates to a sub-agent, which inverts the
comparison. Sum input, output, and cache tokens across the run and its sub-sessions instead. On OpenCode this can be
reconstructed from the run database after the fact, so process metrics never need to be chosen
before the runs.

Prefer executable checks, source verification, schema validation, or blinded rubric scoring over
impression. Keep unverifiable claims separate from errors.

## Step 7 — Decide the verdict

The value claim is supported only when Arm A produces a material, reproducible improvement on the
claimed dimension at an acceptable cost without creating a worse failure elsewhere.

- **Supported**: the improvement meets the stopping rule.
- **Unsupported**: results are equal, worse, or too costly for the claimed value.
- **Indeterminate**: the oracle, sample, reliability, or controls cannot support a conclusion.

Limit the verdict to the declared population. A result on one task, host, model, or repository does
not establish universal skill value.

Record:

- value claim and population
- model, host, tools, skill revision, tasks, and pinned inputs
- starting-state and capability inventories
- oracle and metrics
- every run's score and cost
- failures, exclusions, and validity threats
- verdict, limits, and next replication needed

## Validity threats

Check these before accepting the verdict:

1. **Oracle contamination**: ground truth was written after an output was read.
2. **Prompt drift**: the shared task or limits differed across arms.
3. **Capability leakage**: Arm B could still access the tested skill or an equivalent scaffold.
4. **Starting-state asymmetry**: ignored, untracked, generated, cached, or external inputs differed.
5. **Prior-output bias**: an arm inherited an artifact or answer from earlier work.
6. **Prerequisite confound**: a skill-specific prerequisite was added to both arms without proving
   it was a task input, or only to one arm without counting it as intervention cost.
7. **Interaction bias**: gates or questions were bypassed, pre-answered, or answered inconsistently.
8. **Provider contention**: concurrent runs distorted latency, reliability, or completion.
9. **Selective reruns**: failed or weak results were retried asymmetrically or omitted.
10. **Unverifiable scoring**: plausibility was scored as correctness.
11. **Cross-host overreach**: a host-specific result was generalized to another host.
12. **Single-case overreach**: one task or repository was generalized beyond its declared population.

## Instrument errors observed in practice

These are not hypothetical. Each was made during the `cf-mr-wolf` trial, each falsified a conclusion
that had already been reported, and each is cheap to prevent.

13. **The endpoint cannot observe the behaviour.** A classifier asked "does the run hand off to a
    specialist without producing its own analysis?" The runs handed off by *activating* the
    specialist and returning its analysis, so every run scored "no handoff" and the routing rule was
    reported as inert. It was not: routing was correct 12 of 12.
    **Rule**: before running, write down what the instrument would output for each behaviour you
    expect, including the ones you do not expect. If two materially different behaviours map to the
    same output, the endpoint is broken. Prefer an endpoint read from the execution trace — which
    skill was activated — over one inferred from prose.

14. **The control cannot exhibit the treatment.** Removing an in-body routing table from one arm
    while installing only that skill leaves the control unable to hand off by construction rather
    than by the variable under test.
    **Rule**: verify the control *could* produce the treatment behaviour if it wanted to.

15. **The intervention is measured in isolation but ships in a pack.** Arms carrying a single skill
    cannot delegate to siblings; the same skill inside the installed pack can, and does. A penalty
    measured in isolation may be an artifact of it.
    **Rule**: state whether the trial measures the skill alone or the skill in its shipped
    configuration, and do not generalize from one to the other.

16. **A proxy metric substituted for the mechanism.** Lexical TF-IDF ranking over descriptions
    reported 40% routing accuracy and a 0/4 collapse for one skill. The host selects semantically:
    the same prompts routed at 94%, and that skill at 4/4.
    **Rule**: a cheap proxy is a diagnostic, never a target. Before acting on it, run the mechanism
    once.

17. **Unblinded re-scoring by the trial author.** A dry re-score produced clean arm separation that
    did not survive blind re-scoring by an independent judge — the author's weakest run tied the
    other arm's best two.
    **Rule**: an instrument may be calibrated unblinded; an arm comparison may not.

18. **Verify the payload was exercised.** Deleting material on the strength of a trial requires
    evidence the runs actually loaded it. Grep the traces for the reference reads before concluding
    anything about what the material costs or contributes.

19. **The cheap signal was queued behind the expensive one.** A two-arm design put turn-2 runs and
    blind scoring in the same batch as turn-1, when two of its three predictions were readable from
    turn 1 alone and two of its three decision outcomes changed nothing. Forty-five minutes bought
    what ten would have.
    **Rule**: order a trial so the cheapest discriminating signal is produced first, and pay for the
    expensive stage only if that signal passes. Where a decision rule has outcomes that keep the
    status quo, check whether an early readout can reach them.

20. **The prompt exposed the decision the treatment was supposed to recover.** A case testing whether
    asking recovers a hidden intent used a prompt that named the mechanism outright. Every control
    run reached the intended lens unaided, the preregistered fork-validity condition failed, and the
    case was void — after the runs had been paid for.
    **Rule**: for a case that tests recovering a decision, the prompt may describe only what the user
    *observes*. Naming the mechanism, the component, or the alternatives leaves nothing hidden. Check
    it before running by asking what a control arm could conclude from the prompt text alone.

21. **The endpoint was capped by the artifact under test.** A candidate meant to widen the options a
    skill offers was measured by counting distinct options — but the skill instructs "2-4 options",
    so every run landed on 3 or 4 and the counter had one step of room. The measured difference was
    half an option, inside noise, and would have been inside noise however well the rule worked.
    **Rule**: check the range your endpoint can actually take given the instructions both arms
    carry. If the treatment's whole effect has to fit between two adjacent integers, the endpoint
    cannot see it — measure the property the count was standing in for instead.

22. **The decision rule was finer than the sample could resolve.** A rate estimate preregistered
    bands at ≥ 80% and ≤ 50% and then ran fifteen replications. The observed 60% carries a 95%
    interval of 36-80%, which contains both boundaries: no attainable result could have cleared the
    inconclusive band. The runs were spent to learn nothing the design could have reported in
    advance.
    **Rule**: before running a rate experiment, compute the confidence interval your planned n will
    produce and lay it against your own decision bands. If the interval spans a boundary, either
    widen the bands, raise n, or replace the rate with an endpoint that separates cleanly. Do this
    at preregistration, when it is free.

23. **The empty arm filled itself from outside the isolation boundary.** `CODEX_HOME` isolates
    `$CODEX_HOME/skills` and nothing else. A control arm with no skills installed reached
    `~/.agents/skills/` instead and activated an unrelated third-party skill in six of six runs,
    reading its `SKILL.md` and announcing it in the answer. The treatment arms looked clean only
    because the tested skill had already taken the slot, so the comparison silently became
    skill-versus-other-skill. Recording the directory's contents as a "control" is not enough: it is
    only inert until a prompt happens to match it, and one bed's prompt matched where an earlier bed's
    had not.
    **Rule**: make the control genuinely empty rather than nominally empty. Point `HOME` at a scratch
    directory so `~/.agents` resolves nowhere, verify with a real run, and grep every arm's trace for
    activations you did not install before scoring anything.

24. **The auxiliary instrument was built for a behaviour the skill no longer has.** The two-turn
    driver classified turn 1 as a question or an analysis; that classifier was written when the skill
    asked questions. The skill of that day restated and stopped — no question mark anywhere. Two of three
    treatment runs restated exactly as prescribed, were labelled `ANALISI`, never received turn 2,
    and were scored on a bare restatement. The batch was one reading away from reporting that the
    skill performs its own central behaviour 1 time in 3. It performs it 3 of 3.
    **Rule**: instruments age with the artifact. When the skill's prescribed behaviour changes,
    re-derive every classifier, responder and endpoint from the *current* behaviour. Read one turn-1
    output per arm with your own eyes before trusting any classifier over a whole run set. Repair by
    re-running the corrected instrument over *every* run, not over the ones that look wrong.

25. **The simulated user answered a question nobody asked.** The responder contract — *answer only
    what you are asked, volunteer nothing* — assumed a skill that asks. Against one that restates and
    stops there is no question to be bound by, and the responder handed all three treatment runs the
    goal, the out-of-scope list, and the sentence that resolved the endpoint's own fork. Two of them
    had asked nothing at all.
    **Rule**: write the hidden brief in two tiers and declare them before running. *Volunteered on
    correction*: what a real user says when a restatement gets their goal wrong — forbidding this
    measures a mechanism the skill does not have. *Only when asked*: the preference that decides the
    endpoint, released only to a turn that actually raises it. Audit afterwards by diffing each
    responder reply against the turn it answers; any topic not already in that turn is a breach.

26. **The endpoint required the run to guess something the user could never say.** Case 14 first
    asked whether the answer refused oversized files *by size*. A user can say a partial result is
    worse than none; they cannot name the property the tool should key on. Two of three treatment
    runs refused the same files for being generated build output — goal satisfied, endpoint failed,
    batch indeterminate. The endpoint had smuggled in the shipped commit's implementation choice as
    if it were the user's requirement.
    **Rule**: an endpoint may only test what the hidden brief licenses. Check clause by clause that a
    run could reach it from the brief alone. Ground truth says what the author *did*; the brief says
    what the user *wanted*, and the endpoint must measure the second.

27. **The brief became undeliverable because the arm framed the problem first.** The responder
    contract forbids introducing a topic the assistant's turn has not touched. That is safe against an
    arm whose turn 1 restates the user's own words — it can only touch what the user said. It is not
    safe against an arm whose turn 1 *investigates*: that turn arrives with a framing of its own, and
    where that framing misses the brief's opening fact, the tier-1 line naming it is a breach by the
    contract's own terms. Observed on Case 13: turn 1 reported a stop-and-finalize ambiguity and never
    mentioned the double click, so the tier-1 reply was rejected and the regenerated one reached the
    run carrying strictly less than the archived runs received. Measured afterwards: **four of four**
    of that arm's turn 1s omit the brief's opening fact, so the thinning is systematic and falls only
    on the arm whose behaviour is under test.
    **Rule**: the responder contract and the hidden brief are one instrument, and an arm that reframes
    breaks their fit. Release the opening tier **unconditionally** to any turn the gate marks as
    awaiting the user, and scope the topic-introduction clause to everything beyond it. Conditional
    release makes the information an arm receives a function of its own phrasing — a within-arm
    confound, so replications of one arm stop measuring the same thing — and the strict reading makes
    the mechanism unmeasurable, since a user who may only echo can never hand over what the run did
    not already have. The gate, not the contract, is what keeps the control from receiving anything.
    Declare the consequence in the results: the endpoint then measures what an arm does with a
    correction, not how well it elicited one.

28. **An auxiliary that could not read its input answered anyway.** A blind scorer replied *"Non
    posso leggere ANSWER.md"* — the file was there, 2,269 bytes — and then emitted a label in the
    required shape, which the driver parsed and counted. Re-scored, the same answer came back
    differently.
    **Rule**: a model asked for one word produces one word under any circumstance, including total
    failure, so *"it answered"* is not evidence it looked at anything. Reject a reply that reports it
    could not read its input, and reject one whose label does not match the declared shape exactly —
    void and re-run rather than count.

29. **The control arm defected into the treatment behaviour.** A bare control asked the user a
    question unprompted in 1 run of 3, so it received the hidden brief and reached the treatment
    endpoint.
    **Rule**: preregister what happens when an arm produces the behaviour that defines another arm.
    Report it as its own row, keep it out of the pure-arm denominator, and state the resulting n.
    Expect this whenever the endpoint is a behaviour the baseline can produce at a nonzero rate.

30. **The scoring brief asserted something the trial itself had corrected.** A blind scorer was told
    *"the user's stated cause is false"* and asked to penalise answers that accepted it. The record
    already said the opposite: that cause was defensible and only the requested remedy reversed a
    deliberate design. Runs that correctly accepted the premise and refused the remedy were scored as
    if they had failed. Both arms carried the same brief, so the comparison survived, but that
    component's absolute reading did not.
    **Rule**: a scoring brief is an instrument, so re-derive it from the current record every time,
    not from the intuition that motivated the case. Any factual claim it hands the judge must be one
    the record still makes — check it clause by clause against the ground truth before the batch, and
    prefer a component that reads what the answer *commits to* over one that reads what it *believes*.

31. **The instrument was a `grep`, and nobody calibrated it.** Three readings in one afternoon were
    wrong because a pattern stood in for a property. A search for `relativ` to find *relative paths*
    matched the Italian adjective *"i relativi file"* and scored a run as having found a defect it
    never mentioned. A search for `assume che` to find a stated assumption missed *"l'assunzione più
    fragile è che…"* and reported `0/3` for two arms that were `3/3` — inverting which half of the
    intervention was doing the work. A search for `"cmd": "` to count tool calls matched nothing in
    that log format and reported zero repository inspection for runs that had read forty files.
    **Rule**: a `grep` is an auxiliary instrument and rule 28 applies to it in full. Before trusting
    one over a run set, run it against one output you have read and know contains the property, and
    one you know does not; a pattern that cannot separate those two is not measuring anything. Prefer
    the *narrowest unambiguous* string the property must contain over a stem that also matches
    ordinary prose — and when the runs are not in English, check the pattern against the language they
    are actually written in. Every wrong reading here was a **substantive** claim about which
    mechanism worked, reported before the check.

## Where the intervention can be placed

Placement is part of the design, not a detail: the host decides when text reaches the model, and
`docs/golden-rules.md` records which channel arrives when. The consequence for a trial is the one to
carry here — **an intervention placed in resident text is only being tested on the turn that loaded
it.** If the behaviour under test happens in a later turn, declare where the text lives, and do not
read a null result as a verdict on its wording.

## Designing a case whose fork survives the control arm

Host-neutral, and every line was bought by a case that failed without it. The harness that runs these
— two-turn loop, scripted responder, session resume, snapshot scrubbing, blinding — is kept with the
trial records.

1. Find a shipped commit that **resolved a product decision**, and take its parent as the pin. The
   commit is then the ground truth and nobody in the trial chose it.
2. Check the pre-state is **deliberate and defensible**, not an oversight. If it is simply broken,
   both arms fix it and there is nothing to recover.
3. Write the prompt from **what the user observes only**. Naming the mechanism, the component, or the
   alternatives exposes the decision and voids the case (rule 20).
4. Write the hidden brief so it selects the lens the commit shipped, and include at least one
   requirement that exists **only in the user's head**.
5. **Screen with three control runs before building anything else** — no brief, no treatment, six
   minutes. If the control reaches the target, discard the case now. Two cases were voided by this
   condition *after* the full experiment had been paid for, and a third by skipping the screen
   entirely on a bed whose control defended 3 of 3.
6. Preregister a **fork-validity condition**: how many control runs may reach the intended lens
   unaided before the case is void.
7. Preregister the expectations, the decision rule, and the confidence interval your planned n will
   actually produce (rule 22).

**Two shapes that look like cases and are not.** An ambiguous *symptom* is not an ambiguous
*decision*: before writing a brief, name two changes to the same code that a reasonable user could
want and that contradict each other — if you cannot, the case is dead however vague the prompt
sounds. And a bed built on a user asserting something **plainly false** measures nothing: the model
refutes it unaided. The version that bites is a **defensible cause with a wrong remedy**, where the
premise survives inspection and only the requested change reverses something deliberate.

## Related trials

A **trigger trial** measures invocation precision and recall with a labelled prompt battery. It does
not need an outcome oracle, and it must not be used as evidence that the skill improves task quality.
See `docs/friction-rules-trial.md` for the friction-log baseline that motivates trigger work in this
pack.
