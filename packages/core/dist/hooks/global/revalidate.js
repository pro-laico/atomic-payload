import { revalidateTag } from '../../utilities/revalidateTag';
/** Dispatches the per-slug global revalidations for a given (draft) state. */
async function revalidateGlobalBySlug(slug, draft) {
    switch (slug) {
        case 'siteMetaData':
            await revalidateTag('site-metadata', draft);
            break;
        case 'tracking':
            await revalidateTag('tracking', draft);
            break;
        case 'settings':
            await revalidateTag('settings', draft);
            break;
        default:
            break;
    }
}
/**
 * Unified global hook that handles all revalidations on global changes.
 * Uses global slug to determine which revalidation logic to apply.
 *
 * @deprecated Prefer {@link revalidateCacheAfterChange}: revalidating in
 * `beforeChange` busts the cache before the write commits, so a concurrent read
 * can re-cache the OLD value. Kept for back-compat with existing wiring.
 */
export const revalidateCache = async ({ global, data, context }) => {
    if (context.isSeed)
        return;
    await revalidateGlobalBySlug(global.slug, data?._status === 'draft');
};
/**
 * `afterChange` variant — revalidates only after the write commits, where `doc`
 * carries the persisted state. Prefer this over {@link revalidateCache} (mirror
 * of the collection-side `revalidateCacheCollectionAfterChange`).
 */
export const revalidateCacheAfterChange = async ({ global, doc, context }) => {
    if (context.isSeed)
        return doc;
    await revalidateGlobalBySlug(global.slug, doc?._status === 'draft');
    return doc;
};
//# sourceMappingURL=revalidate.js.map