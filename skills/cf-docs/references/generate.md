# Documentation Generation

Author new documentation or substantially update existing content.
Build the doc from verified facts and a single clear purpose, not from assumptions.

## Ground In The Code

- Read the relevant code before writing: entry points, public contracts, config, constants, and call sites that the doc will describe.
- Source every concrete value — versions, paths, command names, thresholds, symbol names — from the code, and prefer linking to the owning constant or module over hard-coding a value that can drift.
- When a fact cannot be verified in the repository, mark it as an open question rather than inventing it.

## Choose One Purpose

- Decide what the doc is for: how-to (accomplish a task), reference (look up exact details), or explanation (understand a design and its rationale).
- Keep that purpose consistent within a section; if the content needs another purpose, give it its own section or its own doc.
- State the scope up front so a reader knows what the doc does and does not cover.

## Place Each Concept Once

- Before adding an explanation, check whether another doc already owns that concept; if so, link to it and add only what is new here.
- Keep implementation mechanism near code according to the mode selected in the `SKILL.md` Mode Gate; let the doc carry intent, contracts, and rationale.
- Establish one home for shared values and link to it from every doc that needs them.

## Keep It Lean

- Write the smallest text that carries the fundamental concepts; omit historical notes and restated context.
- Prefer concrete contracts and examples drawn from the real code over generic prose.

## Close Out

- Validate links and anchors.
- Re-read each concrete claim against the code one last time.
- Note where the new doc should be linked from so it is discoverable.
