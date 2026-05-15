/**
 * Hand-written front-end / atomic-store types.
 */
import type { ReactNode } from 'react';
import type { ImplementedStorageTypes } from './payload-augment';
type PersistedProp = boolean | null | undefined;
export type AtomicStoreInitialState = {
    version: number;
};
export interface AtomicStoreProviderProps {
    children: ReactNode;
    initialState: AtomicStoreInitialState;
}
export type BaseSlice = {
    hydrated: boolean;
    setHydrated: (hydrated: boolean) => void;
};
export interface DynamicSlice {
    memory: Record<string, ImplementedStorageTypes>;
    persisted: Record<string, ImplementedStorageTypes>;
    removeValue: (key: string, persisted: PersistedProp) => void;
    getValue: (key: string, persisted: PersistedProp) => ImplementedStorageTypes;
    setValue: (key: string, value: ImplementedStorageTypes, persisted: PersistedProp) => void;
}
export interface ConsentPreferences {
    functional: boolean;
    security: boolean;
    analytics: boolean;
    marketing: boolean;
    userData: boolean;
    adPersonalization: boolean;
    contentPersonalization: boolean;
}
export interface ConsentSlice {
    hasConsented: boolean | null;
    preferences: ConsentPreferences;
    previouslyConsented: boolean | null;
    declineCookies: () => void;
    acceptCookies: (preferences?: Partial<ConsentPreferences>) => void;
    setPreference: (category: keyof ConsentPreferences, value: boolean) => void;
}
export type AtomicStore = BaseSlice & ConsentSlice & DynamicSlice;
export {};
//# sourceMappingURL=store.d.ts.map