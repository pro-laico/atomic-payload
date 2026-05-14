/**
 * Registers the supplied action blocks on the Payload config.
 *
 * NOTE: the action blocks themselves currently live in the consuming template.
 * Once the dependency tree on template-only fields (KeySelectField,
 * ChangeKeyField, SetDataField, PerformSelectField) is also extracted, those
 * blocks will move into this package and `blocks` will default to a curated
 * set.
 */
export const actionsPlugin = (opts = {}) => (config) => {
    const { enabled = true, blocks = [] } = opts;
    if (!enabled || blocks.length === 0)
        return config;
    return { ...config, blocks: [...(config.blocks ?? []), ...blocks] };
};
export default actionsPlugin;
//# sourceMappingURL=plugin.js.map