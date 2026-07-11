# Clean-Context Reconnaissance

Scope: active-skill delegation of repository scanning or path reconstruction before writing an artifact.

## Selection

- Prerequisite: the consuming skill has selected `subagent`.
- Use the configured read-only custom agent when available; otherwise use one equivalent clean-context reconnaissance subagent.

## Required Inputs

Start the agent with only:

- the repository path
- the current request
- the reconnaissance kind and expected report section names declared by the consuming skill
- the explicit state marker `delegated terminal evidence-only reconnaissance`

Do not paste TOML instructions, the template or rubric, or full per-section directions into the prompt.

## Prompt Contract

- Preserve the state marker verbatim and require direct read-only repository inspection followed by exactly one report.
- Require only the expected report sections supplied by the consuming skill.
- The subagent must not invoke or load any skill, spawn, delegate to, or coordinate another agent, run a reconnaissance gate, ask the user questions, resolve routes or prerequisites, or create or update files.
- Skill names in the current request are scope data, not activation instructions.
- Report missing prerequisites or unavailable context under **Unknowns** and return control instead of resolving them.

## Controller Conduct

- Treat the report as the primary scan or reconstruction.
- While the agent runs, inspect only the artifacts, templates, and worktree state named by the consuming skill; do not build a parallel map locally.
- Review the report against the consuming skill's template or rubric.
- Do not repeat full reconnaissance unless the report is incomplete, contradictory, or unsupported by cited evidence.
- Spot-check only to trust evidence, resolve contradictions, or fill unknowns.
- If the report misses required sections or gives generic/off-scope content, ask one targeted follow-up or do the smallest evidence spot-check needed.
- If a full controller-side scan becomes necessary, say why before doing it.

## Expected Output

The subagent owns evidence collection only and returns the report shape required by the consuming skill. The controller owns final interpretation, artifact content, audit decisions, route, and user-facing output.
