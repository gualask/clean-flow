import path from "node:path";
import { mkdir, readFile, rm, rmdir, writeFile } from "node:fs/promises";

import { pathExists } from "../lib/fs.mjs";

export const FRICTION_LAW_FILE = "friction-law.md";
export const FRICTION_SCRIPT_RELATIVE_PATH = path.join("bin", "friction.mjs");
export const AGENTS_MARKER_BEGIN = "<!-- BEGIN CFLOW FRICTION -->";
export const AGENTS_MARKER_END = "<!-- END CFLOW FRICTION -->";

const MINIMAL_AGENTS_HEADER = "# Global agent instructions\n";
const SCRIPT_VERSION_PLACEHOLDER = "__CFLOW_PACK_VERSION__";
const SCRIPT_HOME_PLACEHOLDER = "__CFLOW_HOME__";
const LAW_BIN_PLACEHOLDER = "{{CFLOW_BIN}}";

export async function installFriction({
  sourceRoot,
  cflowHome,
  agentsFile,
  version,
  dryRun = false,
}) {
  const scriptTarget = path.join(cflowHome, FRICTION_SCRIPT_RELATIVE_PATH);

  const scriptSource = await readFile(path.join(sourceRoot, "friction.mjs"), "utf8");
  const lawSource = await readFile(path.join(sourceRoot, FRICTION_LAW_FILE), "utf8");

  const scriptContent = scriptSource
    .replaceAll(SCRIPT_VERSION_PLACEHOLDER, version)
    .replaceAll(JSON.stringify(SCRIPT_HOME_PLACEHOLDER), () => JSON.stringify(path.resolve(cflowHome)));
  const lawContent = lawSource.replaceAll(LAW_BIN_PLACEHOLDER, scriptTarget);

  const files = [await planFileWrite("friction script", scriptTarget, scriptContent)];
  // The law is inlined into the AGENTS.md block: hosts are not guaranteed to
  // expand @file imports, and a lazily read law never fires mid-task.
  const agents = await planAgentsUpdate(agentsFile, frictionBlock(lawContent));

  const result = {
    command: "install-friction",
    cflowHome,
    agentsFile,
    dryRun,
    files,
    agents,
    applied: false,
  };

  if (dryRun) {
    return result;
  }

  for (const file of files) {
    if (file.action === "unchanged") {
      continue;
    }
    await mkdir(path.dirname(file.target), { recursive: true });
    await writeFile(file.target, file.content, "utf8");
  }

  if (agents.action !== "unchanged") {
    await mkdir(path.dirname(agentsFile), { recursive: true });
    await writeFile(agentsFile, agents.content, "utf8");
  }

  result.applied = true;
  return result;
}

export async function removeFriction({ cflowHome, agentsFile, dryRun = false }) {
  const warnings = [];
  const files = await planFrictionFileRemoval(cflowHome, warnings);
  const agents = await attemptFrictionCleanup(warnings, () => planAgentsBlockRemoval(agentsFile))
    ?? { path: agentsFile, action: "skipped", content: null };

  const result = {
    command: "remove-friction",
    cflowHome,
    agentsFile,
    dryRun,
    files,
    agents,
    warnings,
    applied: false,
  };

  if (!dryRun) {
    await applyFrictionFileRemoval(cflowHome, files, warnings);
    if (agents.action === "updated") {
      await attemptFrictionCleanup(warnings, async () => {
        agents.action = "skipped";
        await writeFile(agentsFile, agents.content, "utf8");
        agents.action = "updated";
      });
    }
  }

  result.applied = !dryRun && warnings.length === 0;
  return result;
}

async function planFrictionFileRemoval(cflowHome, warnings) {
  const target = path.join(cflowHome, FRICTION_SCRIPT_RELATIVE_PATH);
  const exists = await attemptFrictionCleanup(warnings, () => pathExists(target));
  return exists === false
    ? []
    : [{ name: "friction script", target, action: exists ? "removed" : "skipped" }];
}

