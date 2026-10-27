# AGENTS.md and CLAUDE.md

A coding agent reads this file at the start of every task, so every line costs attention on every task.

Keep only what an agent cannot learn by reading the repository, each with its reason:

- the commands that verify a change, when they are not the obvious ones or must run together;
- conventions that differ from the tools' defaults, and places where the code misleads;
- rules and decisions that live outside the code.

Leave out the repository layout, the product overview, generic coding advice, and whatever another file already says (README, CONTRIBUTING, docs, linter and formatter configs): point to that file instead. A directory appears only with a rule about it that the code does not show.
