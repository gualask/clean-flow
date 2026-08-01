---
name: cf-review
description: "Report structural, convention, and authoritative requirement findings for a set of code changes. Use when the current request asks to review pending or uncommitted work, commit readiness, recent commits, a commit range, or a branch. Do not use to fix findings, assess test assertion quality, or review an unchanged file or area; route test quality to cf-test and a target without a change set to the owning diagnostic skill."
---
Detect eligible structural and authoritative-requirement violations exposed by a bounded change set, record them with evidence, and route them to the skill that owns the next decision.

Do not edit repository files or invoke another skill that edits them.

## Scope

Resolve exactly one change set from the current request:

- **Pending work**, the default: staged, unstaged, and untracked files together, read from repository state.
- **A named history range**: the last few commits, a commit range, or a branch against its base. Take this path only when the current request names it. A clean working tree is not a reason to infer a range.

Then, for either one:

- **Primary files** are the selected, existing files. Each is in scope as a whole, not only at changed lines.
- Read primary files from the working tree as it stands, which is the state a maintainer inherits. When a range was named and uncommitted work also exists, say so: a finding may already be addressed on disk.
- **Deleted entries** are not primary files. Take their old names and paths from the change-set diff or range base, and use them only to find stranded references, incomplete transitions, and documentation drift.
- **Audit surfaces** are repository-controlled references or documentation outside the primary files that lenses 6 or 10 inspect because a selected change may have made them stale. Do not run structural lenses on an audit surface unless the change set also selected it as a primary file.
- **Authoritative intent sources** are explicit requirements from the current request or change description, repository-controlled product or domain documentation and acceptance criteria that name the affected behavior, and primary external contracts linked by the request, code, or repository docs. Lens 11 compares against them; implementation code is never its own intent source.
- A violation that predates the change set is still a finding. Clean new code inside a file that breaks a rule does not clear that file; the change set is the moment the violation resurfaces.
- Generated, vendored, and ignored paths stay out of scope.

## Hard Gates

**Report candidates; never confirm them.** Every finding carries evidence and stays a candidate. Do not expand a file-level trigger into an inventory of subordinate hotspots in that file; continue running the other mandatory lenses, but leave deeper diagnosis, causes, remedies, and confirmation to the receiving skill. A file that breaks a file-level trigger is one finding. Express false-positive risk through `status: candidate` and confidence with its basis.

**Report only violations whose remedy is confined to a nameable unit.** A smell whose fix propagates to every site sharing a shape — and which therefore no single commit can clear — stays out, however real it is. `references/sweep.md` names the excluded families and the rationalization to refuse.

**Complete the sweep before any routing.** Do not name a destination skill, propose a fix, or start a deeper look while findings are still being collected. Routing happens once, after the last lens has run, and only then does `references/handoff.md` load. Stopping mid-sweep to act on the first hotspot is the failure this gate exists to prevent.

## Flow

1. Resolve the change set from the current request. List primary files, deleted entries, and authoritative intent sources separately.
2. Read `references/dynamic-agents.md`. Run its installed-local context gate against every primary file and already-identified authoritative source before loading them in full. Follow its policy and consent UX exactly.
3. Read `references/sweep.md` and `references/navigation-cost.md`. When the change is move-shaped, also read `references/reference-audit.md`; use its read-only audit rule and do not apply its editing rule. Run every lens against its declared surface. All lenses are mandatory; only a lens whose observable condition is absent may be not applicable.
4. For `local`, run the sweep sequentially. For `subagent-1`, `subagent-2`, or `batched`, read `references/review-agent-brief.md` and fill every placeholder. Every assignment applies all lenses. The shared reference owns assignment and completion; treat its merged ledger as the completed sweep before step 5 loads `references/handoff.md`.
5. When the sweep produced at least one finding, read `references/handoff.md` and build the routing output. With no findings, do not read it: report `Findings: none`, `Handoff: none`, and `Result: clear`. Either way the output accounts for every lens.

If the current request names no range and nothing is pending, say so and stop; never widen the pass to the repository. If a named range reaches most of the repository, say so and ask for a narrower one: a change set that covers everything has stopped being a reference point, which is the only thing keeping these findings verifiable.

## Routing

Each lens carries a fixed destination, listed in `references/sweep.md`. The destinations are `cf-cognitive`, `cf-split`, `cf-cohesion`, `cf-simplify`, `cf-scenario`, `cf-docs`, and `cf-start`. A finding no destination owns goes to `cf-mr-wolf`.

Route, do not invoke: name the destination and let the user choose what to open next.

## Artifacts

- Do not create or update repository files, including todo files and `.cflow/*`.
- If the current request also asks to persist findings, finish this read-only pass and name `cf-todo` as the separate next action.

## Output Format

Return only:

- **Scope**: which change set was resolved and how, primary file count and list, deleted entries, audit surfaces inspected, and authoritative intent sources checked.
- **Context budget**: measured files, LOC, estimated tokens, selected policy, consent source, and actual model or `runtime default`; use `local` when no agent ran.
- **Lenses**: every lens by number, each marked as reporting, silent, or not applicable. A `not applicable` mark must name the condition that was absent; a mark without one is a lens that was skipped, and skipping is what this slot exists to make visible.
- **Findings**: every candidate, grouped by file, in the shape `references/handoff.md` defines. Report all of them; do not cap, rank away, or soften a finding that fires a hard trigger.
- **Handoff**: with findings, destination skill mapped to the findings it receives and the recommended first one to open; otherwise `none`.
- **Test-quality follow-up**: `eligible — route cf-test` with the primary test count, or `not applicable — no primary tests`; never run `cf-test` from this pass.
- **Result**: with findings, the shipping recommendation from `references/handoff.md`; otherwise `clear`. Always append exactly one business-alignment qualifier: `business alignment checked against <sources>`, `business correctness not assessed: no authoritative requirement source identified`, or `business correctness not assessed for <case>: authoritative sources conflict or are ambiguous`. State confirmation still needed, that no repository files were modified, and the next action.
