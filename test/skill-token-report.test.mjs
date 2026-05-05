import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { mkdir, writeFile } from "node:fs/promises";

import {
  buildSkillTokenReport,
  formatSkillTokenReport,
} from "../src/lib/skill-token-report.mjs";
import {
  makeTempWorkspace,
  writeSkill,
} from "./support/helpers.mjs";

test("skill token report separates metadata, instructions, resources, and totals", async () => {
  const workspace = await makeTempWorkspace();
  const skillsRoot = path.join(workspace, "skills");

  await writeSkill(skillsRoot, "demo-skill", {
    "SKILL.md": `---\nname: demo-skill\ndescription: Summarize demo inputs.\n---\n\n# Demo\n\nRun the demo workflow.\n`,
    "references/reference.md": "# Reference\n\nExtra workflow detail.\n",
  });
  await mkdir(path.join(skillsRoot, "demo-skill", "assets"), { recursive: true });
  await writeFile(
    path.join(skillsRoot, "demo-skill", "assets", "template.md"),
    "# Template\n\nOutput shape.\n",
    "utf8",
  );

  const report = await buildSkillTokenReport({
    skillsRoot,
    rootForLabels: workspace,
    encoder: whitespaceEncoder(),
  });
  const output = formatSkillTokenReport(report, {
    model: "test-model",
    encodingName: "test-encoding",
    source: "test",
  });

  assert.equal(report.skills.length, 1);
  assert.equal(report.skills[0].metadata.name.value, "demo-skill");
  assert.ok(report.skills[0].totalTokens > 0);
  assert.match(output, /demo-skill/);
  assert.match(output, /metadata/);
  assert.match(output, /SKILL\.md instructions/);
  assert.match(output, /references\/reference\.md/);
  assert.match(output, /assets\/template\.md/);
  assert.match(output, /skill total:/);
  assert.match(output, /Grand totals/);
});

test("skill token report can focus on one skill", async () => {
  const workspace = await makeTempWorkspace();
  const skillsRoot = path.join(workspace, "skills");

  await writeSkill(skillsRoot, "alpha-skill");
  await writeSkill(skillsRoot, "beta-skill");

  const report = await buildSkillTokenReport({
    skillsRoot,
    rootForLabels: workspace,
    encoder: whitespaceEncoder(),
    skillName: "beta-skill",
  });

  assert.deepEqual(
    report.skills.map((skill) => skill.name),
    ["beta-skill"],
  );
  assert.ok(report.totals.totalTokens > 0);

  await assert.rejects(
    () =>
      buildSkillTokenReport({
        skillsRoot,
        rootForLabels: workspace,
        encoder: whitespaceEncoder(),
        skillName: "missing-skill",
      }),
    /Unknown skill "missing-skill"/,
  );
});

function whitespaceEncoder() {
  return {
    encode(text) {
      return text.trim() === "" ? [] : text.trim().split(/\s+/);
    },
  };
}
