# Skill Value Trial — Repeatable Method

Purpose: measure whether a Cflow skill produces value a current model does not produce unaided.
Audience: an LLM agent running the trial autonomously, with shell access.

This answers one question only: **does skill X change the outcome?** It does not measure whether X
is invoked at the right times — that is a separate trigger trial (see "Related trials" below), and
conflating the two produces conclusions neither design supports.

## When this method applies

Use it when a skill's justification is *capability* ("the model would not do this well alone").
Model improvements erode capability-scaffolding faster than any other skill value, so re-run the
trial after major model changes rather than trusting an earlier verdict.

Do not use it for skills whose value is coordination, durable state across sessions, or user-facing
ceremony — a single-session A/B cannot observe those. State that limit instead of testing around it.

## Prerequisites

- `opencode` CLI (`opencode run` is the non-interactive entrypoint), with a configured provider.
  Check available models with `opencode models`.
- Target repositories that already use Cflow, at a clean worktree.
- This pack, to materialize skills: `node ./bin/cflow-skills.mjs install <dir>` writes
  `<dir>/.codex/skills`.

## The one rule that decides validity

**Establish ground truth before reading any arm's output.** Answer the trial task yourself, from
the code, and write the answer down first. Once you have read a model's narrative you cannot judge
it — you will score plausibility instead of correctness. If you skip this step the trial is worth
nothing, however clean the rest of the harness is.

## Step 1 — Pick the target and the task

Requirements for the repository: clean `git status`, small enough for fast runs (~100–400 source
files), and a real product flow crossing at least three ownership boundaries.

Requirements for the task: phrased as a user-reported symptom, not as an instruction to use a skill;
answerable from the code; with a verifiable failure point. Write it once to a file and reuse it
verbatim in both arms — any wording difference invalidates the comparison.

Give the skill its best shot. Choose a task squarely inside the skill's declared domain; a
straw-man task proves nothing about a skill you are considering removing.

## Step 2 — Establish and record ground truth

Read the code and record: the true file set involved, the exact break point with `file:line`, and
any secondary findings. Note also which claims are **not** repo-verifiable (external API semantics,
runtime behavior) — models err there most, and neither arm's discipline catches it.

## Step 3 — Build the harness

```bash
SC=<scratch>/trial            # scratch dir, outside the target repo
SRC=/path/to/target-repo
PIN=$(cd $SRC && git rev-parse HEAD)

# Materialize skills, then keep only the skill under test
node ./bin/cflow-skills.mjs install $SC/skillhost
mkdir -p $SC/skills-A && cp -R $SC/skillhost/.codex/skills/<skill> $SC/skills-A/

# One pinned clone per run, per arm (n>=3 each)
for arm in A B; do for i in 1 2 3; do
  D=$SC/repo-$arm$i
  git clone --quiet --local $SRC $D && (cd $D && git checkout --quiet $PIN)
  rm -f $D/.cflow/<artifact-owned-by-skill>.md     # see pitfall 3
  mkdir -p $D/.cflow && cp $SRC/.cflow/architecture.md $D/.cflow/ && printf '*\n' > $D/.cflow/.gitignore
done; done
```

Per-arm config. Arm A sees only the skill under test; arm B sees none:

```bash
# $SC/repo-A*/opencode.json
{ "$schema": "https://opencode.ai/config.json", "skills": { "paths": ["<abs>/skills-A"] } }
# $SC/repo-B*/opencode.json
{ "$schema": "https://opencode.ai/config.json" }
```

Export `OPENCODE_DISABLE_CLAUDE_CODE_SKILLS=1` for **both** arms so unrelated host skills cannot
contaminate either side. Verify isolation before spending runs:

```bash
cd $SC/repo-A1 && opencode run "List only the names of your available skills. No tools." -m <model>
cd $SC/repo-B1 && opencode run "..." -m <model> | grep -c "<skill>"   # expect 0
```

## Step 4 — Run

```bash
cd $SC/repo-B$i && /usr/bin/time -p opencode run "$(cat $SC/task.txt)" \
  -m <model> --auto > $SC/out-B$i.txt 2> $SC/time-B$i.txt
```

Arm A appends the invocation instruction and pre-answers any gate the skill raises:

```
<task>

Use the <skill> skill for this work. If the skill asks whether to use subagents,
treat the answer as 'n' and proceed in local mode.
```

