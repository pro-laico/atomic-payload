export { revalidationPlugin, default } from './plugin';
export { revalidateTag } from './utilities/revalidateTag';
export { mt } from './utilities/mergeTags';
// `revalidationLogger` from './utilities/log' and `createGetCached` from
// './utilities/getCached' are intentionally NOT re-exported here — both have
// a top-level `import 'server-only'` and would poison any client component
// that imports this barrel (e.g. for the `revalidateTag` server action).
// Import them directly from '@pro-laico/ap-utils/logger' and
// '@pro-laico/ap-utils/getCached' on the server when needed.
export { revalidateCache as revalidateCacheCollection, revalidateCacheOnDelete } from './hooks/collection/revalidate';
export { revalidateCache as revalidateCacheGlobal } from './hooks/global/revalidate';
export { toTitleCase } from './utilities/toTitleCase';
export { toKebabCase } from './utilities/toKebabCase';
export { default as deepMerge, isObject } from './utilities/deepMerge';
export { formatDurationString } from './utilities/formatDurationWithTokens';
export { GenerateMetaData } from './utilities/generateMetaData';
export { getServerSideURL, getClientSideURL } from './utilities/getURL';
export { formatSlug, formatSlugHook } from './hooks/field/formatSlug';
export { updateHrefHook } from './hooks/field/href';
export { updatePublishedAtHook } from './hooks/field/publishedAt';
export { slugField } from './fields/slug';
//# sourceMappingURL=index.js.map