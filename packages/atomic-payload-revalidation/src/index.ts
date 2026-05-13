export { revalidationPlugin, default } from './plugin'
export type { RevalidationPluginOptions } from './plugin'

export { revalidateTag } from './utilities/revalidateTag'
export { mt } from './utilities/mergeTags'
// `revalidationLogger` from './utilities/log' is intentionally NOT re-exported
// here — it has a top-level `import 'server-only'` and would poison any client
// component that imports this barrel (e.g. for the `revalidateTag` server
// action). Import it directly from
// '@pro-laico/atomic-payload-revalidation/logger' on the server when needed.

export { revalidateCache as revalidateCacheCollection, revalidateCacheOnDelete } from './hooks/collection/revalidate'
export { revalidateCache as revalidateCacheGlobal } from './hooks/global/revalidate'
