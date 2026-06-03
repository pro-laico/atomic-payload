import 'server-only'; //DO NOT REMOVE
import { getPayload } from 'payload';
import cacheLogger from '../cacheLogger';
import manualLogger from '../manualLogger';
import sanitizeData from '../sanitizeData';
/** Factory: pass the slug of the pages collection to bind the page-by-href getter to it. */
export const createGetCachedPageByHref = (pagesSlug = 'pages') => {
    const collection = pagesSlug;
    return async (configPromise, tag, tid, draft, pages) => {
        if (!pages.includes(tid)) {
            manualLogger(`[Warning] - Page not found - ${tid}`);
            return;
        }
        const payload = await getPayload({ config: configPromise });
        const where = { href: { equals: tid } };
        if (!draft)
            Object.assign(where, { live: { equals: true } });
        const results = await payload
            .find({
            collection,
            draft,
            where,
            limit: 1,
            depth: 1000,
            pagination: false,
            overrideAccess: draft,
            select: { meta: true, children: true, mainClassName: true },
        })
            .then((res) => res.docs?.[0] || null)
            .then((res) => sanitizeData(res));
        cacheLogger({ tag, tid, draft });
        return results;
    };
};
export const getCachedPageByHref = createGetCachedPageByHref();
//# sourceMappingURL=getPage.js.map