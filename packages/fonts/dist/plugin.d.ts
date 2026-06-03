import type { CollectionConfig, GlobalConfig, Plugin } from 'payload';
export interface FontsPluginOptions {
    enabled?: boolean;
    /**
     * Merged onto the `Font` collection. Top-level keys replace, but `upload`,
     * `access`, and `hooks` are deep-merged onto the base (so e.g.
     * `upload: { staticDir }` keeps the base `mimeTypes` whitelist and extra hooks
     * are appended, not dropped). `fields` still replaces wholesale.
     */
    fontOverride?: Partial<CollectionConfig>;
    /**
     * Register the standalone `fontSet` global — the active font selection for
     * projects that don't use `@pro-laico/styles`'s designSet. `true` registers
     * the default global; pass a partial `GlobalConfig` to override. `fields` are
     * APPENDED to the base font slots and `access` is deep-merged; other top-level
     * keys replace. Defaults to `false` (the designSet's `font` group is the source).
     */
    global?: boolean | Partial<GlobalConfig>;
}
export declare const fontsPlugin: (opts?: FontsPluginOptions) => Plugin;
export default fontsPlugin;
//# sourceMappingURL=plugin.d.ts.map