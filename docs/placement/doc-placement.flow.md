# cf-placement Flow

## Purpose

Document the runtime flow for `cf-placement`, the public local entrypoint for splitting one source file into nearby files or regrouping related files into owner folders, preserving behavior. Non-code content stays outside this flow.

## Runtime Inputs

- Public skill: `skills/cf-placement/SKILL.md`, which carries the whole flow in its body
- Runtime references: none
- Shared script vendored into runtime paths: `skills/_shared/scripts/dir-population.mjs` (discovery count; also used by `cf-review` lens 9)
- Target artifacts: none

## High-Level Flow

1. Start from the named file or area, or from the repository in discovery.
2. A request that only asks whether to split or regroup gets an answer and no edit. On a 330-line TS model the skill and the model without it named the same candidates and edited nothing (1 run each, 2026-10-25): evaluation adds nothing over the bare model, and stays for the no-edit gate.
3. In discovery, count direct source files per directory with the bundled `dir-population.mjs` from the skill root, name the best candidate, and do not edit. On fyler-ui the skill ran the script and ranked the 17-file `merge/model` directory first; without the skill the model gave a broad review with no count and did not name it (1 run each, 2026-10-25).
4. Route without editing to `cf-architecture` when a regrouping would create a folder the language or build treats as a new package or module, move files across features, or change module boundaries. On linqode `internal/tui` (Go) "it is hard to find my way, reorganize it" routed with the package reason and no edit (1 of 1 with the merged skill, 1 of 1 with the earlier regrouping skill); without the skill the model touched 24 files (+906/−792), renamed by prefix inside the package, and edited `TODO.md` and the architecture doc, suite green. Grouping by filename prefix inside one Go package is not harm, and the route still excludes it.
5. A split extracts named owners into files next to the source, kept flat where a folder would be a new package or module. On a 292-line Go file the split stayed flat with bodies unchanged and deferred the owner cluster to `cf-architecture` (2 of 2 across the minimal and merged skill).
6. A regrouping moves whole files without rewriting them. On a 17-file TS model directory the diff held only moves and import paths (2 of 2); without the skill the model moved helpers between files and removed re-exports (1 of 1).
7. Move the tests of each moved unit next to its new file, update every reference. Without the skill, tests stayed in the original file in every split run (0 of 4).
8. Run those tests and the checks a move can break (types, lint, unused exports), scoped to what changed. With "smallest relevant check", and with "typecheck and those tests", the split left an unused export that the repository's knip check rejected (2 of 2); with the scoped hint knip ran and passed in 4 of 4 TS runs, and the run whose commands were counted ran no build, e2e or full suite (2026-10-25).
9. Each function past 20 logical lines in a modified file is a Deferred finding routed to `cf-cognitive`, as in `cf-review` lens 8. Without the line Deferred was `none` on the split and on the regrouping (1 run each); without the skill no run deferred anything (0 of 6). The pack does not define a logical line, and the misses sit at the threshold. With an AST count of non-blank, non-comment lines that leaves out bracket-only lines, 7 of 8 split and regrouping runs deferred every function past 20; the eighth missed two of 21 and 22 lines. Counting bracket-only lines as well, functions of 23–27 lines that some runs left out cross the threshold (2026-10-25).

## Output Slots

The slots use the pack's shared `## Output Format` list, the same five as `cf-cognitive`.

- **Assessment**: each file created or moved with the test that now covers it. With the slot, test coverage was complete and declared in 3 of 3 split runs; without it, tests sat next to 2 of 4 new files, undeclared (1 run, indication).
- **Checks**: the test command and its result, or `tests not run` with the reason.
- **Defects**: with a BMP-support defect planted against the repository's export doc, 2 of 2 runs with the slot named it with file and line; without the slot 0 of 1, without the skill 0 of 1 (2026-10-25).
- **Deferred**, **Result**: as above; behavior preservation claimed only when the tests passed.

## History

`cf-placement` merges `cf-split` and `cf-cohesion` (2026-10-25): the two shared bed, gates, script and slots, and each routed to the other. Built from the minimal versions of both: 489 tokens with the description, against 5,389 across the two skills and the references their flows loaded; it held every gate the minimal versions held in 7 cells (split, regrouping, Go split, Go route, evaluation, discovery, planted defect), 1 run each.

Dropped with no harm found: the references (evaluation, execution, targeted evaluation, file-split rules, navigation cost, reference audit; no run read them), the ambiguity question, "exactly one split" and "only the evaluated owner cluster" (without them the skill extracted three files or grouped two folders, suite green), the verdict labels, placement counts and the owner-folder rule, and the **Scope**, **Decision** and **Cohesion map** slots.

Routing battery on 18 prompts with the new description (gpt-6.1-sol, 2026-10-25): the four former split and cohesion prompts opened `cf-placement`, no cognitive, architecture or no-skill prompt did; 17 of 18 as expected, the 18th went to `cf-scenario` with the previous pack as well.
