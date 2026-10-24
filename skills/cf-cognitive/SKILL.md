---
name: cf-cognitive
description: Find or refactor local source-file cognitive complexity hotspots while preserving behavior. Use when a function or file is hard to read or reason about — overloaded functions, deep nesting, tangled branching, local readability pressure — with or without explicit file targets. Do not use to split a file into new files (cf-split) or for repository-wide refactors (cf-architecture).
---
Find or reduce cognitive complexity in local source files while preserving behavior.

Route elsewhere instead of working here, and when routing do not edit files: `cf-split` for extracting responsibilities from one file into new files; `cf-cohesion` for regrouping related files; `cf-architecture` for module boundaries, ownership moves, or moving code into another package or module, even when the request names the destination.

Measure before judging: run a command that prints, for every function in the files in scope, its logical lines and its deepest nesting of control blocks. Count nesting as the control blocks inside a function — every `if`, loop, `switch`, `select`, or `try`, including one that only guards a `break` or `return`; a third nested block fires the trigger. Read references/navigation-cost.md for the thresholds, the named exemptions that allow `keep as-is` past a threshold, the file-length verdict, and the report/action rule.

- **Discovery** (no file named): run the measure over the source files of the area, rank functions by nesting then length, and report a shortlist of at most three with file, line, and the trigger each fires. Do not edit.
- **Evaluation** (a file named, asked whether it is worth cleaning): classify it `recommended`, `optional`, `keep as-is`, or `route`, naming the exemption when a trigger fires and the verdict is not `recommended`; for a long function, say what the four tests of Execution would extract, or which test keeps it whole; give the file-length verdict. Do not edit.
- **Execution** (asked to reduce, refactor, or fix): stay inside the file, do not create files or move responsibilities to shared utilities. Flatten the main path first (guard clauses, early returns). Then shape the code top-down with four tests:
  - **level**: the function that orchestrates a behavior reads as a list of steps at one level of abstraction; what sits below that level moves to named functions placed below it in call order, as long as the caller can be read without opening them (when it cannot, the two are conjoined and stay together).
  - **owner**: when state outlives a single step, because callbacks, threads, or later calls read and change it (flags, timers, handles, a running process), give it one named owner that hides it. Write its release once, next to where it is acquired, so that every exit path reaches it, errors included; use the form the language and the repository use for that: a destructor or drop guard, `defer`, a `with`, `using`, or try-with-resources block, or a `stop` operation called from the cleanup of a lifecycle callback (a UI effect, a test fixture, a request handler). The orchestration still reads how the behavior starts and how it stops. Do not hand the whole lifecycle to the owner as one call, and do not leave the state in the orchestration. Locals that one step builds and returns need no owner.
  - **pure core**: a computation that only uses its inputs leaves the code that touches the outside world (timers, I/O, state, framework calls) as a named pure function; the call stays where it is and receives the computed value.
  - **consistency**: shape every extraction with the forms the file and the repository already use (how they declare inner and top-level functions, how they build stateful owners, how they name) before choosing a form of your own. When a repository form and the call order of **level** clash, keep the repository form; the orchestration already gives the top-down reading.

  A long function that passes all four tests stays as it is. Run the tests that cover the file with the repository's test runner, then measure again.

## Output Format

Return only:

- **Assessment**: shortlist, classification, or the functions addressed, with the measures before and after; after execution, each unit extracted or kept whole with the test that decided it.
- **Checks**: commands run and results; the test command and its result, or `tests not run` with the reason.
- **Defects**: behavior defects noticed against the code's documented rules, with file and line, or `none` naming what you checked against.
- **Deferred**: after execution only, per the report/action rule.
- **Result**: behavior preservation claimed only when the tests passed; next step when a route applies.
