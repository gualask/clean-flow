---
name: cf-review
description: "Report bugs, requirement contradictions, incomplete changes, documentation drift, and structural findings for a set of code changes. Use only when the current request explicitly asks for a review of pending work, recent commits, a commit range, or a branch. Do not use to fix findings, assess test assertion quality, or review an unchanged file or area; route test assertion quality to cf-test and a target without a change set to the owning diagnostic skill."
---
Detect findings exposed by a bounded change set under the selected focus, record them with evidence, and route each one to the skill that owns the next decision.

Do not edit repository files other than the batched pass's recap.

## Scope

Resolve exactly one change set from the current request:

- **Pending work**, the default: staged, unstaged, and untracked files together, read from repository state.
- **A named history range**: the last few commits, a commit range, or a branch against its base. Take this path only when the current request names it. A clean working tree is not a reason to infer a range.

Then, for either one:

- **Primary files** are the selected, existing files. Each is in scope as a whole, not only at changed code; changed code is the lines the change set adds or rewrites.
- Read primary files from the working tree as it stands, which is the state a maintainer inherits. When a range was named and uncommitted work also exists, say so: a finding may already be addressed on disk.
- **Deleted entries** are not primary files. Take their old names and paths from the change-set diff or range base, and use them only to find stale references, incomplete transitions, and documentation drift.
- **Audit surfaces** are repository-controlled references or documentation outside the primary files that lenses 4 or 6 inspect because a selected change may have made them stale. Do not run Structure lenses on an audit surface unless the change set also selected it as a primary file.
- **Authoritative sources** are explicit requirements from the current request or change description, repository-controlled product or domain documentation and acceptance criteria that name the affected behavior, and primary external contracts linked by the request, code, or repository docs. Lens 3 compares against them; implementation code is never its own authoritative source.
- Test files selected by the change set remain primary files.
- A violation that predates the change set is still a finding, unless the lens that fired limits itself to changed code. Clean new code inside a file that breaks a file-level rule does not clear that file; the change set is the moment the violation resurfaces.
- Generated, vendored, and ignored paths stay out of scope; the context gate's `generated` line names the lockfiles among them.

## Focus

The pass runs one focus, each a group of lenses from `references/sweep.md`:

- **Bugs and requirements**, lenses 1–3: does the change do what it should.
- **Leftovers and docs**, lenses 4–6: did the change finish its own job.
- **Structure**, lenses 7–12: does the change keep the code easy to maintain.
- **All**: every lens.

When the current request names what to look at — bugs, requirements, leftovers, docs, structure, or a complete review — take the matching focus. Otherwise, once the change set is resolved and before measuring or reading primary files, answer with this question in the language of the request, filled in, and stop:

```text
<the change set in one line: selector and changed files>. What should this review focus on?
1. Bugs and requirements
2. Leftovers and docs
3. Structure
4. All
Without a choice I start with Bugs and requirements.
```

A reply that accepts without choosing selects Bugs and requirements.

## Hard Gates

**Report; never diagnose.** Do not expand a file-level trigger into an inventory of the problems inside that file; continue running the other lenses of the focus, but leave deeper diagnosis, causes, and remedies to the skill on the finding's route. A file that breaks a file-level trigger is one finding.

**Report only violations whose remedy is confined to a nameable unit.** A smell whose fix propagates to every site sharing a shape — and which therefore no single commit can clear — stays out, however real it is. `references/sweep.md` names the excluded families and the rationalization to refuse.

**Complete the sweep before any routing.** Do not name a route, propose a fix, or start a deeper look while findings are still being collected. Routing happens once, after the last lens of the focus has run. Stopping mid-sweep to act on the first finding is the failure this gate exists to prevent.

## Flow

1. Resolve the change set from the current request. List primary files, deleted entries, and authoritative sources separately. Select the focus as **Focus** says.
2. Read `references/dynamic-agents.md`. Run its installed-local context gate against every primary file and already-identified authoritative source before loading them in full. Follow its policy exactly; when it is not `local`, read `references/delegated-execution.md` and follow it.
3. Read `references/sweep.md`; for Structure or All, also read `references/navigation-cost.md`. When the change is move-shaped and the focus is Leftovers and docs or All, also read `references/reference-audit.md`; use its read-only audit rule and do not apply its editing rule. Run every lens of the focus against its declared surface. Within the focus all lenses are mandatory; only a lens whose observable condition is absent may be not applicable.
4. For `local`, run the sweep sequentially. For `subagent-1`, `subagent-2`, or `batched`, read `references/review-agent-brief.md` and fill every placeholder. Every assignment applies every lens of the focus. The shared reference owns assignment and completion; treat its merged ledger as the completed sweep before step 5.
5. When the sweep produced at least one finding, read `references/handoff.md` and build the routing output. With no findings, do not read it: report `Findings: none`, `Handoff: none`, and `Result: clear for the completed sweep`.

If the current request names no range and nothing is pending, say so and stop; never widen the pass to the repository.

## Routing

Each lens carries a fixed route, listed in `references/sweep.md`: `cf-mr-wolf`, `cf-scenario`, `cf-docs`, `cf-cognitive`, `cf-split`, `cf-cohesion`, or `cf-architecture`. A finding no lens routes goes to `cf-mr-wolf`.

Route, do not invoke: name the route and let the user choose what to open next.

## Artifacts

- Owns `.cflow/cf-review-recap.md`: the batched pass's recap, written under the Recap File contract in `references/delegated-execution.md`. It is the pass's one repository write.
- When it already exists and the request is about it, work through it under the same contract instead of running the Flow.
- Create or update no other repository file, including todo files and any other `.cflow/*` file. Persisting findings elsewhere belongs to `cf-todo`.

## Output Format

Return only:

- **Scope**: which change set was resolved and how, primary file count and list, deleted entries, audit surfaces inspected, and authoritative sources checked.
- **Focus**: the selected focus and whether the request named it or the default was taken.
- **Context budget**: measured files, LOC, estimated tokens, selected policy, consent source, and actual model or `runtime default`; use `local` when no agent ran.
- **Lenses**: every lens by number, each marked as reporting, silent, not applicable, or not selected. A `not applicable` mark must name the condition that was absent; a mark without one is a lens that was skipped, and skipping is what this slot exists to make visible. `not selected` is only for a lens outside the focus.
- **Findings**: every finding, grouped by file, in the shape `references/handoff.md` defines.
- **Handoff**: with findings, each route mapped to the findings it receives, and the single finding to open first; otherwise `none`.
- **Test assertion quality**: `not assessed in this pass`; recommend running `cf-test` against the same pending work or named history range when that change set adds or changes executable tests. Do not classify tests, report a test count, or run `cf-test` from this pass.
- **Result**: with findings, the shipping recommendation from `references/handoff.md`; otherwise `clear for the completed sweep`, never unqualified `clear` or `commit-ready`. Name each focus not run as `not assessed`. When lens 3 ran, append exactly one requirement-alignment qualifier: `requirement alignment checked against <sources>`, `requirement alignment not assessed: no authoritative source identified`, or `requirement alignment not assessed for <case>: authoritative sources conflict or are ambiguous`. State that no repository file was modified apart from the recap when the pass wrote one, and the next action.
