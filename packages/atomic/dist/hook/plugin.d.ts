import type { Plugin, CollectionBeforeChangeHook } from 'payload';
export interface AtomicHookPluginOptions {
    enabled?: boolean;
    /** The atomicHook implementation to attach to each listed collection. */
    hook: CollectionBeforeChangeHook;
    /** The collection slugs that should have the atomicHook in their `beforeChange` hooks array. */
    collectionSlugs: string[];
}
/** Attaches the provided `atomicHook` to `beforeChange` for each slug (use `createAtomicHook` from this package). */
export declare const atomicHookPlugin: (opts: AtomicHookPluginOptions) => Plugin;
export default atomicHookPlugin;
//# sourceMappingURL=plugin.d.ts.map