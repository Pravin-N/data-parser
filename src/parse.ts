import path from "path";
import { parseLogFile } from "./logParser";
import { parseIniFile } from "./iniParser";
import { writeCsv } from "./csvWriter";
import { findLogFiles } from "./fileUtils";
import { OutputRecord } from "./types";

const rootDir = process.argv[2];

if (!rootDir) {
  console.error("Please provide a root directory path.");
  process.exit(1);
}

const iniFilePath = path.join(__dirname, "appCodes.ini");
const iniData: Record<string, string> = parseIniFile(iniFilePath);
const logFiles: string[] = findLogFiles(rootDir);

if (!logFiles.length) {
  console.error(`No log files found in the specified directory: ${rootDir}`);
  process.exit(1);
}

let id: number = 1;
const records: OutputRecord[] = [];

logFiles.forEach((file) => {
  const logData: OutputRecord[] = parseLogFile(file, iniData, id);
  records.push(...logData);
  id += logData.length;
});

const outputPath = path.join(__dirname, "result.csv");
writeCsv(outputPath, records);
console.log(`Parsing complete. Output written to ${outputPath}`);
