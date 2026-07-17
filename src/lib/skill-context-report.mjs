import path from "node:path";

const CONTEXT_MAP_VERSION = 1;
const FLOW_KEYS = new Set(["required", "conditional", "handoffs"]);
const HANDOFF_KEYS = new Set(["to", "kind", "context"]);
const HANDOFF_KINDS = new Set(["required", "conditional"]);
const HANDOFF_CONTEXTS = new Set(["same-thread", "fresh-context"]);

export function buildSkillContextReport({ contextMap, skillReports, skillName = null }) {
  if (contextMap === null) {
    return null;
  }

  const skillsByName = new Map(skillReports.map((skill) => [skill.name, skill]));
  const resourcesById = buildResourceIndex(skillReports);
  const flowDefinitions = validateAndIndexContextMap({
    contextMap,
    skillsByName,
    resourcesById,
  });
  const discoveryTokens = skillReports.reduce(
    (total, skill) => total + skill.metadata.tokens,
    0,
  );
  const flows = [];

  for (const definition of flowDefinitions.values()) {
    if (skillName !== null && definition.skillName !== skillName) {
      continue;
    }

    flows.push(
      buildFlowReport({
        definition,
        flowDefinitions,
        resourcesById,
        discoveryTokens,
      }),
    );
  }

  return {
    discoveryTokens,
    flows,
  };
}

function buildResourceIndex(skillReports) {
  const resources = new Map();

  for (const skill of skillReports) {
    resources.set(`${skill.name}/SKILL.md`, {
      id: `${skill.name}/SKILL.md`,
      tokens: skill.skillInstructions.tokens,
    });

    for (const resource of skill.resources) {
      const id = `${skill.name}/${toPosixPath(resource.label)}`;
      resources.set(id, { id, tokens: resource.tokens });
    }
  }

  return resources;
}

function validateAndIndexContextMap({ contextMap, skillsByName, resourcesById }) {
  if (!isPlainObject(contextMap)) {
    throw new Error("Skill context map must be an object");
  }
  if (contextMap.version !== CONTEXT_MAP_VERSION) {
    throw new Error(`Unsupported skill context map version: ${JSON.stringify(contextMap.version)}`);
  }
  if (!isPlainObject(contextMap.skills)) {
    throw new Error('Skill context map must define an object at "skills"');
  }

  const configuredSkillNames = Object.keys(contextMap.skills).sort();
  const packagedSkillNames = [...skillsByName.keys()].sort();
  if (configuredSkillNames.join("\n") !== packagedSkillNames.join("\n")) {
    throw new Error(
      `Skill context map coverage differs from packaged skills: configured [${configuredSkillNames.join(", ")}], packaged [${packagedSkillNames.join(", ")}]`,
    );
  }

  const definitions = new Map();

  for (const [skillName, skillConfig] of Object.entries(contextMap.skills)) {
    if (!isPlainObject(skillConfig) || !isPlainObject(skillConfig.flows)) {
      throw new Error(`Skill context map entry ${skillName} must define an object at "flows"`);
    }

    const flowEntries = Object.entries(skillConfig.flows);
    if (flowEntries.length === 0) {
      throw new Error(`Skill context map entry ${skillName} must define at least one flow`);
    }

    for (const [flowName, flowConfig] of flowEntries) {
      const id = `${skillName}:${flowName}`;
      assertFlowConfig(id, flowConfig);
      const requiredIds = resolveResourceList({
        id,
        skillName,
        field: "required",
        values: flowConfig.required ?? [],
        resourcesById,
      });
      const conditionalIds = resolveResourceList({
        id,
        skillName,
        field: "conditional",
        values: flowConfig.conditional ?? [],
        resourcesById,
      });
      const overlap = requiredIds.filter((resourceId) => conditionalIds.includes(resourceId));
      if (overlap.length > 0) {
        throw new Error(
          `Skill context flow ${id} lists resources as both required and conditional: ${overlap.join(", ")}`,
        );
      }

      definitions.set(id, {
        id,
        skillName,
        flowName,
        requiredIds,
        conditionalIds,
        handoffs: flowConfig.handoffs ?? [],
      });
    }
  }

  for (const definition of definitions.values()) {
    for (const handoff of definition.handoffs) {
      assertHandoff(definition.id, handoff);
      if (!definitions.has(handoff.to)) {
        throw new Error(
          `Skill context flow ${definition.id} hands off to unknown flow ${handoff.to}`,
        );
      }
    }
  }

  return definitions;
}

