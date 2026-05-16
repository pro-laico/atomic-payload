# @pro-laico/fonts

> Manages custom fonts in Payload and ships them to disk for `next/font/local`. Built around the design set — only fonts referenced by the active set get downloaded.

## What this package is

A Payload plugin that:

1. Registers an upload collection (`Font`) so admins can upload font files (woff/woff2) and reference them from the design set.
2. Ships a build-time CLI (`atomic-fonts-download`) that pulls the active design set's font files out of storage and writes them to disk, where Next.js's `next/font/local` can pick them up.

The download step is what makes a Payload-managed font appear as a real local font in the rendered site, with all the performance benefits of `next/font/local` (subset preloading, layout-shift prevention).

## Why it exists

Atomic Payload's design tokens include font choices, so font management needs to live in the same place as the rest of the theme. But `next/font` only knows how to load fonts from the filesystem — it can't fetch them from Vercel Blob at runtime. This package bridges the gap: admin uploads → storage → download script → disk → `next/font/local`.

The download step intentionally runs at build time (or during scaffolding), not at request time, because next/font's bundling expects file paths it can resolve at compile.

## Quick start

```ts
import { buildConfig } from 'payload'
import { fontsPlugin } from '@pro-laico/fonts'

export default buildConfig({ plugins: [fontsPlugin()] })
```

In the template, the `download:fonts` script runs the CLI after every install or when fonts change.

## Downloading fonts

Three ways to invoke the download:

**Programmatic (from your own script):**
```ts
import { runDownloadFonts } from '@pro-laico/fonts/scripts/downloadFonts'

await runDownloadFonts({
  // optional overrides — see env vars below
})
```

**Published bin:**
```bash
atomic-fonts-download
```
(Requires the package to be built — `dist/scripts/cli.js` is the published entry.)

**Starter template:**
```jsonc
// package.json
"scripts": {
  "download:fonts": "pnpm exec tsx node_modules/@pro-laico/fonts/src/scripts/cli.ts"
}
```
(Runs the TypeScript source directly via `tsx`. The package's `files` includes `src/` so this works.)

## Environment variables

| Variable | Purpose |
| --- | --- |
| `LIVE_SITE_URL` | Where to fetch the active design set from. |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token for pulling the font binaries. |
| `SCRIPT_USER_EMAIL` | Payload user to authenticate as for the download. |
| `SCRIPT_USER_PASSWORD` | Password for that user. |

## Optional path overrides

| Variable | Default behavior |
| --- | --- |
| `ATOMIC_FONTS_OUTPUT_DIR` | Where to write font binaries. |
| `ATOMIC_FONTS_DEFINITION_FILE` | The generated TypeScript file declaring each `localFont(...)` call. |
| `ATOMIC_FONTS_ENV_FILE` | `.env` file to load before running. |
| `ATOMIC_FONTS_SRC_PREFIX` | Path segments prepended to each `src` in the definition file (relative to the file itself). |

All four can also be passed as options to `runDownloadFonts(...)`.

## What lives in `src/`

| Path | What's there |
| --- | --- |
| `plugin.ts` | `fontsPlugin` — registers the `Font` collection. |
| `collections/font.ts` | The `Font` upload collection config. |
| `scripts/cli.ts` | CLI entry; thin wrapper around `runDownloadFonts`. |
| `scripts/downloadFonts.ts` | The actual download + file-generation logic. |
| `types/payload-augment.ts` | `zap` registry augmentations. |

## Where it sits in the monorepo

Depends on `core`. Has no internal dependents — `designSet` references font docs by ID, not by import. Optional peer deps on `@payloadcms/sdk` and `dotenv` (only needed when running the download script).
