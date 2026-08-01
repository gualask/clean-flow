import path from "node:path";

const CATEGORY_PRIORITY = new Map([
  ["same-flow", 4],
  ["same-thread", 3],
  ["same-skill", 2],
  ["cross-skill", 1],
  ["maintainer-only", 0],
  ["unclassified", 0],
]);

export function buildProseContextModel({ skillsRoot, contextMap, vendorConfig }) {
  const absoluteSkillsRoot = path.resolve(skillsRoot);
  const flows = buildFlows({ absoluteSkillsRoot, contextMap, vendorConfig });
  const sameThreadContexts = buildSameThreadContexts(flows);
  const bindings = new Map();

  for (const flow of flows.values()) {
    for (const [runtimeId, sourcePath] of flow.sources) {
      const sourceBindings = bindings.get(sourcePath) ?? new Set();
      sourceBindings.add(runtimeId);
      bindings.set(sourcePath, sourceBindings);
    }
  }

  return {
    runtimeIdsFor(filePath) {
      return [...(bindings.get(path.resolve(filePath)) ?? [])];
    },
    classify(occurrences) {
      return classifyOccurrences({ occurrences, flows, sameThreadContexts });
    },
  };
}

export function contextCategoryPriority(category) {
  return CATEGORY_PRIORITY.get(category) ?? 0;
}

function buildFlows({ absoluteSkillsRoot, contextMap, vendorConfig }) {
  if (contextMap?.version !== 1 || typeof contextMap.skills !== "object") {
    throw new Error("Unsupported prose duplication context map");
  }
  if (vendorConfig?.version !== 1 || typeof vendorConfig.skills !== "object") {
    throw new Error("Unsupported prose duplication vendor config");
  }

  const flows = new Map();

  for (const [skillName, skillConfig] of Object.entries(contextMap.skills)) {
    for (const [flowName, flowConfig] of Object.entries(skillConfig.flows ?? {})) {
      const id = `${skillName}:${flowName}`;
      const runtimeIds = [
        `${skillName}/SKILL.md`,
        ...(flowConfig.required ?? []).map((resource) => `${skillName}/${resource}`),
        ...(flowConfig.conditional ?? []).map((resource) => `${skillName}/${resource}`),
      ];
      const sources = new Map(
        runtimeIds.map((runtimeId) => [
          runtimeId,
          sourcePathForRuntimeId({
            absoluteSkillsRoot,
            runtimeId,
            vendorConfig,
          }),
        ]),
      );

      flows.set(id, {
        id,
        skillName,
        runtimeIds: new Set(runtimeIds),
        sources,
        handoffs: flowConfig.handoffs ?? [],
      });
    }
  }

  return flows;
}

function sourcePathForRuntimeId({ absoluteSkillsRoot, runtimeId, vendorConfig }) {
  const [skillName, section, ...remaining] = runtimeId.split("/");
  if (section === undefined) {
    throw new Error(`Invalid runtime resource id: ${runtimeId}`);
  }

  const relativeResource = [section, ...remaining].join("/");
  const fileName = remaining.join("/");
  const vendoredItems = vendorConfig.skills[skillName]?.[section] ?? [];
  if ((section === "references" || section === "scripts") && vendoredItems.includes(fileName)) {
    return path.resolve(absoluteSkillsRoot, "_shared", section, fileName);
  }

  return path.resolve(absoluteSkillsRoot, skillName, relativeResource);
}

function buildSameThreadContexts(flows) {
  const contexts = [];

  for (const flow of flows.values()) {
    for (const handoff of flow.handoffs) {
      if (handoff.context !== "same-thread") {
        continue;
      }

      const target = flows.get(handoff.to);
      if (target === undefined) {
        throw new Error(`Unknown same-thread handoff target: ${handoff.to}`);
      }

      contexts.push({
        id: `${flow.id} -> ${target.id}`,
        runtimeIds: new Set([...flow.runtimeIds, ...target.runtimeIds]),
      });
    }
  }

  return contexts;
}

function classifyOccurrences({ occurrences, flows, sameThreadContexts }) {
  const flowMatches = matchingContexts(occurrences, [...flows.values()]);
  if (flowMatches.length > 0) {
    return classification("same-flow", flowMatches);
  }

  const threadMatches = matchingContexts(occurrences, sameThreadContexts);
  if (threadMatches.length > 0) {
    return classification("same-thread", threadMatches);
  }

  const runtimeOccurrences = occurrences.filter((occurrence) => occurrence.runtimeIds.length > 0);
  if (runtimeOccurrences.length < 2) {
    return classification("maintainer-only");
  }

  for (let leftIndex = 0; leftIndex < runtimeOccurrences.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < runtimeOccurrences.length; rightIndex += 1) {
      if (shareSkill(runtimeOccurrences[leftIndex], runtimeOccurrences[rightIndex])) {
        return classification("same-skill");
      }
    }
  }

  return classification("cross-skill");
}

function matchingContexts(occurrences, contexts) {
  const matches = [];

  for (const context of contexts) {
    const occurrenceCount = occurrences.filter((occurrence) =>
      occurrence.runtimeIds.some((runtimeId) => context.runtimeIds.has(runtimeId)),
    ).length;
    if (occurrenceCount > 1) {
      matches.push({ id: context.id, duplicateCopies: occurrenceCount - 1 });
    }
  }

  return matches;
}

function classification(category, matches = []) {
  return {
    category,
    contexts: matches.map((match) => match.id),
    duplicateCopies: Math.max(0, ...matches.map((match) => match.duplicateCopies)),
  };
}

function shareSkill(left, right) {
  const leftSkills = new Set(left.runtimeIds.map(skillNameFromRuntimeId));
  return right.runtimeIds.some((runtimeId) => leftSkills.has(skillNameFromRuntimeId(runtimeId)));
}

function skillNameFromRuntimeId(runtimeId) {
  return runtimeId.split("/", 1)[0];
}
