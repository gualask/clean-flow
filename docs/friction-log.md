# Friction Log

Maintainer-only instrumentation for evolving the pack.
Not part of the Cflow workflow surface: no skill reads it, no skill writes it as part of its procedure, and a default install does not include it.
It exists to answer one question with evidence instead of recollection: where does the pack (or its absence) create friction in real sessions?

Origin: the "friction law" pattern from the orchflows library — log the observation at the moment of friction, because a model cannot reconstruct its failures after the fact and nothing else produces a faithful record.
Only the capture side is adopted; the automated mining/self-improvement side is deliberately not.

## What It Is

An always-on instruction plus a never-failing logger script.
The instruction defines friction as any of: a step taking more than two attempts; a missing input, tool, or document; surprising output; a gap or ambiguity in a skill, rule, or template; a workaround; a wrong skill routed; a recurring user problem no installed skill owns.
On friction the agent logs one observation and continues with the task:

    node ~/.agents/cflow/bin/friction.mjs "<what happened>" "<what was expected>" \
        [--category C] [--skill cf-name]

One JSON line is appended to `<repo>/.cflow/friction/<yyyy-mm>.jsonl` (the main repository root, resolved through linked worktrees), or to `~/.agents/cflow/friction/` when the session is not inside a git repository.

Entry fields: `ts`, `observed`, `expected`, optional `category` and `skill`, plus `session` (from the host's session env var, when present) and `pack_version` (stamped into the script at install time).

- `session` distinguishes a noisy single session from a problem that recurs across sessions.
- `pack_version` distinguishes friction hit against the pack before and after a skills update, mechanically.
- `skill` present means the friction was hit while a Cflow skill was active; absent means general interaction friction — including the category the log exists for, `no-owning-skill`: a user problem no installed skill covers.

Categories (closed set): repeated-attempts | missing-input | missing-tool | missing-doc | contract-gap | tool-failure | surprising-output | workaround | misrouting | no-owning-skill.

## Discipline

- Observations only, never causes or blame; diagnosis happens later, reading the log.
- The logger never blocks, prompts, or fails the task; it always exits 0; logging is exempt from every effort bound.
- The log is append-only and passive: nothing reads it automatically, and an entry never changes agent behavior.
  A wrong or hallucinated entry costs one spurious line, nothing more.
  Skill changes remain manual maintainer decisions, taken while reading the log.
- Privacy: entries describe working friction and land inside the repo being worked on; in shared repositories add `.cflow/friction/` to `.gitignore`.

## Install

Opt-in, global install only:

    node ./bin/cflow-skills.mjs install --global --friction

This writes `~/.agents/cflow/bin/friction.mjs` (pack version stamped) and adds a marked block to `$CODEX_HOME/AGENTS.md` containing the full law text (source: `install/friction/friction-law.md`) — created minimal when absent; existing user content is never rewritten, and the block is idempotent across reinstalls.
`$CFLOW_HOME` overrides `~/.agents/cflow`. The installed logger remembers that location for logs outside a repository; setting `CFLOW_HOME` when running it overrides the fallback again.

The optional source files live in `install/friction/`, outside `skills/`. They do not enter skill materialization and are copied only with `--friction`; a fresh install without the flag creates no Cflow home.

The flag is the desired state for every global sync: `install --global --friction` enables or updates the integration, while `install --global` without the flag removes a previous integration. Dry runs and skill conflicts report the planned friction change without applying it. Repository-scoped installs do not change the global friction state.

The law is inlined rather than referenced with an `@file` import because hosts are not guaranteed to expand imports: a Codex CLI that leaves the import line unexpanded gives the model only a file path, and a law read lazily on request never fires at the moment of friction, which is the entire point of the law.

Both a global install without `--friction` and `remove --global` remove the script and the AGENTS.md block; accumulated logs under the configured Cflow home are user data and stay.

Cleanup failures, such as denied permissions or a read-only mount, emit warnings without failing the skills install or removal. Other cleanup steps still run; any skipped files or AGENTS.md block may remain, so warnings mean the integration may not be fully disabled.

## Reading The Log

Periodically, as a maintainer act: group entries by similarity across sessions (`session`, `ts`), separate pack friction (`skill` present) from coverage gaps (`no-owning-skill`), and check recurrences against the current skill text before changing anything.
One-off entries are noise until they repeat.
