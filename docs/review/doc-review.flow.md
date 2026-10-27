# cf-review

Runtime: [SKILL.md](../../skills/cf-review/SKILL.md), [references/handoff.md](../../skills/cf-review/references/handoff.md), [references/reference-audit.md](../../skills/cf-review/references/reference-audit.md), [references/review-agent-brief.md](../../skills/cf-review/references/review-agent-brief.md), [references/sweep.md](../../skills/cf-review/references/sweep.md), shared [delegated-execution.md](../../skills/_shared/references/delegated-execution.md), shared [dynamic-agents.md](../../skills/_shared/references/dynamic-agents.md), shared [navigation-cost.md](../../skills/_shared/references/navigation-cost.md), shared [dir-population.mjs](../../skills/_shared/scripts/dir-population.mjs), shared [repo-tree.mjs](../../skills/_shared/scripts/repo-tree.mjs).

## Basis

Google, [What to look for in a code review](https://google.github.io/eng-practices/review/reviewer/looking-for.html), is the base for most lenses:

- **Whole files** read, not only changed lines: "Sometimes you have to look at the whole file to be sure that the change actually makes sense." Generated code may be scanned over.
- **Lens 1, bugs**: "making sure that there are no bugs that you see just by reading the code."
- **Lens 3, requirements**: "Does this CL do what the developer intended?"
- **Lens 6, docs**: "If a CL changes how users build, test, interact with, or release code, check to see that it also updates associated documentation".
- **Lens 8, complexity**: "'Too complex' usually means 'can't be understood quickly by code readers.'"
- **Lens 9, placement**: "Does this change belong in your codebase, or in a library?"
- **Lens 11, over-engineering**: "developers have made the code more generic than it needs to be".
- **`not assessed`** for what was not reviewed: "note in a comment which parts you reviewed."
- **Test quality to cf-test**: "Tests do not test themselves".

Other sources:

- **Report; never diagnose.** Google, [How to write code review comments](https://google.github.io/eng-practices/review/reviewer/comments.html): "it is the developer's responsibility to fix a CL, not the reviewer's."
- **Introduced problems held, pre-existing ones reported.** Google, [Handling pushback](https://google.github.io/eng-practices/review/reviewer/pushback.html): new complexity "must be cleaned up before submission"; surrounding problems get "a bug for the cleanup". [The Standard of Code Review](https://google.github.io/eng-practices/review/reviewer/standard.html): approve a CL that "definitely improves the overall code health … even if the CL isn't perfect".
- **One focus per pass.** Braz et al., [Less is More](https://arxiv.org/abs/2202.04586) (ICSE 2022): asking reviewers to focus on security "increases eight times the probability of vulnerability detection"; a checklist adds nothing further.
- **Tool-enforced rules out of lens 7.** Bacchelli & Bird, [Modern Code Review](https://sback.it/publications/icse2013.pdf) (ICSE 2013): "Automating these tasks frees reviewers to look for deeper, more subtle defects."
- **Lens 2, refactor claims.** Fowler, [Definition Of Refactoring](https://martinfowler.com/bliki/DefinitionOfRefactoring.html): a refactoring changes structure "without changing its observable behavior."
- **Lens 4 and the reference audit.** Fowler, [Published Interface](https://martinfowler.com/bliki/PublishedInterface.html): "anything published so you can't reach the calling code needs more complicated treatment."
- **Lens 5, incomplete transition.** Sato, [Parallel Change](https://martinfowler.com/bliki/ParallelChange.html): "Once all usages have been migrated to the new version, you perform the contract phase to remove the old version".
- **Lenses 9 and 12, cohesion.** Martin, [The Single Responsibility Principle](https://blog.cleancoder.com/uncle-bob/2014/05/08/SingleReponsibilityPrinciple.html): "Gather together the things that change for the same reasons."
- **Lens 10, dependency direction and policy in an adapter.** Martin, [The Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html): "source code dependencies can only point inwards." Cockburn, [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/): "code pertaining to the inside part should not leak into the outside part".
- **Lens 11, indirection.** Fowler, [Function Length](https://martinfowler.com/bliki/FunctionLength.html): a function is justified by "the separation between intention and implementation".
- **Lens 12, one owner for a derived value.** Thomas, [Orthogonality and the DRY Principle](https://www.artima.com/articles/orthogonality-and-the-dry-principle): "every piece of system knowledge should have one authoritative, unambiguous representation".
- **The implementation is not its own requirement.** Konstantinou et al., [Can we find bugs using LLM-generated oracles?](https://arxiv.org/abs/2410.21136): generated oracles "mainly capture the actual program behavior". Barr et al., [The Oracle Problem](http://www0.cs.ucl.ac.uk/staff/M.Harman/tse-oracle.pdf) (TSE 2015): without an adequate source "the final source of test oracle information remains the human".
- **Complete the sweep; verify cited evidence.** Cemri et al., [Why Do Multi-Agent LLM Systems Fail?](https://arxiv.org/html/2503.13657v3): failure modes "Premature termination" and "No or incomplete verification".
- **Context gate, compact reports, recap file.** Anthropic, [Effective context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents): context is "a finite resource with diminishing marginal returns"; subagents return "a condensed, distilled summary"; "Structured note-taking" persists outside the context window.
- **Consent and a filled brief.** Anthropic, [How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system): "multi-agent systems use about 15× more tokens than chats"; without clear boundaries "agents duplicate work, leave gaps".
- **Read-only terminal agents.** Yan, [Don't Build Multi-Agents](https://cognition.ai/blog/dont-build-multi-agents): "Actions carry implicit decisions, and conflicting decisions carry bad results".
- **Raw scope in the brief, no suspected findings.** Sharma et al., [Towards Understanding Sycophancy](https://arxiv.org/abs/2310.13548) (ICLR 2024): feedback can favor "responses that match user beliefs over truthful ones".

## No external source

Kept on the pack's own runs or on the user's decision: the bounded-remedy gate; the navigation-cost thresholds; pending work as the default change set; the reference audit's search categories; stale doc paths under lens 6; grouping and first-finding order; route, do not invoke; the policy band from the script; never interrupting a slow agent; working through a recap.
