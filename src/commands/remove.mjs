import { listDirectories, removeDirectory } from "../lib/fs.mjs";
import { isOwnedMarker, readMarker } from "../lib/marker.mjs";

export async function removeSkills({ destinationRoot, dryRun = false }) {
  const targetDirectories = await listDirectories(destinationRoot);
  const result = {
    command: "remove",
    destinationRoot,
    dryRun,
    removed: [],
    kept: [],
    conflicts: [],
    applied: false,
  };

  for (const targetDirectory of targetDirectories) {
    const marker = await readMarker(targetDirectory.path);
    if (isOwnedMarker(marker)) {
      result.removed.push({
        name: targetDirectory.name,
        targetDir: targetDirectory.path,
      });
      continue;
    }

    result.kept.push({
      name: targetDirectory.name,
      targetDir: targetDirectory.path,
    });
  }

  if (dryRun) {
    return result;
  }

  for (const entry of result.removed) {
    await removeDirectory(entry.targetDir);
  }

  result.applied = true;
  return result;
}
