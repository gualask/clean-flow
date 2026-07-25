# Skill Value Trial — Repeatable Method

Purpose: measure whether a Cflow skill produces material value that the same model and tool
environment do not produce without it.

Audience: an LLM agent running a controlled trial with shell access.

This method answers one question only: **does the skill improve the tested outcome enough to justify
its cost?** Invocation precision belongs to a separate trigger trial; coordination, durable state,
and multi-session value need a design that can observe those properties.

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

node ./bin/cflow-skills.mjs install "$TRIAL_ROOT/skill-host"
mkdir -p "$TRIAL_ROOT/skills-a"
cp -R "$TRIAL_ROOT/skill-host/.codex/skills/$SKILL" "$TRIAL_ROOT/skills-a/"

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

## Related trials

A **trigger trial** measures invocation precision and recall with a labelled prompt battery. It does
not need an outcome oracle, and it must not be used as evidence that the skill improves task quality.
See `docs/friction-rules-trial.md` for the friction-log baseline that motivates trigger work in this
pack.
