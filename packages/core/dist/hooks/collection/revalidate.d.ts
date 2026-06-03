import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, CollectionBeforeChangeHook } from 'payload';
/** Args passed to per-slug `beforeChange` revalidation handlers. `data` and
 *  `originalDoc` are typed as `any` so handlers can reach into collection-specific
 *  fields without per-slug typing — they receive the raw shapes Payload passes to
 *  `beforeChange`. */
export type RevalidationContext = {
    data: any;
    originalDoc: any;
    draft: boolean;
    active: boolean;
};
/** Map of collection slug → handler that runs that collection's beforeChange revalidations. */
export type CollectionRevalidationHandlers = Record<string, (ctx: RevalidationContext) => Promise<void> | void>;
/** Args passed to per-slug `afterDelete` revalidation handlers. */
export type DeleteRevalidationContext = {
    doc: any;
};
export type CollectionDeleteRevalidationHandlers = Record<string, (ctx: DeleteRevalidationContext) => Promise<void> | void>;
/** Builds a `CollectionBeforeChangeHook` that dispatches to a per-slug handler. */
export declare const createRevalidateCache: (handlers: CollectionRevalidationHandlers) => CollectionBeforeChangeHook;
/**
 * Builds a `CollectionAfterChangeHook` that dispatches to a per-slug handler.
 *
 * Prefer this over {@link createRevalidateCache} (beforeChange) for plain
 * collections: revalidating in `beforeChange` busts the cache before the write
 * commits, so a concurrent read can re-cache the OLD document. `afterChange`
 * runs after commit, where `doc` carries the persisted state.
 */
export declare const createRevalidateCacheAfterChange: (handlers: CollectionRevalidationHandlers) => CollectionAfterChangeHook;
/** Builds a `CollectionAfterDeleteHook` that dispatches to a per-slug handler. */
export declare const createRevalidateCacheOnDelete: (handlers: CollectionDeleteRevalidationHandlers) => CollectionAfterDeleteHook;
/** Default `beforeChange` handlers — match the atomic-payload template's collection set. Override by calling `createRevalidateCache` directly. */
export declare const DEFAULT_REVALIDATION_HANDLERS: CollectionRevalidationHandlers;
/** Default `afterDelete` handlers — match the atomic-payload template's collection set. */
export declare const DEFAULT_DELETE_REVALIDATION_HANDLERS: CollectionDeleteRevalidationHandlers;
/**
 * Unified `beforeChange` hook bound to `DEFAULT_REVALIDATION_HANDLERS`. Use
 * `createRevalidateCache(handlers)` to bind a custom slug → handler map.
 */
export declare const revalidateCache: CollectionBeforeChangeHook;
/**
 * Unified `afterChange` hook bound to `DEFAULT_REVALIDATION_HANDLERS`. Prefer
 * this over {@link revalidateCache} for plain collections (see
 * {@link createRevalidateCacheAfterChange}).
 */
export declare const revalidateCacheCollectionAfterChange: CollectionAfterChangeHook;
/**
 * Unified `afterDelete` hook bound to `DEFAULT_DELETE_REVALIDATION_HANDLERS`.
 * Use `createRevalidateCacheOnDelete(handlers)` to bind a custom slug → handler map.
 */
export declare const revalidateCacheOnDelete: CollectionAfterDeleteHook;
//# sourceMappingURL=revalidate.d.ts.map