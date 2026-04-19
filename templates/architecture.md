# architecture.md

## Purpose

Describe what this repository exists to do in 2-4 lines.

## Product shape

Record the high-level shape in repository terms:
- project type
- domain gravity
- main operational style

## Top-level map

List the main packages, crates, apps, modules, or bounded areas and what each one owns.

## Entry points

List the user-facing or system-facing entry points:
- CLI commands
- HTTP servers
- UI apps
- workers
- scripts
- libraries / public APIs

## External boundaries

List the important boundaries:
- filesystem
- database
- network / HTTP
- browser APIs
- OS APIs
- queues
- storage
- subprocesses
- tool integrations

## Boundary model

State the current dominant model, for example:
- layered
- use-case oriented
- modular monolith
- ports-and-adapters-ish
- mixed / pragmatic

Explain it briefly in repository terms, not abstract theory.

## Packaging model

State how code is mainly organized:
- by capability
- by layer
- by feature
- by workflow
- hybrid

## Dependency direction

Describe the important dependency direction rules in a few lines.

## Stable invariants

Record the flows or constraints that future refactors should keep easy to reason about, for example:
- critical workflows that must stay legible
- areas that should remain thin
- areas that should stay local rather than shared

## Refactor guidance

Record the stable rules future refactors should follow here, for example:
- preserve workspace shape unless a recurring friction justifies change
- keep CLI thin and orchestration readable
- avoid fake shared utilities
- prefer local helpers until reuse is real

Keep this document stable and short.
