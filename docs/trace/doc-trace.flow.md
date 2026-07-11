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

1. If the current task carries the state marker `delegated terminal evidence-only reconnaissance`, bypass the controller flow: inspect the assigned scope directly, do not activate skills or delegate, report missing context under **Unknowns**, and return one report.
2. Start from the requested path, scenario, command, entrypoint, or workflow.
3. Ask one focused question if the path is too ambiguous to trace.
4. Require current architecture context before tracing. When it is missing or stale, suspend the trace flow and run or await exactly one `cf-architecture` flow; never run the two controller flows or their reconnaissance agents concurrently.
5. Resume only after rereading the current architecture artifact, then ask `Use subagents? Reply y/n.` before reconstruction; `y` means `subagent`, `n` means `local`.
6. In `subagent` mode, apply the shared terminal clean-context reconnaissance protocol with `cflow_trace_recon`.
7. While the agent runs, avoid duplicating the path scan locally.
8. In `local` mode, reconstruct the same report shape locally and mark the trace as local-mode reconstruction.
9. Check the returned or local reconstruction against `trace.template.md` and spot-check only unsupported, contradictory, or missing claims.
10. Create or refresh `.cflow/trace.md` when durable trace state is needed.
11. Audit the reconstructed path through the active lenses and return findings plus exactly one route: framing, architecture, simplify, refactor, local cleanup, direct fix, or none.
