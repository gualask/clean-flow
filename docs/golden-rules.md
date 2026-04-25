# Golden Rules

Use these rules when changing Cflow runtime skills, references, templates, docs, tests, or install behavior.

- Keep runtime behavior in the relevant `SKILL.md` or a reference file directly linked from that skill.
- Keep `docs/` maintainer-only; do not assume docs are visible at runtime.
- Polish every `SKILL.md` as if an LLM reads it from empty context: every sentence must be necessary runtime guidance, with no historical migration notes, maintainer-only labels, stale names, or decorative wording.
- Prefer state-based gates over actor-based gates.
- Keep `cf-start/SKILL.md` as the controller: identity, hard gates, DOT flow diagrams, reference map, and output contracts.
- Put phase-specific operational detail in `cf-start/references/*.md`.
- Keep `_shared` only for runtime rules consumed by multiple public skills or phase references.
- Keep `skills/_codex_agents` only for real Codex custom agents that should be installed, not for notes or examples.
- Do not create separate internal skills unless a phase needs independent triggering as a real user-facing entrypoint.
- Be strict only when the failure mode is concrete and costly.
- Otherwise state the preferred direction plus the conditions that justify exceptions.
