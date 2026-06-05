# `@pro-laico/icons` — Public Export Surface Audit

Barrel: 14 → keep 4, remove 10. Subpaths: 13 → keep 11, remove 2.

Audit-only. No source was edited and no typechecks were run.

Scope note: "external consumer" means a real `import`/`export … from` in `templates/**`,
`examples/**`, the `create-atomic-payload` `scaffolds/**` (template copies), or another
`packages/*/src/**` — **not** `packages/icons/src` itself, not `dist/**`, not
`*payload-types.ts` (generated), and not `.md`/`.mdx` docs or strings printed inside
`<CodeBlock>` literals (those are display text, not imports).

Removing a barrel export does **not** delete its source module: internal relative imports
inside `packages/icons/src` (e.g. `Icon.tsx` importing `../../cache`, `iconChild/component`
importing the extract helpers from the barrel-or-relative source) keep working, and zap
registration / `generate:types` are unaffected. The `./schema` (payload-augment) subpath and
the runtime importMap-loaded admin/UI/component subpaths must stay regardless.

The barrel enumerates 14 symbols (the `export * from './iconSet/defaults'` line expands to 7:
`GENERAL_ICON_VARIANTS`, `INTERFACE_ICON_VARIANTS`, `SOCIAL_ICON_VARIANTS`,
`SHAPES_ICON_VARIANTS`, `BRAND_ICON_VARIANTS`, the `IconName` type, and
`defaultIconNameList` — counted as 7 below).

---

## Keep

### Barrel exports (4)

- **`iconsPlugin`** + **`default`** (`./plugin`) — the plugin entry. Both are the same plugin
  factory; users register it in their Payload config.
  Evidence: `examples/icons-only/src/payload.config.ts:8` (`import { iconsPlugin } from '@pro-laico/icons'`),
  `templates/atomic-payload/src/plugins/icons.ts:1`, `packages/create-atomic-payload/scaffolds/icons-only/src/payload.config.ts:8`.

- **`IconsPluginOptions`** (type) — the plugin's main options type. Kept under the
  "plugin/default export + main options type" rule even though no external file imports the
  type by name (apps pass the option object inline). Not externally imported.

- **`extractSvgContent`**, **`extractSvgProps`** (`./utilities/extractSVG`) — SVG helpers an app
  uses to inline an icon's `svgString` by hand.
  Evidence: `examples/icons-only/src/app/(frontend)/page.tsx:6`
  (`import { extractSvgContent, extractSvgProps } from '@pro-laico/icons'`),
  mirrored in `packages/create-atomic-payload/scaffolds/icons-only/src/app/(frontend)/page.tsx:6`.

- **`IconLabelPath`** (const) — admin import-map path string re-exported by the template's UI
  barrel.
  Evidence: `templates/atomic-payload/src/ui/index.ts:6`
  (`export { IconLabelPath } from '@pro-laico/icons'`),
  `packages/create-atomic-payload/scaffolds/atomic-payload/src/ui/index.ts:6`.

### Subpaths (11)

- **`./schema`** — the payload-augment type-augmentation entry; imported for typed `Icon` /
  `IconSet` document types. Must stay (type-augment entry rule) **and** has real consumers.
  Evidence: `packages/seed/src/seed/iconSet.ts:2` (`import type { Icon, IconSet } from '@pro-laico/icons/schema'`),
  `packages/seed/src/seed/index.ts:5`, and every file under `packages/seed/src/seed/icons/*.ts`.

- **`./Icon`** — the `<Icon>` frontend server component an app renders.
  Evidence: `examples/icons-only/src/app/(frontend)/page.tsx:4` (`import { Icon } from '@pro-laico/icons/Icon'`),
  `packages/create-atomic-payload/scaffolds/icons-only/src/app/(frontend)/page.tsx:4`.

- **`./AtomicIcon`** — frontend marker glyph imported by the atomic package's admin row label.
  Evidence: `packages/atomic/src/children/components/admin/AtomicRowLabel.tsx:8`
  (`import { AtomicIcon } from '@pro-laico/icons/AtomicIcon'`). That file's comment explicitly
  notes it imports the narrow subpath, NOT the barrel.

