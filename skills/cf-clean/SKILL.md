---
name: cf-clean
description: "Check code against what the Cflow skills ask — structure, placement, readability, dead names, dependency direction, ownership, leftovers and documentation drift. Use only when the request names cf-clean or asks for a Cflow cleanup or alignment pass on pending work, commits, a path, or the repository."
---
Check one target against the criteria of every Cflow diagnostic skill, record findings with evidence, and route each one to the skill that owns the next decision.

Do not edit repository files other than the recap and the map under `.cflow/`.

## Target

Resolve exactly one target from the current request:

- **Pending work**: staged, unstaged, and untracked files together, read from repository state.
- **A named history range**: the last few commits, a commit range, or a branch against its base.
- **Paths**: the files or directories the request names.
- **The repository**.

With no target named, take pending work; with nothing pending, take the repository.

Pending work and a history range are **change targets**. For them:

- **Primary files** are the selected, existing files, each in scope as a whole; changed code is the lines the change adds or rewrites.
- Read primary files from the working tree as it stands. When a range was named and uncommitted work also exists, say so: a finding may already be addressed on disk.
- **Deleted entries** are not primary files. Take their old names and paths from the diff or range base, and use them only to find stale references, incomplete transitions, and documentation drift.
- A violation that predates the change is still a finding, unless the lens that fired limits itself to changed code.

For paths and the repository, every source file under the target is a primary file and all of its code counts as changed code; `introduced` does not apply.

For any target:

- **Audit surfaces** are repository-controlled references or documentation outside the primary files that lenses 1 or 3 inspect. Do not run the other lenses on an audit surface.
- Test files are primary files for lenses 1–10; their assertion quality belongs to `cf-test`.
- Generated, vendored, and ignored paths stay out; the context gate's `generated` line names the lockfiles among them.

## Hard Gates

**Report only violations whose remedy is confined to a nameable unit.** A smell whose fix propagates to every site sharing a shape — and which therefore no single commit can clear — stays out, however real it is. `references/sweep.md` names the excluded families and the rationalization to refuse.

## Flow

1. Resolve the target and list primary files, deleted entries, and audit surfaces separately.
2. Check whether `.cflow/cf-clean-map.md` exists by testing that path directly: `.cflow/` is git-ignored, so a file search that honors ignore files does not list it. When the target is the repository, an area of that map, or a request to continue from it, read `references/map.md`, which splits the repository into areas swept one per run and records which are done, and follow it. Otherwise read `references/context-gate.md`, which measures the primary files and selects `local` or `batched`. Run its installed-local context gate against every primary file before loading them in full. Follow its policy exactly; when it is `batched`, read `references/batched-execution.md`, which splits the files into batches and keeps the recap, and follow it.
3. Read `references/sweep.md` for the ten lenses and their routes, `references/navigation-cost.md` for the thresholds, naming test, and exemptions, and `references/string-boundaries.md` for the table of names sent and received. When the target is a move-shaped change, also read `references/reference-audit.md` for the searches that find stale references. Run every lens against its declared surface; only a lens whose observable condition is absent may be not applicable.
4. For `local`, run the sweep sequentially. For `batched`, every batch applies every lens. The shared reference owns batching and completion; treat its merged ledger as the completed sweep before step 5.
5. When the sweep produced at least one finding, read `references/handoff.md`, which defines finding content, grouping, routing, and the result, and build the routing output. With no findings, do not read it: report `Findings: none`, `Handoff: none`, and `Result: clear for the completed sweep`.

The pass does not hunt bugs. A bug seen while reading goes under **Bugs seen** with its evidence; no other lens absorbs it.

## Routing

Each lens carries a fixed route, listed in `references/sweep.md`: `cf-mr-wolf`, `cf-docs`, `cf-cognitive`, `cf-placement`, `cf-architecture`, or `cf-deadcode`. A finding no lens routes goes to `cf-mr-wolf`.

Route, do not invoke: name the route and let the user choose what to open next.

## Artifacts

- Owns `.cflow/cf-clean-recap.md`: the recap, written under the Recap File contract in `references/batched-execution.md`.
- Owns `.cflow/cf-clean-map.md`: the repository's areas and their coverage, under `references/map.md`.
- When the recap already exists and the request is about it, work through it under the same contract instead of running the Flow.
- Create or update no other repository file, including todo files and any other `.cflow/*` file. Persisting findings in a todo file belongs to `cf-docs`.

## Output Format

When `references/map.md` builds the map or stops on an existing one, return only what it names. Otherwise return only:

- **Target**: which target was resolved and how, primary file count and list, deleted entries, and audit surfaces inspected.
- **Context budget**: measured files, LOC, estimated tokens, and selected policy.
- **Lenses**: every lens by number, each marked as reporting, silent, or not applicable. A `not applicable` mark must name the condition that was absent; a mark without one is a lens that was skipped, and skipping is what this slot exists to make visible.
- **Findings**: every finding, grouped by file, in the shape `references/handoff.md` defines. When the pass wrote the recap, the recap holds them: give the finding count per file and per route, and name the recap.
- **Bugs seen**: each bug noticed while reading, with its evidence, or `none seen`; always followed by `bugs not searched for`.
- **Handoff**: with findings, each route mapped to the findings it receives, and the single finding to open first; otherwise `none`.
- **Test assertion quality**: `not assessed in this pass`; recommend running `cf-test` against the same target when it holds executable tests. Do not classify tests, report a test count, or run `cf-test` from this pass.
- **Result**: with findings, the recommendation from `references/handoff.md`; otherwise `clear for the completed sweep`, never unqualified `clear` or `commit-ready`. State that no repository file was modified apart from the recap and the map when the pass wrote them, and the next action.
- **Coverage**: when the pass swept an area of the map, as `references/map.md` defines it.
