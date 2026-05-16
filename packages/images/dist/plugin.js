import { Images } from './collections/images';
import { Favicons } from './collections/favicons';
export const imagesPlugin = (opts = {}) => (config) => {
    const { enabled = true, includeFavicons = true, imagesOverride, faviconsOverride, blurDataUrls = true, blurOptions = { blur: 18, width: 32, height: 'auto' }, } = opts;
    if (!enabled)
        return config;
    const images = imagesOverride ? { ...Images, ...imagesOverride } : Images;
    const favicons = faviconsOverride ? { ...Favicons, ...faviconsOverride } : Favicons;
    let next = { ...config, collections: [...(config.collections ?? []), images, ...(includeFavicons ? [favicons] : [])] };
    if (blurDataUrls) {
        try {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const mod = require('@oversightstudio/blur-data-urls');
            const blurPlugin = mod.blurDataUrlsPlugin({ enabled: true, collections: [images], blurOptions });
            const result = blurPlugin(next);
            if (result instanceof Promise) {
                console.warn('[ap-images] blurDataUrlsPlugin returned a Promise; skipping (plugin must be applied synchronously).');
            }
            else {
                next = result;
            }
        }
        catch {
            // @oversightstudio/blur-data-urls not installed; skip silently.
        }
    }
    return next;
};
export default imagesPlugin;
//# sourceMappingURL=plugin.js.map