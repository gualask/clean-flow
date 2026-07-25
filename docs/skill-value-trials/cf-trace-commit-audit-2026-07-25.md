# Trial — cf-trace on retrospective commit audit (2026-07-25)

Method: `trial-method.md`. Companion to `cf-trace-flow-reconstruction-2026-07-25.md`.
Status: complete; verdict negative.

## Question

The flow-reconstruction trial returned a negative verdict but covered only one of cf-trace's two
historical uses. The other is retrospective auditing of a commit range — the shape of the
pre-existing `termetrix/.cflow/trace.md`, which audited `HEAD~3..HEAD`. That scenario has a
different failure risk: a diff offers no natural thread to follow, so premature closure is more
likely, and a mandatory nine-lens rubric could plausibly pay off there.

Everything was held constant against the first trial — same repository, model, host, harness, n —
so the isolated variable is the task type.

## Setup

Identical to the first trial (`opencode` 1.18.5, `zai-coding-plan/glm-5.2`, termetrix at `686bf2d`,
arm A = only `cf-trace` explicitly invoked with the subagent gate pre-answered `n`, arm B = no Cflow
skill, `OPENCODE_DISABLE_CLAUDE_CODE_SKILLS=1` both sides, fresh pinned clone per run, n=3 per arm).
All six runs were launched concurrently so wall times are internally comparable.

Task: validate whether the three commits in `HEAD~3..HEAD` correctly implement what their messages
and the CHANGELOG declare; report every inconsistency with its evidence.

## Ground truth (established before reading any output)

Range: `95eb940` (release 1.1.1, lucide-preact 0.575→1.24, Biome and Preact bumps),
`27ced6a` (`.vscodeignore` additions), `686bf2d` (CI drops `version: latest`).

Verified correct: the lucide migration is a pure rename set (`Loader2`→`LoaderCircle`,
`AlertTriangle`→`TriangleAlert`, `MoreHorizontal`→`Ellipsis`), complete with no stale names left in
`src/`; the CHANGELOG claim that icons expose `aria-hidden` by default is true but conditional
(`node_modules/lucide-preact/dist/esm/Icon.mjs`: `...!children && !hasA11yProp(rest) &&
{ "aria-hidden": "true" }`); the CI change is right (`pnpm/action-setup@v4` reads
`packageManager: pnpm@11.9.0`, correctly ordered before `setup-node` with `cache: pnpm`);
`.vscodeignore` correctly retires the stale `eslint.config.mjs` line and does not exclude `out/**`.

Defects a good audit should surface:

- **F1 (medium)** `lucide-preact` is a shipped runtime dependency taken across a major (0.575→1.24)
  and released as a **patch** (1.1.0→1.1.1).
- **F2 (low)** `[Unreleased]` was converted to `[1.1.1]` and never restored; the file now has none,
  so the next contribution has nowhere to land — a stated-convention violation
  (`CHANGELOG.md:4` claims Keep a Changelog).
- **F3 (low)** explicit `aria-hidden="true"` remains on many icons now that 1.x defaults it.
- **F4 (info)** `95eb940` bundles three concerns: version release, dependency migration, tooling bumps.

Added during scoring, discovered by run A1 and verified: the `[1.1.1]` section contains **16**
entries but `95eb940` adds only **one** — the rest accumulated in earlier commits under
`[Unreleased]`. Under a literal reading of the task, the range implements one of sixteen declared
items. This is a sharper framing of the task than the referee's own list.

## Results

| | A1 | A2 | A3 | B1 | B2 | B3 |
| --- | --- | --- | --- | --- | --- | --- |
| Wall time | 188s | 248s | 310s | 128s | 275s | 110s |
| Tool calls | 5 | 7 | 4 | 3 | 4 | 3 |
| Delivered a report | ✓ | ✓ | **✗** | ✓ | ✓ | ✓ |
| F1 semver | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| F2 missing `[Unreleased]` | ✗ | ✗ | ✗ | ✗ | ~ | ✓ |
| F3 redundant `aria-hidden` | ✗ | ✗ | ✗ | ✓ | ✓ | ✓ |
| F4 atomicity | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| CHANGELOG attribution | ✓ | ~ | ✗ | ✗ | ✓ | ✗ |
| Verified findings | 2 | 3 | 0 | 2 | 4 | 4 |

Means: **A 249s / 5.3 tool calls — B 171s / 3.3 tool calls.** One arm-A run (A3) ran 310s, made four
tool calls, and ended with neither a report nor a `trace.md`.

## Findings

