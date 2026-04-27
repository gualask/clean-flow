# cf-mr-wolf Flow

## Purpose

Document the runtime flow for `cf-mr-wolf`, the public entrypoint for clarifying unclear problems, feature ideas, refactors, architecture changes, and implementation tasks before execution.

## Runtime Inputs

- Public skill: `skills/cf-mr-wolf/SKILL.md`
- Custom agent source: `skills/_codex_agents/cflow_candidate_finding_recon.toml`
- Custom agent source: `skills/_codex_agents/cflow_finding_derisk_recon.toml`
- Current conversation and user request
- Focused repository context selected from the problem frame
- Notes artifact: `.cflow/mr-wolf-notes.md`, created from `skills/cf-mr-wolf/assets/mr-wolf-notes.template.md`

## Flow

1. Trigger `cf-mr-wolf` directly, or route from `cf-start` when the upstream problem is too unclear for Cflow assessment.
2. If no concrete problem or task is present, ask exactly one question: what problem should be solved.
3. If a problem exists, read `.cflow/mr-wolf-notes.md` when present, or create it from the template when missing.
4. Decide whether existing notes are relevant to the current request and repository state; reuse relevant notes or overwrite stale/unrelated notes.
5. Frame the apparent goal, uncertainty, likely scope, and success criteria.
6. Choose the smallest context slice that can confirm or reject the frame.
7. If the goal is clear but the possible work area is large, ask one focused scoping question before broad inventory when the answer can reduce candidate areas, priority, success criteria, constraints, or validation.
8. Run the problem-framing pass first; do not use specialist skills as generic discovery before the problem frame or candidate area is clear.
9. Run the bounded analysis pass: choose relevant evidence channels such as MCP resources/tools, system commands, bundled repo tree output, deterministic `/tmp` scripts, and specialist skills that clearly match the bounded problem.
10. If a specialist skill is used, apply its review lens only to the selected context slice or a narrower one, and record only the specialist skills actually used plus why.
11. Record only evidence-producing tools in `evidence tools used`; do not list note-writing/editing tools as evidence.
12. For repo-wide or multi-candidate work, run broad inventory, narrowing pass, candidate discovery, and finding de-risk checks before calling the context sufficient.
13. When bounded evidence plus the selected context slice is context-heavy, use `cflow_candidate_finding_recon` when available; pass only repository path, problem frame, success criteria, non-goals, bounded evidence path/summary, selected context slice, and exclusions.
14. Do not cap candidate findings at three; carry forward all materially relevant candidates, grouping equivalent findings and naming minor, deferred, out-of-scope, or non-actionable observations when they affect the decision.
15. When bounded analysis produces candidate findings and the next step might be a fix, route, or completed handoff, select all or the decision-blocking subset for de-risk.
16. When finding de-risk is multi-candidate, call-path-heavy, or context-heavy, use `cflow_finding_derisk_recon` when available; pass only repository path, problem frame, assigned candidate findings, selected context slice, and exclusions.
17. Run custom agents sequentially only; wait for the current report before starting any later discovery or de-risk pass, and never run multiple custom agents at the same time.
18. Treat custom-agent reports as the primary discovery or finding de-risk scan; merge any sequential reports before sufficiency, fix recommendation, or completed handoff; spot-check only gaps, contradictions, or unsupported evidence.
19. Classify each de-risked finding as confirmed, false-positive, or uncertain.
20. Inspect only the selected evidence, then separate signal from noise and update the notes.
21. Assign an investigation confidence percentage and record the basis.
22. Recap whether the context is sufficient to continue; `sufficient` requires at least 80% confidence unless the user explicitly accepts the risk, and repo-wide or multi-candidate work stays below 80% if deterministic inventory, focused verification, finding de-risk checks, used-channel notes, or required skipped-channel reasons are missing.
23. If context is insufficient, ask one focused question or inspect the next smallest justified slice.
24. If the evidence points to cleanup/refactor candidates, stop at evidence-backed handoff and recommend `cf-start` instead of jumping directly to execution skills.
25. If the evidence points to an unclear multi-step path, ordering risk, state gap, or workflow flaw but not yet to a specific refactor, recommend `cf-trace`.
26. Once clear enough, recommend a direction or present 2-3 options with trade-offs.
27. Select a short recommended next step with a reason, naming a specialized available skill when it clearly owns the best follow-up.
28. For Cflow cleanup/refactor work, ask whether to preserve the discovery through `.cflow/refactor-brief.md` and continue with `cf-start`; do not create that brief directly from `cf-mr-wolf`.

