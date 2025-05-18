"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/parse.ts
var import_path2 = __toESM(require("path"));

// src/tagClassifier.ts
function classifyTags(tags) {
  const tagArray = tags?.split("|") ?? [];
  const validSubscriptionStatus = [
    "active_subscriber",
    "expired_subscriber",
    "never_subscribed",
    "subscription_unknown"
  ];
  const validFreeProductStatus = [
    "has_downloaded_free_product",
    "not_downloaded_free_product",
    "downloaded_free_product_unknown"
  ];
  const validIapProductStatus = [
    "has_downloaded_iap_product",
    "not_downloaded_free_product",
    "downloaded_iap_product_unknown"
  ];
  const tagMap = {
    subscription_status: "subscription_unknown",
    has_downloaded_free_product_status: "downloaded_free_product_unknown",
    has_downloaded_iap_product_status: "downloaded_iap_product_unknown",
    unknown_tags: []
  };
  tagArray.forEach((tag) => {
    if (!tag) {
      return;
    }
    if (validSubscriptionStatus.includes(tag)) {
      tagMap.subscription_status = tag;
      return;
    }
    if (validFreeProductStatus.includes(tag)) {
      tagMap.has_downloaded_free_product_status = tag;
      return;
    }
    if (validIapProductStatus.includes(tag)) {
      tagMap.has_downloaded_iap_product_status = tag;
      return;
    }
    if (tag.includes("downloaded_free") && !tag.includes("not")) {
      tagMap.has_downloaded_free_product_status = "has_downloaded_free_product";
      return;
    }
    if (tag.includes("purchased") && !tag.includes("not")) {
      tagMap.has_downloaded_iap_product_status = "has_downloaded_iap_product";
      return;
    }
    if (tag.includes("not")) {
      tagMap.has_downloaded_free_product_status = "not_downloaded_free_product";
      return;
    }
    tagMap.unknown_tags.push(tag);
  });
  return tagMap;
}

// src/logParser.ts
var import_fs = __toESM(require("fs"));

// src/errorHandler.ts
function handleError(error, filePath) {
  console.error(`Error processing ${filePath}: ${error.message}`);
}

// src/logParser.ts
function parseLogFile(filePath, iniData2, startId) {
  const records2 = [];
  let data = "";
  try {
    data = import_fs.default.readFileSync(filePath, "utf-8");
  } catch (error) {
    if (error instanceof Error) {
      handleError(error, filePath);
    } else {
      console.error(
        `Failed to read file: ${filePath} - Unknown error occurred.`
      );
    }
    return records2;
  }
  const lines = data.split("\n");
  if (lines?.[0] !== "app,deviceToken,deviceTokenStatus,tags") {
    console.error(
      `Failed to read file: ${filePath}: Invalid file format. Expected header line not found.`
    );
    return records2;
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
    const record = {
      id: startId++,
      appCode: iniData2?.[appCodeValue] ?? "unknown",
      deviceId: deviceToken ?? "",
      contactable: deviceTokenStatus,
      ...classifyTags(tags)
    };
    records2.push(record);
  });
  return records2;
}

// src/iniParser.ts
var import_fs2 = __toESM(require("fs"));
function parseIniFile(filePath) {
  try {
    const data = import_fs2.default.readFileSync(filePath, "utf-8");
    const lines = data.split("\n");
    const iniData2 = {};
    lines.forEach((line) => {
      const [value, key] = line.split("=");
      if (key && value) {
        iniData2[key.trim().replace(/['"]+/g, "")] = value.trim();
      }
    });
    return iniData2;
  } catch (error) {
    if (error instanceof Error) {
      handleError(error, filePath);
    } else {
      console.error("Failed to read INI file: Unknown error occurred.");
    }
    process.exit(1);
  }
}

// src/csvWriter.ts
var import_fs3 = __toESM(require("fs"));
function writeCsv(filePath, records2) {
  try {
    const headerKeysObj = {
      id: "id",
      appCode: "appCode",
      deviceId: "deviceId",
      contactable: "contactable",
      subscription_status: "subscription_status",
      has_downloaded_free_product_status: "has_downloaded_free_product_status",
      has_downloaded_iap_product_status: "has_downloaded_iap_product_status",
      unknown_tags: "unknown_tags"
    };
    const headerKeys = Object.keys(headerKeysObj);
    const header = headerKeys.join(",") + "\n";
    const rows = records2.map(
      (record) => headerKeys.map((key) => {
        const value = record[key];
        if (Array.isArray(value)) {
          return value.length > 0 ? value.join("|") : "";
        }
        return typeof value === "string" && value.includes(",") ? `"${value}"` : value;
      }).join(",")
    ).join("\n");
    import_fs3.default.writeFileSync(filePath, header + rows, "utf-8");
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Failed to write CSV file: ${error.message}`);
    } else {
      console.error("Failed to write CSV file: Unknown error occurred.");
    }
    process.exit(1);
  }
}

// src/fileUtils.ts
var import_fs4 = __toESM(require("fs"));
var import_path = __toESM(require("path"));
function findLogFiles(dir) {
  const logFiles2 = [];
  function traverse(currentDir) {
    try {
      const files = import_fs4.default.readdirSync(currentDir);
      files.forEach((file) => {
        const filePath = import_path.default.join(currentDir, file);
        const stat = import_fs4.default.statSync(filePath);
        if (stat.isDirectory()) {
          traverse(filePath);
        } else if (filePath.endsWith(".log")) {
          logFiles2.push(filePath);
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
  return logFiles2;
}

// src/parse.ts
var rootDir = process.argv[2];
if (!rootDir) {
  console.error("Please provide a root directory path.");
  process.exit(1);
}
var iniFilePath = import_path2.default.join(__dirname, "appCodes.ini");
var iniData = parseIniFile(iniFilePath);
var logFiles = findLogFiles(rootDir);
if (!logFiles.length) {
  console.error(`No log files found in the specified directory: ${rootDir}`);
  process.exit(1);
}
var id = 1;
var records = [];
logFiles.forEach((file) => {
  const logData = parseLogFile(file, iniData, id);
  records.push(...logData);
  id += logData.length;
});
var outputPath = import_path2.default.join(__dirname, "result.csv");
writeCsv(outputPath, records);
console.log(`Parsing complete. Output written to ${outputPath}`);
