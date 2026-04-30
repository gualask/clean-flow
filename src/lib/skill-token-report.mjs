import path from "node:path";
import { readFile, readdir } from "node:fs/promises";

import { listSkillDirectories } from "./fs.mjs";
import { tokenCountRow } from "./token-count.mjs";

// Budget references:
// - OpenAI Codex skills docs: Codex initially loads skill metadata, then reads full
//   `SKILL.md` only after activation. The initial skill list is separately capped.
//   https://developers.openai.com/codex/skills
// - OpenAI API Skills docs defer frontmatter validation to the Agent Skills spec.
//   https://developers.openai.com/api/docs/guides/tools-skills#limits-and-validation
// - Agent Skills spec: `description` max 1024 chars, `SKILL.md` instructions
//   under 5000 tokens recommended. Use 4000 as an early warning before that.
//   https://agentskills.io/specification
export const DEFAULT_SKILL_TOKEN_BUDGETS = Object.freeze({
  nameChars: 64,
  descriptionChars: 1024,
  metadataGuidanceTokens: 100,
  skillMdWarningTokens: 4000,
  skillMdHardWarningTokens: 5000,
  resourceWarningTokens: 2000,
});

export function skillTokenBudgetsFromEnv(env = process.env) {
  return {
    nameChars: numberFromEnv(env.CFLOW_SKILL_NAME_CHAR_WARNING, DEFAULT_SKILL_TOKEN_BUDGETS.nameChars),
    descriptionChars: numberFromEnv(
      env.CFLOW_SKILL_DESCRIPTION_CHAR_WARNING,
      DEFAULT_SKILL_TOKEN_BUDGETS.descriptionChars,
    ),
    metadataGuidanceTokens: numberFromEnv(
      env.CFLOW_SKILL_METADATA_TOKEN_WARNING,
      DEFAULT_SKILL_TOKEN_BUDGETS.metadataGuidanceTokens,
    ),
    skillMdWarningTokens: numberFromEnv(
      env.CFLOW_SKILL_MD_TOKEN_WARNING,
      DEFAULT_SKILL_TOKEN_BUDGETS.skillMdWarningTokens,
    ),
    skillMdHardWarningTokens: numberFromEnv(
      env.CFLOW_SKILL_MD_TOKEN_HARD_WARNING,
      DEFAULT_SKILL_TOKEN_BUDGETS.skillMdHardWarningTokens,
    ),
    resourceWarningTokens: numberFromEnv(
      env.CFLOW_SKILL_RESOURCE_TOKEN_WARNING,
      DEFAULT_SKILL_TOKEN_BUDGETS.resourceWarningTokens,
    ),
  };
}

export async function buildSkillTokenReport({
  skillsRoot,
  rootForLabels = path.dirname(skillsRoot),
  encoder,
  budgets = DEFAULT_SKILL_TOKEN_BUDGETS,
  skillName = null,
}) {
  const allSkills = await listSkillDirectories(skillsRoot);
  const skills =
    skillName === null ? allSkills : allSkills.filter((skill) => skill.name === skillName);

  if (skillName !== null && skills.length === 0) {
    const available = allSkills.map((skill) => skill.name).join(", ");
    throw new Error(`Unknown skill ${JSON.stringify(skillName)}. Available skills: ${available}`);
  }

  const skillReports = [];

  for (const skill of skills) {
    skillReports.push(
      await buildSingleSkillReport({
        skill,
        rootForLabels,
        encoder,
        budgets,
      }),
    );
  }

  const totals = skillReports.reduce(
    (current, skill) => ({
      metadataTokens: current.metadataTokens + skill.metadata.tokens,
      skillInstructionTokens: current.skillInstructionTokens + skill.skillInstructions.tokens,
      resourceTokens: current.resourceTokens + skill.resourcesTotalTokens,
      totalTokens: current.totalTokens + skill.totalTokens,
    }),
    {
      metadataTokens: 0,
      skillInstructionTokens: 0,
      resourceTokens: 0,
      totalTokens: 0,
    },
  );

  return {
    budgets,
    skills: skillReports,
    totals,
  };
}

export function collectSkillTokenBudgetWarnings(report) {
  const warnings = [];

  for (const skill of report.skills) {
    pushMetadataWarnings(warnings, skill, report.budgets);
    pushTokenWarning(warnings, {
      label: skill.skillInstructions.path,
      actual: skill.skillInstructions.tokens,
      warning: report.budgets.skillMdWarningTokens,
      hardWarning: report.budgets.skillMdHardWarningTokens,
    });

    for (const resource of skill.resources) {
      pushTokenWarning(warnings, {
        label: resource.path,
        actual: resource.tokens,
        warning: report.budgets.resourceWarningTokens,
        hardWarning: null,
      });
    }
  }

  return warnings;
}

