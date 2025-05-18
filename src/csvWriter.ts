import fs from "fs";
import { OutputRecord } from "./types";
import { HeaderKeys } from "./types";

export function writeCsv(filePath: string, records: OutputRecord[]) {
  try {
    const headerKeysObj: HeaderKeys = {
      id: "id",
      appCode: "appCode",
      deviceId: "deviceId",
      contactable: "contactable",
      subscription_status: "subscription_status",
      has_downloaded_free_product_status: "has_downloaded_free_product_status",
      has_downloaded_iap_product_status: "has_downloaded_iap_product_status",
      unknown_tags: "unknown_tags"
    };

    const headerKeys = Object.keys(headerKeysObj) as (keyof OutputRecord)[];
    const header = headerKeys.join(",") + "\n";

    const rows = records
      .map((record) =>
        headerKeys
          .map((key) => {
            const value = record[key];
            if (Array.isArray(value)) {
              return value.length > 0 ? value.join("|") : "";
            }
            return typeof value === "string" && value.includes(",")
              ? `"${value}"`
              : value;
          })
          .join(",")
      )
      .join("\n");
    fs.writeFileSync(filePath, header + rows, "utf-8");
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Failed to write CSV file: ${error.message}`);
    } else {
      console.error("Failed to write CSV file: Unknown error occurred.");
    }
    process.exit(1);
  }
}
