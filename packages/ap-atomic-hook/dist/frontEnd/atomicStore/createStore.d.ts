import type { AtomicStore, AtomicStoreInitialState } from '@pro-laico/ap-atomic-hook';
export declare const createAtomicStore: (initialState: AtomicStoreInitialState) => Omit<import("zustand").StoreApi<AtomicStore>, "setState" | "persist"> & {
    setState(partial: AtomicStore | Partial<AtomicStore> | ((state: AtomicStore) => AtomicStore | Partial<AtomicStore>), replace?: false | undefined): unknown;
    setState(state: AtomicStore | ((state: AtomicStore) => AtomicStore), replace: true): unknown;
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<AtomicStore, unknown, unknown>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: AtomicStore) => void) => () => void;
        onFinishHydration: (fn: (state: AtomicStore) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<AtomicStore, unknown, unknown>>;
    };
};
//# sourceMappingURL=createStore.d.ts.map