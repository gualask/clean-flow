# Changelog

## 2026-07-25

- `cf-simplify` can now report a hard trigger that survives on a touched file as a deferred finding at full severity, instead of choosing between widening an authorized cleanup and dropping the finding.
- Removed `cf-architecture` and its `cflow_architecture_recon` agent: `scripts/repo-tree.mjs` orients more cheaply and cannot go stale, and the architectural rules worth protecting are already enforced by the repositories' own lint rules and tests. `cf-start` no longer requires `.cflow/architecture.md`; `cf-mr-wolf` orients locally. The orphaned `architecture.template.md` and shared `clean-context-recon.md` are gone too.
- Removed `cf-trace` and its `cflow_trace_recon` agent: modern models reconstruct and audit a workflow path unaided, so the skill added cost without changing the outcome. No skill inherits path reconstruction; `cf-scenario`, `cf-mr-wolf`, and `cf-start` drop the route.
- Artifact ownership is now declared with an `Owns` bullet and enforced: a contract test rejects any `.cflow` artifact a skill references without an owner, which is what the two removals left dangling in five places.

## 2026-07-17

- GPT-5.6 tooling refresh: the finding de-risk agent now pins `gpt-5.6-sol` at medium reasoning, token reporting defaults to Sol and recognizes the GPT-5.6 family via `o200k_base`, and contract tests lock the intended Sol/Luna agent roles plus model-name boundaries.
- Navigation-cost hard-trigger thresholds now have a single canonical home: `cf-cognitive`, `cf-split`, and their shared consumer references retain only flow-specific consequences, while a contract test prevents the threshold values from drifting back into duplicated prompt instructions.
- `cf-cognitive` now routes an edited file to `cf-split` only when canonical file-level pressure remains, instead of forcing a second workflow after every completed cleanup.
- Token reporting now uses an adjacent maintainer context map to estimate required and maximum reachable contract stacks per flow, compose same-thread handoffs, and surface the pack's maximum reachable flow alongside the existing inventory totals; contract tests keep the map aligned with public skill flows and runtime files.
- Token reporting now validates the context map against transitively reachable runtime Markdown, recursively inventories nested references/assets, and fails on missing or extra files; maintainer and user docs now explain the commands and consistently list all public flows, including `cf-todo`.

## 2026-07-14

- Description conformance pass against the golden rules: `cf-scenario` drops its actor-based gate ("the user or another agent") for a current-request gate, `cf-cognitive` gains real trigger phrases (hard to read, deep nesting, tangled branching) plus routing to `cf-split`/`cf-start`, `cf-trace` and `cf-scenario` now declare their mutual boundary (path reconstruction vs concrete impact), `cf-scenario` also opens with "Ground" instead of colliding with `cf-mr-wolf` on "Frame" and routes decision-shaped requests (approach, alternatives, worth) back to `cf-mr-wolf`, closing the one-way seam, `cf-cohesion`/`cf-split`/`cf-simplify`/`cf-architecture` gain their missing routing boundaries, and the description contract test regex is tightened from `\bUse\b` to `Use when/after/as/only when`.
- New `cf-todo` utility skill: creates and maintains a lightweight, user-owned `todo.md` with two sections (next steps with observable done criteria, open questions with impact/direction/what-is-needed-to-decide). Completion checks the item; checked items are removed only during a user-requested commit, the file is deleted when it empties, and git is the only history. Never touches `.cflow/*` (refactor progress stays with `cf-start`, drafts with `cf-brainstorm`); durable decision rationale routes to ADRs or owning docs via `cf-docs`, which now routes tracking files to `cf-todo`.
- `cf-docs` gained a transcription non-use boundary: requests that only save already-produced content (analysis results, findings, notes) into a Markdown file no longer trigger the skill — a `.md` destination alone is not a documentation task. The boundary lives in both the discovery description and the skill body.

## 2026-07-05

- New `cf-brainstorm` utility skill (explicit invocation only): deep one-question-at-a-time interrogation with a fresh-context question plan, ephemeral working draft `.cflow/specs/draft.md` (single slot, resume check, promoted by rename on approval, folded into project docs via `cf-docs` after shipping), hard no-implementation gate, and a routing seam with `cf-mr-wolf`. `.cflow/` became self-ignoring: skills write `.cflow/.gitignore` containing `*` instead of editing the repository `.gitignore`. Brief write rules require verbatim constraints and Execution-state/unit-status consistency. Golden rules gained form-matching guidance (failure type -> prohibition, recipe, template slot, or observable-predicate conditional; no nuance clauses; named workarounds and rationalization counters for hard gates) plus a description ban on workflow summaries; a conformance pass fixed a nuance clause in `cf-cognitive` triggers and gave `cf-docs` a no-source-code discovery boundary with a graceful code-verification fallback.

## 2026-07-04

- `cf-mr-wolf` evolved into the decisional entrypoint with flow selection (framing, planning, evaluation) and new `planning.md`/`evaluation.md` references; shared `regression-handling.md` gates further edits when a safety lock breaks in `cf-start`/`cf-split` execution; target-shape and migration planning must surface the plan's fragile assumption; new skill-contract tests (reference links, description constraints, routing targets) which also caught and fixed `cf-simplify` missing its vendored `repo-tree.mjs`; `AGENTS.md` added and `cf-mr-wolf` description tightened to budget.

## 2026-06-28

- Clarified split/cohesion guidance: the 300-LOC file-size bell is not a minimum split threshold, `cf-cognitive` must route smaller stable owners to `cf-split`, and private child files of an owner must be grouped into an owner directory when unrelated sibling owners share the parent.

## 2026-06-26

- Materialized skill install: `_shared/vendor.json` vendors shared references/scripts into consuming skills, no `_shared` runtime directory is installed, install/remove/token-report/tests/docs were aligned, `cf-docs` was added, and subagent/doc gates plus split/navigation-cost guidance were tightened.

## 2026-06-12

- Hard triggers in navigation-cost (nesting, function length, ~300-LOC file bell) with inverted burden of proof, closed exemption list, and ban on minimizing language; guard-clause-first remedy order; repo-tree.mjs references now resolve from the reference file's directory instead of the project working directory.

## 2026-06-11

- Navigation-cost spine as the canonical objective across skills; logic fixes (cf-simplify apply guardrails, consolidation criteria, cf-split route outcome); parallel-flows consolidation lens and scope budget in cf-simplify; repo-tree made the discovery default; removed cf-clarify.

## 2026-05-05

- Initial baseline.
