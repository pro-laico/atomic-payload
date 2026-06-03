import { Font } from './collections/font';
import { FontSet } from './globals/fontSet';
export const fontsPlugin = (opts = {}) => (config) => {
    const { enabled = true, fontOverride, global } = opts;
    if (!enabled)
        return config;
    const fontCollection = fontOverride ? { ...Font, ...fontOverride } : Font;
    const collections = [...(config.collections ?? []), fontCollection];
    let globals = config.globals;
    if (global) {
        const merged = typeof global === 'object' ? { ...FontSet, ...global } : FontSet;
        globals = [...(config.globals ?? []), merged];
    }
    return { ...config, collections, globals };
};
export default fontsPlugin;
//# sourceMappingURL=plugin.js.map