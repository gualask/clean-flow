# .cflow/trace.md

Use this template as both the artifact shape and the controller review rubric for `cf-trace`.
Before writing the file, check the reconstruction report against every section below.

## Trace scope

- request:
- path name:
- entrypoint:
- trigger:
- in scope:
- out of scope:
- last updated:

## Reconstruction

Each step must be `observed` or `inferred`.
For inferred steps, record what would verify the step.

- step:
  - status: observed | inferred
  - evidence:
  - inputs:
  - outputs:
  - owner:
  - next step:
  - verification needed:

## State and artifacts

- runtime state:
- persisted artifacts:
- temporary artifacts:
- external systems:
- cleanup or rollback:
- resume behavior:

## Failure and edge paths

- validation failures:
- missing inputs:
- partial completion:
- retries:
- cancellation or timeout:
- concurrent runs:
- stale artifacts:

## Audit findings

- severity: high | medium | low
  - lens:
  - finding:
  - evidence:
  - impact:
  - recommended route:

## Lens coverage

- sequence correctness:
- state and resume:
- invariants:
- ownership:
- boundary contracts:
- failure modes:
- observability:
- testability:
- instruction ambiguity:

## Evidence

- files read:
- commands run:
- custom agent report:
- spot checks:

## Unknowns

- unknown:
- why it matters:
- how to verify:

## Recommended route

- route: cf-mr-wolf | cf-architecture-map | cf-start | cf-cognitive | cf-file-split | cf-cohesion | direct fix | none
- reason:
- immediate next action:
