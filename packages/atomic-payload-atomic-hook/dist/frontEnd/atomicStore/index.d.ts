import { createAtomicStore } from './createStore';
import type { AtomicStore, AtomicStoreProviderProps } from '@pro-laico/atomic-payload-types';
export type AtomicStoreApi = ReturnType<typeof createAtomicStore>;
export declare const AtomicStoreContext: import("react").Context<(Omit<import("zustand").StoreApi<AtomicStore>, "setState" | "persist"> & {
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
}) | undefined>;
export declare const AtomicStoreProvider: ({ children, initialState }: AtomicStoreProviderProps) => import("react/jsx-runtime").JSX.Element;
export declare const useAtomicStore: <T>(selector: (store: AtomicStore) => T) => T;
export { createAtomicStore };
//# sourceMappingURL=index.d.ts.map