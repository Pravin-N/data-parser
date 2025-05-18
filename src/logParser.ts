import { classifyTags } from "./tagClassifier";
import fs from "fs";
import { OutputRecord } from "./types";
import { handleError } from "./errorHandler";

export function parseLogFile(
  filePath: string,
  iniData: Record<string, string>,
  startId: number
): OutputRecord[] {
  const records: OutputRecord[] = [];
  let data = "";
  try {
    data = fs.readFileSync(filePath, "utf-8");
  } catch (error) {
    if (error instanceof Error) {
      handleError(error, filePath);
    } else {
      console.error(
        `Failed to read file: ${filePath} - Unknown error occurred.`
      );
    }
    return records;
  }
  const lines = data.split("\n");

  if (lines?.[0] !== "app,deviceToken,deviceTokenStatus,tags") {
    console.error(
      `Failed to read file: ${filePath}: Invalid file format. Expected header line not found.`
    );
    return records;
  }

  lines.forEach((line, index) => {
    if (index === 0 || !line) {
      return;
    }
    const fields = line?.split(",") ?? [];
    if (fields.length === 0) {
      return;
    }

    const appCodeValue = fields?.[0];
    const deviceToken = fields?.[1];
    const deviceTokenStatus = !!fields?.[2];
    const tags = fields?.[3];
    if (!appCodeValue || !deviceToken) {
      return;
    }
    const record: OutputRecord = {
      id: startId++,
      appCode: iniData?.[appCodeValue] ?? "unknown",
      deviceId: deviceToken ?? "",
      contactable: deviceTokenStatus,
      ...classifyTags(tags),
    };

    records.push(record);
  });

  return records;
}
