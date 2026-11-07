# cf-clean

Runtime: [SKILL.md](../../skills/cf-clean/SKILL.md), [references/handoff.md](../../skills/cf-clean/references/handoff.md), [references/map.md](../../skills/cf-clean/references/map.md), [references/reference-audit.md](../../skills/cf-clean/references/reference-audit.md), [references/sweep.md](../../skills/cf-clean/references/sweep.md), shared [batched-execution.md](../../shared/references/batched-execution.md), shared [context-gate.md](../../shared/references/context-gate.md), shared [navigation-cost.md](../../shared/references/navigation-cost.md), shared [dir-population.mjs](../../shared/scripts/dir-population.mjs), shared [repo-tree.mjs](../../shared/scripts/repo-tree.mjs), shared [string-boundaries.md](../../shared/references/string-boundaries.md).

## Basis

Google, [What to look for in a code review](https://google.github.io/eng-practices/review/reviewer/looking-for.html), is the base for most lenses:

- **Whole files** read, not only changed lines: "Sometimes you have to look at the whole file to be sure that the change actually makes sense." Generated code may be scanned over.
- **Lens 3, docs**: "If a CL changes how users build, test, interact with, or release code, check to see that it also updates associated documentation".
- **Lens 5, complexity**: "'Too complex' usually means 'can't be understood quickly by code readers.'"
- **Lens 8, over-engineering**: "developers have made the code more generic than it needs to be, or added functionality that isn't presently needed by the system."
- **`bugs not searched for`** stated, not implied: "note in a comment which parts you reviewed."
- **Test quality to cf-test**: "Tests do not test themselves".

Other sources:

- **Introduced problems held, pre-existing ones reported.** Google, [Handling pushback](https://google.github.io/eng-practices/review/reviewer/pushback.html): new complexity "must be cleaned up before submission"; surrounding problems get "a bug for the cleanup". [The Standard of Code Review](https://google.github.io/eng-practices/review/reviewer/standard.html): approve a CL that "definitely improves the overall code health … even if the CL isn't perfect".
- **Tool-enforced rules out of lens 4.** Bacchelli & Bird, [Modern Code Review](https://sback.it/publications/icse2013.pdf) (ICSE 2013): "Automating these tasks frees reviewers to look for deeper, more subtle defects."
- **Lens 1 and the reference audit.** Fowler, [Published Interface](https://martinfowler.com/bliki/PublishedInterface.html): "anything published so you can't reach the calling code needs more complicated treatment."
- **Lens 2, incomplete transition.** Sato, [Parallel Change](https://martinfowler.com/bliki/ParallelChange.html): "Once all usages have been migrated to the new version, you perform the contract phase to remove the old version".
- **Lenses 6 and 9, cohesion.** Martin, [The Single Responsibility Principle](https://blog.cleancoder.com/uncle-bob/2014/05/08/SingleReponsibilityPrinciple.html): "Gather together the things that change for the same reasons."
- **Lens 7, dependency direction and policy in an adapter.** Martin, [The Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html): "source code dependencies can only point inwards." Cockburn, [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/): "code pertaining to the inside part should not leak into the outside part".
- **Lens 8, indirection.** Fowler, [Function Length](https://martinfowler.com/bliki/FunctionLength.html): a function is justified by "the separation between intention and implementation".
- **Lens 9, one representation for each piece of knowledge, not for each piece of text.** Thomas, [Orthogonality and the DRY Principle](https://www.artima.com/articles/orthogonality-and-the-dry-principle): "Most people take DRY to mean you shouldn't duplicate code. That's not its intention."; "every piece of system knowledge should have one authoritative, unambiguous representation"; otherwise "the two or three different representations will most likely fall out of step with each other."
- **Lens 9, search for an existing implementation of what changed code defines.** GitClear, [AI Copilot Code Quality: 2025 Look Back at 12 Months of Data](https://www.gitclear.com/ai_assistant_code_quality_2025_research): "We observe a spike in the prevalence of duplicate code blocks, along with increases in short-term churn code, and the continued decline of moved lines (code reuse)."
- **Lens 10, names paired by convention.** The sources are in the [cf-deadcode mirror](./cf-deadcode.md).
- **Verify cited evidence.** Cemri et al., [Why Do Multi-Agent LLM Systems Fail?](https://arxiv.org/html/2503.13657v3): failure mode "No or incomplete verification".
- **Context gate, recap file, map file.** Anthropic, [Effective context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents): context is "a finite resource with diminishing marginal returns"; "Structured note-taking" persists outside the context window.

## No external source

Kept on the pack's own runs or on the user's decision: one pass that checks a target against every diagnostic skill except `cf-test`, invoked by name or as a Cflow cleanup; any target, pending work by default and the repository when nothing is pending; bugs out of the pass, listed when seen (with the Structure focus the pass found 1 of 5 real bugs where the bare model found 3); the bounded-remedy gate; the navigation-cost thresholds; the owner cluster of the directory-population exemption read from shared file names; the reference audit's search categories; stale doc paths under lens 3; grouping and first-finding order; route, do not invoke; the policy band from the script; working through a recap; the map: areas from the declared layout, a partition by script with the rest as an area, exclusion only of assets and documentation, no lens signals in the map (an internal/local sweep found 8 findings without them against 10 with, none born of a signal), one area per session that checks the other areas' cited lines for the relations it sees, coverage complete when every area is done or excluded, and the map's existence tested on its path, since a search that honors `.cflow/.gitignore` hid it from Codex 1 of 1, an existing map reused or rebuilt on the user's word, never judged stale by the model.
