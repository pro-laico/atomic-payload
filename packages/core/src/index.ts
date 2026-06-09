/**
 * `@pro-laico/core` barrel — merged surface of the former ap-types,
 * ap-apf, and ap-utils packages.
 *
 * Server-only carve-outs (intentionally NOT re-exported from this barrel):
 *
 * - The caching primitive `withCache` from `./utilities/cache` has a top-level
 *   `import 'server-only'` and would poison any client component that imports
 *   this barrel (e.g. for the `revalidateTag` server action). Import it from
 *   `@pro-laico/core/cache` on the server.
 */

export { ActiveField } from './apf/fields/active'
export { APField } from './apf/fields/index'
export { generateAPFFields } from './apf/fields/storage'
export { onArraySetAPFShallow, onUploadSetAPF } from './apf/hooks/field/apf'
// /////////////////////////////////////
// APF — Atomic Payload Functions
// /////////////////////////////////////
export type { APArgs, APFieldWrapper, APFunction, BlockFieldExtensions, ClassNameFieldWrapper } from './apf/types'
export { runAPF } from './apf/utilities/runAPF'
export {
  createRevalidateCache,
  createRevalidateCacheAfterChange,
  createRevalidateCacheOnDelete,
  revalidateCache as revalidateCacheCollection,
  revalidateCacheCollectionAfterChange,
  revalidateCacheOnDelete,
} from './hooks/collection/revalidate'
export { revalidateCacheAfterChange as revalidateCacheGlobalAfterChange } from './hooks/global/revalidate'
export { createJSONSchemaExtensions, jsonSchemaPlugin } from './jsonSchema'
// /////////////////////////////////////
// Kernel (PayloadAugment, Get<>, defaults, generic helpers)
// /////////////////////////////////////
export * from './kernel'
// /////////////////////////////////////
// Plugin composer — returns the plugins plus a trailing finalizer that wires shared concerns
// /////////////////////////////////////
export { DEFAULT_ATOMIC_HOOK_SLUGS, pluginComposer } from './composer'
export type { AtomicWiringOptions, PluginComposerOptions, PluginComposerRevalidateOptions } from './composer'
// /////////////////////////////////////
// Revalidation plugin + JSON-schema plugin
// /////////////////////////////////////
export { default, revalidationPlugin } from './plugin'
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
export { updateHrefHook } from './hooks/field/href'
export { updatePublishedAtHook } from './hooks/field/publishedAt'
export { default as deepMerge } from './utilities/deepMerge'
// Generic helpers that used to live in `@pro-laico/atomic/hook/light`; moved here
// (the trunk) so core no longer runtime-depends on atomic. atomic re-exports them.
export { default as manualLogger } from './utilities/manualLogger'
export { default as sanitizeData } from './utilities/sanitizeData'
// /////////////////////////////////////
// URL + meta helpers
// /////////////////////////////////////
export { GenerateMetaData } from './utilities/generateMetaData'
export { generateLivePreviewPath } from './utilities/generatePreviewPath'
export { getServerSideURL } from './utilities/getURL'
// /////////////////////////////////////
// Hook + config composition
// /////////////////////////////////////
export { mergeCollection, mergeGlobal } from './utilities/mergeConfig'
export { mergeHooks } from './utilities/mergeHooks'
export { toKebabCase } from './utilities/toKebabCase'
// /////////////////////////////////////
// String utilities
// /////////////////////////////////////
export { toTitleCase } from './utilities/toTitleCase'
