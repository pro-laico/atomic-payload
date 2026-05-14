/** Attaches the provided `atomicHook` to `beforeChange` for each slug (use `createAtomicHook` from this package). */
export const atomicHookPlugin = (opts) => (config) => {
    const { enabled = true, hook, collectionSlugs } = opts;
    if (!enabled)
        return config;
    const collections = (config.collections ?? []).map((collection) => {
        if (!collectionSlugs.includes(collection.slug))
            return collection;
        const next = { ...collection };
        const hooks = { ...(next.hooks ?? {}) };
        hooks.beforeChange = [...(hooks.beforeChange ?? []), hook];
        next.hooks = hooks;
        return next;
    });
    return { ...config, collections };
};
export default atomicHookPlugin;
//# sourceMappingURL=plugin.js.map