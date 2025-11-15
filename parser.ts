// parser.ts
interface ParsedData {
  [key: string]: Record<string, any>[];
}

export function parseSGX(text: string): ParsedData {
  const lines = text
    .split("\n")
    .map(l => l.trim())
    .filter(l => l.length > 0);

  if (!lines[0].endsWith(":")) {
    throw new Error("Invalid SGX format: first line must end with ':'");
  }

  const objectName = lines[0].replace(":", "").trim();

  const headers = lines[1].split(",").map(h => h.trim());

  const rows = lines.slice(2).map(line =>
    line.split(",").map(v => v.trim())
  );

  const data = rows.map(row => {
    const obj: Record<string, any> = {};
    headers.forEach((key, idx) => {
      let value: string | number = row[idx];

      // convert numbers
      if (!isNaN(Number(value))) {
        value = Number(value);
      }

      obj[key] = value;
    });
    return obj;
  });

  return { [objectName]: data };
}
