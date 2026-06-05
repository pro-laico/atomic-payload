# `@pro-laico/atomic` — Public Export Surface Audit

Barrel: 25 → keep 5, remove 20. Subpaths: 43 → keep 30, remove 13.

Audit-only. No source was edited and no typecheck was run. "External consumer" = an import in
`templates/**`, `examples/**`, `packages/create-atomic-payload/scaffolds/**`, or another
`packages/*/src/**` (NOT `packages/atomic/src`). Generated `*payload-types.ts` interfaces, `dist/**`,
comments, and `.md`/`.mdx` docs are ignored. Runtime `admin/importMap.js` references count as real
consumers. `examples/**` import zero atomic subpaths (verified — fonts/icons/styles-only apps).

**Removing an export does NOT delete the source module.** Internal relative imports keep working,
zap side-effect registration (`z.ap.add`) and `generate:types` are unaffected, and the four
`/schema` (payload-augment) subpaths plus the runtime importMap admin subpaths must stay.

**Important caveat for several "remove" subpaths.** A number of internal-only subpaths are imported
from inside `packages/atomic/src` **by package name** (`@pro-laico/atomic/...`), not by a relative
path — these resolve through the `exports` map at build/runtime. They have no external consumer, so
they are not public API, but you cannot simply delete the `exports` entry: the self-imports must
first be repointed to relative paths, or resolution breaks. These are flagged "(internal pkg-name
self-import — repoint before removing)" below.

---

## Keep

### Barrel symbols (`src/index.ts`)

Nothing imports the bare root `@pro-laico/atomic` anywhere — every consumer uses a subpath. The five
kept barrel symbols are kept because they are the canonical plugin/field public API and are consumed
via their namespace subpath; the barrel re-export itself is redundant (see Judgment calls).

| Symbol | Reason | External consumer (via subpath) |
| --- | --- | --- |
| `formsPlugin` | forms plugin entry | `templates/atomic-payload/src/plugins/index.ts` (via `@pro-laico/atomic/forms`) |
| `actionsPlugin` | actions plugin entry | `templates/atomic-payload/src/plugins/index.ts` (via `@pro-laico/atomic/actions`) |
| `childBlocksPlugin` | children plugin entry | `templates/atomic-payload/src/plugins/childBlocks.ts` (via `@pro-laico/atomic/children`) |
| `ChildrenBlocksField` | field users add to a collection | `packages/site/src/collections/headers/collection.ts` (via `@pro-laico/atomic/children`) |
| `atomicHook` | beforeChange hook users attach | `templates/atomic-payload/src/plugins/styles.ts`, `packages/site/src/collections/pages/collection.ts` (via `@pro-laico/atomic/hook`) |

### Subpaths (`exports` / `publishConfig.exports`)

