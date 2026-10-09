![Clean Flow hero](./public/hero.png)

# Clean Flow

Clean Flow is a Codex skill pack for cleanup and refactor planning, migration, and execution.
It helps an agent understand the repository, choose the right refactor path, keep work resumable, and avoid uncontrolled rewrites while still treating hard restructures as first-class when the architecture is the real problem.

Use it when you want Codex to:

- clarify an unclear cleanup or refactor goal before touching code
- judge whether the current structure is right, and plan a repository-level refactor when it is not
- explain the real impact of a bug, behavior, or change through concrete code-grounded scenarios
- write, update, or trim docs so they stay accurate against the code
- track decided next steps and open questions in a lightweight todo file
- review an area for overengineering, duplicated parallel flows, or complexity that no longer earns its place
- split an overloaded file into nearby owned files
- reduce local cognitive complexity in a source file
- regroup related files into a more cohesive local feature slice
- check uncommitted work, or the last few commits, against structure rules and authoritative requirements
- plan and run an approved spec, refactor or feature, in reviewable units with artifact-backed resume
- brainstorm a new feature or idea into an approved design spec (explicit invocation only)

## Why Use It

Refactors often fail because the agent starts moving code before it understands the problem, the current boundaries, or the behavior that must stay fixed.
Clean Flow gives Codex a practical operating system for that work:

- **Problem first**: unclear requests are framed before implementation.
- **Repository aware**: structure and evidence are read from the codebase when the work happens, never from a stored map that can drift.
- **Domain-led**: architecture reviews start from product workflows, ownership, and external boundaries before current folders.
- **Clean target first**: recommendations optimize for the cleanest evidence-backed structure, not the easiest low-impact workaround.
- **Low ceremony**: boundaries, abstractions, and layers are justified by real ownership, integration, or risk.
- **Migration-safe**: execution phases require a credible safety net before structural edits and preserve behavior unless a behavior change is explicit.
- **Resumable**: longer flows store durable state in `.cflow/` artifacts.
- **Scoped**: local cleanup, file splitting, cohesion work, and broad refactors use different entrypoints.

## Quick Start

Install or update Clean Flow globally for Codex:

```text
Fetch and follow instructions from https://raw.githubusercontent.com/gualask/clean-flow/refs/heads/main/install/codex/GLOBAL.md and sync Cflow globally.
```

Or install/update it only in the current repository:

```text
Fetch and follow instructions from https://raw.githubusercontent.com/gualask/clean-flow/refs/heads/main/install/codex/LOCAL.md and sync Cflow in the current repository only.
```

CLI alternatives:

```bash
node ./bin/cflow-skills.mjs install /path/to/repo
node ./bin/cflow-skills.mjs install --global
node ./bin/cflow-skills.mjs install /path/to/repo --dry-run
node ./bin/cflow-skills.mjs install /path/to/repo --tag 0.0.1
```

The installer materializes packaged skills and vendors shared authoring files into the consuming skill directories.
Repository installs write to `.agents/skills`; global installs write to `$HOME/.agents/skills`, matching Codex skill discovery.
Pass `--tag <tag>` to install an exact tag from the official Clean Flow repository. This supports both upgrades and downgrades; without `--tag`, the CLI installs the skills packaged in its current checkout.

After installation, ask Codex to use one of the public entrypoints below.
When the concern is the structure of the repository or a subsystem, start with:

```text
Use cf-architecture to assess the architecture of this repository and recommend the next step.
```

Once a spec is approved, plan and run it with:

```text
Use cf-execute to plan the approved spec.
```

When the concern, lens, or desired outcome is still unclear, frame it first:

```text
Use cf-mr-wolf to frame this cleanup/refactor before assessment.
```

<details>
<summary>Uninstall</summary>

Remove only Clean Flow-owned skill directories:

```bash
node ./bin/cflow-skills.mjs remove /path/to/repo
node ./bin/cflow-skills.mjs remove --global
```

Codex prompt shortcuts:

```text
Fetch and follow instructions from https://raw.githubusercontent.com/gualask/clean-flow/refs/heads/main/install/codex/GLOBAL.md and uninstall Cflow globally.
```

```text
Fetch and follow instructions from https://raw.githubusercontent.com/gualask/clean-flow/refs/heads/main/install/codex/LOCAL.md and uninstall Cflow from the current repository only.
```

</details>

## Public Entrypoints

### `cf-architecture`

Assesses and proposes the architecture of a repository or subsystem, including exploration without a known problem.
Produces an evidence-backed recommendation for discussion; when the user takes up a structural change, it records it as an approved spec through the same draft → spec cycle as `cf-brainstorm`. It does not implement changes. Use `cf-scenario` to judge the worth or impact of a named change.

### `cf-execute`

Plans and implements an approved spec: a structural change from `cf-architecture` or a feature from `cf-brainstorm`.
It splits the spec into reviewable units (`split`, `consolidate`, or `feature`), locks behavior with a safety net, executes one accepted unit at a time, and reviews and verifies it. `.cflow/execution-plan.md` carries the plan and resume state and points to the spec. Without an approved spec it routes to the skill that designs one instead of assessing the repository itself.

### `cf-mr-wolf`

<img src="./public/wolf.png" alt="cf-mr-wolf thumbnail" width="96" align="left" hspace="12">

