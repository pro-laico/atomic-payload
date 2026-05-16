/**
 * `@pro-laico/core` barrel — merged surface of the former ap-types,
 * ap-apf, and ap-utils packages.
 *
 * Server-only carve-outs (intentionally NOT re-exported from this barrel):
 *
 * - `revalidationLogger` from `./utilities/log` and `createGetCached` from
 *   `./utilities/cache/getCached` — both have a top-level `import 'server-only'`
 *   and would poison any client component that imports this barrel (e.g. for
 *   the `revalidateTag` server action). Import them from
 *   `@pro-laico/core/logger` and `@pro-laico/core/cache` on the server.
 *
 * - `getMeUser` from `./utilities/getMeUser` — imports `next/navigation`
 *   and would poison any server-only consumer (like payload.config.ts) that
 *   eagerly resolves this barrel under `--conditions=react-server`. Import it
 *   from `@pro-laico/core/auth/getMeUser` on the frontend when needed.
 */

// /////////////////////////////////////
// Kernel (PayloadAugment, Get<>, defaults, generic helpers)
// /////////////////////////////////////
export * from './kernel'

// /////////////////////////////////////
// APF — Atomic Payload Functions
// /////////////////////////////////////
export type * from './apf/types'

export { runAPF } from './apf/utilities/runAPF'
export { APField } from './apf/fields/index'
export { ActiveField } from './apf/fields/active'
export { apfRegistry, apfStorage, generateAPFFields } from './apf/fields/storage'
export {
  virtualAPFAfterReadFieldHook,
  virtualAPFBeforeChangeFieldHook,
  onArraySetAPFShallow,
  onUploadSetAPF,
} from './apf/hooks/field/apf'

// /////////////////////////////////////
// Revalidation plugin + JSON-schema plugin
// /////////////////////////////////////
export { revalidationPlugin, default } from './plugin'
export type { RevalidationPluginOptions } from './plugin'

export type * from './types/cache'
export {
  jsonSchemaPlugin,
  createJSONSchemaExtensions,
  atomicPayloadStoredDefinitions,
  default as jsonSchemaPluginDefault,
} from './jsonSchema'
export type {
  JSONSchemaPluginOptions,
  JSONSchemaExtensionFn,
  BlockRefs,
  GenerateBlocksTypeProps,
  GenerateBlocksTypeFn,
  ToJSONSchemaExtensionsFn,
  AtomicPayloadSchemaBlocks,
  CreateJSONSchemaExtensionsOptions,
} from './jsonSchema'

// /////////////////////////////////////
// Cache + revalidate-tag entry points (sync)
// /////////////////////////////////////
export { revalidateTag } from './utilities/revalidateTag'
export { mt } from './utilities/mergeTags'

export { revalidateCache as revalidateCacheCollection, revalidateCacheOnDelete } from './hooks/collection/revalidate'
export { revalidateCache as revalidateCacheGlobal } from './hooks/global/revalidate'
export { sanitizeAfterRead } from './hooks/collection/sanitize'

// /////////////////////////////////////
// Path constants — string literals consumed by Payload's importMap.
// /////////////////////////////////////
export const APFControlsPath = '@pro-laico/core/admin/controls'
export const APFieldPath = '@pro-laico/core/admin/field'
export const APFieldLabelPath = '@pro-laico/core/admin/label'
export const SiteTriggersPath = '@pro-laico/core/ui/root/siteTriggers'
export const SlugPath = '@pro-laico/core/ui/fields/slug'

// /////////////////////////////////////
// String utilities
// /////////////////////////////////////
export { toTitleCase } from './utilities/toTitleCase'
export { toKebabCase, type NameKebabOptions } from './utilities/toKebabCase'
export { default as deepMerge, isObject } from './utilities/deepMerge'
export { formatDurationString } from './utilities/formatDurationWithTokens'

// /////////////////////////////////////
// URL + meta helpers
// /////////////////////////////////////
export { GenerateMetaData } from './utilities/generateMetaData'
export { getServerSideURL, getClientSideURL } from './utilities/getURL'
export { getImageUrl } from './utilities/getImageURL'
export { generateLivePreviewPath } from './utilities/generatePreviewPath'

// /////////////////////////////////////
// Field-level hooks
// /////////////////////////////////////
export { formatSlug, formatSlugHook } from './hooks/field/formatSlug'
export { updateHrefHook } from './hooks/field/href'
export { updatePublishedAtHook } from './hooks/field/publishedAt'

// /////////////////////////////////////
// Reusable Payload field configs
// /////////////////////////////////////
export { slugField } from './fields/slug'
export { StorageTab } from './fields/storageTab'
export { ClassNameField } from './fields/className'
export { DevModeField } from './fields/devMode'
export { TestPathField } from './fields/testPath'
export { UniqueTitleField } from './fields/uniqueTitle'
