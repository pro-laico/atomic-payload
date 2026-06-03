import 'server-only'; //DO NOT REMOVE
import { getPayload } from 'payload';
import cacheLogger from '../cacheLogger';
/** Factory: pass the slug of the backend forms collection. */
export const createGetCachedBackendForms = (formsSlug = 'forms') => {
    const collection = formsSlug;
    return async (configPromise, tag) => {
        const payload = await getPayload({ config: configPromise });
        const results = await payload.find({ draft: false, collection, limit: 0, pagination: false }).then((res) => res.docs.map((doc) => doc));
        cacheLogger({ tag });
        return results;
    };
};
/** Factory: pass the slug of the pages collection to scan for atomic forms. */
export const createGetCachedAtomicForms = (pagesSlug = 'pages') => {
    const collection = pagesSlug;
    return async (configPromise, tag, draft) => {
        const payload = await getPayload({ config: configPromise });
        const where = { storedAtomicForms: { exists: true } };
        if (!draft)
            Object.assign(where, { live: { equals: true } });
        const results = await payload
            .find({
            draft,
            collection,
            limit: 0,
            pagination: false,
            where,
            select: { storedAtomicForms: true },
        })
            .then((res) => res.docs
            .map((doc) => doc.storedAtomicForms)
            .filter(Boolean)
            .flat()
            .filter((form) => form !== undefined));
        cacheLogger({ tag, draft });
        return results;
    };
};
export const getCachedBackendForms = createGetCachedBackendForms();
export const getCachedAtomicForms = createGetCachedAtomicForms();
/** Used in Atomic Blocks Dynamic Form Submission Only */
export const getCachedAllForms = async (_configPromise, tag, draft, atomicForms, backendForms) => {
    // Add id from forms to atomicForms by matching backendForm
    const mergedAtomicForms = atomicForms.map((atomicForm) => {
        const matchingForm = backendForms.find((form) => form.title === atomicForm.backendForm);
        return { ...atomicForm, backendFormID: matchingForm ? matchingForm.id : '' };
    });
    cacheLogger({ tag, draft });
    return mergedAtomicForms;
};
//# sourceMappingURL=getForms.js.map