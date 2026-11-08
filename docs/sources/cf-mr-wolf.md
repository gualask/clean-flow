# cf-mr-wolf

Runtime: [SKILL.md](../../skills/cf-mr-wolf/SKILL.md), [references/pushback.md](../../skills/cf-mr-wolf/references/pushback.md), [references/wider.md](../../skills/cf-mr-wolf/references/wider.md).

## Basis

- **Recover the goal; the asked-for step may be the wrong path.** [The XY Problem](https://xyproblem.info/): "asking about your attempted solution rather than your actual problem." Raymond and Moen, [How To Ask Questions The Smart Way](http://www.catb.org/~esr/faqs/smart-questions.html): "They come for help with the step, but don't realize that the path is wrong."
- **Ask when nothing decidable is named; the model does not judge whether it may skip asking.** Vijayvargiya et al., [Ambig-SWE: Interactive Agents to Overcome Underspecificity in Software Engineering](https://arxiv.org/abs/2502.13069) (ICLR 2026): "models struggle to distinguish between well-specified and underspecified instructions."
- **No confidence level.** Xiong et al., [Can LLMs Express Their Uncertainty?](https://arxiv.org/abs/2306.13063) (ICLR 2024): verbalized confidence tends "to be overconfident".
- **No plan or code before the answer.** Laban et al., [LLMs Get Lost In Multi-Turn Conversation](https://arxiv.org/abs/2505.06120) (ICLR 2026): models "prematurely attempt to generate final solutions".
- **The fragile assumption; disagreeing costs nothing yet.** Klein, [Performing a Project Premortem](https://hbr.org/2007/09/performing-a-project-premortem) (HBR 2007): a premortem "comes at the beginning of a project rather than the end, so that the project can be improved rather than autopsied."
- **Keep the findings under pushback.** Sharma et al., [Towards Understanding Sycophancy](https://arxiv.org/abs/2310.13548) (ICLR 2024): assistants "frequently wrongly admit mistakes when questioned by the user".
- **A defect may be one site of a wider problem; look before fixing it.** Fowler, [Code Smell](https://martinfowler.com/bliki/CodeSmell.html) (2006), said of smells and applied here to defects: "A code smell is a surface indication that usually corresponds to a deeper problem in the system." "You have to look deeper to see if there is an underlying problem there".
- **Search the repository for the same mechanism elsewhere.** Nguyen et al., [Recurring Bug Fixes in Object-Oriented Programs](https://doi.org/10.1145/1806799.1806847) (ICSE 2010): "Previous research confirms the existence of recurring bug fixes in software systems"; "a large percentage of them occurs in code peers".
- **Reversing a deliberate choice is a cost to state.** Nygard, [Documenting Architecture Decisions](https://www.cognitect.com/blog/2011/11/15/documenting-architecture-decisions): "It's better to avoid either blind acceptance or blind reversal."

## No external source

Kept on the pack's own runs or on the user's decision: looking first, using the user's words, offering no menu; classifying from the request text alone; routing a decidable target to its owner without framing; the description's non-use list; confirm or correct, then act; reading `pushback.md` on every asserted cause or change; taking a request to fix a defect, and stopping before any edit when the sites share a cause.
