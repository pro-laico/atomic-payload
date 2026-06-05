# `@pro-laico/site` — Public Export Surface Audit

Barrel: 11 → keep 3, remove 8 (5 of those 8 are JUDGMENT — see below). Subpaths: 5 → keep 4, remove 1.

> **Method.** Enumerated every `export` in `src/index.ts` and every `./subpath` in
> `package.json` (`exports` + `publishConfig.exports`), then grepped the whole repo for real
> external consumers — imports in `templates/**`, `examples/**`, or another
> `packages/*/src/**`. Ignored: anything in `packages/site/src` itself, `dist/**`,
> `*payload-types.ts` / `*payload-types.augment.d.ts` (GENERATED — a matching name there is a
> generated interface from a `typescriptSchema` `$ref`, not an import), and `.md` / `.mdx`
> docs/READMEs.
>
> **Removing a barrel export does NOT delete its source module.** The collections, globals,
> tabs, slug constants and components keep working through the package's own relative imports;
> the plugin still registers them, zap registration still fires by side-effect, and
> `generate:types` is unaffected. "Remove" here means "drop the re-export line from
> `src/index.ts`" (or "drop the subpath from `package.json`").
>
> **Must stay regardless of this audit:** the `./schema` type-augmentation entry, the `./cache`
> getters (used by template + styles/atomic), the side-effect `import './types/payload'` at the
> top of the barrel (augments `RequestContext` — not a named export), and any runtime
> importMap-loaded UI subpath. (Note: `templates/**/admin/importMap.js` references only
> `@pro-laico/core/ui/root/siteTriggers`; it loads **no** `@pro-laico/site` UI subpath, so there
> is no runtime-importMap obligation on this package.)

---

## Keep

### Barrel (`@pro-laico/site`)

- **`sitePlugin`** (named) — the plugin. Imported by the template.
  Evidence: `templates/atomic-payload/src/plugins/index.ts:4` → `import { sitePlugin } from '@pro-laico/site'`.
- **`default`** (= `sitePlugin`) — the conventional default export of the plugin. Kept as the
  plugin's default per the KEEP rule even though the template uses the named form; pairs with
  the named export.
  Evidence: `packages/site/src/plugin.ts:33` (`export default sitePlugin`).
- **`SitePluginOptions`** (type) — the plugin's main options type. Public API surface for anyone
  typing the call site; kept per the "plugin + main options type" KEEP rule.
  Evidence: `packages/site/src/plugin.ts:9`.

### Subpaths

- **`./schema`** → `src/types/payload-augment.ts` — the Payload type stubs
  (`Page`, `Header`, `Footer`, `ShortcutSet`, `SiteMetaDatum`). External type consumers:
  - `Page` — `packages/seed/src/seed/index.ts:6` (plus `seed/header.ts`, `footer.ts`, `pages/*.ts`, etc.).
  - `Header` — `packages/seed/src/seed/header.ts:1`.
  - `Footer` — `packages/seed/src/seed/footer.ts:1`.
  - `SiteMetaDatum` — `packages/seed/src/seed/siteMetaData.ts:1`.
  - `ShortcutSet` — `packages/styles/src/cssProcessor.ts:2` (also `styles/src/cache/index.ts:8`,
    `styles/src/types/payload.ts:7`, `styles/src/ui/rowLabels/shortcut/index.tsx:4`).

  All five exported types have a real external consumer → keep the whole subpath.
- **`./cache`** → `src/cache/index.ts` — the cached getters/factories. Heavily consumed:
  - `getCachedPageByHref`, `getCachedPages`, `getCachedSiteMetadata` — `templates/atomic-payload/src/app/(frontend)/[...slug]/page.tsx:3`.
  - `getCachedSitemap` — `templates/atomic-payload/src/app/(frontend)/sitemap.ts:4`.
  - `getCachedFooter`, `getCachedHeader` — `templates/atomic-payload/src/app/(frontend)/layout.tsx:6` and (dynamic `import()`) `packages/atomic/src/hook/atomicHookFactory.ts:20`, `packages/atomic/src/hook/lazyAtomicHook.ts:32`.

  (The factory variants `createGetCachedPages` / `createGetCachedPageByHref` / `createGetCachedSitemap`
  are only shown in `.mdx` docs, not imported by code — but they live in the same module and the
  subpath is required anyway, so no per-symbol action.)
