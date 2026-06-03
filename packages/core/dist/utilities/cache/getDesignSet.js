import 'server-only'; //DO NOT REMOVE
import { getPayload } from 'payload';
import cacheLogger from '../cacheLogger';
/** Gets the active design set. */
export const getCachedDesignSet = async (configPromise, tag, draft) => {
    const payload = await getPayload({ config: configPromise });
    const result = await payload.find({ collection: tag, draft, where: { active: { equals: true } }, limit: 1 }).then((res) => res.docs[0] || null);
    cacheLogger({ tag, draft });
    return result;
};
//# sourceMappingURL=getDesignSet.js.map