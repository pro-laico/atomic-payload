import 'server-only'; //DO NOT REMOVE
import { getPayload } from 'payload';
import cacheLogger from '../cacheLogger';
/** Gets all site metadata from the siteMetaData global.*/
export const getCachedSiteMetadata = async (configPromise, tag, draft) => {
    const payload = await getPayload({ config: configPromise });
    const results = await payload.findGlobal({ slug: 'siteMetaData', draft });
    cacheLogger({ tag, draft });
    return results;
};
//# sourceMappingURL=getSiteMetadata.js.map