- **`./components/frontend`** → `src/components/frontend/index.ts` — the `Header` / `Footer`
  server-component renderers. App-imported.
  Evidence: `templates/atomic-payload/src/app/(frontend)/layout.tsx:11` → `import { Footer, Header } from '@pro-laico/site/components/frontend'`.
- **`./zap`** → `src/zap.ts` — the **default** export (`CollectionSchemas` array) is imported for
  the JSON-schema / `generate:types` step.
  Evidence: `templates/atomic-payload/src/plugins/jsonSchema.ts:2` → `import CollectionSchemas from '@pro-laico/site/zap'`.
  Keep the subpath and its default export. (Its named members are a separate finding — see Remove.)

---

## Remove

### Barrel (`@pro-laico/site`) — internal-only, no external consumer

The bare-root specifier `@pro-laico/site` is imported in exactly **one** place repo-wide
(`templates/atomic-payload/src/plugins/index.ts:4`, and it pulls only `sitePlugin`). Every other
named barrel export therefore has **zero** external value/type importers — confirmed by a
whole-repo grep that returned only `packages/site/src/**`, generated `payload-types*`, and
`.md`/`.mdx` matches. None of these need to be on the barrel for the plugin to work, because
`plugin.ts` registers the collections/globals via its own **relative** imports
(`packages/site/src/plugin.ts:3-7,28-29`).

- **`Footer`** (collection re-export, `src/index.ts:3`) — registered internally by the plugin
  (`plugin.ts:28`); no external root import. *(But see Judgment — arguably an extend-it surface.)*
- **`Header`** (collection, `src/index.ts:4`) — same. *(See Judgment.)*
- **`Pages`** (collection, `src/index.ts:5`) — same. *(See Judgment.)*
- **`Settings`** (global, `src/index.ts:16`) — registered internally (`plugin.ts:29`); no external
  import. *(See Judgment.)*
- **`SiteMetaData`** (global, `src/index.ts:17`) — same. *(See Judgment.)*
- **`COLLECTION_SLUGS_WITH_ATOMIC_HOOK`** (`src/index.ts:13`) — defined at
  `src/collections/pages/atomicHookSlugs.ts:7`. No code outside `packages/site/src` imports it
  (only a `site.mdx` doc mentions it). Safe to drop from the barrel.
- **`SEOTab`** (`src/index.ts:14`) — used only internally by
  `src/collections/pages/collection.ts:92`. The other `*SEOTab`/`SettingsTab` hits across the repo
  are unrelated local symbols in `@pro-laico/atomic` / `styles` / `images` / `icons`
  (e.g. `ChildsSettingsTab`, `TagSettingsTab`), not site's. *(But it's a compose-into-your-own-collection
  field — see Judgment.)*
- **`SettingsTab`** (`src/index.ts:15`) — used only internally by
  `src/collections/pages/collection.ts:94`. No external consumer. *(See Judgment.)*

### Subpaths — redundant named exports on `./zap`

