# Todo — cf-audit and pack evolution (sources: docs/cf-audit/cf-audit-gap-analysis.md, docs/handoff-format/format-trials.md, cf-review implementation session)

## Next steps

- [ ] Deepen the cf-audit analysis and resolve the open design questions below — done when: each question is decided or discarded and the outcome is reflected in docs/cf-audit/cf-audit-gap-analysis.md (docs/cf-audit/cf-audit-gap-analysis.md)
- [ ] Decide go/no-go on adding cf-audit to the pack — done when: the decision and its rationale are recorded in the design note (docs/cf-audit/cf-audit-gap-analysis.md)
- [ ] Harden the cf-mr-wolf overflow protocol — done when: cf-mr-wolf carries a deterministic rule that two or more independent actionable findings force persisting all of them (.cflow/mr-wolf-notes.md + todo via cf-todo) and handing off a single item (skills/cf-mr-wolf/SKILL.md, docs/cf-audit/cf-audit-gap-analysis.md "Two Distinct Problems")
- [x] Record the finding-content checklist in the pack authoring rules — done when: docs/maintaining-this-pack.md or docs/golden-rules.md requires every finding-recording artifact section to capture claim, evidence, severity, impact, confidence with basis, route, and status — as required content, not required serialization — applied to a template only when that template is already being touched (docs/handoff-format/format-trials.md "Conclusions")
- [ ] Run the skill-value trial for cf-review — done when: docs/skill-value-trials/ holds a trial with its predeclared value claim, population, controlled inputs, oracle, metrics, and stopping rule, plus a recorded verdict (docs/skill-value-trials/trial-method.md)
- [ ] Smoke-check cf-review on a target repo with a real pending change set — done when: the pack installs, skills/cf-review/references/ contains the vendored shared files, no .codex/skills/_shared appears, and a full sweep runs end to end (docs/maintaining-this-pack.md "Manual Smoke Checks")
- [ ] Redraw the cf-audit boundary against cf-review — done when: the design note states which sections stay repo-wide-only now that the pending-change-set scope is taken, and whether the two share one rubric source (docs/cf-audit/cf-audit-gap-analysis.md)

## Open questions

- Name and scope: `cf-audit` vs `cf-health`, and which sections belong in v1 — invariant compliance, hygiene sweep, tooling snapshot, design-smell detector sweep.
  - Impact: defines the skill description and its boundary against `cf-architecture` and the diagnostic lens `cf-scenario`.
  - Possible direction: hypothesis — `cf-audit` with all four sections: the tooling snapshot is cheap and observational, and the smell sweep is candidates-only by contract; the description must carry an explicit non-use boundary routing impact analysis to `cf-scenario`. Note: `cf-trace` was retired (see docs/skill-value-trials/), so no skill owns path reconstruction — the boundary can no longer delegate flow-level suspicion and must state that the audit simply does not do it.
  - Needed to decide: check the resulting SKILL.md description does not overlap `cf-architecture` routing, and that it does not attract the probe request "credo ci sia un bug nel flusso della feature X, puoi indagare?" — that request must keep routing to `cf-mr-wolf`, never to the audit.
- Where invariants come from: only declared sources (AGENTS.md, docs, `.cflow/architecture.md`) or also a user-provided checklist.
  - Impact: determines whether the skill is useful in repos with no written invariants.
  - Possible direction: hypothesis — declared sources first; when none exist, report "no declared invariants" instead of inventing checks.
  - Needed to decide: try the flow mentally on a repo without AGENTS.md.
- Artifact ownership: does cf-audit write a `.cflow/audit.md` artifact, hand findings to `cf-todo`, or both.
  - Impact: resumability and interaction with `cf-start` preflight rules.
  - Possible direction: hypothesis — some persistence is required: the intended follow-up flow works findings one at a time in new sessions, so conversation output only does not survive long enough (see design note "Persistence implication").
  - Needed to decide: choose between todo.md handoffs via cf-todo and a dedicated `.cflow/audit.md`, and check the interaction with `cf-start` preflight rules. `cf-review` took the cf-todo route and owns no artifact, which keeps it out of `cf-start` preflight entirely; whether a repo-wide sweep survives on the same mechanism is untested, since its finding set is larger and its follow-up spans more sessions.
- Recon mode: reuse the clean-context subagent pattern from `cf-architecture` or run in-context only.
  - Impact: factual reliability of the sweep vs added ceremony.
  - Possible direction: hypothesis — same y/n reconnaissance gate as `cf-architecture`, since evidence quality is the whole point of the skill.
  - Needed to decide: check subagent availability assumptions in the shared authoring files.
- Overlap guard: how the skill avoids drifting into `cf-simplify` territory when a finding is interesting.
  - Impact: keeps the pack's one-lens-per-skill routing coherent.
  - Possible direction: hypothesis — the detector/verifier contract: the audit only marks candidates with evidence and never promotes them to confirmed; confirmation and fixing happen in the receiving skill after handoff (design note, "Detector/verifier contract").
  - Needed to decide: review against docs/golden-rules.md before drafting SKILL.md. `cf-review` implements the contract as two hard gates — candidates only, and routing held until the sweep ends — so the drafting question narrows to whether those gates hold without a change set to bound the pass.
- Missing local ownership lens: misplaced responsibility, false ownership, god object have no owning skill at area level — `cf-cognitive` is in-file readability, `cf-cohesion` is file placement, `cf-split` is single-file extraction, `cf-start` is repository level.
  - Impact: completes the local lens family and gives cf-audit's design-smell candidates a valid route target; without it, those handoffs default to `cf-start` even when local.
  - Possible direction: hypothesis — a separate sibling skill (name to decide, e.g. `cf-responsibility`) rather than extending `cf-cohesion`, since moving responsibilities changes call structure and interfaces while cohesion only moves files.
  - Needed to decide: boundary test against `cf-cohesion`, `cf-split`, and `cf-start`; confirm every audit smell candidate would have an owning route. Now demonstrated by a shipped consumer: `cf-review` has a responsibility lens whose findings have no owning skill and fall through to the `cf-mr-wolf` catch-all, so the gap is reachable from a normal pre-commit pass, not only from a hypothetical audit. The lens also bounds what the sibling skill would inherit — one nameable owner per finding, converging once fixed — which rules out the repeated-shape smells that would otherwise land in its scope.
