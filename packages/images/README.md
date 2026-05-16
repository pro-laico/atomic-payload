# @pro-laico/images

> The image upload collection for Atomic Payload, plus a dedicated favicons collection. Defaults to WebP with sensible image sizes and optional blur-data-URL generation.

## What this package is

A Payload plugin that registers:

- **`Images`** — the general-purpose upload collection. Comes with opinionated `formatOptions` (WebP) and a set of `imageSizes` covering the breakpoints the template renders at.
- **`Favicons`** — a separate collection for favicons specifically. They have different size/format requirements and shouldn't live in the same bucket as content images.
- **`FaviconField`** — a reusable field config for picking a favicon from `Favicons` (used in the `SiteMetaData` global).
- **`imageChild`** block — child block that lets editors drop an image into Atomic blocks. Renders via `@pro-laico/atomic/children`.

If `@oversightstudio/blur-data-urls` is installed, the plugin opts the `Images` collection into automatic blur placeholder generation.

## Why it exists

Image handling is the same for almost every Atomic Payload site — same formats, same sizes, same metadata fields. Bundling that into a plugin means template consumers don't have to reinvent it, and updates to the standard size set propagate automatically.

Favicons are a separate collection because they need different upload constraints (sizes, format) and because mixing them with content images creates UX confusion (every editor uploading a favicon would pollute the main image library).

## Quick start

```ts
import { buildConfig } from 'payload'
import { imagesPlugin } from '@pro-laico/images'

export default buildConfig({
  plugins: [imagesPlugin({ enabled: true })],
})
```

To use the favicon picker in a global:

```ts
import { FaviconField } from '@pro-laico/images'

const SiteMetaData = {
  slug: 'siteMetaData',
  fields: [
    FaviconField,
    // ...
  ],
}
```

## What lives in `src/`

| Path | What's there |
| --- | --- |
| `plugin.ts` | `imagesPlugin` — registers both collections, wires `blur-data-urls` if present. |
| `collections/images.ts` | The `Images` upload collection with default `formatOptions` + `imageSizes`. |
| `collections/favicons.ts` | The `Favicons` upload collection. |
| `fields/favicon.ts` | `FaviconField` — a reusable favicon-picker field. |
| `blocks/imageChild/` | The `imageChild` block (component + block config). |
| `access.ts` | Default access predicates. |
| `types/payload-augment.ts` | `zap` registry augmentations. |

## Subpath imports

| Subpath | What's there |
| --- | --- |
| `./schema` | `zap` registry augmentations |
| `./blocks/imageChild` | Child block config |
| `./blocks/imageChild/component` | Child block renderer |

## Peer dependencies

`@oversightstudio/blur-data-urls` is optional. Install it if you want LQIP-style blur placeholders generated for every uploaded image.

## Where it sits in the monorepo

Depends on `core` and `atomic`. Used by `children` (renders `imageChild`), `core` (icon for the image type), and `site` (favicon field in `SiteMetaData`).
