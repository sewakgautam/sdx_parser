function parseSGX(text) {
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
        const obj = {};
        headers.forEach((key, idx) => {
            let value = row[idx];

            // convert numbers
            if (!isNaN(value)) {
                value = Number(value);
            }

            obj[key] = value;
        });
        return obj;
    });

    return { [objectName]: data };
}

module.exports = { parseSGX };
