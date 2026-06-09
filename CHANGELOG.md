# Changelog

All notable changes to this project are documented in this file. All
`@pro-laico/*` packages share one version (lockstep), so a single entry covers
the whole workspace.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

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
