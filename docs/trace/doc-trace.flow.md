# cf-trace Flow

## Purpose

Document the runtime flow for `cf-trace`, the public path reconstruction and audit entrypoint for finding orchestration flaws before code changes.

## Runtime Inputs

- Public skill: `skills/cf-trace/SKILL.md`
- Custom agent source: `skills/_codex_agents/cflow_trace_recon.toml`
- Artifact template and review rubric: `skills/cf-trace/assets/trace.template.md`
- Target artifacts: `.cflow/trace.md`, `.gitignore`

## Flow

1. Trigger `cf-trace`.
2. Controller identifies the requested path, scenario, command, entrypoint, or workflow.
3. If the requested path is too ambiguous to trace, controller asks one focused question before spawning reconnaissance.
4. Controller preflight reads only existing `.cflow/architecture.md`, `.cflow/trace.md`, `.gitignore`, `trace.template.md`, and `git status --short`.
5. If `.cflow/architecture.md` is missing, stale, or materially incomplete, controller routes to `cf-architecture-map` before continuing.
6. Controller starts `cflow_trace_recon` with only repository path and the user trace request.
7. Custom agent reads `.cflow/architecture.md` first when present, performs read-only path reconstruction from its TOML instructions, uses bundled repo tree output when available to reduce broad path orientation, and returns the trace report.
8. While the agent runs, controller does not scan manifests, docs, source directories, or implementation files.
9. Controller checks the report against `trace.template.md` as the artifact rubric.
10. Controller performs only targeted spot-checks for missing, contradictory, generic, prescriptive, or unsupported report content.
11. Controller creates or updates `.cflow/trace.md` from the template shape and the validated report.
12. Controller adds `.cflow/` to `.gitignore` only when missing.
13. Controller audits the reconstructed path through the required lenses.
14. Controller returns findings, lens coverage, artifact summary, open questions, and exactly one recommended route.

## Review Checks

- The custom agent must reconstruct the path only; it must not decide audit severity, recommend fixes, or choose work units.
- `cf-trace` must require current `.cflow/architecture.md`; missing or stale architecture routes to `cf-architecture-map`.
- The spawn prompt must not paste the custom agent TOML instructions or full report format.
- The controller must not duplicate the path scan while the custom agent is running.
- `trace.template.md` must remain both artifact shape and review rubric.
- `.cflow/trace.md` must distinguish observed from inferred steps.
- Findings must be evidence-backed and ordered by severity.
- Every applicable audit lens must be covered, including explicit `none found from current evidence` when no issue is visible.
- The final route must be exactly one of `cf-mr-wolf`, `cf-architecture-map`, `cf-start`, `cf-cognitive`, `cf-file-split`, `direct fix`, or `none`.