## Contracts

| Situation | Required behavior | May edit code |
| --- | --- | --- |
| invoked without a problem | ask what problem must be solved before inspecting repository context | no |
| invoked with a problem | read or create `.cflow/mr-wolf-notes.md`, then reuse or reset it based on relevance | no |
| ambiguous problem | inspect only the smallest relevant context slice, recap sufficiency, ask one focused question if needed | no |
| clear goal with broad possible scope | ask one focused scoping question before broad inventory when the answer can materially narrow the work | no |
| many deterministic inputs | use commands, bundled repo tree output, or temporary `/tmp` scripts for mechanical analysis, then interpret the compact output | no |
| relevant specialist skill used | apply it only as a review lens over the selected context slice, record why it was used, and keep final judgment in the handoff | no |
| bounded evidence is context-heavy | use `cflow_candidate_finding_recon` when available, then treat its report as the primary candidate discovery scan | no |
| candidate discovery finds more than three material findings | carry all material candidates forward, grouping equivalents and naming minor, deferred, out-of-scope, or non-actionable observations | no |
| finding de-risk is multi-candidate, call-path-heavy, or context-heavy | use one `cflow_finding_derisk_recon` pass at a time, then merge any sequential reports as the primary finding de-risk scan | no |
| any custom agent is used | run agents sequentially only; never run multiple custom agents at the same time | no |
| candidate finding might lead to a fix or handoff | classify each finding as confirmed, false-positive, or uncertain with reachability and fix-fit evidence before recommending implementation | no |
| repo-wide or multi-candidate discovery | run broad inventory, narrowing pass, finding de-risk checks, and record confidence before declaring sufficiency | no |
| cleanup/refactor candidate list | summarize evidence and hand off to `cf-start`; do not route straight to `cf-split`, `cf-cognitive`, or `cf-cohesion` unless the user requested one explicit local action | no |
| clear enough for options | present recommended direction first, with only real alternatives and trade-offs | no |
| completed handoff | separate confirmed, false-positive, and uncertain findings; include fix-fit before recommending implementation; name a specialized available skill when it clearly owns the follow-up | no |
| false positives | record only important excluded false positives, not every non-candidate file | no |
| explicit skip | note the biggest missing requirement or risk briefly, then hand off or proceed as authorized | only after handoff |
| routed from `cf-start` | clarify upstream problem and return a handoff; keep notes current but do not write `.cflow/architecture.md` or `.cflow/refactor-brief.md` | no |

## Review Checks

- The skill is a pragmatic problem fixer, not a generic planning worksheet.
- It asks for the problem first when invoked without instructions.
- It narrows context before reading, and avoids whole-repository scans by default.
- It asks one scoping question before broad inventory when a clear goal still leaves an unnecessarily large work area.
- It separates problem framing from bounded analysis.
- It uses available tools, bundled repo tree output, and deterministic temporary scripts instead of making the model do mechanical analysis.
- It considers clearly matching specialist skills only after the problem frame or candidate area is bounded.
- It records only specialist skills actually used, plus why.
- Specialist skill evidence informs the handoff; it does not replace direct evidence or final judgment.
- It recommends specialized available skills as next steps when they clearly own the follow-up.
- It does not declare discovery sufficient below 80% confidence unless the user accepts the risk.
- It narrows repo-wide investigations through broad inventory, candidate verification, and finding de-risk checks.
- It does not cap candidate findings at three.
- It runs custom agents sequentially only.
- It does not recommend fixes for candidate findings until reachability, false positives, and fix-fit have been checked or explicitly handed off for verification.
- It keeps `.cflow/mr-wolf-notes.md` as compact investigation notes, not an execution plan.
- It records `confirmed candidates`, `candidates to verify`, and `excluded false positives`, not exhaustive rejected lists.
- It states what context was excluded as noise and why.
- It hands multi-file cleanup/refactor discovery to `cf-start` rather than starting execution skills directly.
- It does not create large specs for small tasks.
- It does not create or update `.cflow/architecture.md` or `.cflow/refactor-brief.md`.
- `cf-start` remains the controller for Cflow assessment, planning, execution, review, verification, feedback intake, and resume.