function assertFlowConfig(id, flowConfig) {
  if (!isPlainObject(flowConfig)) {
    throw new Error(`Skill context flow ${id} must be an object`);
  }

  for (const key of Object.keys(flowConfig)) {
    if (!FLOW_KEYS.has(key)) {
      throw new Error(`Skill context flow ${id} has unknown key: ${key}`);
    }
  }

  for (const field of ["required", "conditional", "handoffs"]) {
    if (flowConfig[field] !== undefined && !Array.isArray(flowConfig[field])) {
      throw new Error(`Skill context flow ${id}.${field} must be an array`);
    }
  }
}

function resolveResourceList({ id, skillName, field, values, resourcesById }) {
  const resolved = [];

  for (const value of values) {
    if (typeof value !== "string" || value.trim() === "") {
      throw new Error(`Skill context flow ${id}.${field} contains an invalid resource path`);
    }

    const resourceId = resolveResourceId(skillName, value);
    if (!resourcesById.has(resourceId)) {
      throw new Error(
        `Skill context flow ${id}.${field} references unknown runtime file ${value}`,
      );
    }
    if (resolved.includes(resourceId)) {
      throw new Error(
        `Skill context flow ${id}.${field} repeats runtime file ${value}`,
      );
    }
    resolved.push(resourceId);
  }

  return resolved;
}

function resolveResourceId(skillName, relativePath) {
  if (path.posix.isAbsolute(relativePath) || relativePath.includes("\\")) {
    throw new Error(`Unsafe skill context resource path: ${relativePath}`);
  }

  const normalized = path.posix.normalize(`${skillName}/${relativePath}`);
  if (normalized === ".." || normalized.startsWith("../")) {
    throw new Error(`Unsafe skill context resource path: ${relativePath}`);
  }

  return normalized;
}

function assertHandoff(flowId, handoff) {
  if (!isPlainObject(handoff)) {
    throw new Error(`Skill context flow ${flowId} contains an invalid handoff`);
  }
  for (const key of Object.keys(handoff)) {
    if (!HANDOFF_KEYS.has(key)) {
      throw new Error(`Skill context flow ${flowId} handoff has unknown key: ${key}`);
    }
  }
  if (typeof handoff.to !== "string" || handoff.to.trim() === "") {
    throw new Error(`Skill context flow ${flowId} handoff must name a target flow`);
  }
  if (!HANDOFF_KINDS.has(handoff.kind)) {
    throw new Error(
      `Skill context flow ${flowId} handoff has unsupported kind: ${JSON.stringify(handoff.kind)}`,
    );
  }
  if (!HANDOFF_CONTEXTS.has(handoff.context)) {
    throw new Error(
      `Skill context flow ${flowId} handoff has unsupported context: ${JSON.stringify(handoff.context)}`,
    );
  }
}

function buildFlowReport({ definition, flowDefinitions, resourcesById, discoveryTokens }) {
  const requiredIds = [`${definition.skillName}/SKILL.md`, ...definition.requiredIds];
  const reachableIds = [...requiredIds, ...definition.conditionalIds];
  const requiredTokens = tokensForIds(requiredIds, resourcesById);
  const reachableTokens = tokensForIds(reachableIds, resourcesById);

  return {
    id: definition.id,
    skillName: definition.skillName,
    flowName: definition.flowName,
    requiredTokens,
    reachableTokens,
    reachableWithDiscoveryTokens: discoveryTokens + reachableTokens,
    handoffs: definition.handoffs.map((handoff) =>
      buildHandoffReport({
        sourceReachableIds: reachableIds,
        targetDefinition: flowDefinitions.get(handoff.to),
        handoff,
        resourcesById,
        discoveryTokens,
      }),
    ),
  };
}

function buildHandoffReport({
  sourceReachableIds,
  targetDefinition,
  handoff,
  resourcesById,
  discoveryTokens,
}) {
  const targetReachableIds = [
    `${targetDefinition.skillName}/SKILL.md`,
    ...targetDefinition.requiredIds,
    ...targetDefinition.conditionalIds,
  ];
  const targetReachableTokens = tokensForIds(targetReachableIds, resourcesById);

  if (handoff.context === "fresh-context") {
    return {
      ...handoff,
      targetReachableWithDiscoveryTokens: discoveryTokens + targetReachableTokens,
    };
  }

  const cumulativeReachableIds = unique([...sourceReachableIds, ...targetReachableIds]);
  const cumulativeReachableTokens = tokensForIds(cumulativeReachableIds, resourcesById);

  return {
    ...handoff,
    addedReachableTokens: tokensForIds(
      targetReachableIds.filter((id) => !sourceReachableIds.includes(id)),
      resourcesById,
    ),
    cumulativeReachableWithDiscoveryTokens: discoveryTokens + cumulativeReachableTokens,
  };
}

function tokensForIds(ids, resourcesById) {
  return unique(ids).reduce((total, id) => total + resourcesById.get(id).tokens, 0);
}

function unique(values) {
  return [...new Set(values)];
}

function toPosixPath(value) {
  return value.split(path.sep).join("/");
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
