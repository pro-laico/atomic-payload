import type { CollectionConfig, GlobalConfig, Plugin } from 'payload';
export interface FontsPluginOptions {
    enabled?: boolean;
    /** Shallow-merged onto the `Font` collection (e.g. `upload.staticDir`, `access`, `hooks`). */
    fontOverride?: Partial<CollectionConfig>;
    /**
     * Register the standalone `fontSet` global — the active font selection for
     * projects that don't use `@pro-laico/styles`'s designSet. `true` registers
     * the default global; pass a partial `GlobalConfig` to shallow-merge overrides.
     * Defaults to `false` (the designSet's `font` group is the selection source).
     */
    global?: boolean | Partial<GlobalConfig>;
}
export declare const fontsPlugin: (opts?: FontsPluginOptions) => Plugin;
export default fontsPlugin;
//# sourceMappingURL=plugin.d.ts.map