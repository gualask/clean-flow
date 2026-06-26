# cf-architecture Flow

## Purpose

Document the runtime flow for `cf-architecture`, the public repository mapping entrypoint that creates or refreshes `.cflow/architecture.md`.

## Runtime Inputs

- Public skill: `skills/cf-architecture/SKILL.md`
- Shared sources vendored into runtime paths: `skills/_shared/references/clean-context-recon.md`; `skills/_shared/scripts/repo-tree.mjs`
- Custom agent source: `skills/_codex_agents/cflow_architecture_recon.toml`
- Artifact template and review rubric: `skills/cf-start/assets/architecture.template.md`
- Target artifact: `.cflow/architecture.md`

## High-Level Flow

1. Start from the current mapping request and any existing `.cflow/architecture.md`.
2. Ask `Use subagents? Reply y/n.` before architecture mapping; `y` means `subagent`, `n` means `local`.
3. Preflight only the existing architecture artifact, architecture template, and worktree state.
4. In `subagent` mode, apply the shared clean-context reconnaissance protocol with `cflow_architecture_recon`.
5. While the agent runs, avoid duplicating the repository scan locally.
6. In `local` mode, produce the same report shape locally and mark the final summary as local-mode reconnaissance.
7. Check the returned or local report against `architecture.template.md`, including domain gravity, concepts, boundaries, invariants, workflows, data ownership, observed ownership of named representations, and re-export surfaces; spot-check only decision-relevant gaps or contradictions.
8. Create or refresh `.cflow/architecture.md` from the template shape when the report is good enough.
9. Return the architecture summary and recommend the next route, usually `cf-start` when refactor planning is still needed.
