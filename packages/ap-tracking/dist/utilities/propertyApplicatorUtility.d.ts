/** Shape of populated posthogProperty relationship rows (matches template Payload types). */
type PosthogProperty = {
    propertyObfuscated: string;
    valueObfuscated: string;
};
/**
 * Generates data attributes as props for server components
 * @param attributes Array of attribute objects containing property and value
 * @returns An object with data attributes as props
 */
export declare function postHogPropertyApplicator(attributes: (string | PosthogProperty)[] | null | undefined): Record<string, string> | undefined;
export {};
//# sourceMappingURL=propertyApplicatorUtility.d.ts.map