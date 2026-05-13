# @pro-laico/atomic-payload-fonts

Atomic Payload fonts plugin. Ships the `Font` upload collection (used as targets for design-set font references) and a CLI script for downloading the active design set's fonts to disk for use with `next/font/local`.

```ts
import { fontsPlugin } from '@pro-laico/atomic-payload-fonts'

export default buildConfig({ plugins: [fontsPlugin()] })
```

### Downloading fonts at build time

The package exposes an `atomic-fonts-download` bin that mirrors the original template's `pnpm download:fonts` script.

```jsonc
{
  "scripts": {
    "prebuild": "atomic-fonts-download"
  }
}
```

Environment variables consumed: `LIVE_SITE_URL`, `BLOB_READ_WRITE_TOKEN`, `SCRIPT_USER_EMAIL`, `SCRIPT_USER_PASSWORD`. Override paths with `ATOMIC_FONTS_OUTPUT_DIR`, `ATOMIC_FONTS_DEFINITION_FILE`, `ATOMIC_FONTS_ENV_FILE`.
