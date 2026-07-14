![Clean Flow hero](./public/hero.png)

# Clean Flow

Clean Flow is a Codex skill pack for cleanup and refactor planning, migration, and execution.
It helps an agent understand the repository, choose the right refactor path, keep work resumable, and avoid uncontrolled rewrites while still treating hard restructures as first-class when the architecture is the real problem.

Use it when you want Codex to:

- clarify an unclear cleanup or refactor goal before touching code
- map the current repository shape before planning changes
- trace a workflow or command path and find sequence, ownership, or failure-mode issues
- explain the real impact of a bug, behavior, or change through concrete code-grounded scenarios
- generate or review docs against the code
- review an area for overengineering, duplicated parallel flows, or complexity that no longer earns its place
- split an overloaded file into nearby owned files
- reduce local cognitive complexity in a source file
- regroup related files into a more cohesive local feature slice
- run a larger cleanup/refactor flow with artifact-backed resume
- brainstorm a new feature or idea into an approved design spec (explicit invocation only)

## Why Use It

Refactors often fail because the agent starts moving code before it understands the problem, the current boundaries, or the behavior that must stay fixed.
Clean Flow gives Codex a practical operating system for that work:

- **Problem first**: unclear requests are framed before implementation.
- **Repository aware**: architecture and path evidence are captured from the actual codebase.
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
```

The installer materializes packaged skills, vendors shared authoring files into the consuming skill directories, and syncs packaged Codex custom agents.
Global install writes to `$CODEX_HOME/skills` and `$CODEX_HOME/agents`, or falls back to `~/.codex/skills` and `~/.codex/agents`.

After installation, ask Codex to use one of the public entrypoints below.
For most cleanup or refactor work, start with:

```text
Use cf-start to assess this cleanup/refactor and recommend the next step.
```

<details>
<summary>Uninstall</summary>

Remove only Clean Flow-owned skill directories and Codex custom agents:

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

### `cf-start`

The main workflow controller for cleanup and refactor work, including hard-restructure planning and behavior-preserving migration units.
Use it for fresh assessment, planning, bounded execution, review, verification, and resume.

It can create and maintain:

- `.cflow/architecture.md`
- `.cflow/refactor-brief.md`

### `cf-mr-wolf`

<img src="./public/wolf.png" alt="cf-mr-wolf thumbnail" width="96" align="left" hspace="12">

Helps frame and solve difficult problems before implementation or refactor assessment.  
Invoke it explicitly when the problem is hard, ambiguous, or needs careful reasoning before code changes.

<br clear="left">

### `cf-simplify`

Reviews an area for overengineering, file sprawl, duplicated or parallel near-identical flows, and accidental complexity.
Use it when you are unsure whether the current behavior, interface contracts, boundaries, or abstractions are worth their code cost, or whether similar flows should be consolidated behind one abstraction.

### `cf-architecture`

Builds or refreshes `.cflow/architecture.md` from repository evidence.
Use it when Codex needs a current map of the codebase before making planning decisions.

### `cf-trace`

Reconstructs and audits one concrete workflow, command path, install path, or refactor path.
Use it to find ordering problems, missing states, unclear ownership, weak failure handling, resume gaps, or test gaps.

### `cf-scenario`

Explains what really happens in a concrete scenario, grounded in the code.
Use it to frame a bug, compare similar flows, or validate the practical impact of a recent implementation.

### `cf-cognitive`

Finds or reduces local cognitive complexity in up to three source files.
Use it for overloaded functions, deep nesting, hard-to-scan branching, or local readability pressure.

### `cf-split`

Evaluates or performs a behavior-preserving split of one source file into nearby owned files.
Use it when a file has grown past its natural responsibilities.

### `cf-cohesion`

Evaluates or performs local regrouping of already-related files.
Use it when a workflow or feature is scattered across folders and navigation cost is the problem.

### `cf-docs`

Generates or reviews Markdown docs, READMEs, and design notes against the code.
Use it when docs may be stale, too verbose, duplicated, or structurally out of sync.

### `cf-todo`

Creates and maintains a lightweight `todo.md` tracking next steps and open questions produced by an analysis or working session.
Completed items are checked, then removed only when you ask to commit; git is the only history, so the file holds live work only.

### `cf-brainstorm`

Turns a feature or product idea into an approved design spec through collaborative dialogue, one question at a time, before any implementation.
Invoke it explicitly ("let's brainstorm ..."); it never triggers on its own, and ambiguous or worth-building questions stay with `cf-mr-wolf`.

## First Use And Resume

Installing the pack only syncs materialized skills and Codex custom agents.
It does not create `.cflow/` immediately.

Skills that own durable artifacts create `.cflow/` only when they need it.
When `.cflow/` is created for the first time, Clean Flow writes a `.cflow/.gitignore` containing `*`, so the directory ignores itself and the repository `.gitignore` is never touched.

Use `cf-start` when you want the normal cleanup/refactor lifecycle:

1. assess the repository pressure
2. choose a safe path
3. plan one bounded unit
4. lock behavior with an appropriate safety net
5. execute
6. review and verify
7. resume from `.cflow/refactor-brief.md` when needed

For direct local work, use `cf-cognitive`, `cf-split`, or `cf-cohesion` instead.
For overengineering or "are these files necessary?" reviews, use `cf-simplify`.
For standalone repository mapping, use `cf-architecture`.
For path reconstruction or workflow audit, use `cf-trace`.

## Documentation

- [Start flow](./docs/start/doc-start.flow.md)
- [Mr Wolf flow](./docs/mr-wolf/doc-mr-wolf.flow.md)
- [Architecture flow](./docs/architecture/doc-architecture.flow.md)
- [Simplify flow](./docs/simplify/doc-simplify.flow.md)
- [Trace flow](./docs/trace/doc-trace.flow.md)
- [Scenario flow](./docs/scenario/doc-scenario.flow.md)
- [Cognitive flow](./docs/cognitive/doc-cognitive.flow.md)
- [Split flow](./docs/split/doc-split.flow.md)
- [Cohesion flow](./docs/cohesion/doc-cohesion.flow.md)
- [Docs flow](./docs/docs/doc-docs.flow.md)
- [Brainstorm flow](./docs/brainstorm/doc-brainstorm.flow.md)
- [Maintaining this pack](./docs/maintaining-this-pack.md)
