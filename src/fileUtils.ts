import fs from "fs";
import path from "path";
import { handleError } from "./errorHandler";

export function findLogFiles(dir: string): string[] {
  const logFiles: string[] = [];

  function traverse(currentDir: string) {
    try {
      const files = fs.readdirSync(currentDir);
      files.forEach((file) => {
        const filePath = path.join(currentDir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          traverse(filePath);
        } else if (filePath.endsWith(".log")) {
          logFiles.push(filePath);
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        handleError(error, currentDir);
      } else {
        console.error(`Failed to read directory: ${currentDir}`);
      }
      process.exit(1);
    }
  }

  traverse(dir);
  return logFiles;
}