- **`./admin/iconRowLabel`** — runtime importMap-loaded admin component (exact-path).
  Evidence: `templates/atomic-payload/src/app/(payload)/admin/importMap.js:5,49`,
  `examples/icons-only/src/app/(payload)/admin/importMap.js:7,12`,
  `packages/create-atomic-payload/scaffolds/*/src/app/(payload)/admin/importMap.js`. Must stay.

- **`./admin/iconSelect`** — admin select-field factory re-exported by the atomic package.
  Evidence: `packages/atomic/src/children/components/admin/iconSelect.tsx:1`
  (`export { default } from '@pro-laico/icons/admin/iconSelect'`).

- **`./blocks/iconChild`** — IconChild block + factory the atomic children system composes.
  Evidence: `packages/atomic/src/children/blocks.ts:7` (`import { Icon } from '@pro-laico/icons/blocks/iconChild'`),
  `packages/atomic/src/children/buildChildBlocks.ts:4` (`import { createIconBlock } …`).

- **`./blocks/iconChild/component`** — IconChild frontend component re-exported by atomic
  (also runtime/importMap-shaped block component).
  Evidence: `packages/atomic/src/children/frontend-components.ts:3`
  (`export { IconChild } from '@pro-laico/icons/blocks/iconChild/component'`).

- **`./blocks/svgChild`** — SVGChild block + factory the atomic children system composes.
  Evidence: `packages/atomic/src/children/blocks.ts:8` (`import { SVGBlock } …`),
  `packages/atomic/src/children/buildChildBlocks.ts:3` (`import { createSvgBlock } …`).

- **`./blocks/svgChild/component`** — SVGChild frontend component re-exported by atomic.
  Evidence: `packages/atomic/src/children/frontend-components.ts:2`
  (`export { SVGChild } from '@pro-laico/icons/blocks/svgChild/component'`).

- **`.`** (root barrel) — the package's main entry; consumed for `iconsPlugin`,
  `extractSvg*`, `IconLabelPath` (see barrel keeps above). Must stay.

- **`./cache`** — see Judgment calls; recommended **keep** as a documented escape hatch, so it
  is counted under Keep in the headline total.

---

## Remove

### Barrel exports — internal-only, no external consumer (10)

None of these are imported by `templates/**`, `examples/**`, the `scaffolds/**`, or any other
`packages/*/src/**`. They appear only in `packages/icons/src` (via relative imports), in
`dist/**`, in the generated `payload-types.ts`, or in `docs/**/*.mdx` reference tables — none of
which count.

- **`AtomicIcon`** (barrel, from `./components/frontend/AtomicIcon`) — *redundant barrel
  re-export*. The only real consumer imports the dedicated **`./AtomicIcon` subpath**
  (`packages/atomic/src/children/components/admin/AtomicRowLabel.tsx:8`), whose own comment says
  to avoid the barrel. Nothing imports `AtomicIcon` from the root barrel. The subpath stays; the
  barrel line can go.

- **`formatSVGHook`** (`./hooks/formatSVG`) — wired onto the Icon collection internally; no
  external importer. (`docs/content/docs/plugins/icons.mdx:248` is a docs table entry only.)

- **`formatSvg`** (`./hooks/formatSVG`) — standalone optimizer; no external importer
  (docs table only, `icons.mdx:249`).

- **`createIconCollection`** (`./collections/icon`) — collection factory; no external importer
  (docs table only, `icons.mdx:226`). See Judgment calls.

- **`Icon`** (the **collection**, from `./collections/icon`) — registered by the plugin
  internally; no external importer. Note: external `Icon` imports resolve to the `./Icon`
  *component* subpath or the `./blocks/iconChild` *block*, not this barrel collection symbol.
  See Judgment calls.

- **`IconCollectionOptions`** (type, `./collections/icon`) — options type for the above; no
  external importer (docs table only, `icons.mdx:227`). See Judgment calls.

- **`createIconSetCollection`** (`./collections/iconSet`) — collection factory; no external
  importer (docs table only, `icons.mdx:229`). See Judgment calls.

- **`IconSet`** (the **collection**, from `./collections/iconSet`) — registered by the plugin
  internally; no external importer. (External `IconSet` references are the `./schema` *type*, not
  this barrel collection symbol.) See Judgment calls.

