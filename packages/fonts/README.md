# Atomic Payload Fonts Plugin

Manages custom fonts in Payload and ships them to disk for `next/font/local`, working either with the design set (paired with `@pro-laico/styles`) or standalone via a `fontSet` global, reading binaries from whatever storage Payload is configured with. Part of [Atomic Payload](https://atomicpayload.com).

- [Documentation](https://atomicpayload.com/docs/plugins/fonts)
- [Source code](https://github.com/pro-laico/atomic-payload/tree/main/packages/fonts)
- [Documentation source](https://github.com/pro-laico/atomic-payload/tree/main/docs/content/docs/plugins/fonts.mdx)

## Atomic Payload dependencies

- `@pro-laico/core` — kernel types and shared primitives.

## Exports

| Import | What's there |
| --- | --- |
| `@pro-laico/fonts` | The barrel: `fontsPlugin` (default), `fontUploadField`, `extractFonts`, and `exportFontsEndpoint`. |
| `@pro-laico/fonts/schema` | `Font` / `FontSet` Payload type augmentation stubs. |
| `@pro-laico/fonts/scripts/downloadFonts` | `runDownloadFonts` — selection resolution plus storage-agnostic download and definition generation. |
