# cf-mr-wolf Flow

## Purpose

Maintainer summary for `cf-mr-wolf`. Runtime behavior lives in `skills/cf-mr-wolf/SKILL.md` and `skills/cf-mr-wolf/references/pushback.md`.

## Runtime Inputs

- The request and conversation; the repository only on the "names none" branch.

## Flow

- One classification, from the request text alone: does the request name a **decidable target** — a component, flow, contract, mechanism, or file together with the change to make to it or the alternatives to choose between? A target without its change names none.

| Case | Behavior |
| --- | --- |
| Decidable target owned by another skill | Route to that skill and continue under it, carrying the problem as stated |
| Decidable target no other skill owns | Answer directly; a proposed change names its most fragile assumption, what happens if it fails, and the fallback |
| None | Investigate, report findings in the user's terms, say which part matters is unknown, ask, stop |

- The "none" branch names no choice and offers no alternatives, reports no confidence level, and gives no recommendation, plan, or implementation until the user answers.
- At a later turn, when the user asserts a cause, offers an explanation, or asks for a change, `pushback.md` is read every time: keep the findings, say when the claim does not hold, when the change would not reach the stated goal, and what a reversed deliberate choice loses, leaving the decision to the user.
- No routing table, no sibling catalogue, no artifact, no vendored files. If a specialist stops being reached, fix its `description`.

## Evidence

- The value is the question. Runs that asked scored 4.67/6 against 2.67/6 for runs that did not (p = 0.0011); the skill asks 12/12 where a bare model asks 1/12 across three repositories. A control handed the user's deciding sentence without asking reaches the same endpoints 6/6, so rules about handling the answer buy nothing; anything that changes whether it asks needs re-measuring.
- Hard and ambiguous problems: skill 3/3 against control 0/3 on two beds, one built after the text was frozen. Neutral when the request has one reading; not needed when the problem is hard but well posed (control 4/4).
- Removed reasoning scaffold (framing, evidence, de-risking, outcome, planning, evaluation references): across seven cases it never beat no skill, and it cut repository inspection in seven of eight pairs (18 files against 76 in one). Notes template and delegated counter-evidence brief were removed on cost, never measured. The claim "about two points below no skill, p = 0.053" is withdrawn: the control moved 1.75 points between sessions.
- No alternatives: offered options return only what they cover; a run with four invented lenses scored 2/5 against 5/5 for its siblings.
- Classification from the request text: once the first turn could read code, the routing branch investigated instead of routing.
- No routing table: 12/12 routing with and without one.
- No closing "stand down" section: four such lines earned nothing in three places; 6/6 without them.
- Investigating before asking: no measured gain over restating and stopping (n = 1 against 3); kept because a user who never replies still gets the findings.
- The one measured harm: a user who asserts a cause with certainty gets the remedy, reversing a deliberate design and dropping the turn-1 findings (3/3). `pushback.md` at turn 2 cut harm components from 12/12 to 3/12, with the legitimate correction still reaching its endpoint 3/3. Resident and referenced versions did not separate at three runs per arm. When the user has nothing to add, the skill commits to no branch 3/3.
- Known limit (2026-10-10): a true cause with a requested change that reverses a documented rule is carried out with code and docs aligned 4/5; the cost was stated before acting 1/5. A prohibition ("change nothing until they decide") held 1/2 and was not adopted; widening "the code shows" to documentation held 0/1. A false cause (1/1) and a remedy that would not reach the goal (2/2, naming the documented rule as intentional) are refused without edits. The deliberate-choice rule is unmeasured where the cost is invisible to the user.
- Known limit (2026-10-10): the fragile-assumption line is followed halfway 2/2 — the assumption is stated, its consequence and the fallback are not. "X or Y?" questions on a named target reach `cf-scenario` 2/4, so this branch is seldom reached and the rewrite was not measurable.
- Route and continue (2026-10-10): with "hand off in one line" the turn ended on the skill name; with "route … and continue under it" the specialist ran in the same turn without reading code first.
- Routing: symptoms and open-shape questions open it 8/8 on Codex 0.162; it also opens first on some requests with no referent in the repository and on a named component with alternatives, then continues into the owning skill.
