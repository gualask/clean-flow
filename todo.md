# Todo — pack evolution (sources: docs/handoff-format/format-trials.md, cf-review implementation session, pending-change Golden Rules review)

## Next steps

- [x] Record the finding-content checklist in the pack authoring rules — done when: docs/maintaining-this-pack.md or docs/golden-rules.md requires every finding-recording artifact section to capture claim, evidence, severity, impact, confidence with basis, route, and status — as required content, not required serialization — applied to a template only when that template is already being touched (docs/handoff-format/format-trials.md "Conclusions")
- [ ] Run the skill-value trial for cf-review — done when: docs/skill-value-trials/ holds a trial with its predeclared value claim, population, controlled inputs, oracle, metrics, and stopping rule, plus a recorded verdict (docs/skill-value-trials/trial-method.md)
- [ ] Smoke-check cf-review on a target repo with a real pending change set — done when: the pack installs, skills/cf-review/references/ contains the vendored shared files, no .codex/skills/_shared appears, and a full sweep runs end to end (docs/maintaining-this-pack.md "Manual Smoke Checks")
- [x] Reconcile the shared context policy with cf-review's mandatory complete change-set sweep — done when: the runtime contract defines one unambiguous `batched` behavior for oversized review corpora without silently replacing the full sweep with independent partial reviews (skills/_shared/references/dynamic-agents.md, skills/cf-review/SKILL.md)
- [x] Close the cf-test terminal-agent test-execution loophole — done when: the stable protocol and prose both forbid every test execution, including focused tests, and their contract test prevents the wording from drifting (skills/cf-test/references/test-agent-brief.md)
- [x] Align the cf-review maintainer flow with the controller's evidence-verification responsibility — done when: the docs mirror no longer says the controller does not de-risk candidates while the runtime requires it to verify cited evidence (docs/review/doc-review.flow.md, skills/cf-review/SKILL.md)
- [x] Align the cf-mr-wolf maintainer flow with the deterministic context gate — done when: the de-risk-agent description reflects gate-selected delegation instead of promising dispatch to any available subagent (docs/mr-wolf/doc-mr-wolf.flow.md, skills/_shared/references/dynamic-agents.md)

## Open questions

None.
