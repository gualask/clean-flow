# Golden Rules

Use these rules when changing Cflow runtime skills, references, templates, docs, tests, or install behavior.

## How to Use

Before changing any Cflow pack file, identify which rules apply by file type, runtime role, and public or installable surface; evaluate the full change against all of them and do not stop at the first matching issue.
For runtime guidance, review each changed sentence for empty-context clarity, state-based or current-request gates, progressive disclosure, proportionality, and current-skill self-reference.
For non-runtime files, check that the change does not move runtime behavior into maintainer-only docs, duplicate guidance that belongs in a linked reference, or create installable/public surfaces that the rules reserve for skills, `_shared`, or `_codex_agents`.

## Runtime Placement

- Keep runtime behavior in the relevant `SKILL.md` or a reference file directly linked from that skill.
- Keep `docs/` maintainer-only; do not assume docs are visible at runtime.
- Keep reference loading decisions in the consuming `SKILL.md`; a reference should contain the operational rules for an already-selected path, not the trigger logic needed to decide whether to read it.

## Runtime Skill Text

- Polish every `SKILL.md` as if an LLM reads it from empty context: every sentence must be necessary runtime guidance, with no historical migration notes, maintainer-only labels, stale names, or decorative wording.
- In runtime skill instructions, do not refer to the current skill by its own skill name; use state, scope, artifact, or phase terms such as `here`, `this pass`, or the specific artifact instead.
- Apply progressive disclosure for all runtime guidance: keep `SKILL.md` to trigger conditions, hard gates, and essential routing; move detailed procedures, reference material, examples, and helper usage instructions to the smallest linked resource that is loaded only when needed.
  Before splitting guidance into a reference, ask: if this section moves out of `SKILL.md`, in which realistic invocations should the agent not read it?
- Prefer state-based gates over actor-based gates.
- For composable skills, choose entry modes from the `current request`, not from whether the literal user or another skill made the request. Use `user explicitly asked` only for intentional user-level authorization gates.
- Be strict only when the failure mode is concrete and costly.
- Otherwise state the preferred direction plus the conditions that justify exceptions.

## Pack Surface Boundaries

- Keep `cf-start/SKILL.md` as the controller: identity, hard gates, DOT flow diagrams, reference map, and output contracts.
- Put phase-specific operational detail in `cf-start/references/*.md`.
- Keep `_shared` only for runtime rules consumed by multiple public skills or phase references.
- Keep `skills/_codex_agents` only for real Codex custom agents that should be installed, not for notes or examples.
- Do not create separate internal skills unless a phase needs independent triggering as a real user-facing entrypoint.

## File-Type Checklist

Use this checklist additively: when a changed file has multiple roles, apply every matching line plus the category rules above.

- `SKILL.md`: trigger conditions, hard gates, essential routing, and reference loading decisions.
- `references/*.md`: operational rules for an already-selected path, not trigger logic.
- `docs/*.md`: maintainer-only explanation; no runtime dependency.
- `templates` and `assets`: artifact shape, examples, or review rubrics only.
- `_shared`: runtime rules, references, scripts, or helpers consumed by multiple public skills or phase references.
- `_codex_agents`: real installable custom agent definitions only.
- tests: guard contracts and package behavior; never act as an alternate source of runtime behavior.