| Subpath | Reason | Evidence (external consumer) |
| --- | --- | --- |
| `.` (root) | documented convenience barrel | no direct consumer; kept as the package's `main`/`types` entry (see Judgment) |
| `./cache` | cached-data getters used by app | `templates/atomic-payload/src/app/(frontend)/layout.tsx` (`getCachedAtomicActions`) |
| `./actions` | actions plugin | `templates/atomic-payload/src/plugins/index.ts` (`actionsPlugin`) |
| `./actions/schema` | payload-augment type-augmentation entry | type-augment stubs (`Get<...>`); no direct external import but must stay |
| `./actions/zap` | zap block-type union for jsonSchema | `templates/atomic-payload/src/plugins/jsonSchema.ts` (`ActionBlockType`) |
| `./actions/processor` | **runtime dynamic `import()`** in hook | `packages/atomic/src/hook/lazyAtomicHook.ts:30`, `atomicHookFactory.ts:18` — package-name dynamic import; removing breaks runtime |
| `./hook` | beforeChange hook | `templates/atomic-payload/src/plugins/styles.ts` (`atomicHook`) |
| `./hook/schema` | payload-augment type-augmentation entry | type-augment stub (`ImplementedStorageTypes`); no direct external import but must stay |
| `./hook/client` | client store provider | `templates/atomic-payload/src/app/(frontend)/layout.tsx` (`AtomicStoreProvider`) |
| `./forms` | forms plugin | `templates/atomic-payload/src/plugins/index.ts` (`formsPlugin`) |
| `./forms/schema` | payload-augment type-augmentation entry; also imported by siblings | `packages/seed/src/seed/backendForm.ts` (`Form`), `packages/mux-video/...` |
| `./forms/submitForm/input/zap` | zap block-type unions for jsonSchema | `templates/atomic-payload/src/plugins/jsonSchema.ts` (`InputSanitationBlockType`, `InputValidationBlockType`) |
| `./forms/submitForm/form/zap` | zap block-type unions for jsonSchema | `templates/atomic-payload/src/plugins/jsonSchema.ts` (`FormRateLimitBlockType`, …) |
| `./forms/submitForm/serverFunction` | **runtime dynamic `import()`** in client form hook | `packages/atomic/src/children/hooks/useActions/useForm.ts:14` — package-name dynamic import; removing breaks runtime |
| `./children` | children plugin + field + `RenderChild` type | `templates/atomic-payload/src/plugins/childBlocks.ts`, `packages/mux-video/src/blocks/videoChild/component.tsx` (`RenderChild`) |
| `./children/schema` | child-block types imported by every block sibling | `packages/images/src/blocks/imageChild/component.tsx`, `packages/icons/...`, `packages/richtext/...`, `packages/mux-video/...` |
| `./children/zap` | zap child-block union for jsonSchema | `templates/atomic-payload/src/plugins/jsonSchema.ts` (`BackdropChildSlug`, `ChildBlockType`) |
| `./children/useActions/zap` | zap action unions for jsonSchema | `templates/atomic-payload/src/plugins/jsonSchema.ts` (`Attributer`, `Runner`) |
| `./children/render` | frontend `RenderChildren` component | `templates/atomic-payload/src/app/(frontend)/[...slug]/page.tsx`, `packages/site/src/collections/footers/component.tsx` |
| `./children/fields/coloredEnd` | field block siblings add | `packages/images/src/blocks/imageChild/block.ts`, `packages/icons/...`, `packages/richtext/...` (`ColoredEnd`) |
| `./children/fields/tagType` | field block siblings add | `packages/mux-video/src/blocks/videoChild/block.ts` (`TagTypeField`) |
| `./children/fields/tabs/settings` | settings-tab field block siblings add | `packages/images/src/blocks/imageChild/block.ts`, `packages/icons/...`, `packages/richtext/...` (`ChildsSettingsTab`) |
| `./children/admin` | exposes admin component path constants | `packages/icons/src/blocks/iconChild/block.ts` (`IconSelectPath`) |
| `./children/admin/warningIcon` | admin icon component used by a sibling | `packages/icons/src/blocks/iconChild/component.tsx` (default `Warning`) |
| `./children/admin/coloredEnd` | **runtime importMap** admin component | `templates/atomic-payload/src/app/(payload)/admin/importMap.js` |
| `./children/admin/actionBlock` | **runtime importMap** admin component | `templates/atomic-payload/src/app/(payload)/admin/importMap.js` |
| `./children/admin/inputBlock` | **runtime importMap** admin component | `templates/atomic-payload/src/app/(payload)/admin/importMap.js` |
| `./children/admin/iconSelect` | **runtime importMap** admin component | `templates/atomic-payload/src/app/(payload)/admin/importMap.js` |
| `./children/admin/atomicRowLabel` | **runtime importMap** admin RowLabel | `templates/atomic-payload/src/app/(payload)/admin/importMap.js` |
| `./children/admin/simpleTextRowLabel` | **runtime importMap** admin RowLabel | `templates/atomic-payload/src/app/(payload)/admin/importMap.js` |

