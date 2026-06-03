import 'server-only'; //DO NOT REMOVE
import { getPayload } from 'payload';
import cacheLogger from '../cacheLogger';
export const getCachedImage = async (configPromise, tag, tid, version) => {
    if (!tid)
        return '';
    const payload = await getPayload({ config: configPromise });
    // Only the URL is needed — fetch at depth 0 so related docs aren't populated
    // just to read a URL off the upload document.
    const image = await payload.findByID({ collection: 'images', id: tid, depth: 0 });
    if (!image)
        return;
    const url = version ? image.sizes?.[version]?.url || image.url : image.url;
    if (!url)
        return;
    cacheLogger({ tag, tid });
    return url;
};
//# sourceMappingURL=getImage.js.map