export function formatSkillTokenReport(report, { model, encodingName, source } = {}) {
  const lines = ["Skill token report"];

  if (model || encodingName || source) {
    lines.push(
      `Model: ${model ?? "unknown"} | Encoding: ${encodingName ?? "unknown"} | Source: ${source ?? "unknown"}`,
    );
  }

  lines.push(
    `Budgets: metadata name ${report.budgets.nameChars} chars, description ${report.budgets.descriptionChars} chars, metadata guidance ${report.budgets.metadataGuidanceTokens} tokens`,
  );
  lines.push(
    `Budgets: SKILL.md instructions warn ${report.budgets.skillMdWarningTokens} tokens, hard warn ${report.budgets.skillMdHardWarningTokens} tokens; references/assets warn ${report.budgets.resourceWarningTokens} tokens`,
  );

  for (const skill of report.skills) {
    lines.push("");
    lines.push(skill.name);
    lines.push("  metadata");
    lines.push(
      `    name: ${skill.metadata.name.value || "(missing)"} (${skill.metadata.name.chars}/${report.budgets.nameChars} chars) ${skill.metadata.name.status}`,
    );
    lines.push(
      `    description: ${skill.metadata.description.chars}/${report.budgets.descriptionChars} chars ${skill.metadata.description.status}`,
    );
    lines.push(
      `    discovery tokens: ${skill.metadata.tokens}/~${report.budgets.metadataGuidanceTokens} ${skill.metadata.status}`,
    );
    lines.push("  runtime files");
    lines.push(formatRuntimeRow("item", "tokens", "budget", "status"));
    lines.push(formatRuntimeRow("-".repeat(44), "-".repeat(6), "-".repeat(23), "-".repeat(6)));
    lines.push(
      formatRuntimeRow(
        "SKILL.md instructions",
        skill.skillInstructions.tokens,
        `warn ${report.budgets.skillMdWarningTokens} / hard ${report.budgets.skillMdHardWarningTokens}`,
        skill.skillInstructions.status,
      ),
    );

    for (const resource of skill.resources) {
      lines.push(
        formatRuntimeRow(
          resource.label,
          resource.tokens,
          `warn ${report.budgets.resourceWarningTokens}`,
          resource.status,
        ),
      );
    }

    lines.push(`  skill total: ${skill.totalTokens} tokens`);
  }

  lines.push("");
  lines.push("Grand totals");
  lines.push(`  metadata: ${report.totals.metadataTokens} tokens`);
  lines.push(`  SKILL.md instructions: ${report.totals.skillInstructionTokens} tokens`);
  lines.push(`  references/assets: ${report.totals.resourceTokens} tokens`);
  lines.push(`  all reported tokens: ${report.totals.totalTokens} tokens`);

  return `${lines.join("\n")}\n`;
}

async function buildSingleSkillReport({ skill, rootForLabels, encoder, budgets }) {
  const skillFilePath = path.join(skill.path, "SKILL.md");
  const skillText = await readFile(skillFilePath, "utf8");
  const parsed = parseSkillMarkdown(skillText);
  const skillLabel = path.relative(rootForLabels, skillFilePath);
  const metadataPath = path.relative(rootForLabels, skill.path);
  const metadataText = [
    `name: ${parsed.name}`,
    `description: ${parsed.description}`,
    `path: ${metadataPath}`,
  ].join("\n");
  const metadataTokens = encoder.encode(metadataText).length;
  const instructionRow = tokenCountRow(
    {
      label: skillLabel,
      text: parsed.instructions,
    },
    encoder,
  );
  const resources = [];

  for (const filePath of await listSkillResourceMarkdownFiles(skill.path)) {
    const label = path.relative(skill.path, filePath);
    const row = tokenCountRow(
      {
        label,
        text: await readFile(filePath, "utf8"),
      },
      encoder,
    );

    resources.push({
      ...row,
      path: path.relative(rootForLabels, filePath),
      label,
      status: statusForBudget(row.tokens, {
        warning: budgets.resourceWarningTokens,
        hardWarning: null,
      }),
    });
  }

  const resourcesTotalTokens = resources.reduce((total, resource) => total + resource.tokens, 0);
  const skillInstructionStatus = statusForBudget(instructionRow.tokens, {
    warning: budgets.skillMdWarningTokens,
    hardWarning: budgets.skillMdHardWarningTokens,
  });

  return {
    name: skill.name,
    path: path.relative(rootForLabels, skill.path),
    metadata: {
      tokens: metadataTokens,
      status: statusForBudget(metadataTokens, {
        warning: budgets.metadataGuidanceTokens,
        hardWarning: null,
      }),
      name: {
        value: parsed.name,
        chars: parsed.name.length,
        status: charStatus(parsed.name.length, budgets.nameChars),
      },
      description: {
        value: parsed.description,
        chars: parsed.description.length,
        status: charStatus(parsed.description.length, budgets.descriptionChars),
      },
    },
    skillInstructions: {
      ...instructionRow,
      path: skillLabel,
      status: skillInstructionStatus,
    },
    resources,
    resourcesTotalTokens,
    totalTokens: metadataTokens + instructionRow.tokens + resourcesTotalTokens,
  };
}

