# Dynamic Agents

Use dynamic agents only when they are available, allowed, and selected by the deterministic context gate below. Keep every delegated role terminal and read-only.

## Context Gate

Resolve the active skill's existing-file corpus before reading it in full. Run the installed-local `scripts/repo-tree.mjs --help`, then call it with `--context-budget` and one `--include` for every selected file or owned directory. Never measure the whole repository when the active scope is narrower.

Treat the script's `policy` as authoritative:

- `local`: keep the pass local and do not ask about agents.
- `subagent-1`: use one agent when consent allows it.
- `subagent-2`: use two non-overlapping assignments under the Agent Contract when consent allows it.
- `batched`: do not load or delegate the corpus as one pass; follow the batched execution contract below.

Do not estimate the band, substitute semantic complexity, or override the count because the task feels easy or hard. An explicit user instruction to use or avoid a specific number of agents wins. If the helper is unavailable or cannot measure every selected path, report the measurement failure and ask whether to continue locally or with user-selected delegation; never guess silently.

## Batched Execution

Batching changes source loading, never the logical scope. Use it only when the consuming skill requires a complete corpus pass; otherwise ask for a narrower evidence scope.

- Preserve the resolved path order and build non-overlapping file batches that each remeasure no higher than `subagent-1`. If one file alone exceeds that band, report that it cannot be safely batched and ask for user-selected execution instead of guessing.
- Give every terminal agent the complete path-only scope manifest, its exact file batch, all consuming lenses, relevant authoritative sources, and explicit exclusions. Other batches are unavailable source content, not excluded logical scope.
- Require one compact report per batch containing its complete lens ledger, candidates with cited evidence, cross-batch references, and unknowns. The controller retains only these reports in its context; do not create a repository or temporary artifact.
- Run as many waves as the runtime's available agent slots require. Agent count changes scheduling, never coverage.
- After every report arrives, the controller reconciles cross-batch references, verifies cited evidence, merges one complete ledger, and routes or reports only once. A missing report or unresolved cross-batch check cannot produce a clear result.

When agents are unavailable or declined, ask for a narrower scope. Loading every batch into the same local context is not a batched fallback.

## Consent UX

When the policy selects agents, ask once before the first spawn unless the current request or a durable applicable instruction already authorizes agent use. Include:

- measured file, LOC, and estimated-token totals
- selected policy and agent count, or batch and wave counts for `batched`
- each proposed terminal role
- the resolved model and effort when the runtime exposes them, otherwise `runtime default`
- the local fallback, or the narrower-scope fallback for `batched`

Accept a compact reply such as `yes`, `local`, `no agents`, or `use <model> <effort>`. Consent applies only to the current request unless the user explicitly asks to persist a preference. When agent use is already authorized, announce the same plan without blocking and dispatch it.

## Model Selection

Keep public skill contracts provider-neutral. Never hard-code a model family or provider.

Routing ownership is a stable contract:

- `runtime_model_selection: controller-owned`
- `runtime_effort_selection: controller-owned`
- `reusable_brief_model_values: forbidden`

Apply this precedence:

1. Use an exact model or effort explicitly requested by the user when the spawn tool advertises it.
2. Otherwise omit model-specific overrides and inherit the host's configured subagent defaults.
3. When the host exposes semantic selection but no exact model, request `fast/mechanical` for bounded inventory or repetitive checks and `strong/judgment` for invariants, ambiguity, counter-evidence, or routing risk.
4. If a requested model is unavailable, do not substitute silently; offer the advertised alternatives, runtime default, or local execution.

Pass reasoning effort only when the runtime exposes that control. Model names and effort values belong to the controller's tool call, never to reusable agent prompts.

## Agent Contract

- Give each agent the bounded corpus, active problem frame, exact evidence question or candidate findings, consuming lens, explicit exclusions, and required output shape. When retained notes exist and matter to the pass, include their path or a compact summary.
- Require a read-only report with source-level evidence, unknowns, and candidate findings.
- Do not let agents edit files, update `.cflow` artifacts, activate skills, route prerequisites, delegate again, confirm findings, choose final routing, or expand scope.
- Keep two-agent assignments non-overlapping. A complete corpus pass splits by file; other passes may split by explicit evidence question or file slice.
- Let the controller inspect only the cited evidence needed to de-risk reports, then own final judgment, routing, and user-facing output.

When agents are unavailable or declined outside `batched`, run the same declared lenses locally and sequentially. Delegation changes context ownership, never the consuming contract.
