/**
 * Generates data attributes as props for server components
 * @param attributes Array of attribute objects containing property and value
 * @returns An object with data attributes as props
 */
export function postHogPropertyApplicator(attributes) {
    if (!Array.isArray(attributes) || attributes.length === 0)
        return;
    if (!attributes.every((attr) => typeof attr === 'object' && attr !== null && 'propertyObfuscated' in attr && 'valueObfuscated' in attr))
        return;
    return attributes.reduce((acc, attr) => {
        const { propertyObfuscated, valueObfuscated } = attr;
        acc[`data-ph-capture-attribute-${propertyObfuscated}`] = String(valueObfuscated);
        return acc;
    }, {});
}
//# sourceMappingURL=propertyApplicatorUtility.js.map