import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { SKILLS_ROOT } from "../support/skill-contract-helpers.mjs";

const skillDir = path.join(SKILLS_ROOT, "cf-architecture");
const read = (file) => fs.readFile(path.join(skillDir, file), "utf8");

test("architecture chooses the form from a catalog, on the facts of each form's condition", async () => {
  const contract = await read("SKILL.md");
  const forms = await read("references/forms.md");

  // Without the catalog the neutral prompt on irc-news never put compositions inside the modules
  // and mixed layer names from several conventions; with it, the form held across six repositories.
  assert.match(contract, /Read \[references\/forms\.md\]\(references\/forms\.md\): the forms a tree can take/);
  for (const form of ["Layered", "Ports and adapters", "Modular monolith", "Vertical slices", "Plugins", "Pipeline"]) {
    assert.match(forms, new RegExp(`^## ${form}$`, "m"));
  }
  assert.match(forms, /A form wins only on the facts in its \*\*When\*\*/);
  assert.match(forms, /Inside a module, only the layers its code needs/);
  assert.match(forms, /sits in the module that owns it, named for what it does for the user; no module uses it/);

  // The form flipped between runs on two repositories until each condition was listed and the
  // separating facts checked again; ties were settled by nesting or by a stated requirement.
  assert.match(contract, /For each form compared, list the facts its \*\*When\*\* names and, for each, whether it holds here/);
  assert.match(contract, /A fact that holds for both forms, as when one nests inside the other, does not separate them\./);
  assert.match(contract, /the drawback that breaks a stated requirement \(a dependency rule, a documented invariant\) decides/);
  assert.match(contract, /when no drawback does, do not choose: present both, name the fact that would decide, and ask the user/);
});

test("architecture checks the target tree with the bundled script where an indexer runs", async () => {
  // Read only for a tree drawn from Form: a feature handoff and a routed finding, given the same trigger and slot for every
  // tree, read it and ran the script without changing a decision; bound to the flow, they did neither.
  const skill = await read("SKILL.md");
  assert.match(skill, /Before presenting a tree drawn from the form `Form` decided, read \[references\/dependency-check\.md\]\(references\/dependency-check\.md\): it checks the tree's dependencies against a SCIP index with the bundled script\./);
  assert.match(skill, /for a tree drawn from `Form`, also the last output of `scripts\/tree-check\.mjs`, or the line saying the dependencies are not checked\./);
  const contract = await read("references/dependency-check.md");

  // Trees declared "without cycles" were never checked, and most element moves were missed;
  // with the check, the moves found rose and real cycles surfaced.
  assert.match(contract, /run the bundled `scripts\/tree-check\.mjs`, resolved from the active skill root/);
  assert.match(contract, /when one element causes a use, move that element, not its file/);
  // An unnamed port line once silenced the check for types that were no port.
  assert.match(contract, /declare it with a `port` line that names the port instead; every port the script lists appears in the tree under that name/);
  assert.match(contract, /When no indexer runs, say under the tree that its dependencies are not checked, name the indexer that would check them, and ask the user whether to run it\./);
  // Asked to install, the model took a moved module path from memory; sent to the indexer's documentation, it ran the right one first.
  assert.match(contract, /take the command from the indexer's own documentation, searched online, not from memory; prefer a form that runs it without installing it, and when it installs, say where before running it\./);
  await fs.access(path.join(skillDir, "scripts", "tree-check.mjs"));
});

test("architecture keeps the form for a feature handoff and for a finding routed from another skill", async () => {
  const contract = await read("SKILL.md");

  assert.match(contract, /## Feature Handoff\n\nWhen `cf-brainstorm` hands over its draft/);
  // A one-line finding from cf-clean reopened the form; the section answers only the finding.
  assert.match(contract, /## Routed Finding\n\nWhen the request carries a finding another skill routed here/);
  assert.match(contract, /the repository's form stays: `Drivers` and `Form` do not apply\. Decide only where the code the finding names belongs/);
  assert.match(contract, /omitted for a feature handoff or a routed finding\./);
  // Without an indexer, routed findings reached the same decisions by reading, in less time: the check stays out of the section.
  const routed = contract.slice(contract.indexOf("## Routed Finding"), contract.indexOf("## Artifacts"));
  assert.doesNotMatch(routed, /tree-check|indexer/);
});