(The same admin importMap subpaths and `./cache` / `./children/render` are also referenced by
`packages/create-atomic-payload/scaffolds/atomic-payload/**`, the published scaffold — a subset of
the template, introducing no additional subpaths.)

---

## Remove

### Barrel symbols (`src/index.ts`) — no external consumer via any path

Verified by symbol-name grep across `templates/**`, `examples/**`, sibling `packages/*/src`, and the
create-atomic-payload scaffolds — none of these are imported anywhere outside `packages/atomic/src`.
They are also each still exported by their namespace subpath index, so removing the barrel re-export
loses nothing reachable.

| Symbol | Reason |
| --- | --- |
| `defaultSubmitFormBlocks` | internal only; barrel re-export of `./forms` default block list, no external import |
| `buildChildBlocks` | internal only; factory, no external import (`./children/buildChildBlocks`) |
| `BuildChildBlocksOptions` (type) | internal only; option type for the above |
| `GenericChildBlockSlug` (type) | internal only |
| `childBlocks` | internal only; default child-block array (`./children/blocks`) |
| `childBlocksZapSchemas` | internal only; zap schema bundle, registered by side-effect |
| `ChildBlocksPluginOptions` (type) | internal only; plugin options type, never imported externally |
| `ActionBlockStorageProcessor` | internal only; class from `./actions/blocks/processor`, no external import |
| `ActionOptions` | internal only; from `./actions/blocks/processor` |
| `ActionBlockType` (barrel value) | internal only; the consumed `ActionBlockType` comes via `./actions/zap`, not the barrel |
| `ActionFilters` (barrel value) | internal only; consumed only via `./actions/filters` self-import, not the barrel |
| `AllActionBlocks` | internal only; default action-block array |
| `ActionsPluginOptions` (type) | internal only; plugin options type, never imported externally |
| `atomicHookPlugin` | internal only; the template attaches `atomicHook` directly, never the plugin form |
| `createAtomicHook` | internal only; factory, no external import |
| `unsetActive` / `UnsetActiveType` | internal only; helper + type, no external import |
| `CreateAtomicHookOptions` (type) | internal only |
| `AtomicHookGetCached` (type) | internal only |
| `ActionBlockStorageProcessorClass` (type) | internal only |
| `AtomicHookPluginOptions` / `FormsPluginOptions` (types) | internal only; plugin options types, never imported externally |

> Note: the namespace subpath indexes (`./actions`, `./forms`, `./children`, `./hook`) export a few
> more symbols than the barrel does (e.g. `atomicHookWith`, `DEFAULT_ATOMIC_HOOK_SLUG_CONFIG`,
> `AtomicHookSlugConfig`, `UnsetActiveCleanupFlags`). Those are outside the barrel and outside this
> count; none are imported externally either, but they live behind the same KEEP subpath and were not
> separately enumerated.

### Subpaths — internal-only or redundant

