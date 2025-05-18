import fs from "fs";
import { handleError } from "./errorHandler";

export function parseIniFile(filePath: string): Record<string, string> {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    const lines = data.split("\n");
    const iniData: Record<string, string> = {};

    lines.forEach((line) => {
      const [value, key] = line.split("=");
      if (key && value) {
        iniData[key.trim().replace(/['"]+/g, "")] = value.trim();
      }
    });
    return iniData;
  } catch (error) {
    if (error instanceof Error) {
      handleError(error, filePath);
    } else {
      console.error("Failed to read INI file: Unknown error occurred.");
    }
    process.exit(1);
  }
}
