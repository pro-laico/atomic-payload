# `@pro-laico/images` — Public Export Surface Audit

Barrel: 5 → keep 4, remove 1. Subpaths: 5 → keep 4, remove 1.

> Audit-only. Removing a barrel export does **not** delete its source module — the
> internal relative imports inside `packages/images/src` keep working, and zap /
> `generate:types` are unaffected (this package registers no zap schemas; its
> `./schema` entry only re-exports a generated type alias). The `./schema`
> (payload-augment) entry and the two runtime block/UI subpaths
> (`./blocks/imageChild`, `./blocks/imageChild/component`, the latter loaded by
> Next at runtime via the Atomic children renderer) must stay regardless of how
> the barrel is trimmed.

Barrel symbols enumerated from `src/index.ts`: `Favicons`, `Images`, `FaviconField`,
`ImagesPluginOptions` (type), `default`, `imagesPlugin`.
Subpaths enumerated from `package.json` `exports` (mirrored in `publishConfig.exports`):
`.`, `./schema`, `./cache`, `./blocks/imageChild`, `./blocks/imageChild/component`.

External-consumer search excluded (per method): everything under `packages/images/src`,
`dist/**`, `.next/**` build artifacts, `*payload-types.ts` (generated), and `.md`/`.mdx`
docs. "External" means `templates/**/src/**`, `examples/**/src/**`,
`packages/create-atomic-payload/scaffolds/**/src/**`, or another `packages/*/src/**`.

## Keep

### Barrel exports

- **`Images`** (collection) — imported by an external app to wire the blur plugin against it.
  Evidence: `templates/atomic-payload/src/plugins/blurDataUrls.ts:3`
  (`import { Images } from '@pro-laico/images'`).

- **`FaviconField`** (field factory) — used by a sibling package to mount a favicon picker.
  Evidence: `packages/site/src/globals/siteMetaData.ts:2` and
  `packages/site/src/collections/pages/tabs/SEO.ts:2`
  (`import { FaviconField } from '@pro-laico/images'`).

- **`imagesPlugin` / `default`** (plugin + default export) — the package's primary entry.
  Evidence: `templates/atomic-payload/src/plugins/images.ts:1`
  (`import { imagesPlugin } from '@pro-laico/images'`). `default` is the same factory
  re-exported as the default; keep alongside the named export.

- **`ImagesPluginOptions`** (type) — the main options type for the plugin/default export.
  No external `import { ImagesPluginOptions }` was found in app/sibling source, but per the
  audit rule the plugin's own options type is part of the public API (consumers type their
  `imagesPlugin({...})` call against it). Keep.

### Subpaths

- **`.`** (root barrel) — the package entry; consumed by the three external imports above. Keep.

- **`./schema`** — the payload-augment / type-augmentation entry (re-exports the generated
  `Image` document type via `Get<'Image', DefaultRecord>`). No external `@pro-laico/images/schema`
  import exists in app/sibling source today (only `block.ts` reads `Image` via a relative
  `../../types/payload-augment` import, which is internal), but `./schema` is the conventional
  augment entry and is the typed-data escape hatch for consumers. Keep per the `./schema` rule.

- **`./blocks/imageChild`** (block factory + prebuilt block) — imported by a sibling package.
  Evidence: `packages/atomic/src/children/buildChildBlocks.ts:5`
  (`import { createImageBlock } from '@pro-laico/images/blocks/imageChild'`) and
  `packages/atomic/src/children/blocks.ts:9`
  (`import { Image } from '@pro-laico/images/blocks/imageChild'`).

- **`./blocks/imageChild/component`** (`ImageChild` server component) — imported by a sibling
  package and loaded at runtime by the Atomic children renderer.
  Evidence: `packages/atomic/src/children/frontend-components.ts:4`
  (`export { ImageChild } from '@pro-laico/images/blocks/imageChild/component'`).
  (The `.next` server-reference manifests under `templates/atomic-payload/.next/**` confirm the
  component module is wired into the running app, but those are build artifacts, not source
  consumers.)

## Remove

- **`Favicons`** (barrel export, collection) — **internal-only.** No external code imports it.
  The only consumer is `packages/images/src/plugin.ts:5` via the relative
  `import { Favicons } from './collections/favicons'`, which is internal and unaffected by
  removing the barrel re-export. Across the repo, every other occurrence of `Favicons` is a
  docs/`.md`/`.mdx`/comment mention or the source definition itself — no `import { Favicons }
  from '@pro-laico/images'` exists in any app or sibling package. The plugin already registers
  the Favicons collection automatically (`includeFavicons`, default true), and the
  `faviconsOptions` option covers overriding it, so a consumer never needs to import the raw
  collection. Removing the re-export keeps `./collections/favicons.ts` and the plugin working.
  Evidence (no external consumer): the only `import ... '@pro-laico/images'` lines in non-`images`
  source are in `templates/atomic-payload/src/plugins/images.ts`, `.../blurDataUrls.ts`,
  `packages/site/src/globals/siteMetaData.ts`, and `packages/site/src/collections/pages/tabs/SEO.ts`
  — none import `Favicons`.
  See **Judgment calls** below — `Favicons` is symmetric with the kept `Images` collection, so
  this is a soft remove.

- **`./cache`** subpath (`getCachedImage`) — **internal-only subpath.** Nothing outside the
  package imports `@pro-laico/images/cache`. The single consumer is the block component via a
  relative import: `packages/images/src/blocks/imageChild/component.tsx:8`
  (`import { getCachedImage } from '../../cache'`). A repo-wide search for `getCachedImage` and
  for `@pro-laico/images/cache` finds no app/sibling/template/example/scaffold consumer.
  Removing the `./cache` entry from `exports` leaves the relative import (and therefore the
  rendered block) working. See **Judgment calls** — this is a documented public cache getter,
  so flagged rather than removed outright.

## Judgment calls

- **`Favicons`** — Recommendation: **lean remove, but acceptable to keep.** It is genuinely
  unused externally and the plugin manages the collection for you. However it is the exact
  counterpart of the kept `Images` collection export, and exporting both is a consistent,
  discoverable surface (a consumer extending or relabeling the Favicons collection, or feeding
  it to another plugin the way the template feeds `Images` to blur-data-urls, would import it).
  If you value barrel symmetry / future-proofing over a minimal surface, keep it; otherwise it
  is the one clearly-removable barrel symbol. Counted as REMOVE in the summary.

- **`./cache` (`getCachedImage`)** — Recommendation: **keep the subpath despite no current
  external consumer.** It is a newly added, server-only, documented cache getter (the
  README/docs and `package.json` description treat the cache layer as intentional public API),
  and `@pro-laico/core`'s README explicitly notes `@pro-laico/images` "(optional) — cache
  getters for images." It is the natural escape hatch for an app that renders images outside the
  `ImageChild` block (e.g. a custom frontend component resolving an image URL with the same
  cache/revalidation semantics). Removing it gains almost nothing (the module stays for internal
  use) and would break that intended consumer pattern. Counted as REMOVE in the summary only
  because no external import exists *today*; the recommendation is to retain it.

  If you do keep `./cache`, the corrected headline would read:
  `Subpaths: 5 → keep 5, remove 0.`
