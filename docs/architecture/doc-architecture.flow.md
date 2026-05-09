# cf-architecture Flow

## Purpose

Document the runtime flow for `cf-architecture`, the public repository mapping entrypoint that creates or refreshes `.cflow/architecture.md`.

## Runtime Inputs

- Public skill: `skills/cf-architecture/SKILL.md`
- Shared reference: `skills/_shared/references/clean-context-recon.md`
- Custom agent source: `skills/_codex_agents/cflow_architecture_recon.toml`
- Artifact template and review rubric: `skills/cf-start/assets/architecture.template.md`
- Target artifact: `.cflow/architecture.md`

## High-Level Flow

1. Start from the current mapping request and any existing `.cflow/architecture.md`.
2. Preflight only the existing architecture artifact, architecture template, and worktree state.
3. Apply the shared clean-context reconnaissance protocol with `cflow_architecture_recon`.
4. While the agent runs, avoid duplicating the repository scan locally.
5. Check the returned report against `architecture.template.md`, including domain gravity, concepts, boundaries, invariants, workflows, data ownership, observed ownership of named representations, and re-export surfaces; spot-check only decision-relevant gaps or contradictions.
6. Create or refresh `.cflow/architecture.md` from the template shape when the report is good enough.
7. Return the architecture summary and recommend the next route, usually `cf-start` when refactor planning is still needed.