async function listSkillResourceMarkdownFiles(skillPath) {
  const files = [];

  for (const relativePath of ["references", "assets"]) {
    const absolutePath = path.join(skillPath, relativePath);
    const entries = await readdir(absolutePath, { withFileTypes: true }).catch((error) => {
      if (error?.code === "ENOENT" || error?.code === "ENOTDIR") {
        return null;
      }
      throw error;
    });

    if (entries === null) {
      continue;
    }

    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith(".md")) {
        files.push(path.join(absolutePath, entry.name));
      }
    }
  }

  return files.sort();
}

function parseSkillMarkdown(text) {
  const frontmatter = text.match(/^---\n([\s\S]*?)\n---\n?/);
  const frontmatterBody = frontmatter?.[1] ?? "";

  return {
    frontmatter: frontmatterBody,
    name: frontmatterField(frontmatterBody, "name"),
    description: frontmatterField(frontmatterBody, "description"),
    instructions: frontmatter ? text.slice(frontmatter[0].length) : text,
  };
}

function frontmatterField(frontmatter, fieldName) {
  const match = new RegExp(`^${fieldName}:\\s*(.+)$`, "m").exec(frontmatter);
  return stripOuterQuotes(match?.[1]?.trim() ?? "");
}

function stripOuterQuotes(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

function pushMetadataWarnings(warnings, skill, budgets) {
  if (skill.metadata.name.status !== "ok") {
    warnings.push({
      code: "CFLOW_SKILL_METADATA_BUDGET",
      message: `${skill.path} name uses ${skill.metadata.name.chars} characters, above warning budget ${budgets.nameChars}`,
    });
  }

  if (skill.metadata.description.status !== "ok") {
    warnings.push({
      code: "CFLOW_SKILL_DESCRIPTION_BUDGET",
      message: `${skill.path} description uses ${skill.metadata.description.chars} characters, above warning budget ${budgets.descriptionChars}`,
    });
  }

  if (skill.metadata.status !== "ok") {
    warnings.push({
      code: "CFLOW_SKILL_METADATA_TOKEN_BUDGET",
      message: `${skill.path} discovery metadata uses ${skill.metadata.tokens} tokens, above guidance budget ${budgets.metadataGuidanceTokens}`,
    });
  }
}

function pushTokenWarning(warnings, { label, actual, warning, hardWarning }) {
  if (hardWarning !== null && actual > hardWarning) {
    warnings.push({
      code: "CFLOW_SKILL_TOKEN_HARD_BUDGET",
      message: `${label} uses ${actual} tokens, above hard warning budget ${hardWarning}`,
    });
    return;
  }

  if (actual > warning) {
    warnings.push({
      code: "CFLOW_SKILL_TOKEN_BUDGET",
      message: `${label} uses ${actual} tokens, above warning budget ${warning}`,
    });
  }
}

function charStatus(actual, limit) {
  return actual > limit ? "warn" : "ok";
}

function statusForBudget(actual, { warning, hardWarning }) {
  if (hardWarning !== null && actual > hardWarning) {
    return "hard";
  }

  if (actual > warning) {
    return "warn";
  }

  return "ok";
}

function formatRuntimeRow(item, tokens, budget, status) {
  return `    ${String(item).padEnd(44)} ${String(tokens).padStart(6)}  ${String(budget).padEnd(23)} ${status}`;
}

function numberFromEnv(value, fallback) {
  if (value === undefined || value === "") {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}
