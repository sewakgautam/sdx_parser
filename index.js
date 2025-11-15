const fs = require("fs");
const { parseSGX } = require("./parser");

function loadSGX(filePath) {
    const raw = fs.readFileSync(filePath, "utf8");
    return parseSGX(raw);
}

module.exports = { parseSGX, loadSGX };
