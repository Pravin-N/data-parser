export function handleError(error: Error, filePath: string) {
  console.error(`Error processing ${filePath}: ${error.message}`);
}
