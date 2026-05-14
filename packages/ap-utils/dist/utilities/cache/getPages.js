'use server';
import 'server-only'; //DO NOT REMOVE
import { getPayload } from 'payload';
import cacheLogger from '../cacheLogger';
/** Gets all pages set in the pages collection and returns them as an array of strings. */
export const getCachedPages = async (configPromise, tag, draft) => {
    const payload = await getPayload({ config: configPromise });
    const where = { href: { exists: true } };
    if (!draft)
        Object.assign(where, { live: { equals: true } });
    const result = await payload.find({
        collection: 'pages',
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
//# sourceMappingURL=getPages.js.map