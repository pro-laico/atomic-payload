import type { Plugin, CollectionConfig } from 'payload';
import { type IconSetCollectionOptions } from './collections/iconSet';
export interface IconsPluginOptions {
    /** When false, the plugin is a no-op. Defaults to true. */
    enabled?: boolean;
    /** Override the Icon collection (merged shallow). */
    iconCollection?: Partial<CollectionConfig>;
    /** When true (default), registers the IconSet collection. */
    includeIconSet?: boolean;
    /** Options forwarded to `createIconSetCollection`. */
    iconSetOptions?: IconSetCollectionOptions;
}
/**
 * Payload plugin that contributes the Icon and (optionally) IconSet collections.
 * Pass `iconSetOptions.atomicHook` and `iconSetOptions.livePreviewUrl` to wire
 * the icon set into your project's atomic-hook / live preview flow.
 */
export declare const iconsPlugin: (opts?: IconsPluginOptions) => Plugin;
export default iconsPlugin;
//# sourceMappingURL=plugin.d.ts.map