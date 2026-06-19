# Changelog

All notable changes to this project are documented in this file. All
`@pro-laico/*` packages share one version (lockstep), so a single entry covers
the whole workspace.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

## [0.4.1] - 2026-06-19

### Changed

- **Standalone packages are now self-contained.** Every `@pro-laico/*` package
  moves its third-party runtime libraries from `peerDependencies` to
  `dependencies`, so `pnpm add @pro-laico/<pkg>` just works without hand-installing
  transitive deps: `server-only`, `zustand`, `@mux/blurup`, `dotenv`, `svgo`,
  `svg-path-bbox`, `@oversightstudio/mux-video`, `@next/third-parties`,
  `@vercel/analytics`, and `posthog-js`. `@pro-laico/core` is now always a regular
  `dependency` (never a peer), so the shared base always installs.
- **Cross-package `@pro-laico/*` deps are now `peerDependencies`** (paired with a
  `workspace:*` devDependency for local builds), so a consumer resolves a single
  shared copy of each plugin instead of duplicated nested copies. The host
  framework stays peer as before — `payload`, `next`, `react`, `react-dom`,
  `@payloadcms/*` — alongside `sharp`, `unocss`, and `@base-ui/react`. Each plugin
  doc page now spells out what's installed for you vs. what you provide.

### Fixed

