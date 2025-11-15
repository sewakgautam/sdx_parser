"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSGX = void 0;
exports.loadSGX = loadSGX;
const fs_1 = require("fs");
const parser_1 = require("./parser");
Object.defineProperty(exports, "parseSGX", { enumerable: true, get: function () { return parser_1.parseSGX; } });
function loadSGX(filePath) {
    const raw = (0, fs_1.readFileSync)(filePath, "utf8");
    return (0, parser_1.parseSGX)(raw);
}
