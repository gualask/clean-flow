# Shared Handoff Block — Format Trials

Status: concluded (2026-07-18). Outcome: shared serialization rejected; a shared semantic checklist retained as the working direction (authoring-rules todo item still pending) — see Conclusions. Source: artifact-format session (2026-07-18), follow-up to docs/cf-audit/cf-audit-gap-analysis.md. Trials 1–3 below are kept as the record of which information the current templates capture or miss.

Method: for realistic scenarios, write the artifact excerpt the old way (current per-skill template) and the new way (candidate shared finding block), then compare field by field to detect information loss. Scenario material reuses real findings from the qaptar freeform audit examined in the gap analysis.

## Candidate Format Under Trial (v0)

```
- finding: <one-line claim>
  evidence: <command or file:line that proves it>
  confidence: <high | medium | low> — <basis>
  route: <owning skill or direct action>
  status: <candidate | confirmed | excluded | routed>
```

## Trial 1 — cf-mr-wolf Overflow (Three Findings From One Framing Pass)

Scenario: a framing pass on the qaptar backend surfaces three findings; the overflow protocol requires persisting all of them in `.cflow/mr-wolf-notes.md` and handing off one.

### Old Way (current mr-wolf-notes template)

```
## Findings

- confirmed candidates: F1 permissions allowlist gap — cmd_export_data, cmd_import_data
  registered in generate_handler! but absent from permissions/default.toml
- candidates to verify: F2 useReportFilters hook recomputes on every render; memo deps
  include an unstable callback
- excluded false positives: F3 adapter wiring duplication — shared factory createAdapter
  already covers it; residual duplication is 2 lines per adapter

## De-risk checks

- per-candidate matrix:
  - F1 | backend-commands | static-signal | confirmed | reachable from UI export button | none found | in scope | one-line toml fix | invariant declared in AGENTS.md
  - F2 | frontend-hooks | detector | to-verify | render profiling not done | parent may memoize | in scope | unclear | needs behavioral check
```

### New Way (candidate block v0)

```
- finding: Tauri commands cmd_export_data/cmd_import_data missing from permissions allowlist
  evidence: grep -n cmd_export permissions/default.toml → no match; registered in src-tauri/src/main.rs:41
  confidence: high — invariant declared in AGENTS.md, check is mechanical
  route: direct fix
  status: confirmed

- finding: useReportFilters recomputes on every render; memo deps include an unstable callback
  evidence: src/hooks/useReportFilters.ts:88 — deps array includes inline closure
  confidence: low — render profiling not done; parent may memoize
  route: cf-cognitive
  status: candidate

- finding: adapter wiring duplication across adapters
  evidence: createAdapter factory in src/adapters/factory.ts already covers it; residual is 2 lines per adapter
  confidence: high — helper verified present and used
  route: none
  status: excluded
```

### Loss Analysis

| Old information | In v0 block? | Severity of loss |
| --- | --- | --- |
| Claim, evidence, route, status | yes | — |
| Slice linkage (`backend-commands`, `frontend-hooks`) | lost | real: resuming the slice map in a later session cannot tell which slice produced the finding |
| Evidence class (`static-signal`, `detector`) | lost | real: behavioral-vs-detector separation is a pack discipline (decomposition.md) and drives what "verify" means for a candidate |
| De-risk dimensions (reachability, counter-evidence, scope fit, fix-fit) | compressed into the confidence basis | real: the structured record of what was checked vs not checked disappears; a later session cannot resume de-risking without redoing it |

Verdict: v0 is lossy for mr-wolf. The lost fields are exactly the pack's evidence discipline, not decoration.

## Trial 2 — cf-trace Audit Findings

Historical: `cf-trace` was retired on 2026-07-25 (`docs/skill-value-trials/`). The trial is kept
because the format conclusions stand on their own; the template it compares against no longer exists.

Scenario: a trace of the qaptar export workflow finds a resume defect.

### Old Way (current trace template, "Audit findings" section)

```
- severity: high
  - lens: state and resume
  - finding: partial completion leaves export.tmp on disk; resume path re-reads it as fresh
  - evidence: src-tauri/src/export/writer.rs:132 writes tmp before validation; resume.rs:57 globs *.tmp without age check
  - impact: a crashed export silently corrupts the next export's output
  - recommended route: cf-start
```

