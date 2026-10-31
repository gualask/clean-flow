# cf-scenario

Runtime: [SKILL.md](../../skills/cf-scenario/SKILL.md).

## Basis

- **Cost per scenario touched.** Kazman et al., [Scenario-Based Analysis of Software Architecture](https://cs.uwaterloo.ca/research/tr/1995/45/CS95-45.pdf) (1995): "list the changes to the architecture that are necessary for it to support the scenario and estimate the cost".
- **Stored data: say what happens to existing rows.** Sadalage and Fowler, [Evolutionary Database Design](https://martinfowler.com/articles/evodb.html): "changing a schema after deployment resulted in painful data migration problems."
- **Trace a routed requirement both ways.** Gotel and Finkelstein, [The Requirements Traceability Problem](https://discovery.ucl.ac.uk/749/1/2.2_rtprob.pdf) (ICRE 1994): "follow the life of a requirement, in both a forwards and backwards direction".
- **The code is not the intended rule.** Konstantinou et al., [Can we find bugs using LLM-generated oracles?](https://arxiv.org/abs/2410.21136): generated oracles "mainly capture the actual program behavior".

## No external source

Kept on the pack's own runs or on the user's decision: the three Decision values; `file:line` on every line and the Trace slot only for a routed change; no product intuition in place of the source.