- **`@pro-laico/fonts`: clean builds no longer fail on a missing `definition.ts`.**
  The download step now writes an empty stub module when `src/app/definition.ts`
  is absent (e.g. a fresh CI/Vercel checkout, where it's gitignored) on any
  skip/fail path, so `next build` can resolve `@/app/definition` and the fonts
  wire up on the next deploy once `FONT_DOWNLOAD_URL` is reachable.

### Upgrade notes

- Run `pnpm install` after updating. If your package manager doesn't auto-install
  peer dependencies, add the `@pro-laico/*` plugins each package now lists as peers
  (plus `@base-ui/react` / `unocss` / `sharp` where applicable) — each plugin's
  docs page lists exactly what to provide.

## [0.4.0] - 2026-06-16

### Added

- **`@pro-laico/fonts`: typefaces with multiple weight files, optimize-on-upload, and a premium uploader.**
  A `font` document is now **one typeface** that holds its weight/style files
  (Regular/Bold/Italic/…) through a `files` relationship to a new `fontFile` upload
  collection — fed to `next/font/local` as a single `localFont({ src: [...] })`
  declaration (one CSS family per typeface). Opt-in `fontsPlugin({ optimize })`
  converts each uploaded weight file to a subsetted **WOFF2** on save (default
  charset `latin` — ASCII + Latin-1 + common punctuation; also `'latin-ext'` or an
  explicit string), keeps the untouched original in a sibling `fontOriginal`
  collection, auto-detects weight/style/family via `fontkit`, and reports the size
  reduction (`optimized`/`originalFilesize`/`optimizedFilesize`/`savedPercent`).
  Bundles `subset-font` (WASM harfbuzz — serverless-safe) + `fontkit` as
  dependencies (no consumer install); if optimization fails the file is stored
  unmodified. **Off by default**; the `atomic-payload` template enables it.

  A premium **drag-1-or-many uploader** (`uploader` option, default on) replaces the
  native upload UI on the typeface document: drop files, see a client-side `fontkit`
  preview (weight/style, sorted boldest → lightest, normals before italics, with
  duplicate detection), assign a role, then **Save** — no grid of upload fields.
  Dropped files are **staged**, not uploaded on drop; the optimized `fontFile`s are
  created (and linked into `files`) by a `beforeChange` hook only when the document
  saves, so **abandoning a create leaves no orphaned files**. Removing a weight is
  likewise applied on save (an `afterChange` hook deletes de-referenced files). A
  `beforeValidate` guard rejects two files at the same weight + style, and the save
  requires at least one file. New exports: `createFontCollection`,
  `createFontFileCollection`, `createFontOriginalCollection`, `optimizeFontHook`,
  `cleanupOriginalHook`, `cleanupFontFilesHook`, `uniqueWeightHook`,
  `processPendingFontFiles`, `deleteDereferencedFontFiles`, `resolveCharsetText`,
  `@pro-laico/fonts/admin/fontUploader` (`FontUploaderPath`), `FONT_FILE_SLUG`, and
  the `FontsOptimizeOption` type. Adds `react` / `@payloadcms/ui` / `next` peer deps
  for the admin component. (Staged bytes ride the multipart `_payload` field of the
  save; the plugin raises `upload.limits.fieldSize` so the batch isn't truncated, but
  the platform request-body limit still applies — ~4.5 MB on Vercel — so very large or
  numerous fonts must be added across multiple saves.)

  **Consumer setup when `optimize` is on:** register `fontFile` + `fontOriginal` with
  your storage adapter using **server-side** uploads (client-side direct uploads
  bypass the optimize hook), and add `['subset-font', 'harfbuzzjs', 'fontkit']` to
  `serverExternalPackages` in `next.config` so Next/Turbopack doesn't bundle the
  harfbuzz `.wasm`. See the template's `vercelBlobStorage.ts` + `next.config.ts`.

- **`@pro-laico/images`: on-demand image transforms with focal cropping and built-in blur.**
  Uploads now store **only the original** (no fixed size ladder). Every rendered size is
  generated the first time a page requests it by a Sharp transform endpoint
  (`GET /api/img/:id?w&h&ar&fit&q&fmt&v`), cropped to the image's focal point, streamed
  same-origin with immutable cache headers, and cached as a row in a new hidden
  `generatedImages` collection. Render with the bundled **`<ResponsiveImage>`** — a plain
  `<img>` whose `srcset` points at the endpoint (not `next/image`), in server or client
  trees; the srcset step is set on the component via `pixelStep` (default 50px).

  **Blur placeholders are built in** (Sharp shrink + blur on upload into `blurDataUrl`,
  read by `<ResponsiveImage>`), replacing the `@oversightstudio/blur-data-urls` peer; tune
  or disable via the `blur` option, with a `backfillBlurDataUrls` helper for existing
  images. An admin **focal-point picker** with live ratio previews reproduces the endpoint
  crop exactly. **Cache invalidation:** each URL carries a `v` token derived from filename
  + focal so an edit busts immutable browser/CDN caches, and change/delete hooks (plus a
  **Purge variants** button) drop stale cached variants. Ships a new standalone
  **`images-only`** example app. New exports include `createTransformEndpoint` /
  `createPurgeEndpoint`, `GeneratedImages` (+ factory), the purge + blur hooks,
  `ResponsiveImage`, `buildSrcset` / `buildVariantUrl` / `deriveVersion`, and the
  `@pro-laico/images/admin/focalPreview` + `purgeVariants` field components.

  **Consumer setup:** pass `sharp` to `buildConfig`, add `'sharp'` to
  `serverExternalPackages` in `next.config`, set `NEXT_PUBLIC_SERVER_URL` (the endpoint
  self-fetches the original on cloud/relative-URL adapters), and register `generatedImages`
  with your storage adapter using **server-side** uploads.

### Changed

- **BREAKING (`@pro-laico/fonts`):** a `font` document is now a non-upload
  **typeface** (previously one upload = one weight file). The four role slots
  (designSet `font` group + `fontSet` global) are now a single `relationship` →
  `font` — one typeface per role (previously a `hasMany` upload). Weight files live
  in the new `fontFile` upload collection; the optimize hook + `upload.staticDir`/
  `mimeTypes` move from `fontOptions` → `fontFileOptions`. The `GET /api/fonts/export`
  response shape is unchanged (an `ExportedFont[]` per role), now sourced from the
  typeface's `files`. Migrate by re-pointing each role slot at a typeface id and
  regenerating types.

- **BREAKING (`@pro-laico/images`):** the `Images` collection no longer pre-generates
  WebP `imageSizes` on upload — it stores the original only, and all sizing is on demand.
  On SQL adapters this drops the old per-size columns; `pregenerateSizes: true` restores
  the legacy 7-size ladder if you need it. The `@oversightstudio/blur-data-urls` optional
  peer and the plugin's `pixelStep` option are **removed** (blur is built in; the srcset
  `pixelStep` now lives on `<ResponsiveImage>`). The `ImageChild` block renders
  `<ResponsiveImage>` instead of `next/image`, and `getCachedImage`'s legacy size names
  now resolve to on-demand transform URLs. Migrate by rendering through `<ResponsiveImage>`
  and dropping any `blurDataUrlsPlugin` wiring.

## [0.3.4] - 2026-06-12

### Removed

