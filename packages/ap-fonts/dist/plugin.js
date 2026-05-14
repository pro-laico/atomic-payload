import { Font } from './collections/font';
export const fontsPlugin = (opts = {}) => (config) => {
    const { enabled = true, fontOverride } = opts;
    if (!enabled)
        return config;
    const merged = fontOverride ? { ...Font, ...fontOverride } : Font;
    return { ...config, collections: [...(config.collections ?? []), merged] };
};
export default fontsPlugin;
//# sourceMappingURL=plugin.js.map