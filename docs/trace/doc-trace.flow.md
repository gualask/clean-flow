# cf-trace Flow

## Purpose

Document the runtime flow for `cf-trace`, the public path reconstruction and audit entrypoint for finding orchestration flaws before code changes.

## Runtime Inputs

- Public skill: `skills/cf-trace/SKILL.md`
- Custom agent source: `skills/_codex_agents/cflow_trace_recon.toml`
- Artifact template and review rubric: `skills/cf-trace/assets/trace.template.md`
- Target artifact: `.cflow/trace.md`

## High-Level Flow

1. Start from the requested path, scenario, command, entrypoint, or workflow.
2. Ask one focused question if the path is too ambiguous to trace.
3. Require current architecture context before tracing; route to `cf-architecture` when it is missing or stale.
4. Spawn `cflow_trace_recon` with repository path and trace request when subagent use is allowed.
5. While the agent runs, avoid duplicating the path scan locally.
6. Check the returned reconstruction against `trace.template.md` and spot-check only unsupported, contradictory, or missing claims.
7. Create or refresh `.cflow/trace.md` when durable trace state is needed.
8. Audit the reconstructed path through the active lenses and return findings plus exactly one route: framing, architecture, simplify, refactor, local cleanup, direct fix, or none.
