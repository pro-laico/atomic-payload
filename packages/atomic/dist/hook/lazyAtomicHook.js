'use server';
/**
 * Ready-made `atomicHook` whose dependencies (`getCached` / UnoCSS via
 * `ap-utils/cache/auto`, and the actions `ActionBlockStorageProcessor`) are
 * dynamically imported on first invocation. This keeps Payload config + zap
 * schema generation from pulling UnoCSS at module-load time.
 */
let inner;
export const atomicHook = async (args) => {
    if (!inner) {
        const [hookMod, procMod, cacheMod] = await Promise.all([
            import('./createAtomicHook'),
            import('@pro-laico/atomic/actions/processor'),
            import('@pro-laico/ap-utils/cache/auto'),
        ]);
        inner = hookMod.createAtomicHook({
            getCached: cacheMod.default,
            ActionBlockStorageProcessor: procMod.ActionBlockStorageProcessor,
        });
    }
    return inner(args);
};
//# sourceMappingURL=lazyAtomicHook.js.map