- **BREAKING: `pluginComposer` is removed from `@pro-laico/core`** (along with
  `DEFAULT_ATOMIC_HOOK_SLUGS` and the `PluginComposerOptions` /
  `AtomicWiringOptions` / `PluginComposerRevalidateOptions` types). Its trailing
  finalizer sprayed revalidation hooks onto every collection and global, which
  was redundant (each `@pro-laico/*` collection and global bakes its own) and
  attached the deprecated pre-commit `beforeChange` variants, double-revalidating
  and risking a stale-read race.

  **Migrate** by composing plugins as a plain `Plugin[]` and wiring the two
  cross-cutting concerns explicitly: bake the shared `atomicHook` through each
  owning plugin's option (`stylesPlugin({ atomicHook })` for the design/shortcut
  sets, `iconSetOptions.hooks` for the icon set; `sitePlugin` already bakes it on
  pages/header/footer), and use `revalidationPlugin({ collectionSlugs: [...] })`
  for any third-party collections (e.g. the form builder's `forms` /
  `form-submissions`). See the updated `atomic-payload` template's
  `src/plugins/index.ts`.

### Changed

- `revalidationPlugin` now attaches the post-commit `afterChange` revalidation
  hooks instead of `beforeChange`, so a concurrent read can no longer re-cache a
  document before its write commits.
- Documentation facelift across the site: accuracy fixes, leaner plugin
  reference pages, rewritten/expanded feature guides, and new
  `getting-started/project-structure` and `features/seeding` pages.

## [0.3.3] - 2026-06-12

### Added

- **`@pro-laico/icons`: requested-icons usage manifest, admin panel, and runtime
  miss tracking.** A build-time `atomic-icons-scan` (also `@pro-laico/icons/scan`)
  collects literal `<Icon name="…">` usages into `icon-usage-manifest.json`; an
  opt-in IconSet "Requested icons" panel (`iconSetOptions.usagePanel`) diffs it
  against the set and flags missing names with their `file:line`. `trackRequests:
  true` adds an `iconRequest` collection that records runtime misses (throttled,
  best-effort, including dynamic `name={…}`), shown in the panel with live counts
  and a clear action; disable with `ICON_USAGE_TRACKING=false`. New exports:
  `./scan`, `./admin/iconUsagePanel`, `IconUsagePanelPath`, and the
  `atomic-icons-scan` bin.

### Changed

- `@pro-laico/seed` clears upload collections through `payload.delete` (removing
  each stored file, not just its row) with `disableTransaction`, so re-seeding no
  longer orphans blobs or collides on existing files.
- The template and `icons-only` example enable the usage panel + tracking and add
  a `generate:icons` prebuild; the template's 404 page now renders icons.

### Fixed

- `.gitattributes` forces `eol=lf` so Biome/`check:ci` and `pnpm test` pass on
  Windows checkouts; the seed test suites are isolated into their own vitest fork
  to fix an intermittent race.

## [0.3.2] - 2026-06-09

Every dependency across all packages, examples, templates, tools, and docs was
bumped to its latest version and all deliberate exact version pins were removed
(caret ranges throughout). Scaffolds inherit these changes automatically (they
are generated from the template + examples at pack time).

### Notable upgrades

- **TypeScript** 5.8 → 6.0
- **Payload** ecosystem 3.79 → 3.85 (`payload`, all `@payloadcms/*`)
- **Next.js** 16.1/16.2 → 16.2.7; **React** / **React DOM** 19.2.4 → 19.2.7
- **svgo** 3 → 4, **shiki** 3 → 4, **ora** 8 → 9, **@vercel/analytics** 1 → 2,
  **mongodb-memory-server** 10 → 11, **@mux/mux-video-react** 0.25 → 0.31,
  **sharp** 0.32 → 0.34, **@swc/cli** 0.7 → 0.8, **@types/node** 22 → 25,
  **Biome** 2.4.15 → 2.4.16

### Changed

- Removed the `react` / `react-dom` / `next` `overrides` from
  `pnpm-workspace.yaml`; caret ranges now converge on a single resolved version.
- **`@base-ui-components/react` → `@base-ui/react` (`^1.5.0`).** The old package
  was deprecated and renamed upstream. Swapped the dependency in `core`, `atomic`,
  and the template, and rewrote all `/toast`, `/dialog`, and `/popover` subpath
  imports.
- **`@pro-laico/styles`** now declares `server-only` (peer `>=0.0.1` + dev
  `^0.0.1`), matching `core`/`atomic`. It imports `server-only` in `src/cache` but
  previously resolved it only via lockfile hoisting, which broke under the
  refreshed lockfile (and surfaced via the Payload CLI).
- Regenerated the committed Payload artifacts (`importMap.js`, `payload-types.ts`)
  for the template and all examples to match payload 3.85's generator output.

### Fixed

