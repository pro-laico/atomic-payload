'use server';
import 'server-only'; //DO NOT REMOVE
import { getPayload } from 'payload';
import cacheLogger from '../cacheLogger';
/** Gets the active header. */
export const getCachedHeader = async (configPromise, tag, draft) => {
    const payload = await getPayload({ config: configPromise });
    const results = await payload
        .find({ collection: tag, draft, limit: 1, pagination: false, where: { active: { equals: true } } })
        .then((res) => res.docs[0]);
    cacheLogger({ tag, draft });
    return results;
};
//# sourceMappingURL=getHeader.js.map