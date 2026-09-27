# Architecture Principles

Assess how the architecture helps people understand and modify the project.

- Which responsibilities change together?
- Which can be understood independently?
- What complexity does a boundary hide, and what coordination does it introduce?
- How much structure does each responsibility justify?

Distinguish ownership of responsibilities, contracts, folder organization, and execution boundaries.

A state or policy belongs to the capability when any interface invoking the use case would need it (lifecycle, cancellation, result acceptance, cache, workflow rules); it belongs to an adapter only when it exists because of one environment or presentation session. Judge the decision, not the framework mechanism implementing it or where it runs.

Contracts belong to the capability whose meaning they carry; shared holds only what has no natural owner.
