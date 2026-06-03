import { mergeHooks } from '@pro-laico/core';
import { Font } from './collections/font';
import { FontSet } from './globals/fontSet';
export const fontsPlugin = (opts = {}) => (config) => {
    const { enabled = true, fontOverride, global } = opts;
    if (!enabled)
        return config;
    const fontCollection = fontOverride
        ? {
            ...Font,
            ...fontOverride,
            // Deep-merge the nested keys a top-level spread would otherwise clobber.
            access: { ...Font.access, ...fontOverride.access },
            upload: fontOverride.upload && typeof fontOverride.upload === 'object' && typeof Font.upload === 'object'
                ? { ...Font.upload, ...fontOverride.upload }
                : (fontOverride.upload ?? Font.upload),
            hooks: fontOverride.hooks ? mergeHooks(Font.hooks ?? {}, fontOverride.hooks) : Font.hooks,
        }
        : Font;
    const collections = [...(config.collections ?? []), fontCollection];
    let globals = config.globals;
    if (global) {
        const merged = typeof global === 'object'
            ? {
                ...FontSet,
                ...global,
                // Append extra fields to the base font slots; deep-merge access.
                fields: [...FontSet.fields, ...(global.fields ?? [])],
                access: { ...FontSet.access, ...global.access },
            }
            : FontSet;
        globals = [...(config.globals ?? []), merged];
    }
    return { ...config, collections, globals };
};
export default fontsPlugin;
//# sourceMappingURL=plugin.js.map