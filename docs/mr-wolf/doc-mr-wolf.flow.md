# cf-mr-wolf

Runtime: [SKILL.md](../../skills/cf-mr-wolf/SKILL.md), [references/pushback.md](../../skills/cf-mr-wolf/references/pushback.md).

## Basis

- **Recover the goal; the asked-for step may be the wrong path.** [The XY Problem](https://xyproblem.info/): "asking about your attempted solution rather than your actual problem." Raymond, [How To Ask Questions The Smart Way](http://www.catb.org/~esr/faqs/smart-questions.html): "They come for help with the step, but don't realize that the path is wrong."
- **Ask when nothing decidable is named; the model does not judge whether it may skip asking.** Vijayvargiya et al., [Ambig-SWE](https://arxiv.org/abs/2502.13069) (ICLR 2026): "models struggle to distinguish between well-specified and underspecified instructions."
- **No confidence level.** Xiong et al., [Can LLMs Express Their Uncertainty?](https://arxiv.org/abs/2306.13063) (ICLR 2024): verbalized confidence tends "to be overconfident".
- **No plan or code before the answer.** Laban et al., [LLMs Get Lost In Multi-Turn Conversation](https://arxiv.org/abs/2505.06120): models "prematurely attempt to generate final solutions".
- **Look first, use the user's words, offer no menu.** Vincent, [superpowers brainstorming skill](https://github.com/obra/superpowers/blob/2ce8aa15d05bd57213e6f746f953aafb7ded7a8b/skills/brainstorming/SKILL.md): "Never ask what the project or their context already answers."; "Options steer. Ask them to describe it first."
- **The fragile assumption; disagreeing costs nothing yet.** Klein, [Performing a Project Premortem](https://hbr.org/2007/09/performing-a-project-premortem) (HBR 2007): "Those with reservations may speak freely at the outset, so that the project can be improved rather than autopsied."
- **Keep the findings under pushback.** Sharma et al., [Towards Understanding Sycophancy](https://arxiv.org/abs/2310.13548) (ICLR 2024): assistants "frequently wrongly admit mistakes when questioned by the user".
- **Reversing a deliberate choice is a cost to state.** Nygard, [Documenting Architecture Decisions](https://www.cognitect.com/blog/2011/11/15/documenting-architecture-decisions): "It's better to avoid either blind acceptance or blind reversal."

## No external source

Kept on the pack's own runs or on the user's decision: classifying from the request text alone; routing a decidable target to its owner without framing; the description's non-use list; confirm or correct, then act; reading `pushback.md` on every asserted cause or change.
