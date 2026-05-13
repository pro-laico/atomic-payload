/**
 * Registers the supplied DesignSet (and optionally ShortcutSet) collection
 * configs onto Payload.
 *
 * NOTE: the collection schemas still live in the consuming template because
 * they depend on template-only field utilities (APField wiring, ActiveField,
 * UniqueTitleField, generateLivePreviewPath, design-token row labels). A
 * subsequent release will move those dependencies and the schema definitions
 * into this package.
 */
export const designSetsPlugin = (opts = {}) => (config) => {
    const { enabled = true, designSet, shortcutSet } = opts;
    if (!enabled)
        return config;
    const additions = [];
    if (designSet)
        additions.push(designSet);
    if (shortcutSet)
        additions.push(shortcutSet);
    if (additions.length === 0)
        return config;
    return { ...config, collections: [...(config.collections ?? []), ...additions] };
};
export default designSetsPlugin;
//# sourceMappingURL=plugin.js.map