- **`IconSetCollectionOptions`** (type, `./collections/iconSet`) — options type for the above;
  no external importer (docs table only, `icons.mdx:230`). See Judgment calls.

- **`export * from './iconSet/defaults'`** — the whole star-export and every symbol it surfaces
  (`GENERAL_ICON_VARIANTS`, `INTERFACE_ICON_VARIANTS`, `SOCIAL_ICON_VARIANTS`,
  `SHAPES_ICON_VARIANTS`, `BRAND_ICON_VARIANTS`, the `IconName` type, `defaultIconNameList`).
  No external file imports any of these names. `defaultIconNameList` is referenced only in a docs
  table (`icons.mdx:259`, attributed to the `./iconSet/defaults` subpath, not the barrel). The
  variant consts + `IconName` type are consumed only inside `packages/icons/src/iconSet/defaults.ts`
  itself. Removing the barrel line does not delete `defaults.ts` — internal relative imports keep
  working and `generate:types` is unaffected.

### Subpaths — redundant, nobody imports by the subpath form (2)

- **`./iconSet/defaults`** — duplicates names already on the root barrel and has no external
  importer by the subpath form (only the docs table at `icons.mdx:259` names it). Redundant
  subpath; safe to drop. (If the barrel `export *` is also removed per above, these names become
  fully internal, which is the intended outcome.)

- **`./src`** — a self-alias that points at the same `index.ts` as `.`. No file anywhere imports
  `@pro-laico/icons/src`. Redundant subpath; safe to drop.

---

## Judgment calls

- **`./cache`** (subpath) — *recommend KEEP.* No real runtime importer exists today: the only
  `@pro-laico/icons/cache` occurrence is inside a `<CodeBlock>{…}` **string** in
  `examples/icons-only/src/app/(frontend)/page.tsx:216` (display text, not an import), and a prose
  comment in `examples/icons-only/src/instrumentation.ts:6`. Internally, `./Icon` reaches the
  getters via the relative path `../../cache` (`packages/icons/src/components/frontend/Icon.tsx:6`),
  so the subpath is not needed for the bundled component to work. However, `./cache`
  (`getCachedIconSet`, `getCachedIconByName`, `getCachedIconOptions`) is a deliberate, documented
  public escape hatch for hand-rolled rendering — the "by hand" code sample teaches exactly that.
  Removing it would break that documented path. Recommend keeping; revisit only if the docs stop
  advertising it.

- **`createIconCollection` / `IconCollectionOptions` / `createIconSetCollection` /
  `IconSetCollectionOptions`** (barrel) — *recommend REMOVE, but flagging.* These are advanced
  collection-factory escape hatches plus their option sub-types. They are unused by any external
  code (docs reference tables only) and the plugin wires the collections itself via the
  `iconOptions` / `iconSetOptions` option bags, so the common customization path does **not** need
  these symbols. They are arguably public API for users who want to register a customized Icon /
  IconSet collection outside the plugin. Recommendation: remove from the barrel to shrink the
  surface; if you want to preserve the advanced path, keep just the two `create*` factories and
  their options types and drop the rest. The source modules stay either way.

- **`Icon` / `IconSet`** (the **collection** objects on the barrel, distinct from the `./Icon`
  component and `./schema` types) — *recommend REMOVE, but flagging.* No external code imports the
  ready-made collection objects; the plugin registers them. They are arguably public for a user who
  wants to drop the pre-built collection straight into `collections: []` without the plugin. Low
  value given the plugin is the documented path. Note the naming collision risk if kept: barrel
  `Icon`/`IconSet` (collections) vs `./Icon` (component) vs `./schema` `Icon`/`IconSet` (types) vs
  `./blocks/iconChild` `Icon` (block) — removing the barrel collections reduces that ambiguity.

### Uncertainty

- I treated `packages/create-atomic-payload/scaffolds/**` as real consumers (they are shipped
  template sources). They mirror `templates/**` / `examples/**` exactly and introduced no symbol
  not already covered, so they do not change any classification.
- The `IconsPluginOptions` "keep" rests on the stated rule ("plugin/default export + main options
  type"), not on an actual external import — no file imports that type by name.
