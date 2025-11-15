// index.d.ts
declare module 'sdx-parser' {
  /**
   * Parses SGX format text into a JavaScript object
   * @param text - The SGX format string to parse
   * @returns Parsed object with data
   * @throws Error if format is invalid
   */
  export function parseSGX(text: string): Record<string, any[]>;

  /**
   * Loads and parses an SGX file from the filesystem
   * @param filePath - Path to the .sgx file
   * @returns Parsed object with data
   * @throws Error if file not found or format is invalid
   */
  export function loadSGX(filePath: string): Record<string, any[]>;
}