### New Way (candidate block v0)

```
- finding: partial completion leaves export.tmp on disk; resume path re-reads it as fresh
  evidence: src-tauri/src/export/writer.rs:132 writes tmp before validation; resume.rs:57 globs *.tmp without age check
  confidence: high — both sides of the defect read directly in code
  route: cf-start
  status: confirmed
```

### Loss Analysis

| Old information | In v0 block? | Severity of loss |
| --- | --- | --- |
| Finding, evidence, route | yes | — |
| Severity (`high`) | lost | real: ranking findings for the handoff order needs it; confidence is not severity (a low-impact fact can be high-confidence) |
| Lens (`state and resume`) | lost | moderate: the lens ties the finding back to the template's "Lens coverage" checklist; losing it breaks the coverage cross-check |
| Impact (consequence statement) | partially foldable into the claim | moderate: folding impact into the claim makes one-line claims bloated; keeping it separate is cheap |

Verdict: v0 is lossy for trace too. Severity and impact are general-purpose fields, not trace-specific: any consumer ordering multiple findings wants them.

## Trial 3 — Promotion To todo.md And Chat Handoff

Scenario: finding F1 from trial 1 is promoted to a todo next step; the same finding is delivered as the chat handoff.

### Old Way

Manual translation, performed differently each time:

```
- [ ] Add cmd_export_data/cmd_import_data to permissions/default.toml — done when: both
  commands listed and export works from the UI (src-tauri/src/main.rs:41)
```

### New Way

Mechanical mapping: `finding`→action rationale, `evidence`→`(<ref>)`, `route`→who acts. The done-when criterion does not exist in either the old or the new source format — promotion is additive by design (cf-todo requires an observable criterion the finding does not carry).

Verdict: no loss in either direction; the shared block makes the mapping mechanical but a human/skill still supplies the done-when. This trial passes with v0 unchanged.

## Reader-Side Reassessment

The trials above evaluated writer-side information capture. A follow-up review of the reader side dissolved the case for a shared serialization:

- The consumers of these artifacts are models, not parsers. A model reads four heterogeneous formats at the same cost as one and does not break on an unknown shape. "One format to know", mechanical promotion, and cross-artifact ranking all work on heterogeneous formats too — provided the information exists.
- A shared format pays only when at least two writers write the same file. The pack is single-writer everywhere by design, including the overflow flow, where the only writer of `todo.md` is `cf-todo`, which normalizes on entry. No shared multi-writer file exists or is planned.
- What a model cannot do is recover information that was never written. That is the only real loss the trials measured: the gaps are content gaps, mislabeled as format losses.

## Conclusions

1. **Shared serialization (v0 and the two-layer v1 direction) is rejected.** The reader-side reassessment removes its benefits; its costs (template migration, a shared internal API to version, risk of eroding writer-side scaffolding such as the mr-wolf de-risk matrix) remain. Templates stay per-skill; the single-writer rule stays the invariant that keeps formats a non-problem.
2. **What the trials actually identified is a semantic checklist**: the minimum information a finding must capture regardless of shape — claim, evidence (command or file:line), severity, impact (when not self-evident), confidence with its basis, route, status. Trial 2 showed severity and impact are consumer-relevant for any finding; trial 1 showed the de-risk record is what makes a finding resumable.
3. **Current templates have asymmetric content gaps** against that checklist: `trace.md` captures severity/impact but no structured confidence; `mr-wolf-notes.md` captures confidence and de-risk but no severity. These are content defects independent of any format decision.
4. **Adoption path**: record the checklist in the pack authoring rules (`docs/maintaining-this-pack.md` or `docs/golden-rules.md`), expressed as required information, not required serialization. Apply it to a template only when that template is being touched anyway; no migration pass. The first natural application is cf-audit, whose finding shape does not exist yet.

## Next Trials Worth Running

- A resume trial: open a fresh session with only an artifact written under the checklist (own format, complete content) and check whether de-risking and slice work can actually continue. This validates content completeness, which is the surviving concern.
- cf-audit's invariant-compliance table: verify its rows carry the checklist information (evidence command, severity, route) in table form — part of cf-audit design, not blocked on any format work.
