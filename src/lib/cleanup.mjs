// Cleanup must neither fail a completed operation nor mask its original error.
export async function tryCleanup(operation, onWarning = writeWarning) {
  try {
    return await operation();
  } catch (error) {
    onWarning(`Warning: Cleanup incomplete: ${error.message}`);
  }
}

function writeWarning(message) {
  process.stderr.write(`${message}\n`);
}
