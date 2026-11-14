# cf-deadcode

Runtime: [SKILL.md](../../skills/cf-deadcode/SKILL.md), shared [string-boundaries.md](../../shared/references/string-boundaries.md).

## Basis

- **The project's tool first, and again without tests.** Knip, [Production Mode](https://knip.dev/features/production-mode): "Test files usually import production files."; in that mode "files such as tests and Storybook files (stories) are excluded from the analysis." Haas et al., [Is Static Analysis Able to Identify Unnecessary Source Code?](https://teamscale.com/hubfs/26978363/Publications/2020-unnecessary-code-tosem.pdf) (TOSEM 2020): classes with "only references from test code, are considered dead code."
- **A row for every name two sides share by convention.** [Connascence of Name](https://connascence.io/name.html): "multiple components must agree on the name of an entity."
- **Import-graph tools miss those pairings, so the cells come from reading the source.** Knip, [Handling Issues](https://knip.dev/guides/handling-issues): "Dynamic import specifiers aren’t resolved". Vulture, [README](https://github.com/jendrikseipp/vulture): "code that is only called implicitly may be reported as unused." Samhi et al., [Call Graph Soundness in Android Static Analysis](https://arxiv.org/abs/2407.07804) (ISSTA 2024): the tools "failed to capture 61% of the dynamically-executed methods."
- **An unpaired name is dead.** Node.js, [`emitter.emit`](https://nodejs.org/api/events.html): "Returns true if the event had listeners, false otherwise."

## No external source

Kept on the pack's own runs or on the user's decision: the table form and the report limited to its unpaired rows; the example list of boundary names; opening only on a request about unused code; the table limited to the files the request names; the line saying where code only tests reach was not checked.
