import path from "node:path";
import { readFile } from "node:fs/promises";

import { listSkillDirectories } from "./fs.mjs";
import { resolveResourceId } from "./skill-context-report.mjs";

const RUNTIME_MARKDOWN_PATH =
  /(?<![\w/])(?:\.\.\/[A-Za-z0-9._-]+\/)?(?:references|assets)\/[A-Za-z0-9._/-]+\.md/g;

export async function validateSkillContextMapRuntimeCoverage({ skillsRoot, contextMap }) {
  if (contextMap === null) {
    return;
  }

  const skills = await listSkillDirectories(skillsRoot);
  const skillsByName = new Map(skills.map((skill) => [skill.name, skill]));
  const configuredResources = configuredResourceIds(contextMap);
  const { citedResources, skillTexts } = await collectReachableRuntimeResources({
    skills,
    skillsByName,
  });

  assertMatchingResources({ configuredResources, citedResources });
  assertDeclaredFlowsMatch({ contextMap, skillTexts });
}

function configuredResourceIds(contextMap) {
  const resources = new Set();

  for (const [skillName, skillConfig] of Object.entries(contextMap.skills)) {
    for (const flowConfig of Object.values(skillConfig.flows)) {
      for (const relativePath of [
        ...(flowConfig.required ?? []),
        ...(flowConfig.conditional ?? []),
      ]) {
        resources.add(resolveResourceId(skillName, relativePath));
      }
    }
  }

  return resources;
}

async function collectReachableRuntimeResources({ skills, skillsByName }) {
  const citedResources = new Set();
  const skillTexts = new Map();
  const visited = new Set();
  const queue = skills.map((skill) => ({
    id: `${skill.name}/SKILL.md`,
    filePath: path.join(skill.path, "SKILL.md"),
    skillName: skill.name,
    isSkillFile: true,
  }));

  while (queue.length > 0) {
    const current = queue.shift();
    if (visited.has(current.id)) {
      continue;
    }
    visited.add(current.id);

    const text = await readRuntimeFile(current);
    if (current.isSkillFile) {
      skillTexts.set(current.skillName, text);
    }

    for (const relativePath of runtimeMarkdownPaths(text)) {
      const resourceId = resolveResourceId(current.skillName, relativePath);
      const targetSkillName = resourceId.split("/", 1)[0];
      const targetSkill = skillsByName.get(targetSkillName);

      if (!targetSkill) {
        throw new Error(
          `Runtime file ${current.id} cites a resource outside the packaged skills: ${relativePath}`,
        );
      }

      citedResources.add(resourceId);
      queue.push({
        id: resourceId,
        filePath: path.join(targetSkill.path, ...resourceId.split("/").slice(1)),
        skillName: targetSkillName,
        isSkillFile: false,
      });
    }
  }

  return { citedResources, skillTexts };
}

async function readRuntimeFile({ id, filePath }) {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    if (error?.code === "ENOENT") {
      throw new Error(`Runtime citation points to a missing Markdown file: ${id}`);
    }
    throw error;
  }
}

function runtimeMarkdownPaths(text) {
  return [...text.matchAll(RUNTIME_MARKDOWN_PATH)].map((match) => match[0]);
}

function assertMatchingResources({ configuredResources, citedResources }) {
  const missing = difference(citedResources, configuredResources);
  if (missing.length > 0) {
    throw new Error(
      `Skill context map is missing cited runtime Markdown files: ${missing.join(", ")}`,
    );
  }

  const extra = difference(configuredResources, citedResources);
  if (extra.length > 0) {
    throw new Error(
      `Skill context map includes runtime Markdown files not reachable from any SKILL.md: ${extra.join(", ")}`,
    );
  }
}

function assertDeclaredFlowsMatch({ contextMap, skillTexts }) {
  for (const [skillName, text] of skillTexts) {
    const declaredFlows = [...text.matchAll(/^### (.+) Flow$/gm)]
      .map((match) => slugifyFlowName(match[1]))
      .sort();

    if (declaredFlows.length === 0) {
      continue;
    }

    const configuredFlows = Object.keys(contextMap.skills[skillName].flows).sort();
    if (declaredFlows.join("\n") !== configuredFlows.join("\n")) {
      throw new Error(
        `Skill context map flow coverage differs for ${skillName}: declared [${declaredFlows.join(", ")}], configured [${configuredFlows.join(", ")}]`,
      );
    }

    assertDirectFlowCitations({
      skillName,
      text,
      flowConfigs: contextMap.skills[skillName].flows,
    });
  }
}

function assertDirectFlowCitations({ skillName, text, flowConfigs }) {
  let activeFlow = null;

  for (const line of text.split("\n")) {
    const flowHeading = /^### (.+) Flow$/.exec(line);
    if (flowHeading) {
      activeFlow = slugifyFlowName(flowHeading[1]);
      continue;
    }
    if (/^#{1,3} /.test(line)) {
      activeFlow = null;
      continue;
    }
    if (activeFlow === null) {
      continue;
    }

    const configuredIds = new Set(
      [...(flowConfigs[activeFlow].required ?? []), ...(flowConfigs[activeFlow].conditional ?? [])]
        .map((relativePath) => resolveResourceId(skillName, relativePath)),
    );

    for (const relativePath of runtimeMarkdownPaths(line)) {
      const resourceId = resolveResourceId(skillName, relativePath);
      if (!configuredIds.has(resourceId)) {
        throw new Error(
          `Skill context map ${skillName}:${activeFlow} is missing direct citation ${relativePath}`,
        );
      }
    }
  }
}

function slugifyFlowName(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function difference(left, right) {
  return [...left].filter((value) => !right.has(value)).sort();
}
