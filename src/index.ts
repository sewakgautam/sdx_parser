import { readFileSync } from "fs";
import { parseSGX, ParsedData } from "./parser";

function loadSGX(filePath: string): ParsedData {
  const raw = readFileSync(filePath, "utf8");
  return parseSGX(raw);
}

export { parseSGX, loadSGX, ParsedData };
