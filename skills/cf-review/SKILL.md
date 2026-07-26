---
name: cf-review
description: "Review a set of changes for structural and convention violations, reporting each with evidence and a route: uncommitted work by default, or a history range the request names. Use when the request asks to check or review pending changes, whether the working tree is ready to commit, or to review the last few commits or a branch. Do not use to fix or confirm the findings. With nothing pending and no range named, route a named file, area, or concern to cf-cognitive, cf-split, cf-cohesion, or cf-simplify."
---
Operate as the detector that runs over a set of changes: find every structural violation the changed files expose, record it with evidence, and hand it to the skill that owns it.

Do not edit repository files here.

## Scope

Resolve exactly one change set from the current request:

- **Pending work**, the default: staged, unstaged, and untracked files together, read from repository state.
- **A named history range**: the last few commits, a commit range, or a branch against its base. Take this path only when the current request names it. A clean working tree is not a reason to infer a range.

Then, for either one:

- The change set selects **files**, not lines. Every selected file is in scope as a whole.
- Read file contents from the working tree as it stands, which is the state a maintainer inherits. When a range was named and uncommitted work also exists, say so: a finding may already be addressed on disk.
- A violation that predates the change set is still a finding. Clean new code inside a file that breaks a rule does not clear that file; the change set is the moment the violation resurfaces.
- Deleted files leave scope for structural lenses but stay in scope for the references and leftovers they may have stranded.
- Generated, vendored, and ignored paths stay out of scope.

## Hard Gates

**Report candidates; never confirm them.** Every finding carries evidence and stays a candidate. Do not open a flagged file to enumerate what else is wrong inside it, do not diagnose a cause, do not weigh remedies, and do not judge whether a candidate survives scrutiny. A file that breaks a file-level trigger is one finding; its internal hotspots belong to the receiving skill. False positives are expected and must be declared as such.

**Report only violations whose remedy is confined to a nameable unit.** A smell whose fix propagates to every site sharing a shape — and which therefore no single commit can clear — stays out, however real it is. `references/sweep.md` names the excluded families and the rationalization to refuse.

**Complete the sweep before any routing.** Do not name a destination skill, propose a fix, or start a deeper look while findings are still being collected. Routing happens once, after the last lens has run, and only then does `references/handoff.md` load. Stopping mid-sweep to act on the first hotspot is the failure this gate exists to prevent.

## Flow

1. Resolve the change set from the current request and list the files in scope.
2. Read `references/sweep.md` and run every lens it defines against those files. All lenses are mandatory; a lens that finds nothing reports nothing, but it is never skipped.
3. When the sweep produced at least one finding, read `references/handoff.md` and build the routing and persistence output. With no findings, report a clean result and stop. Either way the output accounts for every lens.

If the current request names no range and nothing is pending, say so and stop; never widen the pass to the repository. If a named range reaches most of the repository, say so and ask for a narrower one: a change set that covers everything has stopped being a reference point, which is the only thing keeping these findings verifiable.

## Routing

Each lens carries a fixed destination, listed in `references/sweep.md`. The destinations are `cf-cognitive`, `cf-split`, `cf-cohesion`, `cf-simplify`, `cf-scenario`, `cf-docs`, and `cf-start`. A finding no destination owns goes to `cf-mr-wolf`.

Route, do not invoke: name the destination and let the user choose what to open next. The only skill this pass hands work to directly is `cf-todo`, to persist the findings.

## Artifacts

- Do not create, read, or update `.cflow/*`; nothing here is resumable state.
- Findings persist through `cf-todo`, which owns the repository todo file.

## Output Format

Return only:

- **Scope**: which change set was resolved and how, file count, and files in scope.
- **Lenses**: every lens by number, each marked as reporting, silent, or not applicable. A `not applicable` mark must name the condition that was absent; a mark without one is a lens that was skipped, and skipping is what this slot exists to make visible.
- **Findings**: every candidate, grouped by file, in the shape `references/handoff.md` defines. Report all of them; do not cap, rank away, or soften a finding that fires a hard trigger.
- **Handoff**: destination skill mapped to the findings it receives, and the recommended first one to open.
- **Result**: whether anything found should block shipping the change set, what was persisted, and the next action.
