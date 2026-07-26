# cf-audit — Gap Analysis And Design Direction

Status: working draft. Everything below is hypothesis or direction sketch unless explicitly marked decided; the go/no-go on cf-audit is open. Sources: comparison session (2026-07-18) between a freeform LLM repository audit and the coverage of the current Clean Flow skill pack; follow-up sessions (2026-07-18/19) on skill-vs-mr-wolf placement and on the checklist-driven audit flow.

## Origin

A freeform audit of a real repository (qaptar: Tauri v2 + Rust backend, React 19 frontend, ~26k LOC) was produced by a general-purpose coding agent from the single request "verify the repo". The question examined here: would Clean Flow have produced an equivalent result, and if not, what is missing?

## What The Freeform Audit Contained

1. Repository identity and size stats (file counts, LOC per side).
2. Architecture map with layering verification (hexagonal boundaries, dependency direction, adapter isolation).
3. Verified strengths via hygiene greps (zero TODO backend, zero `any`/`@ts-ignore`, error-type policy confinement, strong discriminated unions).
4. One real blocking runtime bug: two Tauri commands registered in `generate_handler!` but missing from the permissions allowlist — found by checking a rule declared in the repo's `AGENTS.md` against the code.
5. Code smells with `file:line` references (oversized files, duplicated wiring, fat hooks, ineffective memo deps, inconsistent helper reuse).
6. Tooling and config snapshot (build, lint, CSP, absence of CI) with a CI recommendation.

Accuracy check of that audit: out of ~20 verifiable claims, 4–5 were factually wrong (wrong absolute counts, wrong file path, wrong line numbers, one finding misframed because an existing helper was missed). The architectural diagnosis and the blocking bug were correct.

## Where The Audit Behavior Came From

The tool that produced the audit ships no audit skill, agent, or dedicated prompt: the quality came from the model improvising on an open request. The one decisive ingredient was that the target repo's `AGENTS.md` was loaded into context, and the model took the initiative to verify a declared invariant ("every `#[tauri::command]` must be listed in `permissions/default.toml`") against the code. That is how the only real bug was found.

Conclusion: there is no methodology to borrow. The borrowable insight is the pattern — systematically verify declared invariants against the code — not any implementation.

## Coverage Mapping Against Current Clean Flow

| Audit component | Clean Flow coverage |
| --- | --- |
| Identity, architecture map, layering | `cf-architecture` covers it, likely with higher factual quality (template rubric, clean-context recon) |
| Code smells per area | `cf-simplify` / `cf-cognitive` / `cf-split`, but only when pointed at an area, one area per pass |
| Declared-invariant compliance (the real bug) | Not covered. `cf-architecture` records "Observed invariants" but is explicitly observational: recording ≠ verifying |
| Repo-wide hygiene sweep (TODO, type escape hatches, error policy) | Not covered by any skill |
| Tooling / config / CI snapshot | Not covered by any skill |
| One-shot broad deliverable | Actively prevented by design: `cf-start` Frame Gate intercepts broad diagnostic requests, Verification Gate forbids checks during assessment, `cf-simplify` routes repo-level perimeters away. Equivalent coverage needs ~4 invocations |

The gates are a feature, not a bug: they are the mechanism that avoids the freeform audit's factual error rate. The trade-off is breadth vs reliability, and both sides are real.

## Two Distinct Problems

The follow-up session separated two needs that were initially conflated:

- **A missing lens (cf-audit proper)**: invariant compliance, repo-wide hygiene sweep, tooling/CI snapshot. No current skill owns these checks; this is a genuine coverage gap and the subject of this note.
- **A missing overflow protocol**: when any analysis (typically `cf-mr-wolf`) surfaces multiple actionable findings, doing them all in one pass degrades quality. The wanted behavior is: stop, persist every finding with its evidence, then deep-dive one item at a time, possibly in fresh sessions.

