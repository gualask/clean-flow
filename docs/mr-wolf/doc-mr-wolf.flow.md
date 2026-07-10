# cf-mr-wolf Flow

## Purpose

Maintainer summary for `cf-mr-wolf`. Runtime behavior belongs to `skills/cf-mr-wolf/SKILL.md` and its linked references; keep this file descriptive, not authoritative.

## Runtime Inputs

- Public skill: `skills/cf-mr-wolf/SKILL.md`
- Runtime references: `skills/cf-mr-wolf/references/framing.md`, `decomposition.md`, `evidence.md`, `dynamic-agents.md`, `derisk.md`, `outcomes.md`, `planning.md`, `evaluation.md`
- Shared source vendored into runtime paths: `skills/_shared/scripts/repo-tree.mjs`
- Custom agent source: `skills/_codex_agents/cflow_finding_derisk_recon.toml`
- Current conversation and request
- Focused repository context selected from the clarified request and bounded perimeter
- Optional notes artifact: `.cflow/mr-wolf-notes.md`, created from `skills/cf-mr-wolf/assets/mr-wolf-notes.template.md` when evidence or decisions need durable handoff context

## Maintainer Notes

- Runtime routing for ambiguity, indecision, alternatives, planning, and evaluation stays in `skills/cf-mr-wolf/SKILL.md`.
- Framing, evidence, de-risking, outcome, planning, and evaluation rules stay in linked references.
- Planning flow owns generic decision-complete plans only; repository-level refactor planning routes to `cf-start`, and code-structure value judgments route to `cf-simplify`.
- `.cflow/mr-wolf-notes.md` is optional handoff memory.
- `.cflow/refactor-brief.md` remains owned by `cf-start`.
- Keep this doc aligned with runtime files, but do not rely on it at runtime.
