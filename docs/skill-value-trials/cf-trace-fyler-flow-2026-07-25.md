# Trial — cf-trace on flow reconstruction, larger repository (2026-07-25)

Method: `trial-method.md`. Third trial in the cf-trace series. Status: complete at n=1 per arm.

## Question

The first two trials ran on `termetrix` (138 source files, single language). If cf-trace's value is
giving the model cognizance of the files involved, that value should **grow** with repository size
and with boundaries the model must cross. `fyler` is roughly three times larger (401 source files)
and cross-language: React/Vite frontend, Rust/Tauri backend, communicating over IPC.

## Setup

`opencode` 1.18.5, `zai-coding-plan/glm-5.2`, `fyler` pinned at `90ffbfd`, `.cflow/architecture.md`
seeded identically in both arms, no other `.cflow` artifact carried over. Arm A = only `cf-trace`,
explicitly invoked, subagent gate pre-answered `n`. Arm B = no Cflow skill.

**Runs were executed strictly sequentially**, one at a time, following the contention failure
documented in `cf-trace-commit-audit-2026-07-25.md`. The provider log records **zero `stream error`
events** in either run's window, so the timings here are clean.

n = 1 per arm. Arm A was capped by a 16-minute deadline (see Limits).

Task: reconstruct the full password-protected PDF import flow, from the user adding the file to
successful unlock or skip; list involved files with exact paths, give the sequence across the
frontend/backend boundary, and identify where the flow can break.

## Ground truth (established before reading any output)

Entry (`add-files-action.hook.ts`, `file-drop.hook.ts`) → platform boundary (`src/infra/platform/`,
`unlockPdfSource`) → Rust IPC (`src-tauri/src/commands/sources.rs`, `models.rs` returning
`passwordRequired`, `error.rs` mapping `InvalidPdfPassword` → `invalid_pdf_password`) → the
11-file / 665-line state machine in `src/features/workspace/hooks/protected-pdf-import/` → dialog
components → password cache in `src/infra/pdf/pdf-cache/`.

Genuine defect (low): `unlockRemainingWithPassword`
(`protected-pdf-import.logic.ts:94-101`) pushes **any** throwing file onto `stillLocked` without
discriminating the cause, and `protected-pdf-submit.hook.ts:48` then passes
`'previous-password-failed'` unconditionally. A non-password failure surfaces to the user as "the
previous password was wrong".

Two verified **false-positive traps** — code that looks suspicious but is correct:

- **N1** the `unlockInFlightRef` guard is reset on every exit path: success
  (`protected-pdf-dialog-controller.hook.ts:61`), completion (`:49`), failure
  (`protected-pdf-submit.hook.ts:61`). There is no stuck-guard bug.
- **N2** cached passwords are evicted per file (`releasePdfDocument` → `docPasswordsRef.delete`) and
  wholesale (`clear()`). There is no unbounded password retention.

Because the flow is well built, this trial doubles as a direct test of cf-trace's explicit promise:
"Do not invent findings. If a lens has no evidence-backed issue, record `none found from current
evidence`." Arm B carries no such instruction.

## Results

| | A1 (cf-trace) | B1 (bare) |
| --- | --- | --- |
| Wall time | **>960s, killed at deadline** | **214s** |
| Tool calls | 45 | 53 |
| Delivered a report | **✗** | ✓ |
| `.cflow/trace.md` written | ✗ | n/a |
| Files cited | — | ~25, TS + Rust |
| Hallucinated paths | — | **0 / 12 checked** |
| Wrong line references | — | **0 / 13 checked** |
| Break points identified | — | 9, three ranked most likely |
| False-positive trap N1 | — | **passed** (explicitly called handled) |

## Findings

**The bare arm was factually perfect across a language boundary.** Every one of B1's sampled claims
verified exactly, including Rust internals: `registry.rs:178/188/197/205` (`begin_unlock`,
`restore_pending_unlock`, `finish_unlock`, `discard_pending_paths`), `pdf/metadata.rs:10/20`,
`import.rs:118/230`, `source_registration.rs:72/82`, `commands/sources.rs:216/250`,
`app-error.ts:47`. Zero hallucinated paths in a 401-file repository. The hypothesis that a larger,
cross-language repository would expose a factual-discipline gap is falsified.

**The bare arm passed the false-positive trap unaided.** B1's break-point 4 states that the skip
buttons are guarded by `unlockInFlightRef` and "la race lato FE è gestita" — correctly declining to
report N1 as a defect. cf-trace's anti-invention clause had no opportunity to differentiate, since
arm A produced nothing, but the clause's premise — that a bare model invents findings on clean code
— did not hold here.

**One imprecision, thesis intact.** B1 argued the password-detection heuristic is narrow and gave
`lopdf::Error::Unimplemented` with "encrypted"/"password" as the example — which
`pdf/metadata.rs:26-33` actually does cover. The underlying claim stands (classification is by
enumeration; anything not downcastable to `lopdf::Error` returns `false` and lands in
`OpenPdfFailed`), but the illustrating example was wrong.

**The skill actively obstructed, rather than merely costing more.** This is the first trial where
arm A did worse in kind, not only in degree. A1's last eight reads were peripheral to the flow —
`app-notifications.hook.ts`, `tauri-notification-events.hook.ts`, `AppContent.tsx`,
`workspace-source-events.hook.ts`. At tool call 45 it was still widening scope, not converging, and
had not begun writing the artifact. B1 converged in 53 calls because it targeted the question;
cf-trace requires populating every template section (inputs and triggers, state and artifacts,
external effects, failure and resume paths) and then auditing through nine lenses. That completeness
mandate does not scale with repository size: the bigger the repository, the more it diverges.

Note the tool-call counts are comparable (45 vs 53) while wall time differs 4.5×. The gap is not
more work but more expensive turns — the skill's `SKILL.md`, references, template, and the seeded
architecture map ride in context on every turn.

## Verdict

On the scenario where cf-trace should have been strongest — a large, cross-language repository where
"knowing which files matter" is genuinely hard — the bare model delivered a complete, factually
perfect reconstruction in 214 seconds, and the skill arm delivered nothing in over four times that.
The value proposition is inverted: cf-trace's cost grows with repository size faster than its
benefit, because its deliverable is defined by template completeness rather than by the question.

## Limits

**n = 1 per arm** — much weaker than the n=3 of the first two trials, and the single most important
caveat here. **Arm A's non-delivery is bounded by a deadline I imposed** (16 minutes, chosen after a
6-way parallel batch had already burned 35 minutes): with an unbounded budget A1 might have
finished. What is measured is therefore "did not deliver within 4.5× the bare arm's time", not
"cannot deliver". The scope-drift evidence is independent of the deadline and does not depend on it.

One repository, one model, one host (opencode + GLM 5.2, not Codex). The trial covers flow
reconstruction only.

## Series conclusion

Three scenarios, three negative results, now including the one predicted to favour the skill most:

| Trial | Scenario | Outcome |
| --- | --- | --- |
| `cf-trace-flow-reconstruction` | small repo, flow | parity on accuracy, arm A ~50% slower |
| `cf-trace-commit-audit` | small repo, diff audit | arm B found more (2/4/4 vs 2/3/0) |
| this | large cross-language repo, flow | arm B complete in 214s; arm A nothing in >960s |

The direction is consistent and the mechanism is now understood, which matters more than the sample
size: reconstruction is commoditised, the rubric does not add coverage, and template-driven
completeness scales against the user on large repositories. The recommendation to retire cf-trace as
an entrypoint stands, with the lens list rebuilt from observed misses if it is carried into
`cf-audit` at all.
