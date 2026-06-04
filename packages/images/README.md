# Atomic Payload Images Plugin

The image upload collection for Atomic Payload plus a dedicated favicons collection, defaulting to WebP with sensible image sizes, a reusable favicon-picker field, and an `ImageChild` block. Part of [Atomic Payload](https://atomicpayload.com).

- [Documentation](https://atomicpayload.com/docs/plugins/images)
- [Source code](https://github.com/pro-laico/atomic-payload/tree/main/packages/images)
- [Documentation source](https://github.com/pro-laico/atomic-payload/tree/main/docs/content/docs/plugins/images.mdx)

## Atomic Payload dependencies

- `@pro-laico/core` — provides the cached image-URL getter for the `images` collection.
- `@pro-laico/atomic` — the `ImageChild` block renders via its `children` subpath.

`@oversightstudio/blur-data-urls` is an optional peer for LQIP-style blur placeholders; install it and wire it yourself (see the `imagesPlugin` JSDoc).

## Exports

| Import | What's there |
| --- | --- |
| `.` | Plugin barrel — `imagesPlugin`, the `Images` / `Favicons` collections, and the `FaviconField` helper. |
| `./schema` | `Image` schema type stub for the `@pro-laico/core` kernel. |
| `./blocks/imageChild` | `ImageChild` block — `createImageBlock` factory + prebuilt `Image` block. |
| `./blocks/imageChild/component` | Child block renderer. |