| Subpath | Reason | Evidence (internal-only use) |
| --- | --- | --- |
| `./src` | redundant subpath — duplicates the root `.`; no consumer imports `@pro-laico/atomic/src` | no match anywhere |
| `./actions/blocks` | internal only (relative) | `AllActionBlocks` imported via `./blocks/blocks` in `packages/atomic/src/actions/plugin.ts`, `actions/index.ts` |
| `./actions/filters` | internal only (pkg-name self-import — repoint before removing) | `packages/atomic/src/children/components/admin/actionBlock.tsx:7` (`@pro-laico/atomic/actions/filters`) |
| `./actions/fields` | internal only (pkg-name self-import — repoint before removing) | 8 block files, e.g. `packages/atomic/src/actions/blocks/theme/set/block.ts:2` |
| `./actions/fields/keyText` | internal only (pkg-name self-import — repoint before removing) | `packages/atomic/src/children/fields/staticDataAttributes.ts:3` |
| `./actions/fields/strict/registry/theme` | internal only (pkg-name self-import); zap schema read by string id elsewhere | `packages/atomic/src/children/hooks/useActions/dispatch/runner/setThemes/zap.ts:2` (`themePerform`) |
| `./actions/fields/strict/registry/cookieConsent` | internal only (pkg-name self-import); zap-related, read by string id | `packages/atomic/src/children/hooks/useActions/dispatch/attributer/cCToDA/zap.ts:2`, `runner/setCCs/zap.ts:2` (`cookieConsentKeys`) |
| `./forms/fields/validationMessage` | internal only (pkg-name self-import — repoint before removing) | 4 block files, e.g. `packages/atomic/src/forms/submitForm/input/validation/contains/block.ts:4` |
| `./forms/submitForm/input/useOn` | internal only (pkg-name self-import — repoint before removing) | `packages/atomic/src/children/fields/blocks/submitForm/input.ts:5` (`useOn`) |
| `./forms/submitForm/formProcessor` | internal only (relative) | imported via `./formProcessor` in `packages/atomic/src/forms/submitForm/serverFunction.ts:3`; no pkg-name ref |
| `./forms/utilities/formatDurationWithTokens` | internal only (relative) | used within `packages/atomic/src/forms/submitForm/formProcessor.ts`; no pkg-name ref |
| `./forms/utilities/getServerSideURL` | internal only | no consumer outside its own module; no pkg-name ref |
| `./children/frontend-components` | internal only (relative) | imported via `../frontend-components` in `packages/atomic/src/children/render/renderChildren.tsx:33` |

---

## Judgment calls

1. **The root barrel `.` and its re-exports.** Nothing imports `@pro-laico/atomic` (the bare root)
   anywhere in the repo — all consumers use subpaths. Strictly, the entire `src/index.ts` barrel is
   dead weight: every symbol it re-exports is also available on a namespace subpath, and the five
   that are actually used externally (`formsPlugin`, `actionsPlugin`, `childBlocksPlugin`,
   `ChildrenBlocksField`, `atomicHook`) are imported via those subpaths, not the root.
   **Recommendation:** the package's own header comment already steers users to the subpaths
   (`@pro-laico/atomic/{actions,hook,forms,children}`). You can safely trim the barrel down to just
   the canonical plugin entries + their main options types (or drop the root entry entirely and rely
   on subpaths). I left `.` as KEEP only because it is the package's declared `main`/`types`; if you
   keep it, prune the 20 unused re-exports listed above. This is the single biggest cleanup.

2. **`./forms/submitForm/serverFunction` and `./actions/processor`.** Both are unused by any external
   consumer, which would normally make them removal candidates — but each is loaded at **runtime via
   a package-name dynamic `import('@pro-laico/atomic/...')`** from inside `src` (to break a
   server/client or hook/actions init cycle). Removing either `exports` entry would break that
   runtime resolution. **Recommendation: keep both** (classified KEEP above). They are de-facto
   public API by virtue of the self-resolved dynamic import.

3. **The pkg-name self-import subpaths** (`./actions/filters`, `./actions/fields`,
   `./actions/fields/keyText`, `./actions/fields/strict/registry/theme`,
   `./actions/fields/strict/registry/cookieConsent`, `./forms/fields/validationMessage`,
   `./forms/submitForm/input/useOn`). Listed under Remove because no external code uses them, but they
   are currently imported by package name from within `src` (one of them,
   `./children/components/admin/actionBlock.tsx`, is itself an importMap-loaded admin component).
   **Recommendation:** removable, but only after repointing those internal imports to relative paths;
   removing the `exports` entry alone would break the self-resolution. If you would rather not touch
   the call sites, leave these as-is — they are cheap to keep.

4. **`./actions/schema` and `./hook/schema`.** Type-augmentation (`Get<...>` stub) entries with no
   *direct* external import (unlike `./children/schema` and `./forms/schema`, which siblings import).
   They are still part of the documented payload-augment surface. **Recommendation: keep** — they
   round out the `/schema` set and cost nothing.
