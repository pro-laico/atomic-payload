# @pro-laico/atomic-payload-fonts

Atomic Payload fonts plugin. Ships the `Font` upload collection (design-set font references), **`fontsPlugin`**, and a CLI to download the active design set’s fonts for `next/font/local`.

```ts
import { fontsPlugin } from '@pro-laico/atomic-payload-fonts'

export default buildConfig({ plugins: [fontsPlugin()] })
```

### Downloading fonts at build time

- **Programmatic:** `import { runDownloadFonts } from '@pro-laico/atomic-payload-fonts/scripts/downloadFonts'` then `await runDownloadFonts({ ... })`.
- **CLI (published):** `atomic-fonts-download` bin (run `pnpm build` in this package so `dist/` exists).
- **Starter template:** `"download:fonts": "pnpm exec tsx node_modules/@pro-laico/atomic-payload-fonts/src/scripts/cli.ts"` (ships `src/` in the package tarball).

Environment variables: `LIVE_SITE_URL`, `BLOB_READ_WRITE_TOKEN`, `SCRIPT_USER_EMAIL`, `SCRIPT_USER_PASSWORD`.

Optional paths: `ATOMIC_FONTS_OUTPUT_DIR`, `ATOMIC_FONTS_DEFINITION_FILE`, `ATOMIC_FONTS_ENV_FILE`, `ATOMIC_FONTS_SRC_PREFIX` (path segments in the generated `localFont({ src })` URLs, relative to the definition file). You can override the same via `runDownloadFonts({ ... })`.
