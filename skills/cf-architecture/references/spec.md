# Architecture Spec

The user has replied to a recommendation that changes the structure. A recommendation to keep the structure has no spec.

Read [references/design-spec-lifecycle.md](references/design-spec-lifecycle.md): it holds the draft → spec cycle, from resume check to promotion. Run that cycle as owner `cf-architecture`, with the user's reply as the first settled decision.

Besides the lifecycle sections, the spec holds:

- the ownership rows from the recommendation;
- the target tree;
- the traced workflow, current and target;
- a `Moves` table, one row per move: what moves, from → to, the decision it carries (file:line), and the evidence that its current owner is wrong. A move with no such evidence is not a move. Every move comes from the recommendation the user approved; a change found only while writing the spec goes to `Questions` as an open question, not into `Moves`;
- the migration order.

For a draft handed over by `cf-brainstorm`, keep its sections and add the ownership rows, the target tree of the touched modules, and a `Moves` table only for existing code the feature must relocate, with the same evidence rule; add a migration order only when there are moves.

An approved spec ends this skill; the skill that plans its implementation is `cf-execute`.
