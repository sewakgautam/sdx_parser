export interface ParsedData {
    [key: string]: Record<string, any>[];
}
export declare function parseSGX(text: string): ParsedData;
