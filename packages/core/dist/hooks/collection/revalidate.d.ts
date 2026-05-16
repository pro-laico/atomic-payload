import type { CollectionBeforeChangeHook, CollectionAfterDeleteHook } from 'payload';
/**
 * Unified collection hook that handles all revalidations on document changes.
 * Uses collection slug to determine which revalidation logic to apply.
 */
export declare const revalidateCache: CollectionBeforeChangeHook;
/**
 * Unified collection hook that handles all revalidations on document deletion.
 * Uses collection slug to determine which revalidation logic to apply.
 */
export declare const revalidateCacheOnDelete: CollectionAfterDeleteHook;
//# sourceMappingURL=revalidate.d.ts.map