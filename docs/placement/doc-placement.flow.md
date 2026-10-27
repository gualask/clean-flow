# cf-placement

Runtime: [SKILL.md](../../skills/cf-placement/SKILL.md), shared [dir-population.mjs](../../skills/_shared/scripts/dir-population.mjs).

## Basis

- **Split a long or mixed file; keep the pieces flat next to it.** ESLint, [`max-lines`](https://eslint.org/docs/latest/rules/max-lines): "Large files tend to do a lot of things". Google, [Go Style: Package size](https://google.github.io/styleguide/go/best-practices#package-size): a maintainer should "tell which file contains something". Angular, [Style 04-04 Flat](https://github.com/angular/angular/blob/17.3.x/aio/content/guide/styleguide.md): "keep a flat folder structure as long as possible."
- **Regroup what is read together; a directory near ten files.** Angular, [Style 04-02 Locate](https://github.com/angular/angular/blob/17.3.x/aio/content/guide/styleguide.md): "Keeping related files near each other in an intuitive location saves time"; 04-04: "when a folder has ten or more files, it may be time to create subfolders." Letovsky and Soloway, [Delocalized Plans](https://www.cs.kent.edu/~jmaletic/cs69995-PC/papers/letovsky-1986-software.pdf) (1986): delocalized plans "are more liable to misinterpretation".
- **A folder that is a package or module goes to `cf-architecture`.** Go, [How to Write Go Code](https://go.dev/doc/code): "A package is a collection of source files in the same directory"; Python, [The import system](https://docs.python.org/3/reference/import.html); Rust, [Modules](https://doc.rust-lang.org/reference/items/modules.html).
- **Move whole files without rewriting them.** Google, [Small CLs](https://google.github.io/eng-practices/review/developer/small-cls.html): "moving and renaming a class should be in a different CL from fixing a bug in that class."
- **Tests next to the moved unit.** Angular, [Style guide](https://angular.dev/style-guide): "Unit tests should live in the same directory as the code-under-test."
- **Preservation claimed only after the tests pass.** Fowler, [SelfTestingCode](https://martinfowler.com/bliki/SelfTestingCode.html): confidence comes "should the tests pass".
- **Long functions deferred to `cf-cognitive`.** Martin, quoted in [A Philosophy of Software Design vs Clean Code](https://github.com/johnousterhout/aposd-vs-clean-code): "Functions should hardly ever be 20 lines long".

## No external source

Kept on the pack's own runs or on the user's decision: an evaluation answers without editing; discovery names one candidate; moves across features route to `cf-architecture`; the examples of named owners; owner clusters kept flat deferred to `cf-architecture`; reference updates and scoped checks; the Assessment slot naming covering tests; the Defects slot; non-code content out of scope.
