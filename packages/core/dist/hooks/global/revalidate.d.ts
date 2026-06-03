import type { GlobalAfterChangeHook, GlobalBeforeChangeHook } from 'payload';
/**
 * Unified global hook that handles all revalidations on global changes.
 * Uses global slug to determine which revalidation logic to apply.
 *
 * @deprecated Prefer {@link revalidateCacheAfterChange}: revalidating in
 * `beforeChange` busts the cache before the write commits, so a concurrent read
 * can re-cache the OLD value. Kept for back-compat with existing wiring.
 */
export declare const revalidateCache: GlobalBeforeChangeHook;
/**
 * `afterChange` variant — revalidates only after the write commits, where `doc`
 * carries the persisted state. Prefer this over {@link revalidateCache} (mirror
 * of the collection-side `revalidateCacheCollectionAfterChange`).
 */
export declare const revalidateCacheAfterChange: GlobalAfterChangeHook;
//# sourceMappingURL=revalidate.d.ts.map