**No advantage from the rubric, again.** The hypothesis was that nine mandatory lenses would prevent
premature closure on a diff. They did not: the richest outputs were B2 and B3 with four verified
findings each, against A's 2 / 3 / 0. Arm A's lens tables were populated largely with
"nessun problema", which is the rubric being satisfied rather than exercised.

**The deepest single insight came from arm A — but was not reproducible.** A1's CHANGELOG
attribution finding (16 declared entries, 1 implemented in range) is the best result in either arm
across both trials, and it is correct. But A2 only approximated it and A3 produced nothing, while
B2 found it unaided. One run in three is not a skill property.

**A blind spot shared by both arms sits exactly where the lenses do not reach.** F1 (a shipped
dependency major released as a patch) and F4 (commit atomicity) were missed by all six runs. The
nine lenses cover sequence, state, invariants, ownership, boundaries, failure modes, observability,
testability, and instruction ambiguity — none of them is a release-policy or versioning lens, and
the pack's own historical `trace.md` found an atomicity defect on an earlier range only because the
user's request named commit atomicity explicitly. The rubric does not generalise to what it does not
list.

**Reliability regressed in the skill arm — retracted, see below.** A3 delivered nothing, and it was
an arm-A run. This was originally read as a skill-attributable reliability cost. It is not
attributable: see "Provider contention invalidates the timing data".

## Provider contention invalidates the timing data

All six runs were launched concurrently. The provider log
(`~/.local/share/opencode/log/opencode.log`) records **11 `stream error` events with exponential
backoff (6s → 9s → 17s → 33s), all inside this trial's window** (07:07–07:08Z), across two
sessions; the flow-reconstruction trial, which never ran more than four runs at once, records zero.

Consequences for this trial:

- **Wall times are not comparable** and must not be used. The A-vs-B time gap reported above is
  confounded by retry backoff distributed unevenly across runs.
- **A3's non-delivery cannot be attributed to cf-trace.** The session that accumulated the escalating
  backoff burned roughly 74s waiting on retries, which matches A3's profile (310s wall, 4 tool
  calls, no output). Provider contention is at least as good an explanation as the skill.
- **The findings-coverage comparison survives**, because it depends on output content rather than on
  timing or completion, and five of six runs delivered.

The verdict below rests on coverage only. Trials from this point on run sequentially, following the
provider-contention validity rule in `trial-method.md`.

## Harness artifact, disclosed

Five of six runs reported that `.vscodeignore` excludes non-existent paths (`knip.json`,
`.mcp.json`, `.impeccable/**`). Only `knip.json` is genuinely absent — knip is configured through
`package.json` with no separate file. `.mcp.json` and `.impeccable/` exist in the real repository
but are untracked, so `git clone --local` did not carry them and the runs could not see them. Every
run reported what its environment actually contained; this is scored as a harness defect, not a
model error, and is covered by the starting-state asymmetry rule in `trial-method.md`. B2 was
nonetheless the most precise arm,
narrowing the phantom set to two entries and classifying `.mcp.json` as a real local artifact.

## Verdict

The retrospective commit audit does not rescue cf-trace. On the one dimension this trial can still
measure, arm A produced fewer verified findings (2 / 3 / 0) than arm B (2 / 4 / 4). The scenario that
looked most likely to justify the rubric is the one where the rubric visibly idled: arm A's lens
tables were largely "nessun problema".

Timing and reliability claims are withdrawn — see the contention section. A re-run under sequential
execution would be needed to say anything about cost here.

## Limits

Same as the companion trial: one repository, one model, one host (opencode + GLM 5.2, not Codex),
n=3. The audited range is small (11 files, 81 insertions) and largely configuration; a range with
substantial logic changes could stress the lenses differently. Both trials are negative, so the
convergent direction is stronger than either alone — but the evidence base remains one repository.

## Conclusion across both trials

Nothing in cf-trace's machinery is supported by evidence as it stands:

- reconstruction is commoditised (first trial);
- rubric-driven audit shows no coverage advantage and one delivery failure (this trial);
- the recommended route was unstable across identical runs (first trial: three routes, one wrong);
- the durable artifact was written but never consumed;
- the lens list has demonstrable blind spots (versioning policy, commit atomicity, third-party API
  assumptions — where both trials' misses and false positives concentrated).

If cf-trace is retired, the residue worth carrying forward is not the lens list as authored but the
*idea* of a rubric, and even that now needs its must-list rebuilt from observed misses rather than
inherited. `cf-audit` remains the natural home for that work.