- **Home page (`/`) rendered blank in production.** It was the only frontend route
  rendered dynamically — `(frontend)/[...slug]`'s `generateStaticParams`
  explicitly excluded `/`, so under the layout's `force-dynamic` the home fell
  through to the dynamic path. Converted the route to an optional catch-all
  `(frontend)/[[...slug]]`, removed the redundant home `page.tsx`, and included `/`
  in `generateStaticParams`. The home now prerenders as static HTML like every
  other page.
- **TypeScript 6 build breaks:** removed the deprecated `baseUrl` from the four app
  `tsconfig.json` files (their `paths` values were already relative, so resolution
  is unchanged), and declared the `@payloadcms/next/css` side-effect import
  (TS2882) in each app.
- **svgo 4:** the `removeScriptElement` plugin was renamed to `removeScripts`
  (uploaded-SVG sanitization in `@pro-laico/icons`).

### Added

- `createTestPathField(pagesSlug?)` is now exported from `@pro-laico/core` (the
  factory behind `TestPathField`), so you can bind the live-preview test-path field
  to a non-default pages collection slug.
- `scripts/check-generated.mjs` and a `test:generated` step (runs after the Turbo
  suite in `pnpm test`) that re-runs `generate:importmap` / `generate:types` for
  every app and fails if the committed output drifts — guarding against stale
  Payload artifacts after future dependency bumps.

### Docs

- Reworked the plugin setup guides for the post-refresh codebase. Every plugin page
  now notes that `@pro-laico/core` ships bundled (a dependency, not a separate
  install) and links to its Setup — and the pages whose cached reads depend on it
  point at the `registerPayloadConfig` instrumentation wiring.
- Full accuracy pass against the current source: corrected the
  `@base-ui-components/react` → `@base-ui/react` peer on the core page, added the
  missing `server-only` peer to the icons and styles pages, fixed the
  `@pro-laico/seed` page's incorrect claim that the seed runs in a transaction (it
  deliberately doesn't — it clears-and-recreates and is re-runnable), switched the
  fonts standalone guide to the published `atomic-fonts-download` bin, and
  documented `ShortcutSet` and `createTestPathField`.

### Upgrade notes

- After pulling, run a fresh install: `pnpm install`.
- The home route directory was renamed (`[...slug]` → `[[...slug]]`). Existing
  local builds must clear `.next` once, since Next's generated type validator
  still references the old route path.

## [0.3.1] - 2026-06-09

### Fixed

- **Seeding a fresh MongoDB now works.** The `atomic-payload` template sets
  `transactionOptions: false` — a fresh database's first write implicitly creates
  its collection, which MongoDB refuses inside a transaction. This also lets the
  app run against a standalone (non–replica-set) local Mongo.
- **`@pro-laico/core` is safe outside a Next request.** `revalidateTag` and
  `withCache` now swallow the "static generation store / incrementalCache missing"
  invariants and fall back to an uncached fetch, so seeding (and other
  non-request contexts) no longer crash.
- **`@pro-laico/seed` icon seeding.** Icons upload sequentially instead of in
  parallel — parallel uploads shared one request and collided on the unique
  `filename`. Also fixed the `cookie` seed icon, which duplicated the logo's
  filename.
- **`create-atomic-payload` published scaffolds** — fixed the pnpm build
  allowlist and the fonts CLI bin.
- `next-env.d.ts` is now gitignored so builds don't churn the tree.

### Added

- A monorepo test harness (Turbo + Vitest + Payload integration): a Mongo-backed
  full-template seed suite (mongodb-memory-server replica set), per-example seed
  tests (fonts / icons / styles), and a `create-atomic-payload` scaffold test
  harness — all wired into `pnpm test`.

## [0.3.0] - 2026-06-08

First public release of the `@pro-laico/*` plugin ecosystem. This transforms
Atomic Payload from a single Payload + Tailwind starter template into a full,
plugin-based monorepo: the functionality that used to live inside one template is
now factored into 12 installable `@pro-laico/*` packages plus the
`create-atomic-payload` scaffolder — each independently documented, versioned in
lockstep, and published to npm. Install just the plugin you need into an existing
Payload app, or scaffold the full stack.

### Added

- **`@pro-laico/core`** — the shared base every other package builds on: kernel
  types (`PayloadAugment` / `Get<>` type augmentation), APF (Atomic Payload
  Functions), shared utilities, cache + cache revalidation, the JSON-schema
  plugin, and admin/frontend UI primitives.
