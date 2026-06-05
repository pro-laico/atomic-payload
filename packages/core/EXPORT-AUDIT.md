# `@pro-laico/core` Public Export Surface Audit

Barrel: 95 → keep 55, remove 40. Subpaths: 21 → keep 17, remove 4.

Audit-only. Method: enumerate every barrel symbol in `src/index.ts` (including the
`export *`/`export type *` wildcards from `./kernel`, `./apf/types`, `./types/cache`)
and every `./subpath` in `package.json` `exports` + `publishConfig.exports`; then grep
the whole repo for real external consumers (imports in `templates/**`, `examples/**`,
or another `packages/*/src/**`). Ignored as non-consumers: `packages/core/src` itself
(internal relative imports do not justify a public export), `dist/**`, generated
`*payload-types*.{ts,d.ts}`, comments, and `.md`/`.mdx`. The untracked, gitignored
`packages/create-atomic-payload/scaffolds/**` is the create-CLI's copied template
output; it mirrors `templates/atomic-payload` and is also partly **stale** (it imports
removed APIs like `@pro-laico/core/cache/auto` and `createGetCached` that no longer
exist in the package). It is NOT used as independent evidence — every live scaffold
import has an equivalent in `templates/**` or `examples/**`.

Counting note: the barrel re-exports three wildcard modules. Their members are counted
individually below (kernel: 16 types; `./apf/types`: 16 types; `./types/cache`: 8
types), which is why the headline barrel count is larger than the number of `export`
lines in `index.ts`.

**Removing an export does NOT delete the source module.** Internal relative imports
(`./apf/fields/storage`, `./hooks/...`, etc.) keep resolving, zap-style side-effect
registration is unaffected, and `payload generate:types` / `core-augment-types` keep
working. The `PayloadAugment` interface, the `./config` registry entry, and the runtime
`importMap` UI subpaths (`./admin/*`, `./ui/*`) MUST stay regardless of barrel changes.

---

## Keep

### Barrel — value exports

