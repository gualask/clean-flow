# cf-trace Flow

## Purpose

Document the runtime flow for `cf-trace`, the public path reconstruction and audit entrypoint for finding orchestration flaws before code changes.

## Runtime Inputs

- Public skill: `skills/cf-trace/SKILL.md`
- Shared sources vendored into runtime paths: `skills/_shared/references/clean-context-recon.md`; `skills/_shared/scripts/repo-tree.mjs`
- Custom agent source: `skills/_codex_agents/cflow_trace_recon.toml`
- Artifact template and review rubric: `skills/cf-trace/assets/trace.template.md`
- Target artifact: `.cflow/trace.md`

## High-Level Flow

1. Start from the requested path, scenario, command, entrypoint, or workflow.
2. Ask `Use subagents? Reply y/n.` before reconstruction; `y` means `subagent`, `n` means `local`.
3. Ask one focused question if the path is too ambiguous to trace.
4. Require current architecture context before tracing; route to `cf-architecture` when it is missing or stale.
5. In `subagent` mode, apply the shared clean-context reconnaissance protocol with `cflow_trace_recon`.
6. While the agent runs, avoid duplicating the path scan locally.
7. In `local` mode, reconstruct the same report shape locally and mark the trace as local-mode reconstruction.
8. Check the returned or local reconstruction against `trace.template.md` and spot-check only unsupported, contradictory, or missing claims.
9. Create or refresh `.cflow/trace.md` when durable trace state is needed.
10. Audit the reconstructed path through the active lenses and return findings plus exactly one route: framing, architecture, simplify, refactor, local cleanup, direct fix, or none.
