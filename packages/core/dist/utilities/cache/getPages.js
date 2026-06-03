import 'server-only'; //DO NOT REMOVE
import { getPayload } from 'payload';
import cacheLogger from '../cacheLogger';
/** Factory: pass the slug of the pages collection to bind the pages-list getter to it. */
export const createGetCachedPages = (pagesSlug = 'pages') => {
    const collection = pagesSlug;
    return async (configPromise, tag, draft) => {
        const payload = await getPayload({ config: configPromise });
        const where = { href: { exists: true } };
        if (!draft)
            Object.assign(where, { live: { equals: true } });
        const result = await payload.find({
            collection,
            draft,
            where,
            limit: 0,
            overrideAccess: draft,
            select: { href: true },
        });
        const docs = result.docs;
        const returns = docs?.map(({ href }) => href).filter((href) => href != null) || [];
        cacheLogger({ tag, draft });
        return returns;
    };
};
export const getCachedPages = createGetCachedPages();
//# sourceMappingURL=getPages.js.map