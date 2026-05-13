import type { Plugin } from 'payload';
export interface RevalidationPluginOptions {
    /** When false, the plugin is a no-op. Defaults to true. */
    enabled?: boolean;
    /** Collection slugs to attach the beforeChange revalidate hook to. */
    collectionSlugs?: string[];
    /** Collection slugs to attach the afterDelete revalidate hook to. */
    deleteCollectionSlugs?: string[];
    /** Global slugs to attach the beforeChange revalidate hook to. */
    globalSlugs?: string[];
}
/**
 * Payload plugin that wires the unified collection + global revalidation hooks
 * to the slugs supplied in the options.
 */
export declare const revalidationPlugin: (opts?: RevalidationPluginOptions) => Plugin;
export default revalidationPlugin;
//# sourceMappingURL=plugin.d.ts.map