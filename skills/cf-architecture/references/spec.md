# Architecture Spec

The user has replied to a tree that changes the structure. A tree that keeps the structure has no spec.

Read [references/design-spec-lifecycle.md](references/design-spec-lifecycle.md): it holds the draft → spec cycle, from resume check to promotion. Run that cycle as owner `cf-architecture`, with the user's reply as the first decision.

Besides the lifecycle sections, the spec holds:

- the target tree the user replied to, with what each directory owns and the `file:line` that proves it;
- a `Moves` table, one row per move: what moves, from → to, the decision it carries (file:line), and the evidence that its current owner is wrong. A move with no such evidence is not a move. Every move comes from the tree the user replied to; a change found only while writing the spec goes to `Questions` as an open question, not into `Moves`;
- the migration order.

For a draft handed over by `cf-brainstorm`, keep its sections and add the target tree of the touched modules, with what each directory owns and the `file:line`, and a `Moves` table only for existing code the feature must relocate, with the same evidence rule; add a migration order only when there are moves.

An approved spec ends this skill.
