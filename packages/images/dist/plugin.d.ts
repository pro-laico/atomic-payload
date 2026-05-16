import type { Plugin, CollectionConfig } from 'payload';
export interface ImagesPluginOptions {
    /** When false, the plugin is a no-op. Defaults to true. */
    enabled?: boolean;
    /** When true (default), registers the Favicons collection alongside Images. */
    includeFavicons?: boolean;
    /** Shallow override for the Images collection. */
    imagesOverride?: Partial<CollectionConfig>;
    /** Shallow override for the Favicons collection. */
    faviconsOverride?: Partial<CollectionConfig>;
    /**
     * When true (default) the plugin will attempt to register the
     * `@oversightstudio/blur-data-urls` plugin on the Images collection. Set to
     * false if you wire it externally (or don't want blur data URLs).
     */
    blurDataUrls?: boolean;
    /** Options for the blur data urls plugin. */
    blurOptions?: {
        blur?: number;
        width?: number;
        height?: number | 'auto';
    };
}
export declare const imagesPlugin: (opts?: ImagesPluginOptions) => Plugin;
export default imagesPlugin;
//# sourceMappingURL=plugin.d.ts.map