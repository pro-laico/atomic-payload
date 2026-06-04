# @pro-laico/images

> The image upload collection for Atomic Payload, plus a dedicated favicons collection. Defaults to WebP with sensible image sizes and optional blur-data-URL generation.

## What this package is

A Payload plugin that registers:

- **`Images`** — the general-purpose upload collection. Comes with opinionated `formatOptions` (WebP) and a set of `imageSizes` covering the breakpoints the template renders at.
- **`Favicons`** — a separate collection for favicons specifically. They have different size/format requirements and shouldn't live in the same bucket as content images.
- **`FaviconField`** — a reusable field config for picking a favicon from `Favicons` (used in the `SiteMetaData` global).
- **`ImageChild`** block — child block that lets editors drop an image into Atomic blocks. Exposed from the `./blocks/imageChild` subpath as `createImageBlock` (factory) and `Image` (the prebuilt block); it is **not** re-exported from the package root. Renders via `@pro-laico/atomic/children`.

`@oversightstudio/blur-data-urls` is an optional peer. The plugin does **not** auto-wire it (pnpm doesn't hoist the optional peer next to this package, so a `require()` from here would silently fail). Register `blurDataUrlsPlugin` yourself after `imagesPlugin`, passing the exported `Images` collection — see the `imagesPlugin` JSDoc for the snippet.

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

### Plugin options

`imagesPlugin(options?)` accepts:

| Option | Type | Default | Purpose |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | When `false`, the plugin is a no-op. |
| `includeFavicons` | `boolean` | `true` | When `true`, registers the `Favicons` collection alongside `Images`. |
| `imagesOverride` | `Partial<CollectionConfig>` | — | Override for the `Images` collection. Top-level keys replace, but `upload`/`access`/`admin` are deep-merged and `fields`/`hooks` are merged — so a partial override can't silently drop the base `imageSizes`, `mimeTypes`, `alt` field, or access rules. |
| `faviconsOverride` | `Partial<CollectionConfig>` | — | Override for the `Favicons` collection (same deep-merge semantics as `imagesOverride`). |

To use the favicon picker in a global:

```ts
import { FaviconField } from '@pro-laico/images'

const SiteMetaData = {
  slug: 'siteMetaData',
  fields: [
    FaviconField(),
    // ...
  ],
}
```

## What lives in `src/`

| Path | What's there |
| --- | --- |
| `plugin.ts` | `imagesPlugin` — registers the `Images` + `Favicons` collections. |
| `collections/images.ts` | The `Images` upload collection with default `formatOptions` + `imageSizes`. |
| `collections/favicons.ts` | The `Favicons` upload collection. |
| `fields/favicon.ts` | `FaviconField` — a reusable favicon-picker field. |
| `blocks/imageChild/` | The `ImageChild` block — `createImageBlock` factory + `Image` block (component + block config). |
| `access.ts` | Default access predicates. |
| `types/payload-augment.ts` | `Image` schema type stub (resolves through the `@pro-laico/core` kernel). |

## Subpath imports

| Subpath | What's there |
| --- | --- |
| `./schema` | `Image` schema type stub for the `@pro-laico/core` kernel |
| `./blocks/imageChild` | `ImageChild` block — `createImageBlock` factory + prebuilt `Image` block |
| `./blocks/imageChild/component` | Child block renderer |

## Peer dependencies

`@oversightstudio/blur-data-urls` is an optional peer. Install it **and wire it yourself** (see the `imagesPlugin` JSDoc) if you want LQIP-style blur placeholders generated for uploaded images.

## Where it sits in the monorepo

Depends on `core` and `atomic`. Consumed by `atomic` (renders `ImageChild` via its `children` subpath), `core` (which provides the cached image-URL getter for the `images` collection and lists `images` as an optional peer), and `site` (favicon field in `SiteMetaData` and the page SEO tab).
