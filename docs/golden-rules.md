# Golden Rules

Use these rules when changing Cflow runtime skills, references, templates, docs, tests, or install behavior.

## How to Use

Before changing any Cflow pack file, identify which rules apply by file type, runtime role, and public or installable surface; evaluate the full change against all of them and do not stop at the first matching issue.
For runtime guidance, review each changed sentence for empty-context clarity, state-based or current-request gates, progressive disclosure, proportionality, and current-skill self-reference.
For non-runtime files, check that the change does not move runtime behavior into maintainer-only docs, duplicate guidance that belongs in a linked reference, or create installable/public surfaces that the rules reserve for skills, `_shared`, or `_codex_agents`.

## Runtime Placement

- Keep runtime behavior in the relevant `SKILL.md` or a reference file directly linked from that skill.
- Keep `docs/` maintainer-only; do not assume docs are visible at runtime.
- Keep first-level reference loading decisions in the consuming `SKILL.md`; a reference should not decide whether it should have been read.
- A reference may own local subpath selection after it is active, including agent paths bound to that reference.
- Do not repeat phase-entry gates inside local subpath or agent selection; if the whole reference should not run yet, the gate belongs in the consuming `SKILL.md`.
- Bind every agent contract to the smallest active reference that owns its phase or task; keep shared agent rules separate from phase-specific prompt, input, and output contracts.
- In agent-bound references, prefer `Selection`, `Required Inputs`, `Valid Inputs`, `Assumptions`, `Prompt Contract`, and `Expected Output` sections over generic `Preconditions` headings.

## Runtime Skill Text

- Treat frontmatter `description` as discovery metadata, not procedure: front-load user-facing task words and trigger phrases, state when to use the skill plus its key non-use or routing boundary, and avoid internal implementation details or artifact names unless they are invocation signals such as existing `.cflow` work.
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

- `SKILL.md`: trigger conditions, hard gates, essential routing, and first-level reference loading decisions.
- `references/*.md`: operational rules, local subpath selection, agent binding, input contracts, prompt contracts, and output contracts for an already-active phase; not first-level loading logic.
- `docs/*.md`: maintainer-only explanation; no runtime dependency.
- `templates` and `assets`: artifact shape, examples, or review rubrics only.
- `_shared`: runtime rules, references, scripts, or helpers consumed by multiple public skills or phase references.
- `_codex_agents`: real installable custom agent definitions only.
- tests: guard contracts and package behavior; never act as an alternate source of runtime behavior.
