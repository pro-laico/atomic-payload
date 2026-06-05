/**
 * `@pro-laico/core` barrel — merged surface of the former ap-types,
 * ap-apf, and ap-utils packages.
 *
 * Server-only carve-outs (intentionally NOT re-exported from this barrel):
 *
 * - `revalidationLogger` from `./utilities/log` and the caching primitive
 *   `withCache` from `./utilities/cache` — both have a top-level
 *   `import 'server-only'` and would poison any client component that imports
 *   this barrel (e.g. for the `revalidateTag` server action). Import them from
 *   `@pro-laico/core/logger` and `@pro-laico/core/cache` on the server.
 *
 * - `getMeUser` from `./utilities/getMeUser` — imports `next/navigation`
 *   and would poison any server-only consumer (like payload.config.ts) that
 *   eagerly resolves this barrel under `--conditions=react-server`. Import it
 *   from `@pro-laico/core/auth/getMeUser` on the frontend when needed.
 */

export { ActiveField } from './apf/fields/active'
export { APField } from './apf/fields/index'
export { apfRegistry, apfStorage, generateAPFFields } from './apf/fields/storage'
export {
  onArraySetAPFShallow,
  onUploadSetAPF,
  virtualAPFAfterReadFieldHook,
  virtualAPFBeforeChangeFieldHook,
} from './apf/hooks/field/apf'
// /////////////////////////////////////
// APF — Atomic Payload Functions
// /////////////////////////////////////
export type * from './apf/types'
export type { APArgs, APFieldWrapper, BlockFieldExtensions, ClassNameFieldWrapper } from './apf/types'
export { runAPF } from './apf/utilities/runAPF'
export type {
  CollectionDeleteRevalidationHandlers,
  CollectionRevalidationHandlers,
  DeleteRevalidationContext,
  RevalidationContext,
} from './hooks/collection/revalidate'
export {
  createRevalidateCache,
  createRevalidateCacheAfterChange,
  createRevalidateCacheOnDelete,
  DEFAULT_DELETE_REVALIDATION_HANDLERS,
  DEFAULT_REVALIDATION_HANDLERS,
  revalidateCache as revalidateCacheCollection,
  revalidateCacheCollectionAfterChange,
  revalidateCacheOnDelete,
} from './hooks/collection/revalidate'
export { sanitizeAfterRead } from './hooks/collection/sanitize'
export {
  revalidateCache as revalidateCacheGlobal,
  revalidateCacheAfterChange as revalidateCacheGlobalAfterChange,
} from './hooks/global/revalidate'
export type {
  AtomicPayloadSchemaBlocks,
  BlockRefs,
  CreateJSONSchemaExtensionsOptions,
  GenerateBlocksTypeFn,
  GenerateBlocksTypeProps,
  JSONSchemaExtensionFn,
  JSONSchemaPluginOptions,
  ToJSONSchemaExtensionsFn,
} from './jsonSchema'
export {
  atomicPayloadStoredDefinitions,
  createJSONSchemaExtensions,
  default as jsonSchemaPluginDefault,
  jsonSchemaPlugin,
} from './jsonSchema'
// /////////////////////////////////////
// Kernel (PayloadAugment, Get<>, defaults, generic helpers)
// /////////////////////////////////////
export * from './kernel'
export type { RevalidationPluginOptions } from './plugin'
// /////////////////////////////////////
// Revalidation plugin + JSON-schema plugin
// /////////////////////////////////////
export { default, revalidationPlugin } from './plugin'
export type * from './types/cache'
export { mt } from './utilities/mergeTags'
// /////////////////////////////////////
// Cache + revalidate-tag entry points (sync)
// /////////////////////////////////////
export { revalidateTag } from './utilities/revalidateTag'

// /////////////////////////////////////
// Path constants — string literals consumed by Payload's importMap.
// /////////////////////////////////////
export const APFControlsPath = '@pro-laico/core/admin/controls'
export const APFieldPath = '@pro-laico/core/admin/field'
export const APFieldLabelPath = '@pro-laico/core/admin/label'
export const SiteTriggersPath = '@pro-laico/core/ui/root/siteTriggers'
export const SlugPath = '@pro-laico/core/ui/fields/slug'

export { DevModeField } from './fields/devMode'
// /////////////////////////////////////
// Reusable Payload field configs
// /////////////////////////////////////
export { slugField } from './fields/slug'
export { StorageTab } from './fields/storageTab'
export { createTestPathField, TestPathField } from './fields/testPath'
export { UniqueTitleField } from './fields/uniqueTitle'
// /////////////////////////////////////
// Field-level hooks
// /////////////////////////////////////
export { formatSlug, formatSlugHook } from './hooks/field/formatSlug'
export { updateHrefHook } from './hooks/field/href'
export { updatePublishedAtHook } from './hooks/field/publishedAt'
export { default as deepMerge, isObject } from './utilities/deepMerge'
export { formatDurationString } from './utilities/formatDurationWithTokens'
// Generic helpers that used to live in `@pro-laico/atomic/hook/light`; moved here
// (the trunk) so core no longer runtime-depends on atomic. atomic re-exports them.
export { default as manualLogger } from './utilities/manualLogger'
export { default as sanitizeData } from './utilities/sanitizeData'
// /////////////////////////////////////
// URL + meta helpers
// /////////////////////////////////////
export { GenerateMetaData } from './utilities/generateMetaData'
export { generateLivePreviewPath } from './utilities/generatePreviewPath'
export { getImageUrl } from './utilities/getImageURL'
export { getClientSideURL, getServerSideURL } from './utilities/getURL'
// /////////////////////////////////////
// Hook + config composition
// /////////////////////////////////////
export { mergeCollection, mergeGlobal } from './utilities/mergeConfig'
export { mergeHooks } from './utilities/mergeHooks'
export { type NameKebabOptions, toKebabCase } from './utilities/toKebabCase'
// /////////////////////////////////////
// String utilities
// /////////////////////////////////////
export { toTitleCase } from './utilities/toTitleCase'