Run at least three per arm. Report every run individually; a mean over two runs hides the variance
that decides whether a difference is real.

## Step 5 — Score

Verify mechanically, never by impression:

| Metric | How |
| --- | --- |
| Hallucinated paths | extract every cited path; `[ -f "$f" ]` each one |
| Wrong line references | `sed -n '<n>p'` each cited line; check it holds the named symbol |
| Ground-truth coverage | per recorded element: found / partial / missed |
| False positives | each finding checked against code; mark unverifiable-by-repo separately |
| Route stability (skill arms) | compare the recommended route across identical runs |
| Cost | wall time and tool-call count (`grep -cE '→ .*(Read\|Grep\|Glob\|Bash)'` on the log) |

## Step 6 — Verdict

The skill adds value only if it wins on a dimension that matters, reproducibly across runs, at a
cost you accept. Equal accuracy plus higher cost is a negative result — say so plainly.

Record, in the trial file: the model and host, n, the task, the ground truth, the per-run table, the
verdict, and the limits. A trial without its limits stated will be over-read later.

## Pitfalls that have already cost time

1. **`.cflow/` is untracked and self-ignoring**, so `git clone` does not carry it. Skills whose
   preflight requires `.cflow/architecture.md` will suspend and route away instead of running.
   Seed the artifact identically in both arms and say you did.
2. **Interactive gates stall non-interactive runs.** Pre-answer them in the prompt and record it as
   a deliberate deviation — it disables whatever the gate protects (e.g. clean-context independence).
3. **A pre-existing owned artifact biases the skill arm**, which will "refresh in place" and inherit
   earlier work. Delete it from every clone.
4. **The host may ship its own built-in skills.** Present in both arms they are a controlled
   constant, which is acceptable — but record whether the bare arm reaches for an alternative
   scaffold, since that changes what "unaided" means.
5. **Seeding a Cflow artifact into arm B is a confound favouring it.** Check whether the bare arm
   actually read it (`grep -c architecture.md` on the log). Runs that never opened it are the
   strongest evidence in the trial.
6. **macOS has no `timeout`**; use `/usr/bin/time -p`. Runs take minutes — start them in the
   background and wait with an `until` loop on the completion marker rather than polling.
7. **`git clone --local` omits untracked and ignored files.** Any finding of the form "this path
   does not exist" may be an artifact of the clone rather than a fact about the repository. Before
   scoring such a finding, diff the clone against the source (`[ -e $CLONE/$f ]` vs
   `[ -e $SRC/$f ]`). A run that reports what it could actually see is correct even when the claim
   is false of the real repository — score the harness, not the model.
8. **Run sequentially — one run at a time.** Concurrent runs contend for provider throughput. A
   six-way parallel batch produced 11 `stream error` events with exponential backoff (up to 33s)
   inside a single trial window, while a batch of at most four produced none. Backoff lands
   unevenly, so it destroys wall-time comparability and can starve a run into delivering nothing —
   a failure that then looks like a property of the arm. Sequential execution costs wall-clock time
   and buys the only cost metric the trial has. Check the provider log afterwards
   (`~/.local/share/opencode/log/opencode.log`, grep `stream error`) and discard timing data if any
   appear.
9. **A run can end without producing its deliverable.** Record incomplete runs as incomplete rather
   than dropping them — the failure rate is part of the result.
10. **Cross-host validity.** Cflow skills are authored for Codex. A trial in another host tells you
    about that host's model; it is indicative, never dispositive.
11. **A launched run can die at once, silently.** `opencode run` buffers its output when redirected,
    so an empty output file proves nothing by itself — but an empty file *plus* no matching process
    means the run never started. Confirm liveness within a minute of launching: `pgrep -f "opencode
    run"` and the output file's size. Then poll at most every two minutes, and never report a run as
    in progress without having just checked. This trial lost twenty minutes waiting on a background
    script that died at launch, while its status was reported as running.

## Related trials

A **trigger trial** answers the other half: a labelled battery of prompts, half deserving the skill
and half not, run with the skill available, measuring invocation precision and recall. It needs no
ground truth beyond the labels, and it is the only cheap way to validate a description rewrite
before the friction log accumulates evidence. See `docs/friction-rules-trial.md` for the
friction-log baseline that motivates such work.
