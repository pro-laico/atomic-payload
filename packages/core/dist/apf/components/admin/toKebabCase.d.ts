export interface NameKebabOptions {
    addQuotes?: boolean;
    unicodeNormalization?: boolean;
    camelCaseHandling?: boolean;
    lowercase?: boolean;
    dashCollapse?: boolean;
    dashTrim?: boolean;
}
/**
 * Converts a string to kebab-case format by normalizing unicode characters, handling camelCase/PascalCase boundaries, and replacing non-alphanumeric characters with dashes.
 */
export declare function toKebabCase(input?: string | null, options?: NameKebabOptions): string;
//# sourceMappingURL=toKebabCase.d.ts.map