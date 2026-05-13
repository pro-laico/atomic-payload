import { Icon } from './collections/icon';
import { createIconSetCollection } from './collections/iconSet';
/**
 * Payload plugin that contributes the Icon and (optionally) IconSet collections.
 * Pass `iconSetOptions.atomicHook` and `iconSetOptions.livePreviewUrl` to wire
 * the icon set into your project's atomic-hook / live preview flow.
 */
export const iconsPlugin = (opts = {}) => (config) => {
    const { enabled = true, iconCollection, includeIconSet = true, iconSetOptions } = opts;
    if (!enabled)
        return config;
    const icon = iconCollection ? { ...Icon, ...iconCollection } : Icon;
    const additions = [icon];
    if (includeIconSet)
        additions.push(createIconSetCollection(iconSetOptions));
    return { ...config, collections: [...(config.collections ?? []), ...additions] };
};
export default iconsPlugin;
//# sourceMappingURL=plugin.js.map