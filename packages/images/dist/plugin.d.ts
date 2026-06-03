import type { CollectionConfig, Plugin } from 'payload';
export interface ImagesPluginOptions {
    /** When false, the plugin is a no-op. Defaults to true. */
    enabled?: boolean;
    /** When true (default), registers the Favicons collection alongside Images. */
    includeFavicons?: boolean;
    /**
     * Override for the Images collection. Top-level keys replace, but
     * `upload`/`access`/`admin` are deep-merged and `fields`/`hooks` are merged —
     * so a partial override can't silently drop the base `imageSizes`, `mimeTypes`,
     * `alt` field, or access rules.
     */
    imagesOverride?: Partial<CollectionConfig>;
    /** Override for the Favicons collection (same deep-merge semantics as {@link imagesOverride}). */
    faviconsOverride?: Partial<CollectionConfig>;
}
/**
 * Registers the bundled `Images` and `Favicons` upload collections.
 *
 * Notes on `@oversightstudio/blur-data-urls`: that plugin lives in the
 * consumer because pnpm doesn't hoist optional peers next to this package, so
 * a `require()` from here would silently fail. Wire it yourself after this
 * plugin runs:
 *
 * ```ts
 * import { Images } from '@pro-laico/images'
 * import { blurDataUrlsPlugin } from '@oversightstudio/blur-data-urls'
 *
 * plugins: [
 *   imagesPlugin({ enabled: true }),
 *   blurDataUrlsPlugin({ enabled: true, collections: [Images], blurOptions: {...} }),
 * ]
 * ```
 */
export declare const imagesPlugin: (opts?: ImagesPluginOptions) => Plugin;
export default imagesPlugin;
//# sourceMappingURL=plugin.d.ts.map