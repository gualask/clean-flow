# Clean-Context Reconnaissance

Use when an active skill delegates repository scanning or path reconstruction before writing an artifact.

## Protocol

- Use the configured read-only custom agent when available; otherwise use one equivalent clean-context reconnaissance subagent.
- If the runtime requires explicit subagent authorization, ask the user for permission to use subagents before continuing.
- Start the agent with only the repository path and current request. Do not paste TOML instructions or the full report format into the prompt.
- Treat the report as the primary scan or reconstruction.
- While the agent runs, inspect only the artifacts, templates, and worktree state named by the consuming skill; do not build a parallel map locally.
- Review the report against the consuming skill's template or rubric.
- Do not repeat full reconnaissance unless the report is incomplete, contradictory, or unsupported by cited evidence.
- Spot-check only to trust evidence, resolve contradictions, or fill unknowns.
- If the report misses required sections or gives generic/off-scope content, ask one targeted follow-up or do the smallest evidence spot-check needed.
- If a full controller-side scan becomes necessary, say why before doing it.

The subagent owns evidence collection only; the controller owns final interpretation, artifact content, audit decisions, route, and user-facing output.
