import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import {
  buildSkillTokenReport,
  formatSkillTokenReport,
} from "../src/lib/skill-token-report.mjs";
import {
  makeTempWorkspace,
  writeSkill,
} from "./support/helpers.mjs";

const execFileAsync = promisify(execFile);
const REPORT_COMMAND = fileURLToPath(
  new URL("../src/commands/skill-token-report.mjs", import.meta.url),
);

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
    contextMap: {
      version: 1,
      skills: {
        "demo-skill": {
          flows: {
            default: {
              required: ["references/reference.md"],
              conditional: ["assets/template.md"],
            },
          },
        },
      },
    },
  });
  const output = formatSkillTokenReport(report, {
    model: "test-model",
    encodingName: "test-encoding",
    source: "test",
  });

  assert.equal(report.skills.length, 1);
  assert.equal(report.skills[0].metadata.name.value, "demo-skill");
  assert.ok(report.skills[0].totalTokens > 0);
  assert.equal(report.context.flows.length, 1);
  assert.equal(report.context.flows[0].flowName, "default");
  assert.ok(
    report.context.flows[0].reachableTokens > report.context.flows[0].requiredTokens,
  );
  assert.equal(
    report.context.flows[0].reachableWithDiscoveryTokens,
    report.context.discoveryTokens + report.context.flows[0].reachableTokens,
  );
  assert.match(output, /demo-skill/);
  assert.match(output, /metadata/);
  assert.match(output, /SKILL\.md instructions/);
  assert.match(output, /references\/reference\.md/);
  assert.match(output, /assets\/template\.md/);
  assert.match(output, /skill inventory total:/);
  assert.match(output, /flow stacks/);
  assert.match(output, /maximum reachable flow stack: \d+ tokens \(demo-skill:default\)/);
  assert.match(output, /Grand totals/);
  assert.match(output, /all inventory tokens:/);
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
  assert.equal(report.context, null);

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

test("skill token report composes same-thread handoff context", async () => {
  const workspace = await makeTempWorkspace();
  const skillsRoot = path.join(workspace, "skills");

  await writeSkill(skillsRoot, "alpha-skill", {
    "references/alpha.md": "# Alpha\n\nAlpha flow detail.\n",
  });
  await writeSkill(skillsRoot, "beta-skill", {
    "references/beta.md": "# Beta\n\nBeta flow detail.\n",
  });

  const report = await buildSkillTokenReport({
    skillsRoot,
    rootForLabels: workspace,
    encoder: whitespaceEncoder(),
    skillName: "alpha-skill",
    contextMap: {
      version: 1,
      skills: {
        "alpha-skill": {
          flows: {
            default: {
              required: ["references/alpha.md"],
              conditional: [],
              handoffs: [
                {
                  to: "beta-skill:default",
                  kind: "conditional",
                  context: "same-thread",
                },
              ],
            },
          },
        },
        "beta-skill": {
          flows: {
            default: {
              required: ["references/beta.md"],
              conditional: [],
            },
          },
        },
      },
    },
  });

  assert.deepEqual(
    report.skills.map((skill) => skill.name),
    ["alpha-skill"],
  );
  assert.equal(report.context.flows.length, 1);
  assert.equal(
    report.context.discoveryTokens,
    report.skills[0].metadata.tokens +
      whitespaceEncoder().encode(
        "name: beta-skill\ndescription: Test skill beta-skill\npath: skills/beta-skill",
      ).length,
  );

  const handoff = report.context.flows[0].handoffs[0];
  assert.equal(handoff.to, "beta-skill:default");
  assert.equal(handoff.context, "same-thread");
  assert.ok(handoff.addedReachableTokens > 0);
  assert.ok(
    handoff.cumulativeReachableWithDiscoveryTokens >
      report.context.flows[0].reachableWithDiscoveryTokens,
  );
});

test("skill context map rejects unknown runtime files and handoff flows", async () => {
  const workspace = await makeTempWorkspace();
  const skillsRoot = path.join(workspace, "skills");

  await writeSkill(skillsRoot, "demo-skill");

  await assert.rejects(
    () =>
      buildSkillTokenReport({
        skillsRoot,
        rootForLabels: workspace,
        encoder: whitespaceEncoder(),
        contextMap: {
          version: 1,
          skills: {
            "demo-skill": {
              flows: {
                default: {
                  required: ["references/missing.md"],
                  conditional: [],
                },
              },
            },
          },
        },
      }),
    /references unknown runtime file references\/missing\.md/,
  );

  await assert.rejects(
    () =>
      buildSkillTokenReport({
        skillsRoot,
        rootForLabels: workspace,
        encoder: whitespaceEncoder(),
        contextMap: {
          version: 1,
          skills: {
            "demo-skill": {
              flows: {
                default: {
                  required: [],
                  conditional: [],
                  handoffs: [
                    {
                      to: "demo-skill:missing",
                      kind: "conditional",
                      context: "same-thread",
                    },
                  ],
                },
              },
            },
          },
        },
      }),
    /hands off to unknown flow demo-skill:missing/,
  );
});

test("custom skills roots use flow estimates only with an explicit context map", async () => {
  const workspace = await makeTempWorkspace();
  const skillsRoot = path.join(workspace, "skills");
  const contextMapPath = path.join(workspace, "context.json");

  await writeSkill(skillsRoot, "demo-skill", {
    "references/reference.md": "# Reference\n\nFlow detail.\n",
  });
  await writeFile(
    contextMapPath,
    JSON.stringify({
      version: 1,
      skills: {
        "demo-skill": {
          flows: {
            default: {
              required: ["references/reference.md"],
              conditional: [],
            },
          },
        },
      },
    }),
    "utf8",
  );

  const inventoryOnly = await execFileAsync(process.execPath, [
    REPORT_COMMAND,
    "--skills-root",
    skillsRoot,
  ]);
  assert.doesNotMatch(inventoryOnly.stdout, /Flow estimates:/);

  const withContext = await execFileAsync(process.execPath, [
    REPORT_COMMAND,
    "--skills-root",
    skillsRoot,
    "--context-map",
    contextMapPath,
  ]);
  assert.match(withContext.stdout, /Flow estimates:/);
  assert.match(withContext.stdout, /flow stacks/);
});

function whitespaceEncoder() {
  return {
    encode(text) {
      return text.trim() === "" ? [] : text.trim().split(/\s+/);
    },
  };
}
