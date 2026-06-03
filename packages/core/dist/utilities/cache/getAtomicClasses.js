import 'server-only';
import { getPayload } from 'payload';
import cacheLogger from '../cacheLogger';
/** Factory: pass the slug of the pages collection to bind the getter to it. */
export const createGetCachedAtomicClasses = (pagesSlug = 'pages') => {
    const collection = pagesSlug;
    return async (configPromise, tag, draft) => {
        const payload = await getPayload({ config: configPromise });
        const and = [{ or: [{ storedAtomicClasses: { exists: true } }, { href: { equals: '/' } }] }];
        if (!draft)
            and.push({ live: { equals: true } });
        const where = { and };
        const res = await payload.find({
            collection,
            draft,
            where,
            limit: 0,
            pagination: false,
            depth: 0,
            select: { storedAtomicClasses: true },
        });
        const docs = res.docs;
        const result = docs.flatMap((doc) => doc.storedAtomicClasses ?? []);
        cacheLogger({ tag, draft });
        return result;
    };
};
/** Default getter bound to `pagesSlug = 'pages'`. */
export const getCachedAtomicClasses = createGetCachedAtomicClasses();
//# sourceMappingURL=getAtomicClasses.js.map