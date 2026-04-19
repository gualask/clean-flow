# Cflow v6

Cflow is a repository-local skill pack for **behavior-preserving cleanup and refactor work**.

This version is built around **two macro phases**:

- **Phase A — analysis and definition**
  - read `AGENTS.md`
  - read `architecture.md`
  - analyze the repository
  - decide whether the path is soft or hard
  - stop for user alignment only when a material decision is still open
  - create or refresh `architecture.md`
  - create or refresh `refactor-brief.md` when the work is non-trivial
- **Phase B — execution**
  - map the current work unit
  - establish a safety net
  - apply the bounded refactor
  - simplify locally
  - review
  - verify

## Canonical files

Keep these file names exactly in lowercase:

- `AGENTS.md`
- `architecture.md`
- `refactor-brief.md`

Why lowercase:
- it avoids case-mismatch confusion across tools and prompts
- it makes repository guidance easier to reference consistently

## Skill families

### Public entrypoints
- `cf-start`
- `cf-review`
- `cf-verify`
- `cf-feedback-intake`

### Advanced phase skills
- `cf-phase-discovery`
- `cf-phase-brainstorming`
- `cf-phase-target-shape`
- `cf-phase-migration-units`
- `cf-phase-pressure-map`

### Advanced execution steps
- `cf-step-safety-net`
- `cf-step-boundary-apply`
- `cf-step-local-simplify`

## Naming model

- `cf-` = this skill belongs to the Cflow suite
- `phase-` = analysis or decision work
- `step-` = bounded execution work that should not invent missing strategy

## What changed in v6

- `cf-start` is now the **real orchestrator**, not a router that only suggests the next skill
- `architecture.md` is now treated as a **required repository map**
- discovery is now more **repo-level**
- pressure mapping is now more **work-unit level**
- the pack is designed so that `cf-start` can continue on its own and stop only when:
  - a material choice needs user input
  - the user asked for analysis only
  - the user did not make execution intent clear after analysis

## Language rule

- Conversational output should follow the **user's language**
- Durable repo artifacts should use the **dominant documentation language of the repository**
- If the repository has no dominant documentation language, use the user's language for artifacts too

## Install

Copy the pack into the repository root:

```bash
cp -R .agents /path/to/repo/
cp AGENTS.example.md /path/to/repo/AGENTS.md
cp architecture.md /path/to/repo/
cp refactor-brief.template.md /path/to/repo/
```

Then keep `architecture.md` updated as the stable repository map.
Create `refactor-brief.md` only when the work is non-trivial, multi-step, risky, or likely to resume later.

## Recommended usage

### Normal start
```text
$cf-start Analyze this repository and proceed as far as possible. Stop only if a material cleanup decision needs my input.
```

### Analyze only
```text
$cf-start Analyze this repository and stop after Phase A with a recommended path and updated artifacts.
```

### Analyze and execute the first bounded unit
```text
$cf-start Analyze this repository, decide the right path, and execute the first bounded work unit if the direction is clear.
```

### Advanced manual flow

Use the advanced skills only when you already know where you are in the workflow.

#### Phase A
```text
$cf-phase-discovery Analyze repository context, architecture fit, and whether the right path is soft or hard. Do not implement.
```

```text
$cf-phase-brainstorming Resolve the material cleanup decisions with the user, then lock or refresh architecture.md and refactor-brief.md if the direction is stable.
```

#### Phase B
```text
$cf-phase-pressure-map Analyze the current bounded work unit and map its workflows, responsibility mix, and safe split direction.
```

```text
$cf-step-safety-net Establish the smallest credible behavior lock for the current bounded work unit.
```

```text
$cf-step-boundary-apply Apply the bounded structural cleanup for the current work unit. Preserve behavior.
```

```text
$cf-step-local-simplify Simplify naming and control flow in the touched area without reopening architecture.
```

```text
$cf-review Review the touched area and judge whether the refactor reduced pressure without over-engineering.
```

```text
$cf-verify Verify the touched area with factual evidence before claiming completion.
```

## Practical rule of thumb

- Start with `cf-start`
- Use the other skills manually only when you want tighter control
- Do not start with a `cf-step-*` skill unless the work unit is already clear
