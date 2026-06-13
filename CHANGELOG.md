# Changelog

All notable changes to this project are documented in this file. All
`@pro-laico/*` packages share one version (lockstep), so a single entry covers
the whole workspace.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

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