Recovers the goal behind a symptom or a doubt that names nothing to decide on: it reads the code, tells you what it found in your terms, says it does not yet know which part matters to you, and asks.  
It is a gate: it investigates and stops, hands off to the owning skill in one line, or steps aside entirely. It offers no menu of options and recommends nothing until you answer.

<br clear="left">

### `cf-scenario`

Decides a named change against the concrete scenarios it touches, grounded in the code.
Use it when a named change needs a worth-doing decision or its cost in other scenarios weighed, not merely to explain current behavior. It opens with **Decision:** (`make it`, `do not make it`, or `make it only if` a condition), then the cost in each scenario with `file:line`. A business-alignment candidate from `cf-review` gets a `file:line` trace from the changed line to the result a user sees.

### `cf-deadcode`

Reports which code is unreachable when you ask whether something is unused, dead, or safe to delete.
It closes the pass with a table pairing every name that crosses a boundary as a string — an event, a command, a message type, a job name — with the file and line on each side; an empty cell is a finding. It reports and never removes.

### `cf-cognitive`

Finds or reduces local cognitive complexity in up to three source files.
Use it for overloaded functions, deep nesting, hard-to-scan branching, or local readability pressure.

### `cf-split`

Evaluates or performs a behavior-preserving split of one source file into nearby owned files.
Use it when a file has grown past its natural responsibilities.

### `cf-cohesion`

Evaluates or performs local regrouping of already-related files.
Use it when a workflow or feature is scattered across folders and navigation cost is the problem.

### `cf-review`

Checks a bounded change set against structural rules, repository conventions, behavior-preservation claims, documentation, and authoritative requirements.

The change set is uncommitted work by default, or a named history range such as recent commits or a branch against its base. Selected files, including tests, are reviewed as whole units for structural and repository-level concerns. Test assertion quality remains a separate pass. Findings remain evidenced candidates, are limited to remedies a nameable unit can clear, and are routed without being confirmed or fixed; the only repository write is the batched pass's recap, `.cflow/cf-review-recap.md`.

Business alignment uses explicit requirements, repository-controlled product or domain documentation and acceptance criteria, or linked primary external contracts. Without one, the result says that business correctness was not assessed.

### `cf-test`

Reviews pending tests, a named history range, explicit tests, or the existing suite against observable contracts and invariants.
It reports missing invariants, invalid domain states, redundant or over-specified assertions, brittle strings, and implementation-detail coupling, grouped by action (`remove`, `rewrite`, `strengthen`, `redesign`), without running the suite; the only repository write is the batched pass's recap, `.cflow/cf-test-recap.md`.

### `cf-docs`

Writes, updates, trims, and restructures Markdown docs, READMEs, and design notes against the code.
It enters when the request writes a Markdown file or asks to audit existing docs against the code; reading a doc to answer something else never triggers it.

### `cf-todo`

Creates and maintains a lightweight `todo.md` tracking next steps and open questions produced by an analysis or working session.
It enters only when the request changes the file; reading it or reporting what is left does not.
Completed tasks stay checked in place while work remains and after the list becomes fully complete. They are removed only when a later update adds new tasks to that fully completed list.

### `cf-brainstorm`

Turns a feature or product idea into an approved design spec through collaborative dialogue, one question at a time, before any implementation.
Invoke it explicitly ("let's brainstorm ..."); it never triggers on its own, and ambiguous or worth-building questions stay with `cf-mr-wolf`.

## First Use And Resume

Installing the pack only syncs materialized skills.
It does not create `.cflow/` immediately.

Skills that own durable artifacts create `.cflow/` only when they need it.
When `.cflow/` is created for the first time, Clean Flow writes a `.cflow/.gitignore` containing `*`, so the directory ignores itself and the repository `.gitignore` is never touched.

The normal lifecycle for a structural change or a new feature:

1. design it with `cf-architecture` (structure) or `cf-brainstorm` (feature) until the spec is approved
2. plan it with `cf-execute` into bounded units
3. lock behavior with an appropriate safety net
4. execute one accepted unit
5. review and verify
6. resume from `.cflow/execution-plan.md` when needed

For direct local work, use `cf-cognitive`, `cf-split`, or `cf-cohesion` instead.
To review what a set of changes exposes and route it, use `cf-review`: pending work before you commit, or a history range after the fact.
To inspect assertion quality, run `cf-test` separately against the same pending work or named history range; `cf-review` does not classify tests or assess their assertions.
For lightweight follow-up tracking from an analysis or working session, use `cf-todo`.

## Documentation

- [Architecture flow](./docs/architecture/doc-architecture.flow.md)
- [Execute flow](./docs/execute/doc-execute.flow.md)
- [Mr Wolf flow](./docs/mr-wolf/doc-mr-wolf.flow.md)
- [Scenario flow](./docs/scenario/doc-scenario.flow.md)
- [Cognitive flow](./docs/cognitive/doc-cognitive.flow.md)
- [Split flow](./docs/split/doc-split.flow.md)
- [Cohesion flow](./docs/cohesion/doc-cohesion.flow.md)
- [Review flow](./docs/review/doc-review.flow.md)
- [Test flow](./docs/test/doc-test.flow.md)
- [Docs flow](./docs/docs/doc-docs.flow.md)
- [Todo flow](./docs/todo/doc-todo.flow.md)
- [Brainstorm flow](./docs/brainstorm/doc-brainstorm.flow.md)
- [Maintaining this pack](./docs/maintaining-this-pack.md)