async function applyFrictionFileRemoval(cflowHome, files, warnings) {
  for (const file of files) {
    if (file.action === "skipped") {
      continue;
    }
    await attemptFrictionCleanup(warnings, async () => {
      // Report a removal only after it succeeds.
      file.action = "skipped";
      await rm(file.target, { force: true });
      file.action = "removed";
    });
  }
  // Friction logs under <cflowHome>/friction/ are user data and stay.
  await attemptFrictionCleanup(warnings, () => removeIfEmpty(path.join(cflowHome, "bin")));
  await attemptFrictionCleanup(warnings, () => removeIfEmpty(cflowHome));
}

// Optional cleanup must not fail the skills operation or prevent other cleanup.
async function attemptFrictionCleanup(warnings, operation) {
  try {
    return await operation();
  } catch (error) {
    warnings.push(`Friction cleanup incomplete: ${error.message}`);
  }
}

function frictionBlock(lawContent) {
  return `${AGENTS_MARKER_BEGIN}\n${lawContent.trim()}\n${AGENTS_MARKER_END}`;
}

async function planFileWrite(name, target, content) {
  const existing = await readFileOrNull(target);
  const action = existing === null ? "created" : existing === content ? "unchanged" : "updated";
  return { name, target, content, action };
}

async function planAgentsUpdate(agentsFile, block) {
  const existing = await readFileOrNull(agentsFile);

  if (existing === null) {
    return {
      path: agentsFile,
      action: "created",
      content: `${MINIMAL_AGENTS_HEADER}\n${block}\n`,
    };
  }

  const replaced = replaceMarkerBlock(existing, block);
  if (replaced !== null) {
    return {
      path: agentsFile,
      action: replaced === existing ? "unchanged" : "updated",
      content: replaced,
    };
  }

  const separator = existing.endsWith("\n") ? "\n" : "\n\n";
  return {
    path: agentsFile,
    action: "appended",
    content: `${existing}${separator}${block}\n`,
  };
}

async function planAgentsBlockRemoval(agentsFile) {
  const existing = await readFileOrNull(agentsFile);
  if (existing === null) {
    return { path: agentsFile, action: "unchanged", content: null };
  }

  const stripped = stripMarkerBlock(existing);
  if (stripped === null || stripped === existing) {
    return { path: agentsFile, action: "unchanged", content: existing };
  }

  return { path: agentsFile, action: "updated", content: stripped };
}

// Returns the file content with the marker block replaced, or null when no
// complete marker block exists.
function replaceMarkerBlock(content, block) {
  const bounds = markerBounds(content);
  if (!bounds) {
    return null;
  }
  return content.slice(0, bounds.start) + block + content.slice(bounds.end);
}

// Returns the content without the marker block (surrounding blank lines
// collapsed), or null when no complete marker block exists.
function stripMarkerBlock(content) {
  const bounds = markerBounds(content);
  if (!bounds) {
    return null;
  }

  const before = content.slice(0, bounds.start).replace(/\n+$/, "\n");
  const after = content.slice(bounds.end).replace(/^\n+/, "");
  if (before.trim() === "" && after.trim() === "") {
    return "";
  }
  return after === "" ? before : `${before}\n${after}`;
}

function markerBounds(content) {
  const start = content.indexOf(AGENTS_MARKER_BEGIN);
  if (start === -1) {
    return null;
  }
  const endMarker = content.indexOf(AGENTS_MARKER_END, start);
  if (endMarker === -1) {
    return null;
  }
  return { start, end: endMarker + AGENTS_MARKER_END.length };
}

async function readFileOrNull(pathname) {
  try {
    return await readFile(pathname, "utf8");
  } catch (error) {
    if (error?.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

async function removeIfEmpty(pathname) {
  try {
    await rmdir(pathname);
  } catch (error) {
    if (["ENOENT", "ENOTEMPTY", "EEXIST"].includes(error?.code)) {
      return;
    }
    throw error;
  }
}
