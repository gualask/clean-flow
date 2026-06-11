# Navigation Cost

Use this lens whenever judging whether code is structured well enough to maintain, inside one file, across files, or across folders.
It is the objective that ranks every other readability, split, or cohesion signal.

## The Test

Picture a maintainer new to this area who must fix a likely bug or make a small change here.
The cost is how much code they must read and hold in their head to reach the target, not how many files they open.
Estimate it:

- which regions they can discard unread because role or location makes relevance obvious,
- how few lines they must read at each stop before they can judge "this matters" or "skip it",
- how much unrelated logic sits between them and the code that matters.

Lowering that reading-and-holding cost is the goal. The verdict is this cost, not any single metric.

## Jumps Are Cheap; Reading Is Expensive

A jump to another unit is nearly free when the reader can judge that unit's relevance in a few lines and skip it: a small, single-responsibility, well-named unit in a predictable place.
What is expensive is having to read a lot to find or understand the target.
So prefer reducing how much must be read over reducing how many hops. Many small skippable units beat few large ones.
Resist the pull to inline or merge responsibilities just to remove a hop; that trades a cheap jump for expensive reading.

Follow single responsibility closely, with pragmatic limits: split by distinct responsibility so each unit can be judged and skipped on its own; do not shatter one indivisible behavior across units that must all be read together to understand it.

A unit is a function, not only a file. Split at the smallest level that restores skippability: when a function is large but its file is still a readable single owner, extract named same-file helpers; create new files only when the file itself fails the test.
A unit's name is its skippability test: if it cannot be named by its result or role without "and", "or", or a list of steps, it holds more than one responsibility.

## What Lowers the Cost

- small single-responsibility units, so a reader confirms or skips relevance from a few lines
- role and layer separation, so whole regions are discarded unread; a business-logic bug is never hunted in a controller
- names that say where a behavior or likely bug lives, so a unit can be skipped without reading its body
- predictable placement, through a recognized architecture or a consistent local convention, so the likely location is guessable
- grouping what is read together and separating what is not

## Signals Are Not the Verdict

Treat long functions, file length, deep nesting, line-count thresholds, hop count, and scattered files as smells that prompt the test, never as the decision.
When a smell and the test disagree, the test wins.
A stable, well-named owner that tells a maintainer where to look can stay even if a threshold calls it too long; a short file can still fail the test when it hides where behavior lives.

## What Counts as a Regression

A change that satisfies a smell but raises reading cost is not a cleanup.
Do not inline distinct responsibilities, hide ordering, or merge owners just to cut hops or shorten a call chain.
Equally, do not split one indivisible behavior into units that must all be read together, or scatter an owner so its pieces become unpredictable to locate.

## Proportionality

Act only where the test shows real cost in the touched scope.
Code that is already clear, cohesive, and proportionate is done.
