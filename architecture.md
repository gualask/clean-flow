# Repository Architecture

Keep this file concise and stable.
It is the repository map, not a changelog and not a refactor diary.

## Purpose
- What this repository does:
- Who or what uses it:

## Product shape
- Project type:
- Domain gravity:
- Main operational style:

## Top-level module or workspace map
- Area 1:
- Area 2:
- Area 3:

## Entry points
- Primary runtime entry points:
- Human or automation entry surfaces:

## External boundaries
- Filesystem:
- Network / HTTP:
- Database / storage:
- Browser / UI / IPC / OS APIs:
- Other boundaries:

## Boundary model
- Current boundary style:
- Where orchestration tends to live:
- Where integrations tend to live:
- Where pure logic tends to live:

## Packaging model
- Current packaging style:
- Why this packaging currently fits or does not fit:

## Dependency direction
- Important allowed directions:
- Important forbidden directions:
- Practical rules maintainers should follow:

## Stable invariants
- Behaviors or flows that must stay easy to reason about:
- Areas that should remain thin:
- Areas that should remain local rather than shared:

## Refactor guidance
- Prefer soft cleanup vs hard refactor when:
- Common pressure points to watch:
- Non-goals for future cleanup:

## Notes for future sessions
- Anything a new maintainer should understand quickly:
