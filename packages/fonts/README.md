# @pro-laico/fonts

> Manages custom fonts in Payload and ships them to disk for `next/font/local`. Works with the design set (when paired with `@pro-laico/styles`) or on its own via a standalone `fontSet` global, and reads the binaries from whatever storage Payload is configured with.

## What this package is

A Payload plugin that:

1. Registers an upload collection (`Font`) so admins can upload font files (woff/woff2/ttf/otf).
2. Optionally registers a `fontSet` global — a singleton picking the active sans/serif/mono/display fonts — for projects that don't use `@pro-laico/styles`'s `designSet`.
3. Ships a build-time CLI (`atomic-fonts-download`) that pulls the active font files out of storage and writes them to disk, where Next.js's `next/font/local` can pick them up.

The download step is what makes a Payload-managed font appear as a real local font in the rendered site, with all the performance benefits of `next/font/local` (subset preloading, layout-shift prevention).

## Why it exists

`next/font` only loads fonts from the filesystem — it can't fetch them from object storage at request time. This package bridges the gap: admin uploads → storage → download script → disk → `next/font/local`.

The downloader is **storage-agnostic**: it reads each font's `url` as Payload reports it, so it works whether the project stores uploads on local disk, Vercel Blob, S3, or any other adapter — no Vercel-specific token required. Relative URLs (local disk) are resolved against `LIVE_SITE_URL` and fetched with the script's auth token; absolute CDN URLs are fetched as-is.

The download step intentionally runs at build time (or during scaffolding), not at request time, because `next/font`'s bundling expects file paths it can resolve at compile.

## Quick start

```ts
import { buildConfig } from 'payload'
import { fontsPlugin } from '@pro-laico/fonts'

// With @pro-laico/styles — fonts come from the active designSet's `font` group:
export default buildConfig({ plugins: [fontsPlugin()] })

// Standalone — register the `fontSet` global to pick the active fonts:
export default buildConfig({ plugins: [fontsPlugin({ global: true })] })
```

`fontsPlugin` options:

| Option | Purpose |
| --- | --- |
| `enabled` | Set `false` to no-op the plugin. Default `true`. |
| `fontOverride` | Shallow-merged onto the `Font` collection — e.g. `upload.staticDir` (local storage location), `access`, `hooks`. |
| `global` | `true` registers the standalone `fontSet` global; pass a partial `GlobalConfig` to override. Default `false`. |

> **Where are fonts stored?** That's Payload's job: the `Font` collection's `upload.staticDir` (local) or a storage plugin (`@payloadcms/storage-*`) you add at the config level. The downloader just follows the `url` Payload produces, so you don't configure storage twice.

## Downloading fonts

The CLI resolves the font selection in order: the **active `designSet`'s `font` group**, then the **`fontSet` global**. So a styles project and a standalone fonts project both work without changing the script.

Three ways to invoke it:

**Programmatic:**
```ts
import { runDownloadFonts } from '@pro-laico/fonts/scripts/downloadFonts'

await runDownloadFonts({ /* optional overrides — see below */ })
```

**Published bin:** `atomic-fonts-download` (requires the package to be built — `dist/scripts/cli.js`). This is the canonical form for consumers.

**In-repo development only:** running the un-built TypeScript source directly with `tsx`. This needs `tsx` installed and a toolchain that resolves the package's `src/` (i.e. inside this monorepo) — it is not a recommendation for published consumers, who should use the bin or programmatic form above.
```jsonc
// package.json
"scripts": { "download:fonts": "pnpm exec tsx node_modules/@pro-laico/fonts/src/scripts/cli.ts" }
```

## Environment variables

| Variable | Purpose |
| --- | --- |
| `LIVE_SITE_URL` | Site to read the active designSet / `fontSet` global from, and the base for resolving relative (local-storage) font URLs. |
| `SCRIPT_USER_EMAIL` | Payload user to authenticate as (needed to read auth-gated fonts and, for local storage, the file route). |
| `SCRIPT_USER_PASSWORD` | Password for that user. |

No storage token is required — the downloader uses whatever URL Payload reports for each font.

## Optional overrides

| Variable | `runDownloadFonts` option | Default behavior |
| --- | --- | --- |
| `ATOMIC_FONTS_OUTPUT_DIR` | `fontsOutputDir` | Where to write font binaries (`./public/fonts`). |
| `ATOMIC_FONTS_DEFINITION_FILE` | `definitionFile` | The generated module declaring each `localFont(...)` call. |
| `ATOMIC_FONTS_ENV_FILE` | `envFile` | `.env` file to load before running. |
| `ATOMIC_FONTS_SRC_PREFIX` | `localFontSrcPrefix` | Path prepended to each `src` in the definition file. |
| `ATOMIC_FONTS_GLOBAL_SLUG` | `fontSetGlobalSlug` | Slug of the global to fall back to (`fontSet`). |
| `ATOMIC_FONTS_CSS_VAR_PREFIX` | `cssVariablePrefix` | Prefix for the emitted CSS custom properties; slot name appended capitalised (`--font-set` → `--font-setSans`). |

## Exports

| Export | What it is |
| --- | --- |
| `fontsPlugin` (default) | The plugin. |
| `Font` | The `Font` upload collection config. |
| `fontUploadField` | The `font` group field for the designSet's Fonts tab. |
| `fontUploadFields` | The four upload slots (shared by the group and the global). |
| `FontSet`, `createFontSetGlobal`, `FONT_SET_SLUG` | The standalone font-selection global. |

## What lives in `src/`

| Path | What's there |
| --- | --- |
| `plugin.ts` | `fontsPlugin` — registers the `Font` collection (+ optional `fontSet` global). |
| `collections/font.ts` | The `Font` upload collection config. |
| `globals/fontSet.ts` | The standalone `fontSet` global. |
| `fields/font.ts` | `fontUploadField` / `fontUploadFields`. |
| `scripts/cli.ts` | CLI entry; thin wrapper around `runDownloadFonts`. |
| `scripts/downloadFonts.ts` | Selection resolution + storage-agnostic download + definition generation. |
| `types/payload-augment.ts` | `Font` / `FontSet` schema stubs. |

## Where it sits in the monorepo

Depends on `core`. Has no internal dependents — `designSet` references font docs by ID, not by import. Optional peer deps on `@payloadcms/sdk` and `dotenv` (only needed when running the download script).
