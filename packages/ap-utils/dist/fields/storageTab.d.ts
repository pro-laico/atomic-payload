import type { TabAsField } from 'payload';
type StorageKey = 'classes' | 'forms' | 'actions';
/** Adds a `Storage` tab containing read-only JSON fields for atomic classes, forms, and actions. */
export declare const StorageTab: ({ filter }?: {
    filter?: StorageKey[];
}) => TabAsField;
export {};
//# sourceMappingURL=storageTab.d.ts.map