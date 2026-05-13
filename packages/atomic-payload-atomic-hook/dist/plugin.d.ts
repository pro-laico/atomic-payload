import type { Plugin, CollectionBeforeChangeHook } from 'payload';
export interface AtomicHookPluginOptions {
    enabled?: boolean;
    /** The atomicHook implementation to attach to each listed collection. */
    hook: CollectionBeforeChangeHook;
    /** The collection slugs that should have the atomicHook in their `beforeChange` hooks array. */
    collectionSlugs: string[];
}
/**
 * Registers a caller-supplied `atomicHook` on every collection slug in
 * `collectionSlugs`. The hook itself currently lives in the consuming template
 * because it directly references the template's ActionBlockStorageProcessor,
 * cssProcessor, processDesignSet, etc. Those processors will move into this
 * package once their template-only dependencies (action blocks, design-set
 * fields) are also extracted.
 */
export declare const atomicHookPlugin: (opts: AtomicHookPluginOptions) => Plugin;
export default atomicHookPlugin;
//# sourceMappingURL=plugin.d.ts.map