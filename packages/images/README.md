# Atomic Payload Images Plugin

On-demand image handling for Atomic Payload. Uploads store only the original; every rendered size is generated on request by a custom Payload endpoint (resize/crop/recompress with Sharp, cropped to a focal point) and cached as a hidden, purgeable variant collection. Ships a focal-point + ratio-preview admin field, a responsive `<img>` component (`ResponsiveImage`, no `next/image`), a dedicated favicons collection, a favicon-picker field, and an `ImageChild` block. Part of [Atomic Payload](https://atomicpayload.com).

- [Documentation](https://atomicpayload.com/docs/plugins/images)
- [Source code](https://github.com/pro-laico/atomic-payload/tree/main/packages/images)
- [Documentation source](https://github.com/pro-laico/atomic-payload/tree/main/docs/content/docs/plugins/images.mdx)

## How it works

- **Upload** stores the original only (no pre-generated sizes by default; `pregenerateSizes` restores the legacy ladder if you want it).
- **Request** `/api/img/<id>?w&h&ar&fit&q&fmt&v` → the endpoint reads the source + its focal point, transforms with Sharp, streams it back same-origin with immutable cache headers, and saves the result to the hidden `generatedImages` collection (via the configured storage adapter, so it's platform-agnostic).
- **Render** with `<ResponsiveImage image={…} aspectRatio="16:9" sizes="100vw" />` — a plain `<img>` whose `srcset` has the settings baked into each URL. The LQIP blur placeholder is **built in**: on upload the plugin shrinks + blurs the original with Sharp into the doc's `blurDataUrl`, and the component reads it and fades the image in over it. Tune or disable it with the `blur` option.
- **Manage** derivatives through the `variants` join on each image, the **Purge variants** button, and automatic purge on re-upload / focal change / delete.

> **Cache invalidation.** Each transform URL carries a `v` token derived from the source's filename + focal point (`deriveVersion`), so replacing the file or moving the focal point yields a *new* URL — busting otherwise-immutable browser/CDN caches while a metadata-only edit (e.g. `alt`) leaves it untouched. The server ignores `v` (focal comes from the doc, and the variant cache key folds it in directly). This only works when you pass a **populated doc** to `<ResponsiveImage>`; a bare id has no identity to version, so its URLs omit `v`.

> **Environment.** Cloud/relative-URL storage adapters are read by self-fetching the server's own static route, so set `NEXT_PUBLIC_SERVER_URL` to your deployment origin — otherwise generation falls back to `http://localhost:3000` and fails in production (surfacing as a `502`). If you customize the endpoint base with `transform.path`, pass the same `path` to `<ResponsiveImage>` / `buildSrcset` and `GenerateMetaData`, or generated URLs will 404.

## Atomic Payload dependencies

- `@pro-laico/core` — the only required `@pro-laico/*` dependency (cached image-URL getter, config/cache primitives, and the `Get<>`/`PayloadAugment` type system).
- `@pro-laico/atomic` — an **optional** peer, needed only for the `./blocks/imageChild` subpath (the Atomic child block). The core image features — the `Images` collection, the on-demand transform endpoint, `ResponsiveImage`, the focal point UI, and blur — don't need it, so the package works in any Payload + Next app with just `@pro-laico/core`.

`sharp` is an optional peer (required for the transform endpoint and the built-in blur placeholders; Payload already brings it).

## Exports

| Import | What's there |
| --- | --- |
| `.` | Plugin barrel — `imagesPlugin`, the `Images` / `Favicons` / `GeneratedImages` collections + factories, the transform/purge endpoint factories, purge hooks, the blur hook + `backfillBlurDataUrls`, and the `FaviconField` helper. |
| `./schema` | `Image` / `GeneratedImage` schema type stubs for the `@pro-laico/core` kernel. |
| `./cache` | `getCachedImage` — cached image-URL getter (maps legacy size names to on-demand URLs). |
| `./components/image` | `ResponsiveImage` — the responsive `<img>` component (server- and client-safe). |
| `./components/buildSrcset` | `buildSrcset` / `buildVariantUrl` — isomorphic URL builders. |
| `./endpoints/transform` | `createTransformEndpoint` / `createPurgeEndpoint`. |
| `./admin/focalPreview` | Focal-point + ratio-preview admin field component. |
| `./admin/purgeVariants` | "Purge variants" admin button component. |
| `./blocks/imageChild` | `ImageChild` block — `createImageBlock` factory + prebuilt `Image` block. |
| `./blocks/imageChild/component` | Child block renderer (`ResponsiveImage`-based). |
