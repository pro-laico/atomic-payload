import type { StoredAtomicActions } from '@pro-laico/ap-types/schema';
/** Narrow getter used by `createCssProcessor` (e.g. app `getCached` / `unstable_cache` wrapper). */
export type AtomicHookGetCached = (tag: 'atomic-classes' | 'header' | 'footer' | 'designSet' | 'shortcutSet', draft: boolean) => Promise<unknown>;
/** Constructor for `@pro-laico/ap-actions/processor` (passed from the app to avoid pulling actions into this package's tsc graph). */
export type ActionBlockStorageProcessorClass = new () => {
    setKeyInitialValueByBlock: (args: {
        node: unknown;
    }) => void;
    before: (args: {
        node: object;
        path: string[];
    }) => void;
    after: (args: {
        node: object;
        path: string[];
    }) => void;
    getAllActionBlocks: () => StoredAtomicActions | undefined;
};
export type CreateAtomicHookOptions = {
    getCached: AtomicHookGetCached;
    ActionBlockStorageProcessor: ActionBlockStorageProcessorClass;
};
//# sourceMappingURL=atomicHookTypes.d.ts.map