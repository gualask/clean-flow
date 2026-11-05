# cf-brainstorm

Runtime: [SKILL.md](../../skills/cf-brainstorm/SKILL.md), shared [design-spec-lifecycle.md](../../skills/_shared/references/design-spec-lifecycle.md).

## Basis

- **Design before code, in proportion.** Ubl, [Design Docs at Google](https://www.industrialempathy.com/posts/design-docs-at-google/): "Early identification of design issues when making changes is still cheap"; "focus on the parts that are relevant to the design and its trade-offs".
- **No premature solution.** Laban et al., [LLMs Get Lost In Multi-Turn Conversation](https://arxiv.org/abs/2505.06120) (ICLR 2026): models "prematurely attempt to generate final solutions, on which they overly rely."
- **Targeted questions.** Mu et al., [ClarifyGPT: A Framework for Enhancing LLM-Based Code Generation via Requirements Clarification](https://arxiv.org/abs/2310.10996) (FSE 2024): "targeted clarifying questions".
- **The draft is the memory.** Liu et al., [Lost in the Middle: How Language Models Use Long Contexts](https://arxiv.org/abs/2307.03172) (TACL 2024): models "do not robustly make use of information in long input contexts."
- **Decisions appended, never rewritten.** Nygard, [Documenting Architecture Decisions](https://www.cognitect.com/blog/2011/11/15/documenting-architecture-decisions): "keep the old one around, but mark it as superseded."
- **Self-review once, then the user's.** Huang et al., [Large Language Models Cannot Self-Correct Reasoning Yet](https://arxiv.org/abs/2310.01798) (ICLR 2024): models "struggle to self-correct their responses without external feedback".
- **Approval is not a request to implement.** Qu et al., [Overeager Coding Agents](https://arxiv.org/abs/2605.18583): "the agent sometimes does more than asked".
- **Resume check with `ls -a`.** [ripgrep README](https://github.com/BurntSushi/ripgrep/blob/master/README.md): ripgrep "will respect gitignore rules and automatically skip hidden files/directories".

## No external source

Kept on the pack's own runs or on the user's decision: no code before an approved design; independent subsystems one at a time; one question per turn, building on the last answer; one recommended approach; an assumption stays open; approval covers what was shown; the boundaries to `cf-scenario`, `cf-mr-wolf` and `cf-architecture`; the handoff to `cf-architecture`; one draft at a time; returning to the oldest open question after a side exploration; a spec deleted once shipped, only after the docs step; the docs language.
