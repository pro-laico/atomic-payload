'use server';
import 'server-only';
import { getPayload } from 'payload';
import cacheLogger from '../cacheLogger';
export const getCachedAtomicClasses = async (configPromise, tag, draft) => {
    const payload = await getPayload({ config: configPromise });
    const and = [{ or: [{ storedAtomicClasses: { exists: true } }, { href: { equals: '/' } }] }];
    if (!draft)
        and.push({ live: { equals: true } });
    const where = { and };
    const res = await payload.find({ collection: 'pages', draft, where, limit: 0, pagination: false, depth: 0, select: { storedAtomicClasses: true } });
    const docs = res.docs;
    const result = docs.flatMap((doc) => doc.storedAtomicClasses ?? []);
    cacheLogger({ tag, draft });
    return result;
};
//# sourceMappingURL=getAtomicClasses.js.map