import type { Plugin, CollectionConfig } from 'payload';
export interface FontsPluginOptions {
    enabled?: boolean;
    fontOverride?: Partial<CollectionConfig>;
}
export declare const fontsPlugin: (opts?: FontsPluginOptions) => Plugin;
export default fontsPlugin;
//# sourceMappingURL=plugin.d.ts.map