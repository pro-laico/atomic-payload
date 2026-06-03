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
export { ActiveField } from './apf/fields/active';
export { APField } from './apf/fields/index';
export { apfRegistry, apfStorage, generateAPFFields } from './apf/fields/storage';
export { onArraySetAPFShallow, onUploadSetAPF, virtualAPFAfterReadFieldHook, virtualAPFBeforeChangeFieldHook, } from './apf/hooks/field/apf';
export type * from './apf/types';
export type { APArgs, APFieldWrapper, BlockFieldExtensions, ClassNameFieldWrapper } from './apf/types';
export { runAPF } from './apf/utilities/runAPF';
export type { CollectionDeleteRevalidationHandlers, CollectionRevalidationHandlers, DeleteRevalidationContext, RevalidationContext, } from './hooks/collection/revalidate';
export { createRevalidateCache, createRevalidateCacheAfterChange, createRevalidateCacheOnDelete, DEFAULT_DELETE_REVALIDATION_HANDLERS, DEFAULT_REVALIDATION_HANDLERS, revalidateCache as revalidateCacheCollection, revalidateCacheCollectionAfterChange, revalidateCacheOnDelete, } from './hooks/collection/revalidate';
export { sanitizeAfterRead } from './hooks/collection/sanitize';
export { revalidateCache as revalidateCacheGlobal, revalidateCacheAfterChange as revalidateCacheGlobalAfterChange, } from './hooks/global/revalidate';
export type { AtomicPayloadSchemaBlocks, BlockRefs, CreateJSONSchemaExtensionsOptions, GenerateBlocksTypeFn, GenerateBlocksTypeProps, JSONSchemaExtensionFn, JSONSchemaPluginOptions, ToJSONSchemaExtensionsFn, } from './jsonSchema';
export { atomicPayloadStoredDefinitions, createJSONSchemaExtensions, default as jsonSchemaPluginDefault, jsonSchemaPlugin, } from './jsonSchema';
export * from './kernel';
export type { RevalidationPluginOptions } from './plugin';
export { default, revalidationPlugin } from './plugin';
export type * from './types/cache';
export { mt } from './utilities/mergeTags';
export { revalidateTag } from './utilities/revalidateTag';
export declare const APFControlsPath = "@pro-laico/core/admin/controls";
export declare const APFieldPath = "@pro-laico/core/admin/field";
export declare const APFieldLabelPath = "@pro-laico/core/admin/label";
export declare const SiteTriggersPath = "@pro-laico/core/ui/root/siteTriggers";
export declare const SlugPath = "@pro-laico/core/ui/fields/slug";
export { DevModeField } from './fields/devMode';
export { slugField } from './fields/slug';
export { StorageTab } from './fields/storageTab';
export { createTestPathField, TestPathField } from './fields/testPath';
export { UniqueTitleField } from './fields/uniqueTitle';
export { formatSlug, formatSlugHook } from './hooks/field/formatSlug';
export { updateHrefHook } from './hooks/field/href';
export { updatePublishedAtHook } from './hooks/field/publishedAt';
export { default as deepMerge, isObject } from './utilities/deepMerge';
export { formatDurationString } from './utilities/formatDurationWithTokens';
export { default as manualLogger } from './utilities/manualLogger';
export { default as sanitizeData } from './utilities/sanitizeData';
export { GenerateMetaData } from './utilities/generateMetaData';
export { generateLivePreviewPath } from './utilities/generatePreviewPath';
export { getImageUrl } from './utilities/getImageURL';
export { getClientSideURL, getServerSideURL } from './utilities/getURL';
export { mergeHooks } from './utilities/mergeHooks';
export { type NameKebabOptions, toKebabCase } from './utilities/toKebabCase';
export { toTitleCase } from './utilities/toTitleCase';
//# sourceMappingURL=index.d.ts.map