- **Standalone plugins**, usable on their own in any Payload + Next.js project:
  - **`@pro-laico/styles`** — designSet + shortcutSet collections, token fields,
    the CSS preflight pipeline, and the UnoCSS / `processDesignSet` processor.
  - **`@pro-laico/icons`** — Icon and IconSet collections, an SVG-optimizing
    `formatSVG` hook, SVG-extraction helpers, and the `AtomicIcon` component.
  - **`@pro-laico/fonts`** — a Font upload collection and a CLI that downloads
    fonts from the active design set to disk for `next/font/local`.
  - **`@pro-laico/tracking`** — Tracking global plus PostHog, Google Tag Manager,
    and Vercel Analytics providers behind a composite `TrackingProvider`.
- **Runtime / tool packages** the standalones and template compose with (rarely
  installed directly): **`@pro-laico/atomic`** (the runtime engine — action
  blocks, the `beforeChange` CSS/UnoCSS processor, the form pipeline, and the
  child-blocks system), **`@pro-laico/site`** (Pages / Header / Footer plus
  SiteMetaData and Settings via one `sitePlugin()`), **`@pro-laico/images`**
  (Images + Favicons collections, a `FaviconField` helper, an `ImageChild` block
  factory), **`@pro-laico/mux-video`** (a local `MuxVideo` collection wrapping
  `@oversightstudio/mux-video`), **`@pro-laico/richtext`** (the `RichTextChild`
  block, a default Lexical preset, and a JSX renderer), **`@pro-laico/seed`** (a
  `POST /api/seed` endpoint and a BeforeDashboard seed button), and
  **`@pro-laico/zap`** (zod with Atomic Payload extensions — the `z.ap`
  registry-aware schema layer).
- **`create-atomic-payload`** — `npm create @pro-laico/atomic-payload` scaffolds a
  new project or a single-plugin example.
- **New project surfaces:** a Fumadocs **documentation site** (`docs/`);
  standalone **examples** (`fonts-only`, `icons-only`, `styles-only`); and the
  **starter template** (`templates/atomic-payload`) rewired to consume the
  published plugins instead of bundling everything inline.
- **Tooling & infrastructure:** lockstep release tooling (`tools/releaser` —
  `pnpm release`, `pnpm publish-packages`), CI publishing with npm provenance on
  `v*` tags (`.github/workflows/release.yml`), and Biome for lint/format.

## [0.2.0] - 2026-03-12

### Added

- **Monorepo structure**, to better manage packages. The first published package
  is **`create-atomic-payload`**, for faster project setup
  (`pnpx @pro-laico/create-atomic-payload .`); the Payload plugins used by the
  template follow in later releases. (#16)

### Changed

- Updated non-breaking package dependencies, including Payload. (#15)

## [0.1.2] - 2026-01-28

### Added

- An `INCLUDE_SEED` environment toggle to remove/disable seed functionality. (#9)

### Changed

- **Upgraded to Next.js 16.1.6.** An initial implementation — not yet fully
  aligned with every Next 16 best practice, but functionally identical to the
  previous v15 setup. (#12)
- Updated dependencies. (#12)

### Fixed

- `generateMetadata` now uses page SEO titles correctly. (#8)
- The Atomic Store provider uses `useState` instead of a ref. (#10)

## [0.1.1] - 2026-01-19

### Added

- **UnoCSS Typography (prose) configuration controls in the Payload admin.**
  Works in tandem with the rich-text block to style its generated child elements
  across the default / `sm` / `base` / `lg` prose sizes. (#4)

### Removed

- The consent requirement. (#1)
- The Analytics GTM check. (#3)

## [0.1.0] - 2026-01-05

### Added

- Initial release — Atomic Payload now exists.

[Unreleased]: https://github.com/pro-laico/atomic-payload/compare/v0.4.1...HEAD
[0.4.1]: https://github.com/pro-laico/atomic-payload/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/pro-laico/atomic-payload/compare/v0.3.4...v0.4.0
[0.3.4]: https://github.com/pro-laico/atomic-payload/compare/v0.3.3...v0.3.4
[0.3.3]: https://github.com/pro-laico/atomic-payload/compare/v0.3.2...v0.3.3
[0.3.2]: https://github.com/pro-laico/atomic-payload/compare/v0.3.1...v0.3.2
[0.3.1]: https://github.com/pro-laico/atomic-payload/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/pro-laico/atomic-payload/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/pro-laico/atomic-payload/compare/v0.1.2...v0.2.0
[0.1.2]: https://github.com/pro-laico/atomic-payload/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/pro-laico/atomic-payload/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/pro-laico/atomic-payload/releases/tag/v0.1.0
