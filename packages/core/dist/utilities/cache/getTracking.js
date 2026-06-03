import 'server-only'; //DO NOT REMOVE
import { getPayload } from 'payload';
import cacheLogger from '../cacheLogger';
/** Gets tracking settings from payload about posthog, vercel and google tag manager. */
export const getCachedTracking = async (configPromise, tag, draft) => {
    const payload = await getPayload({ config: configPromise });
    const results = await payload.findGlobal({ slug: 'tracking', draft });
    cacheLogger({ tag, draft });
    return results;
};
//# sourceMappingURL=getTracking.js.map