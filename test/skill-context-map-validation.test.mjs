import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";

import { validateSkillContextMapRuntimeCoverage } from "../src/lib/skill-context-map-validation.mjs";
import { buildSkillTokenReport } from "../src/lib/skill-token-report.mjs";
import { makeTempWorkspace, writeSkill } from "./support/helpers.mjs";

test("context map resources exactly match reachable runtime Markdown", async () => {
  const workspace = await makeTempWorkspace();
  const skillsRoot = path.join(workspace, "skills");

  await writeSkill(skillsRoot, "demo-skill", {
    "SKILL.md": `---\nname: "demo-skill"\ndescription: "Test skill demo-skill"\n---\n\n# Demo\n\nRead references/entry.md.\n`,
    "references/entry.md": "# Entry\n\nOptionally load assets/nested/template.md.\n",
    "assets/nested/template.md": "# Template\n",
    "assets/unused.md": "# Unused\n",
  });

  const exactMap = contextMap({
    required: ["references/entry.md"],
    conditional: ["assets/nested/template.md"],
  });
  await assert.doesNotReject(() =>
    validateSkillContextMapRuntimeCoverage({ skillsRoot, contextMap: exactMap }),
  );

  await assert.rejects(
    () =>
      validateSkillContextMapRuntimeCoverage({
        skillsRoot,
        contextMap: contextMap({ required: ["references/entry.md"] }),
      }),
    /missing cited runtime Markdown files: demo-skill\/assets\/nested\/template\.md/,
  );

  await assert.rejects(
    () =>
      buildSkillTokenReport({
        skillsRoot,
        rootForLabels: workspace,
        encoder: { encode: (text) => text.trim().split(/\s+/) },
        contextMap: contextMap({
          required: ["references/entry.md"],
          conditional: ["assets/nested/template.md", "assets/unused.md"],
        }),
      }),
    /not reachable from any SKILL\.md: demo-skill\/assets\/unused\.md/,
  );
});

test("context map flows match explicit headings and their direct citations", async () => {
  const workspace = await makeTempWorkspace();
  const skillsRoot = path.join(workspace, "skills");

  await writeSkill(skillsRoot, "demo-skill", {
    "SKILL.md": `---\nname: "demo-skill"\ndescription: "Test skill demo-skill"\n---\n\n# Demo\n\n### Review Flow\n\nRead references/review.md.\n\n### Generate Flow\n\nRead references/generate.md.\n`,
    "references/review.md": "# Review\n",
    "references/generate.md": "# Generate\n",
  });

  await assert.rejects(
    () =>
      validateSkillContextMapRuntimeCoverage({
        skillsRoot,
        contextMap: {
          version: 1,
          skills: {
            "demo-skill": {
              flows: {
                review: { required: ["references/review.md"] },
                other: { required: ["references/generate.md"] },
              },
            },
          },
        },
      }),
    /flow coverage differs for demo-skill/,
  );

  await assert.rejects(
    () =>
      validateSkillContextMapRuntimeCoverage({
        skillsRoot,
        contextMap: {
          version: 1,
          skills: {
            "demo-skill": {
              flows: {
                review: { required: ["references/generate.md"] },
                generate: { required: ["references/review.md"] },
              },
            },
          },
        },
      }),
    /demo-skill:review is missing direct citation references\/review\.md/,
  );
});

function contextMap({ required, conditional = [] }) {
  return {
    version: 1,
    skills: {
      "demo-skill": {
        flows: {
          default: { required, conditional },
        },
      },
    },
  };
}
