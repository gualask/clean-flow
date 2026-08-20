# Delegated Execution

Read this when the context gate returns anything other than `local`.

## Batched Execution

Batching changes source loading, never the logical scope. Use it only when the consuming skill requires a complete corpus pass; otherwise ask for a narrower evidence scope.

- Preserve the resolved path order and build non-overlapping file batches that each remeasure no higher than `subagent-1`. If one file alone exceeds that band, report that it cannot be safely batched and ask for user-selected execution instead of guessing.
- Give every terminal agent the complete path-only scope manifest, its exact file batch, all consuming lenses, relevant authoritative sources, and explicit exclusions. Other batches are unavailable source content, not excluded logical scope.
- Require one compact report per batch containing its complete lens ledger, candidates with cited evidence, cross-batch references, and unknowns. The controller appends each report to the recap file as it arrives and keeps only the reports in its context; it creates no other repository or temporary artifact.
- Run as many waves as the runtime's available agent slots require. Agent count changes scheduling, never coverage.
- After every report arrives, the controller reconciles cross-batch references, verifies cited evidence, merges one complete ledger, and routes or reports only once. A missing report or unresolved cross-batch check cannot produce a clear result.

When agents are unavailable or declined, still make the complete pass locally: process the same non-overlapping batches in the resolved path order and append each batch's report to the recap file before reading the next. Delegation changes who reads the source, never whether the recap is written.

## Recap File

The batched pass produces one recap file, and it is a deliverable rather than a scratch note: the controller and the user read it together to decide what to do next. A long pass loses its early context, so the recap is the memory, not the conversation. It holds one entry per candidate finding, written as the final output shows it. The findings still in the file are what is left to do; when none remain the pass is done, whatever headings or per-batch bookkeeping the file still carries.

- The consuming skill owns its own recap at the path its Artifacts contract names, and the controller is its only writer, with agents and without them. Delegated agents write nothing; they return their reports and the controller appends them in the resolved batch order.
- Before creating it, create `.cflow/` if needed and write `.cflow/.gitignore` containing a single `*` line if missing; never edit the repository `.gitignore`.
- Each batching skill has its own recap and writes no other skill's. If this skill's recap already exists, its entries are outstanding work from an earlier pass: stop and ask whether to work through them or to replace the file with this pass's findings; never overwrite it silently.
- Append each batch's report when that batch completes, before the next one is read or dispatched. Reconcile and report from the file, not from memory.
- Name the file in the final output and leave it in place. It is the one repository write the pass may make.

**Working through a recap.** Do not re-read the corpus. Take the first entry and load only the evidence it cites. Report what that evidence actually shows — that it supports the finding, contradicts it, or is inconclusive — and stop there. Deciding what to do about it is the user's, with you. Remove the entry from the file only once that decision is made, before the next entry is read.

## Consent UX

When the policy selects agents, ask once before the first spawn unless the current request or a durable applicable instruction already authorizes agent use. Include:

- measured file, LOC, and estimated-token totals
- selected policy and agent count, or batch and wave counts for `batched`
- each proposed terminal role
- the resolved model and effort when the runtime exposes them, otherwise `runtime default`
- the local fallback

Accept a compact reply such as `yes`, `local`, `no agents`, or `use <model> <effort>`. Consent applies only to the current request unless the user explicitly asks to persist a preference. When agent use is already authorized, announce the same plan without blocking and dispatch it.

## Delegated Terminal Agent Protocol

Apply this stable protocol to every delegated agent. It restricts only the delegated role; the consuming controller retains the authority allowed by its own skill contract and the current request.

- `filesystem_writes: forbidden`
- `test_execution: forbidden`
- `artifact_creation: forbidden`
- `skill_activation: forbidden`
- `prerequisite_routing: forbidden`
- `further_delegation: forbidden`
- `candidate_confirmation: forbidden`
- `final_routing_decision: forbidden`
- `scope_expansion: forbidden`
- `runtime_model_selection: controller-owned`
- `runtime_effort_selection: controller-owned`
- `reusable_brief_model_values: forbidden`

## Completion

- Wait for every dispatched agent to finish. Never interrupt it or redo its assignment locally because it seems slow; only an explicit request from the user in the current conversation authorizes interruption.
- A missing report leaves the delegated pass incomplete; do not report a clear or completed result.

## Model Selection

Keep public skill contracts provider-neutral. Never hard-code a model family or provider. Apply the protocol's model-ownership fields with this precedence:

1. Use an exact model or effort explicitly requested by the user when the spawn tool advertises it.
2. Otherwise omit model-specific overrides and inherit the host's configured subagent defaults.
3. When the host exposes semantic selection but no exact model, request `fast/mechanical` for bounded inventory or repetitive checks and `strong/judgment` for invariants, ambiguity, counter-evidence, or routing risk.
4. If a requested model is unavailable, do not substitute silently; offer the advertised alternatives, runtime default, or local execution.

Pass reasoning effort only when the runtime exposes that control. Model names and effort values belong to the controller's tool call, never to reusable agent prompts.

## Agent Contract

- Give each agent the bounded corpus, active problem frame, exact evidence question or candidate findings, consuming lens, explicit exclusions, and required output shape. When retained notes exist and matter to the pass, include their path or a compact summary.
- Restate the terminal read-only role and its task-specific prohibitions in every agent-bound prompt; shared ownership does not replace prompt explicitness.
- Require a read-only report with source-level evidence, unknowns, and candidate findings.
- Keep two-agent assignments non-overlapping. A complete corpus pass splits by file; other passes may split by explicit evidence question or file slice.
- Let the controller inspect only the cited evidence needed to de-risk reports, then own final judgment, routing, and user-facing output.

When agents are unavailable or declined outside `batched`, run the same declared lenses locally and sequentially. Delegation changes context ownership, never the consuming contract.
