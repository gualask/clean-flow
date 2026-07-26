# Golden Rules

Use these rules when changing Cflow runtime skills, references, templates, docs, tests, or install behavior.

## How to Use

Before changing any Cflow pack file, identify which rules apply by file type, runtime role, and public or installable surface; evaluate the full change against all of them and do not stop at the first matching issue.
For runtime guidance, review each changed sentence for empty-context clarity, state-based or current-request gates, progressive disclosure, proportionality, and current-skill self-reference.
For non-runtime files, check that the change does not move runtime behavior into maintainer-only docs, duplicate guidance that belongs in a linked reference, or create installable/public surfaces that the rules reserve for skills or `_shared` authoring sources.

## Runtime Placement

- Keep runtime behavior in the relevant `SKILL.md`, a first-level reference linked from that skill, or a vendored shared reference loaded by an active runtime reference.
- Keep `docs/` maintainer-only; do not assume docs are visible at runtime.
- Keep first-level reference loading decisions in the consuming `SKILL.md`; a reference should not decide whether it should have been read.
- A reference may own local subpath selection after it is active, including agent paths bound to that reference.
- Do not repeat phase-entry gates inside local subpath or agent selection; if the whole reference should not run yet, the gate belongs in the consuming `SKILL.md`.
- Bind every agent contract to the smallest active reference that owns its phase or task; keep shared agent rules separate from phase-specific prompt, input, and output contracts.
- Make terminal agent roles explicit in both agent selection and the agent-bound prompt contract; a terminal agent must not activate skills, route prerequisites, or delegate again.
- In agent-bound references, prefer `Selection`, `Required Inputs`, `Valid Inputs`, `Assumptions`, `Prompt Contract`, and `Expected Output` sections over generic `Preconditions` headings.

## Runtime Skill Text

- Treat frontmatter `description` as discovery metadata, not procedure: front-load user-facing task words and trigger phrases, state when to use the skill plus its key non-use or routing boundary, and avoid internal implementation details or artifact names unless they are invocation signals such as existing `.cflow` work.
- Never summarize the skill's process or workflow in the `description`: an agent follows the summary instead of reading the skill body. State what the skill produces and when to trigger it, never how it works.
- Polish every `SKILL.md` as if an LLM reads it from empty context: every sentence must be necessary runtime guidance, with no historical migration notes, maintainer-only labels, stale names, or decorative wording.
- Write runtime guidance as context-shaping lenses by default; use hard prohibitions only for concrete safety, artifact, scope, or behavior-preservation failures.
- In runtime skill instructions, do not refer to the current skill by its own skill name; use state, scope, artifact, or phase terms such as `here`, `this pass`, or the specific artifact instead.
- Apply progressive disclosure for all runtime guidance: keep `SKILL.md` to trigger conditions, hard gates, and essential routing; move detailed procedures, reference material, examples, and helper usage instructions to the smallest linked resource that is loaded only when needed.
  Before splitting guidance into a reference, ask: if this section moves out of `SKILL.md`, in which realistic invocations should the agent not read it?
- Prefer state-based gates over actor-based gates.
- For composable skills, choose entry modes from the `current request`, not from whether the literal user or another skill made the request. Use `user explicitly asked` only for intentional user-level authorization gates.
- Be strict only when the failure mode is concrete and costly.
- Otherwise state the preferred direction plus the conditions that justify exceptions.
- Match the form of strictness to the failure it prevents: a rule skipped under pressure needs a prohibition; wrong-shaped output needs a positive recipe or output contract stating what the output is; an omitted element needs a required slot in the template; condition-dependent behavior needs a conditional keyed to an observable predicate, not an unconditional rule with exemption clauses.
- Do not soften a working rule with nuance clauses such as "unless it matters"; express a real exception as its own conditional on an observable predicate.
- When a hard prohibition is justified, make it hold: name the specific workarounds it forbids, and turn rationalizations observed in real sessions into explicit counters in the skill text.
- Prefer role/category language over example lists in runtime instructions. When examples are necessary, state that analogous project-specific forms must also be considered; do not let examples become a closed checklist.

## Finding Content

- When a skill, reference, or template records findings for later work, require every finding to carry claim, evidence, severity, impact, confidence with its basis, route, and status. Require the content; do not impose a serialization. Skills are single-writer by design, and a model reads several shapes at the same cost as one, so a shared format buys nothing while a shared checklist prevents real content gaps.
- State impact only when it is not already obvious from the claim; state every other element explicitly, including when it does not apply.
- Keep severity a property of the rule that fired, never of how recent, small, or easy to fix the finding looks. Age and effort belong in separate fields.
- Apply the checklist to a template when that template is already being changed; do not open templates only to conform them.
- Let a detecting skill report a violation only when the remedy is confined to a unit the finding can name. A smell whose fix propagates to every site sharing a shape does not converge: no single pass clears it, so it returns on every later pass until the output becomes noise a reader skips, while the propagating fix is itself the runaway-refactor failure these passes exist to prevent. Judge a candidate lens on that test, not on how objective its trigger looks.
- When a detecting skill excludes a category on those grounds, name the excluded families and the rationalization in its runtime text. A category left unmentioned gets re-added by the next author who finds it useful.

## Refactor Decision Principle

- Cflow's mission is obsessive pursuit of the cleanest practical structure: maximum domain and ownership clarity, minimum justified ceremony, and no boilerplate that does not pay for a real boundary or risk.
- Cleanliness is the default: optimize for the cleanest evidence-backed structure that fits the repository and request, not for the easiest or lowest-impact change.
- Treat cognitive impact as bug-localization cost first: stable named owners that show where to inspect for likely bugs can override anti-overengineering heuristics such as flat defaults, file-count thresholds, or low-churn preference.
- Open architecture reasoning by locating critical complexity; then define ownership, workflows, boundaries, invariants, dependency pressure, and packaging. Current structure is evidence and migration inventory, not the target to preserve.
- Choose architecture from that diagnosis. Prefer the closest recognized reference architecture in the pragmatic form the repository needs, and involve the user before choosing custom top-level deviations.
- Treat target shape as the clean end state for the assessed scope, not the first safe migration step. Do not shrink target scope or preserve current buckets because migration is risky.
- Use cost, churn, reviewability, and behavior preservation only to stage migration after the clean target is chosen; behavior preservation is not structure preservation.
- Do not recommend cleanup paths that preserve false ownership, accidental boundaries, global glue, unclear dependency direction, or catch-all ownership buckets.

## Pack Surface Boundaries

- Keep `cf-start/SKILL.md` as the controller: identity, hard gates, flow selection slices, phase reference links, and output contracts.
- Put phase-specific operational detail in `cf-start/references/*.md`.
- Keep `_shared` only for shared authoring references, scripts, and vendoring config consumed by multiple public skills or phase references.
- Do not create separate internal skills unless a phase needs independent triggering as a real user-facing entrypoint.

## File-Type Checklist

Use this checklist additively: when a changed file has multiple roles, apply every matching line plus the category rules above.

- `SKILL.md`: trigger conditions, hard gates, essential routing, and first-level reference loading decisions.
- `references/*.md`: operational rules, local subpath selection, agent binding, input contracts, prompt contracts, and output contracts for an already-active phase; not first-level loading logic.
- `docs/*.md`: maintainer-only explanation; no runtime dependency.
- `templates` and `assets`: artifact shape, examples, or review rubrics only.
- `_shared`: shared authoring references, scripts, helpers, and vendoring config consumed by multiple public skills or phase references.
- tests: guard contracts and package behavior; never act as an alternate source of runtime behavior.
