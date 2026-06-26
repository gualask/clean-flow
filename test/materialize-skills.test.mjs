import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { mkdir } from "node:fs/promises";

import { createMaterializedSkills } from "../src/lib/materialize-skills.mjs";
import {
  listDirectoryNames,
  makeTempWorkspace,
  readText,
  writeSkill,
  writeSupportDirectory,
} from "./support/helpers.mjs";

test("materialized skills vendor configured shared references and scripts", async () => {
  const workspace = await makeTempWorkspace();
  const sourceRoot = path.join(workspace, "skills");

  await writeSupportDirectory(sourceRoot, "_shared", {
    "vendor.json": JSON.stringify(
      {
        version: 1,
        skills: {
          "demo-skill": {
            references: ["example.md"],
            scripts: ["tool.mjs"],
          },
        },
      },
      null,
      2,
    ),
    "references/example.md": "# Shared Example\n",
    "scripts/tool.mjs": "console.log('shared tool');\n",
  });
  await writeSkill(sourceRoot, "demo-skill", {
    "references/example.md":
      "<!-- Cflow vendored placeholder: ../../_shared/references/example.md -->\n",
    "scripts/tool.mjs":
      "// Cflow vendored placeholder: ../../_shared/scripts/tool.mjs\nthrow new Error('placeholder');\n",
  });

  const materialized = await createMaterializedSkills(sourceRoot);

  try {
    assert.deepEqual(await listDirectoryNames(materialized.skillsRoot), ["demo-skill"]);
    assert.equal(
      await readText(path.join(materialized.skillsRoot, "demo-skill", "references", "example.md")),
      "# Shared Example\n",
    );
    assert.equal(
      await readText(path.join(materialized.skillsRoot, "demo-skill", "scripts", "tool.mjs")),
      "console.log('shared tool');\n",
    );
  } finally {
    await materialized.cleanup();
  }
});

test("materialized skills require configured placeholders to exist", async () => {
  const workspace = await makeTempWorkspace();
  const sourceRoot = path.join(workspace, "skills");

  await writeSupportDirectory(sourceRoot, "_shared", {
    "vendor.json": JSON.stringify({
      version: 1,
      skills: {
        "demo-skill": {
          references: ["example.md"],
        },
      },
    }),
    "references/example.md": "# Shared Example\n",
  });
  await writeSkill(sourceRoot, "demo-skill");

  await assert.rejects(
    () => createMaterializedSkills(sourceRoot),
    /Vendored placeholder is missing/,
  );
});

test("materialized skills reject runtime shared source paths", async () => {
  const workspace = await makeTempWorkspace();
  const sourceRoot = path.join(workspace, "skills");

  await mkdir(path.join(sourceRoot, "_shared"), { recursive: true });
  await writeSkill(sourceRoot, "demo-skill", {
    "SKILL.md": `---\nname: "demo-skill"\ndescription: "Demo"\n---\n\nRead ../_shared/references/example.md.\n`,
  });

  await assert.rejects(
    () => createMaterializedSkills(sourceRoot),
    /still references shared source path/,
  );
});
