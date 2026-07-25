# Trial — cf-trace on flow reconstruction (2026-07-25)

Method: `trial-method.md`. Status: complete; verdict negative for the tested scenario.

## Question

cf-trace was designed to reconstruct a product flow so the model gains cognizance of the files
involved before working (originating example: "there is a problem in settings saving"). That is
capability scaffolding. Does it still change the outcome with a current model?

## Setup

- Host/model: `opencode` 1.18.5, `zai-coding-plan/glm-5.2`, `--auto`, non-interactive `opencode run`.
- Target: `termetrix` (VS Code extension, 138 source files) pinned at `686bf2d`.
- Arms: **A** = only `cf-trace` available, explicitly invoked, subagent gate pre-answered `n`
  (local mode). **B** = no Cflow skill available. `OPENCODE_DISABLE_CLAUDE_CODE_SKILLS=1` in both.
- n = 3 per arm, one fresh pinned clone per run, `.cflow/trace.md` removed,
  `.cflow/architecture.md` seeded identically in both arms.
- Task (identical, Italian, no mention of skills in the shared part): reported symptom that status
  bar values sometimes do not update after changing extension settings; reconstruct the full flow
  from the configuration-change event to the status-bar update, list involved files with exact
  paths, and identify where the flow can break.

## Ground truth (established before reading any output)

`package.json` declares `termetrix.*` → `src/extension/support/configManager.ts:200` `onConfigChange`
filters on `CONFIG_SECTION_IDS.root` (`constants.ts:24` = `'termetrix'`), `subscribeAndApply` at
line 214 → **only two subscribers**: `extension.ts:128` (`applyStatusBarConfig`, visibility keys
only) and `autoRefreshController.ts:30` (timer) → status bar via `metricsItem.ts` +
`metricsStatusBarRenderer.ts`.

Break point: settings affecting computation (`getCoreScanConfig`, read at
`executeSizeScan.ts:18`) are read **only when a scan runs**. The config event fires but no
subscriber rescans, so displayed values stay stale until an independent trigger. Secondary: the
section-level filter over-notifies; `ScanCache` exposes only `get`/`set`, no invalidation;
`metricsItem.update()` (line 85) has zero callers; `autoRefresh.enabled` defaults to `false`
(`settingsDefaults.ts:27-28`), which is what makes the symptom intermittent.

## Results

| | A1 | A2 | A3 | B1 | B2 | B3 |
| --- | --- | --- | --- | --- | --- | --- |
| Wall time | 154s | 347s | 265s | 193s | 121s | 204s |
| Tool calls | 17 | 26 | 37 | **8** | 18 | 26 |
| Hallucinated paths | 0 | 0 | 0 | 0 | 0 | 0 |
| Wrong line refs | 0 | 0 | 0 | 0 | 0 | 0 |
| Primary break point | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `update()` dead code | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Intermittency explained | ✗ | ✗ | ~ | ✓ | ✓ | ~ |
| Section-filter finding | ✓ | ~ | ✗ | ✓ | ✓ | ✓ |
| False positives | 0 | 1 | 0 | 0 | 0 | 1 |

Means: **A 255s / 26.7 tool calls — B 173s / 17.3 tool calls.** The skill arm cost 47% more wall
time and 54% more tool calls.

Roughly 80 claims were verified individually against the code across the six runs.

## Findings

**Factual discipline no longer differentiates.** This was the strongest remaining argument for the
skill: an earlier gap analysis, kept out of this repository, measured 4–5 wrong claims out of ~20 in
a freeform audit. Here both arms produced zero hallucinated paths and zero wrong line references. The bare arm
cited `configManager.ts:155/200/202/214` exactly and correctly established that
`metricsItem.update()` has no callers.

**Systematic coverage went to the bare arm.** The two hardest ground-truth elements were found more
often without the skill: dead-code `update()` (B 3/3, A 2/3) and the intermittency mechanism from
the `enabled: false` default (B 2/3 fully, A 0/3). The nine lenses produced more formal finding
tables, not more complete ones.

**The recommended route is unstable.** Three identical runs returned three different routes:
`direct fix` (A1), `cf-cognitive` (A2), `cf-start` (A3). `cf-cognitive` is wrong — wiring a missing
subscription is not local cognitive complexity — so the skill generated a misroute in the one
output that is supposed to be its decisive contribution.

**Both false positives concerned claims the repository cannot falsify**: B3 asserted that
`affectsConfiguration('termetrix')` without a `scope` argument may miss folder-level changes (the
API returns true for any affected scope), and A2's misroute. No lens in the skill checks
assumptions about third-party API semantics.

**Observed preflight friction**, consistent with the contract: A3 opened with "No
`.cflow/architecture.md` exists, per the skill I should route to `cf-architecture`" before
correcting itself, and the subagent gate required a pre-injected answer to avoid stalling.

**The seeding confound does not explain the result**: B1 and B3 never read `architecture.md`
(0 references in their logs) and still found the primary break point and the dead code. B1 did so
in 8 tool calls.

## Verdict

For flow reconstruction with a current model, cf-trace produces no measurable value and costs
roughly 50% more. The result is consistent across three runs per arm and points the same way as that
earlier gap analysis, which already rated cf-trace's contribution to a freeform repository audit as
marginal.

## Limits

One task, one repository (138 files, clean and documented architecture), one model. n=3. The host is
opencode with GLM 5.2, **not Codex**, for which the skill is authored — indicative, not dispositive.
The trial covers *flow reconstruction* only. It does not test the retrospective commit-audit usage
visible in `termetrix/.cflow/trace.md`, which remains the one scenario where a residual core could
survive; that is the natural next trial.

## Open decision

Two candidate directions, unchanged by this trial except in cost evidence:

- retire cf-trace as an entrypoint and promote the nine orchestration lenses and the
  observed/inferred marking to a shared reference consumed by `cf-scenario`, `cf-start`, and a
  future `cf-audit` (which is rubric-driven by the same machinery);
- narrow it to an explicit-invocation orchestration audit, dropping reconstruction as a deliverable.

The first is better supported by the data collected so far.