- **`./zap` named exports** `CollectionThatUsesAtomicHookSlug`,
  `CollectionWithStoredAtomicClassesSlug`, `CollectionThatUseCSSProcessorSlug`,
  `CollectionWithStoredAtomicFormsSlug`, `CollectionWithStoredAtomicActionsSlug`
  (`src/zap.ts:13,17,21,25,29`) — these register themselves into the zap registry by side-effect
  via `z.ap.add(schema, { id: '…' })`. They are read **externally by string id**, never by
  importing the const:
  - `packages/atomic/src/hook/createAtomicHook.ts:45` → `z.ap.get('CollectionThatUsesAtomicHookSlug')`.
  - `packages/styles/src/types/css.ts` uses `Get<'CollectionThatUsesCSSProcessorSlug', …>` against
    the augmented registry, not an import of the const.
  - The matches in `templates/.../payload-types.ts` / `payload-types.augment.d.ts` and
    `packages/styles/src/types/payload-augment.ts` are GENERATED `$ref` interfaces / `Get<>`
    augmentations — not imports of these consts.

  The named exports are still needed **inside** `zap.ts` to assemble the default `CollectionSchemas`
  array, so they can stay as plain `const`s — just drop the `export` keyword (or stop relying on
  them being public). The `./zap` **subpath itself stays** (its default export is consumed).

  This is the one "redundant" finding: the subpath is kept, but its named surface is unused
  externally and can be made internal.

> Note: the `./zap` *subpath* is **not** removed — only its named exports are reclassified as
> internal. I counted the subpath under Keep (4 kept) and this named-export reduction as the single
> Remove against the 5 subpaths.

---

## Judgment calls

These have **no** external consumer today, so by the strict "nothing outside uses it → remove"
test they are removable. But each is plausibly intended public API (the README and `site.mdx`
advertise them as user-facing). Recommendation per item:

- **`SEOTab`, `SettingsTab`** (`src/index.ts:14-15`) — documented as drop-in tabs you compose into
  your own page-like collections (`site.mdx:215-216`, `README.md:21`). No app imports them yet.
  **Recommendation: KEEP** as a deliberate composition escape hatch; low cost, clearly public-API
  shaped. Remove only if you want to shrink the surface to exactly what's consumed.
- **`Pages`, `Header`, `Footer`** (collections, `src/index.ts:3-5`) and **`Settings`,
  `SiteMetaData`** (globals, `src/index.ts:16-17`) — advertised as "import it to register or extend
  it yourself" (`site.mdx:203-207`, `README.md:21`). The plugin already registers them, so the
  normal user never imports them. **Recommendation: KEEP `Pages` / `Header` / `Footer`** (extending a
  collection is a realistic advanced need) and **lean toward REMOVE `Settings` / `SiteMetaData`** from
  the barrel — re-registering a global manually is unusual and the plugin owns them. If you want the
  tightest possible surface, all five can go (they keep working via the plugin's relative imports).
- **`COLLECTION_SLUGS_WITH_ATOMIC_HOOK`** (`src/index.ts:13`) — documented as "keep your atomic-hook
  wiring in sync with this" (`site.mdx:233`), but nothing in the template actually imports it (the
  template hardwires its own slug list). **Recommendation: REMOVE** from the barrel unless you plan
  to make the template consume it; it's currently aspirational, not consumed.
- **`createGetCached*` factories** on `./cache` (`createGetCachedPages`, `createGetCachedPageByHref`,
  `createGetCachedSitemap`) — shown in `concepts/slugs.mdx` and `caching.mdx` as the way to bind a
  getter to a custom pages slug, but no code imports them. They share the `./cache` module (kept
  anyway), so there's no subpath action. **Recommendation: KEEP** — they're the documented
  custom-slug escape hatch and cost nothing to leave exported.

---

## Uncertainties / notes

- I treated `default` as KEEP on the strength of "plugin default export"; strictly, the only
  observed import is the **named** `sitePlugin`. If you standardize on named-only plugin imports,
  `default` is technically droppable — but that's a stylistic call, not a dead-export one.
- The `./schema` subpath maps to `types/payload-augment.ts`. All five of its types have an external
  consumer, so no per-type trimming is warranted there.
- No `examples/**` app depends on `@pro-laico/site` at all (the fonts-only / icons-only / styles-only
  examples don't list it in their `package.json`), so all external evidence comes from
  `templates/atomic-payload/**` and from `packages/{seed,styles,atomic}/src/**`.