- **`APField`** — APF field factory; the most-used core export. `packages/styles/src/fields/value.ts:8`, `packages/atomic/src/actions/fields/setData.ts:1`, `packages/site/src/collections/pages/collection.ts:9`.
- **`ActiveField`** — preset active-checkbox field. `packages/site/src/collections/footers/collection.ts:7`, `packages/styles/src/designSet/tabs/settings.ts:2`, `packages/icons/src/collections/iconSet.ts:4`.
- **`generateAPFFields`** — builds the hidden APF storage checkboxes. `packages/site/src/globals/siteMetaData.ts:3`, `packages/site/src/collections/pages/tabs/settings.ts:4`.
- **`onArraySetAPFShallow`** — array-field APF trigger hook. `packages/styles/src/fields/value.ts:1`, `packages/styles/src/designSet/tabs/colors.ts:5`.
- **`onUploadSetAPF`** — upload-field APF trigger hook. `packages/site/src/collections/pages/tabs/SEO.ts:3`, `packages/images/src/fields/favicon.ts:3`.
- **`runAPF`** — read APF "changed" flag from request context. `packages/atomic/src/hook/createAtomicHook.ts:6`.
- **`revalidateCacheCollection`** (alias of `revalidateCache`) — bound beforeChange revalidate hook. `templates/atomic-payload/src/plugins/formBuilder.ts:3`.
- **`revalidateCacheCollectionAfterChange`** — bound afterChange revalidate hook. `packages/images/src/collections/images.ts:2`, `packages/icons/src/collections/icon.ts:5`.
- **`revalidateCacheOnDelete`** — bound afterDelete revalidate hook. `packages/icons/src/collections/iconSet.ts`, `packages/styles/src/designSet/createCollection.ts:2`, `packages/site/src/collections/headers/collection.ts`.
- **`revalidateCacheGlobalAfterChange`** — global afterChange revalidate hook. `packages/tracking/src/globals/tracking.ts:2`, `packages/site/src/globals/settings.ts:2`.
- **`jsonSchemaPlugin`** — JSON-schema generation plugin. `templates/atomic-payload/src/plugins/jsonSchema.ts:1`.
- **`revalidationPlugin`** — revalidation Payload plugin. `templates/atomic-payload/src/plugins/index.ts:7`.
- **`revalidateTag`** — sync revalidate-tag entry point. `examples/styles-only/src/payload.config.ts:9`, `packages/styles/src/hooks/cssHook.ts:1`, `packages/atomic/src/hook/createAtomicHook.ts:6`.
- **`APFControlsPath`** — admin importMap path constant. `packages/site/src/collections/pages/collection.ts:8`, `packages/styles/src/designSet/createCollection.ts:2`, `templates/atomic-payload/src/ui/index.ts:8`.
- **`APFieldPath`** — admin importMap path constant. `templates/atomic-payload/src/ui/index.ts:8`.
- **`APFieldLabelPath`** — admin importMap path constant. `templates/atomic-payload/src/ui/index.ts:8`.
- **`SiteTriggersPath`** — admin importMap path constant. `templates/atomic-payload/src/ui/index.ts:7`.
- **`SlugPath`** — admin importMap path constant. `packages/site/src/collections/pages/collection.ts:13`, `templates/atomic-payload/src/ui/index.ts:7`.
- **`DevModeField`** — preset dev-mode checkbox field. `packages/site/src/collections/pages/tabs/settings.ts:4`, `packages/site/src/collections/headers/collection.ts:9`.
- **`slugField`** — slug + checkbox field pair. `packages/site/src/collections/pages/collection.ts:15`.
- **`StorageTab`** — preset hidden storage tab. `packages/site/src/collections/pages/collection.ts:14` (note: `packages/styles` defines its own local `StorageTab`, not this one).
- **`TestPathField`** — preset relationship field. `packages/styles/src/designSet/tabs/settings.ts:2`, `packages/site/src/collections/headers/collection.ts:14`, `templates/atomic-payload/src/plugins/icons.ts:2`.
- **`UniqueTitleField`** — preset unique-title field factory. `packages/site/src/collections/headers/collection.ts:15`, `packages/styles/src/shortcutSet/tabs/settings.ts:3`.
- **`updateHrefHook`** — field hook. `packages/site/src/collections/pages/collection.ts:16`.
- **`updatePublishedAtHook`** — field hook. `packages/site/src/collections/pages/collection.ts:17`.
- **`deepMerge`** — recursive merge util. `packages/styles/src/cssProcessor.ts:1`, `packages/atomic/src/actions/fields/setData.ts:1`.
- **`manualLogger`** — console logger util. `packages/atomic/src/hook/unsetActive.ts:1`, `packages/site/src/cache/index.ts:6`.
- **`sanitizeData`** — strips internal/null fields util. `packages/atomic/src/hook/createAtomicHook.ts:6`, `packages/site/src/cache/index.ts:6`.
- **`GenerateMetaData`** — Next metadata builder. `templates/atomic-payload/src/app/(frontend)/[...slug]/page.tsx:2`.
- **`generateLivePreviewPath`** — live-preview URL builder. `templates/atomic-payload/src/plugins/styles.ts:4`, `examples/styles-only/src/collections/pages.ts:2`, `packages/site/src/collections/pages/collection.ts:11`.
- **`getServerSideURL`** — server URL util. `examples/styles-only/src/payload.config.ts:9`, `templates/atomic-payload/src/payload.config.ts:9`, `packages/site/src/cache/index.ts:6`.
- **`mergeCollection`** — collection-config merge util. `packages/mux-video/src/plugin.ts:4`, `packages/images/src/plugin.ts:3`, `packages/fonts/src/plugin.ts:3`.
- **`mergeGlobal`** — global-config merge util. `packages/fonts/src/plugin.ts:3`.
- **`mergeHooks`** — per-phase hook merge util. `packages/icons/src/collections/icon.ts:5`, `packages/icons/src/collections/iconSet.ts:8`.
- **`toKebabCase`** — string util. `packages/atomic/src/children/hooks/useActions/useDaToText.ts:3`.
- **`toTitleCase`** — string util. `packages/icons/src/cache/index.ts:6`, `packages/styles/src/ui/rowLabels/color.tsx:2`.

