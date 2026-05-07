![Clean Flow hero](./public/hero.png)

# Clean Flow

Clean Flow is a Codex skill pack for cleanup and refactor planning, migration, and execution.
It helps an agent understand the repository, choose the right refactor path, keep work resumable, and avoid uncontrolled rewrites while still evaluating hard restructures when the architecture is the real problem.

Use it when you want Codex to:

- clarify an unclear cleanup or refactor goal before touching code
- map the current repository shape before planning changes
- trace a workflow or command path and find sequence, ownership, or failure-mode issues
- explain the real impact of a bug, behavior, or change through concrete code-grounded scenarios
- split an overloaded file into nearby owned files
- reduce local cognitive complexity in a source file
- regroup related files into a more cohesive local feature slice
- run a larger cleanup/refactor flow with artifact-backed resume

## Why Use It

Refactors often fail because the agent starts moving code before it understands the problem, the current boundaries, or the behavior that must stay fixed.
Clean Flow gives Codex a practical operating system for that work:

- **Problem first**: unclear requests are framed before implementation.
- **Repository aware**: architecture and path evidence are captured from the actual codebase.
- **Clean target first**: recommendations optimize for the cleanest evidence-backed structure, not the easiest low-impact workaround.
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

The installer syncs packaged skills, shared support resources, and packaged Codex custom agents.
Global install writes to `$CODEX_HOME/skills` and `$CODEX_HOME/agents`, or falls back to `~/.codex/skills` and `~/.codex/agents`.

After installation, ask Codex to use one of the public entrypoints below.
For most cleanup or refactor work, start with:

```text
Use cf-start to assess this cleanup/refactor and recommend the next step.
```

<details>
<summary>Uninstall</summary>

Remove only Clean Flow-owned skill and support directories:

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

Reviews an area for overengineering, file sprawl, and accidental complexity.
Use it when you are unsure whether the current behavior, UX, boundaries, or abstractions are worth their code cost.

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

## First Use And Resume

Installing the pack only syncs the skills and support resources.
It does not create `.cflow/` immediately.

Skills that own durable artifacts create `.cflow/` only when they need it.
When `.cflow/` is created for the first time, Clean Flow also adds it to `.gitignore`.

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
- [Architecture flow](./docs/architecture/doc-architecture.flow.md)
- [Simplify flow](./docs/simplify/doc-simplify.flow.md)
- [Trace flow](./docs/trace/doc-trace.flow.md)
- [Cognitive flow](./docs/cognitive/doc-cognitive.flow.md)
- [Split flow](./docs/split/doc-split.flow.md)
- [Cohesion flow](./docs/cohesion/doc-cohesion.flow.md)
- [Maintaining this pack](./docs/maintaining-this-pack.md)
