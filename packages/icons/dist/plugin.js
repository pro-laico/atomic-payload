import { createIconCollection } from './collections/icon';
import { createIconSetCollection } from './collections/iconSet';
/**
 * Payload plugin that contributes the `Icon` upload collection and (by
 * default) the `IconSet` grouping collection.
 *
 * - **`Icon`** — single-SVG uploads. Runs `formatSVGHook` (svgo + viewBox
 *   tightening) on `beforeChange`, plus the standard cache-revalidation hooks
 *   on save and delete.
 * - **`IconSet`** — named buckets of icons, with versions/drafts, APF
 *   `active` toggle, and optional atomicHook + live preview wiring.
 *
 * Both collections support additive extension — see
 * {@link IconCollectionOptions} and {@link IconSetCollectionOptions}. User
 * hooks always run AFTER the built-ins, and extra fields land in the most
 * natural location for their shape.
 *
 * @example
 * ```ts
 * import { buildConfig } from 'payload'
 * import { iconsPlugin } from '@pro-laico/icons'
 *
 * export default buildConfig({
 *   plugins: [
 *     iconsPlugin({
 *       iconSetOptions: {
 *         atomicHook,
 *         livePreviewUrl,
 *         fields: [{ name: 'description', type: 'textarea' }],
 *       },
 *     }),
 *   ],
 * })
 * ```
 */
export const iconsPlugin = (opts = {}) => (config) => {
    const { enabled = true, iconOptions, iconCollection, includeIconSet = true, iconSetOptions } = opts;
    if (!enabled)
        return config;
    const built = createIconCollection(iconOptions);
    const icon = iconCollection ? { ...built, ...iconCollection } : built;
    const additions = [icon];
    if (includeIconSet)
        additions.push(createIconSetCollection(iconSetOptions));
    return { ...config, collections: [...(config.collections ?? []), ...additions] };
};
export default iconsPlugin;
//# sourceMappingURL=plugin.js.map