### Barrel — type exports

- **`APArgs`** — APF field arg type. `packages/styles/src/fields/className.ts:1`, `packages/atomic/src/actions/fields/persisted.ts:1`.
- **`APFieldWrapper`** — APF field wrapper signature. `packages/atomic/src/actions/fields/changeKey.ts:2`, `packages/atomic/src/children/fields/defaultOpen.ts:2`.
- **`ClassNameFieldWrapper`** — styles className-field wrapper type. `packages/atomic/src/children/plugin.ts:4`, `packages/styles/src/fields/className.ts:1`.
- **`BlockFieldExtensions`** — child-block field-extension type. `packages/mux-video/src/blocks/videoChild/block.ts:2`, `packages/icons/src/blocks/iconChild/block.ts:2`, `packages/richtext/src/blocks/richText/block.ts:2`, `packages/atomic/src/children/buildChildBlocks.ts:7`.
- **`APFunction`** — APF name union (from `./apf/types`). `packages/icons/src/collections/iconSet.ts:1`, `packages/site/src/collections/pages/tabs/settings.ts:4`, `packages/styles/src/designSet/createCollection.ts:1`, `packages/images/src/fields/favicon.ts:4`.

### Barrel — kernel types (`export * from './kernel'`)

- **`PayloadAugment`** — the type-augmentation target interface; consumer projects `declare module '@pro-laico/core'` against it. This IS the schema-augment entry. `templates/atomic-payload/src/payload-types.augment.d.ts:6`, `examples/icons-only/src/payload-types.augment.d.ts:6` (generated, but the augmentation target must stay public).
- **`Get`** — augment lookup helper. `packages/zap/src/types/payload-augment.ts:4`, `packages/site/src/types/payload-augment.ts:4` (every package's `payload-augment.ts`).
- **`ExtractOrDefault`** — discriminant-preserving Extract. `packages/atomic/src/actions/types/index.ts:6`.
- **`DefaultRecord`** — augment fallback. `packages/images/src/types/payload-augment.ts:4`, `packages/tracking/src/types/payload-augment.ts:4`.
- **`DefaultBlock`** — augment fallback. `packages/atomic/src/children/types/payload-augment.ts:4`, `packages/atomic/src/forms/types/payload-augment.ts:4`.
- **`DefaultActionFn`** — augment fallback. `packages/atomic/src/actions/types/payload-augment.ts:6`.
- **`Config`** — root config stub. `packages/atomic/src/forms/types/index.ts:1`, `packages/styles/src/types/css.ts:6`.
- **`StringKeyOf`** — generic helper. `packages/atomic/src/children/types/index.ts:7`.
- **`DotNestedKeys`** — generic helper. `packages/atomic/src/children/types/index.ts:7`.
- **`AllBlocks`** — all-blocks union. `packages/atomic/src/children/types/index.ts:7`.
- **`CollectionBySlug`** — collection-by-slug helper. `packages/atomic/src/hook/createAtomicHook.ts:5`.
- **`BlockBySlug`** — block-by-slug helper. `packages/atomic/src/children/types/index.ts:7`.

### Subpaths

- **`.`** (root barrel) — primary entry; consumed everywhere. `packages/site/src/collections/pages/collection.ts:18`.
- **`./config`** — `registerPayloadConfig` / `getPayloadConfig` registry; the server-only config-registry entry (NOT in the barrel). `templates/atomic-payload/src/instrumentation.ts:12`, `examples/icons-only/src/instrumentation.ts:13`, `packages/styles/src/cache/index.ts:6`, `packages/images/src/cache/index.ts:6`.
- **`./cache/primitives`** — `withCache` + `mt`. `packages/styles/src/cache/index.ts:7`, `packages/images/src/cache/index.ts:7`, `packages/icons/src/cache/index.ts:8`, `packages/atomic/src/cache/index.ts:7`, `packages/tracking/src/cache/index.ts:7`.
- **`./payload`** — `getPayloadInstance`. `packages/atomic/src/forms/submitForm/serverFunction.ts:6`.
- **`./next/preview`** — `createPreviewRouteHandler`. `templates/atomic-payload/src/app/(frontend)/next/preview/route.ts:2`, `examples/styles-only/src/app/(frontend)/next/preview/route.ts:2`.
- **`./next/exit-preview`** — `exitPreviewRouteHandler`. `templates/atomic-payload/src/app/(frontend)/next/exit-preview/route.ts:1`, `examples/icons-only/src/app/(frontend)/next/exit-preview/route.ts:1`.
- **`./components/frontend/Toaster`** — frontend client component. `templates/atomic-payload/src/app/(frontend)/layout.tsx:12`.
- **`./components/frontend/LivePreviewListener`** — frontend client component. `templates/atomic-payload/src/app/(frontend)/[...slug]/page.tsx:5`, `examples/styles-only/src/app/(frontend)/layout.tsx:6`, `examples/icons-only/src/app/(frontend)/page.tsx:7`.
- **`./admin/controls`** — runtime importMap UI component. `templates/atomic-payload/src/app/(payload)/admin/importMap.js:4,48`, `examples/styles-only/src/app/(payload)/admin/importMap.js`.
- **`./admin/field`** — runtime importMap UI component. `templates/atomic-payload/src/app/(payload)/admin/importMap.js:2,46`, `examples/icons-only/src/app/(payload)/admin/importMap.js`.
- **`./admin/label`** — runtime importMap UI component. `templates/atomic-payload/src/app/(payload)/admin/importMap.js:1,45`, `examples/styles-only/src/app/(payload)/admin/importMap.js`.
- **`./ui/fields/slug`** — runtime importMap UI component. `templates/atomic-payload/src/app/(payload)/admin/importMap.js:3,47`.
- **`./ui/root/siteTriggers`** — runtime importMap UI component. `templates/atomic-payload/src/app/(payload)/admin/importMap.js:40,84`.

---

## Remove

### Barrel — internal-only value exports (used only via relative imports inside `packages/core/src`)

- **`apfRegistry`** — internal only, used at `packages/core/src/apf/components/admin/field.tsx:14` and `controls.tsx:11` via relative import; the registry is read internally, never imported by name externally.
- **`apfStorage`** — internal only, used at `packages/core/src/apf/fields/storage.ts:37` (and its own default export); no external consumer.
- **`virtualAPFAfterReadFieldHook`** — internal only, used at `packages/core/src/apf/fields/storage.ts:4`.
- **`virtualAPFBeforeChangeFieldHook`** — internal only, used at `packages/core/src/apf/fields/storage.ts:4`.
- **`sanitizeAfterRead`** — internal only, defined at `packages/core/src/hooks/collection/sanitize.ts:6`; no external consumer.
- **`formatSlug`** — internal only, used at `packages/core/src/ui/fields/slug/index.tsx:9`; external code uses the `./ui/fields/slug` component, not this fn.
- **`formatSlugHook`** — internal only, used at `packages/core/src/fields/slug.ts:3`; external code uses `slugField`, which wires the hook itself.
- **`createTestPathField`** — internal only, used at `packages/core/src/fields/testPath.ts:12` to build `TestPathField`; only `TestPathField` is imported externally.
- **`isObject`** — internal only, used at `packages/core/src/utilities/deepMerge.ts`; `packages/images/src/fields/favicon.ts:10` defines its own local `isObject` rather than importing this one.
- **`formatDurationString`** — internal only; `packages/atomic/src/forms/utilities/formatDurationWithTokens.ts` has its own copy and imports that, not core's.
- **`getImageUrl`** — internal only, defined at `packages/core/src/utilities/getImageURL.ts`; no external consumer.
- **`getClientSideURL`** — internal only, used at `packages/core/src/utilities/{generatePreviewPath,getImageURL,getMeUser}.ts` and `LivePreviewListener.tsx`; external code imports `getServerSideURL`, never this.
- **`mt`** (barrel form) — internal only via the barrel; external consumers import `mt` from `./cache/primitives` instead (`packages/icons/src/cache/index.ts:8`, `packages/atomic/src/cache/index.ts:7`). The barrel re-export is redundant. (`./cache/primitives` itself stays.)
- **`revalidateCacheGlobal`** (alias of global `revalidateCache`) — internal only; no external consumer (external code uses `revalidateCacheGlobalAfterChange`).
- **`DEFAULT_REVALIDATION_HANDLERS`** — internal only, used at `packages/core/src/hooks/collection/revalidate.ts:125,132`; no external consumer.
- **`DEFAULT_DELETE_REVALIDATION_HANDLERS`** — internal only, used at `packages/core/src/hooks/collection/revalidate.ts:138`; no external consumer.
- **`jsonSchemaPluginDefault`** (the `default as jsonSchemaPluginDefault` re-export of `jsonSchemaPlugin`) — redundant; external code imports the named `jsonSchemaPlugin`. No external import of `jsonSchemaPluginDefault`.

### Barrel — internal-only type exports

- **`NameKebabOptions`** — internal only, used at `packages/core/src/utilities/toKebabCase.ts:25`; no external import. (Note it's also independently inlined in `apf/types.ts` and `apf/components/admin/toKebabCase.ts`.)
- **`./apf/types` secondary types** (`RunAPFProps`, `SupportedAPFFields`, `APFBaseProps`, `APFieldType`, `APReturn`, `APFComponentBaseProps`, `APFFieldComponentType`, `CollectionsWithActive`, `CollectionsWithoutActive`, `Collections`) — internal only; all defined and used only within `packages/core/src/apf`. Only `APFunction`, `APArgs`, `APFieldWrapper`, `ClassNameFieldWrapper`, `BlockFieldExtensions` from this module are imported externally. (richtext's "Collections" at `packages/richtext/src/blocks/richText/defaultLexical.ts` is a local `enabledCollections` option, not an import of core's `Collections`.)
- **Revalidation context types** (`CollectionRevalidationHandlers`, `CollectionDeleteRevalidationHandlers`, `RevalidationContext`, `DeleteRevalidationContext`) — internal only, defined/used at `packages/core/src/hooks/collection/revalidate.ts`; no external consumer.
- **JSON-schema types** (`AtomicPayloadSchemaBlocks`, `BlockRefs`, `CreateJSONSchemaExtensionsOptions`, `GenerateBlocksTypeFn`, `GenerateBlocksTypeProps`, `JSONSchemaExtensionFn`, `JSONSchemaPluginOptions`, `ToJSONSchemaExtensionsFn`) — internal only, defined/used at `packages/core/src/jsonSchema.ts`; no external consumer. (`packages/zap/src/jsonSchema.ts:5` defines its OWN local `GenerateBlocksTypeProps`, not an import of core's.)
- **`RevalidationPluginOptions`** — internal only, used at `packages/core/src/plugin.ts:22`; no external import.
- **`./types/cache` types** (`PayloadConfigPromise`, `RevalidateTagResponse`, `RevalidateTagType`, `RArgs`, `RReturns`, `AllTags`, `PromiseTagGroup`, `RevalidationLoggerType`) — the entire `export type * from './types/cache'` is internal only; all members are consumed only within `packages/core/src` (`config/index.ts`, `utilities/revalidateTag.ts`, `utilities/log.ts`, `utilities/log/cache.ts`).

### Barrel — internal-only kernel types

- **`DefaultConfig`** — internal only, used at `packages/core/src/kernel.ts:51` (the `Config` stub); no external import.
- **`Last`** — internal only, defined at `packages/core/src/kernel.ts:65`; no consumer anywhere (not even internal).
- **`MergeTuples`** — internal only, defined at `packages/core/src/kernel.ts:68`; no consumer anywhere.
- **`AllCollections`** — internal only, defined at `packages/core/src/kernel.ts:74`; no consumer anywhere (external code uses `AllBlocks`/`CollectionBySlug`, not this).

### Subpaths — redundant / unconsumed

- **`./kernel`** — redundant subpath. Nobody imports `from '@pro-laico/core/kernel'`; all kernel types are imported from the root barrel. (The kernel *module* must remain for `core-augment-types` / the barrel; only the public subpath is removable.)
- **`./src`** — redundant subpath, a verbatim duplicate of `.` (same `src/index.ts` target). No external `from '@pro-laico/core/src'`.
- **`./logger`** — unconsumed subpath (`revalidationLogger`). Used only internally via relative import at `packages/core/src/utilities/revalidateTag.ts:6` (`import revalidationLogger from './log'`). No external `@pro-laico/core/logger` import. (Server-only carve-out; the module stays for internal use.)
- **`./auth/getMeUser`** — unconsumed subpath (`getMeUser`). No external consumer anywhere in `templates/**`, `examples/**`, or other packages.

### Subpath kept-but-noted

- **`./cache`** (`utilities/cache/index.ts`) — currently only re-exports `withCache`/`mt` from `./withCache`, fully duplicating `./cache/primitives`, which is the form external code actually imports. No external `from '@pro-laico/core/cache'` (bare) consumer exists in the tracked tree. It is a **redundant subpath** and a removal candidate. It is listed here rather than in the count's "remove" set with low confidence because: (a) the package's own comment frames `./cache` as the intended public "primitives" entry, and (b) the stale scaffold imports `from '@pro-laico/core/cache'` (an old `createGetCached` API). Recommendation: collapse `./cache` and `./cache/primitives` into one, then keep a single subpath. Counted as KEEP above pending that decision.

---

## Judgment calls

- **`default` export (revalidationPlugin)** — no external consumer uses a bareword `import x from '@pro-laico/core'`; everyone imports the named `revalidationPlugin`. The default is therefore unused externally. RECOMMENDATION: it is harmless and conventional for a plugin package to expose a default; keep it for ergonomics, or drop it to match the "named-only" convention the rest of the codebase already follows. Low impact either way.

- **`createRevalidateCache` / `createRevalidateCacheAfterChange` / `createRevalidateCacheOnDelete`** — build-it-yourself factories that bind a custom `slug → handler` map (the documented escape hatch; see the JSDoc in `packages/core/src/hooks/collection/revalidate.ts`). No external consumer today — every package/template uses the pre-bound `revalidateCache*`/`revalidateCacheOnDelete` hooks instead. RECOMMENDATION: keep as intentional public API (they're the customization seam for the otherwise-fixed default handler sets), OR remove all three together with `DEFAULT_*_HANDLERS` if you decide the default hooks are the only supported surface. They only make sense exported as a set.

- **`createJSONSchemaExtensions`** — the lower-level factory under `jsonSchemaPlugin` (builds the `JSONSchemaExtensionFn` without wrapping it in a `Plugin`). No external consumer; templates use `jsonSchemaPlugin`. RECOMMENDATION: keep as an advanced escape hatch for non-plugin composition, or remove and treat `jsonSchemaPlugin` as the sole public surface.

- **`atomicPayloadStoredDefinitions`** — the `Record<string, JSONSchema4>` of stored block definitions, consumed internally by `createJSONSchemaExtensions` (`packages/core/src/jsonSchema.ts:109`). No external consumer. RECOMMENDATION: remove unless you want apps to extend/inspect the stored-definition set directly; it's an internal building block. Leans REMOVE.

---

### Notes / caveats

- Confidence is high for the barrel value/type removals: each was grep-verified to have zero importers outside `packages/core/src` across `.ts`/`.tsx` (and the runtime `.js` importMaps).
- The kernel module, `./apf/types`, `./types/cache`, `./jsonSchema`, and every "remove"-listed source file stay on disk; only their *public re-export* from the barrel/subpath table is what's flagged. Internal relative imports and type-generation are unaffected.
- `PayloadAugment`, `./config`, and the `importMap` UI subpaths (`./admin/*`, `./ui/*`) are load-bearing and must remain regardless of any pruning.