The overflow protocol is not a new skill. Its mechanisms already exist in the pack: the `cf-mr-wolf` decomposition slice map (statuses, sequential analysis, no completed handoff while slices are open), `.cflow/mr-wolf-notes.md` for durable evidence, and `cf-todo` for cross-session tracking. What is missing is a deterministic trigger — the notes-file rule is discretionary ("when evidence or decisions need durable handoff"). The fix is a hardening of `cf-mr-wolf`: when evidence produces two or more independent actionable findings, the only permitted outcome is to persist all of them (notes + todo via `cf-todo`) and hand off a single item. That is an edit to existing skills, tracked separately from the cf-audit go/no-go.

## Why Not A cf-mr-wolf Branch

Current position (draft): implementing the audit as a flow inside `cf-mr-wolf` is discarded. Three conflicts with mr-wolf's own design:

1. Its Hard Stop exists precisely to block broad diagnostic sweeps without a confirmed lens; an audit is by definition broad and multi-section.
2. Mr-wolf forbids running checks during framing; the audit lives on executed checks with evidence commands.
3. Mr-wolf is decisional (frame, plan, judge); the audit is observational (measure, verify, report).

The sharpest way to state the difference: mr-wolf is request-driven — its Hard Stop asks "which lens should drive the check?" and derives slices from the answer; the audit is rubric-driven — its checklist is the pre-compiled answer ("all of these, mandatorily"). Opposite triggers, not variants of one flow.

The correct relationship is routing: `cf-mr-wolf` may route to `cf-audit` when the request is a repository health check, the same way it routes to `cf-architecture` when the map is missing.

## Design Direction For cf-audit (Draft)

A new public entrypoint: one-shot, read-only, repository-level health audit, driven by a template checklist.

- **No Frame Gate**: the audit is the frame. Explicit invocation, like `cf-brainstorm`. The audit stays hypothesis-free: a suspected bug in a specific flow is not audit work and keeps routing to `cf-mr-wolf`.
- **Template-driven checklist**: the audit runs from a template listing the mandatory checks (the musts); the model may extend the list based on repo type, but may not skip a must. The checks fall into two families:
  - **Judgment-free checks**: invariant compliance (collect invariants declared in `AGENTS.md`, docs, `.cflow/architecture.md` "Observed invariants"; run each concrete check and report pass/fail with the evidence command — this systematizes what the freeform audit found by luck); hygiene sweep with verified numbers (TODO/FIXME counts, type escape hatches, error-policy confinement, oversized files — every claim backed by the command that produced it); tooling/CI snapshot, stated observationally.
  - **Design-smell detector sweep**: mandatory smell checks (god object, misplaced responsibility, false ownership, …; exact must-list to be defined in the template) recorded as candidates only.
- **Detector/verifier contract**: the audit may only mark candidates with evidence (`status: candidate`; false positives expected and declared). Confirmation (de-risk) and fixing belong to the receiving skill after handoff, in its own session. The audit never promotes a candidate to confirmed, never classifies necessity, never reconstructs paths. This contract is also the overlap guard toward `cf-simplify` and `cf-split`.
- **Finding content**: every finding carries the finding-content checklist fields (claim, evidence, severity, impact, confidence with basis, route, status — see docs/handoff-format/format-trials.md), in the audit's own format.
- **Handoffs, not recommendations**: each finding routes to the owning skill instead of prescribing fixes. Known gap: misplaced-responsibility / false-ownership candidates currently have no owning skill to route to — the local ownership lens is missing from the pack (open question in todo.md); that lens is a partial prerequisite for audit handoff quality.
- **Output sections** (sketch): short map recap → invariant compliance table → hygiene findings → smell candidates → tooling snapshot → handoffs. No refactor planning inside the audit.
- **Persistence implication**: the intended follow-up flow — candidates worked one at a time, possibly in new sessions — requires the audit result to survive the session. This weighs the artifact open question toward persistence (todo via `cf-todo` and/or a `.cflow/` artifact) rather than conversation output only.

## Open Design Questions

Recorded in `todo.md` at the repository root; decide them there, one at a time (route hard framing to `cf-mr-wolf`).
