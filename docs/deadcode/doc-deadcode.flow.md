# cf-deadcode

Runtime: [SKILL.md](../../skills/cf-deadcode/SKILL.md).

## Basis

- **A row for every name two sides share by convention.** [Connascence of Name](https://connascence.io/name.html): "multiple components must agree on the name of an entity."
- **Import-graph tools miss those pairings, so the cells come from reading the source.** Knip, [Handling Issues](https://knip.dev/guides/handling-issues): "Dynamic import specifiers aren’t resolved". Vulture, [README](https://github.com/jendrikseipp/vulture): "code that is only called implicitly may be reported as unused." Samhi et al., [Call Graph Soundness in Android Static Analysis](https://arxiv.org/abs/2407.07804) (ISSTA 2024): the tools "failed to capture 61% of the dynamically-executed methods."
- **An unpaired name is dead.** Node.js, [`emitter.emit`](https://nodejs.org/api/events.html): "Returns true if the event had listeners, false otherwise."

## No external source

Kept on the pack's own runs or on the user's decision: the table form; the example list of boundary names; opening only on a request about unused code.
