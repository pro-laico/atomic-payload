# @pro-laico/icons

> Custom SVG icons in Payload, optimized on upload and surfaced as a child block. Includes an `IconSet` collection for grouping icons, a select widget for the admin, and the `AtomicIcon` component for the frontend.

## What this package is

A Payload plugin that turns icons into first-class CMS content:

- **`Icon`** upload collection — accepts SVG files. On upload, the `formatSVGHook` runs the file through `svgo` (cleanup) and `svg-path-bbox` (tightens `viewBox`), so what's stored is the smallest correct version of the original.
- **`IconSet`** collection — groups icons under a named bucket (e.g. "Social", "Nav"). The active design set can reference icon sets so icons travel with the theme.
- **`AtomicIcon`** — a React component that renders any stored icon by ID.
- **`createIconSelect`** — a factory that returns a Payload select field server component for picking icons in the admin. Requires you to pass your React-cached getter so it doesn't re-fetch on every render.
- **Child blocks** — `iconChild` (picks from the `Icon` collection) and `svgChild` (pastes raw SVG). Both render via the frontend renderer in `@pro-laico/atomic/children`.

## Why it exists

Icon sets are part of brand and often change with the design. Putting icons in the CMS means non-developers can swap them per design set without code changes. Doing the SVG cleanup on upload (instead of at render time) means the stored asset is always optimized and `viewBox` is correct — no per-render cost, no manual cleanup.

## Quick start

```ts
import { buildConfig } from 'payload'
import { iconsPlugin } from '@pro-laico/icons'

export default buildConfig({
  plugins: [
    iconsPlugin({
      iconSetOptions: {
        livePreviewUrl: yourPreview,
        extraSettingsFields: [
          // e.g. a test path relationship
        ],
      },
    }),
  ],
})
```

Cache revalidation comes from `@pro-laico/core` hooks (`revalidateCacheCollection` on save, `revalidateCacheOnDelete` on delete) — no runtime dependency on `@pro-laico/atomic`. If you want the atomicHook snapshot behavior on `IconSet`, attach it explicitly through the additive `hooks` option:

```ts
import { atomicHook } from '@pro-laico/atomic/hook'

iconsPlugin({
  iconSetOptions: {
    hooks: { beforeChange: [atomicHook] },
  },
})
```

### Extending the collections

Both collections accept additive hooks and fields. User hooks always run **after** the built-ins (so `formatSVGHook` and the revalidation hooks always run first).

```ts
iconsPlugin({
  iconOptions: {
    // Append to top-level Icon fields, after `optimized` + `svgString`.
    fields: [{ name: 'note', type: 'text' }],
    // Merged additively with built-in hooks.
    hooks: {
      afterChange: [({ doc }) => { /* … */ return doc }],
    },
  },
  iconSetOptions: {
    livePreviewUrl,

    // Compact, in-row injection next to title/active.
    extraSettingsFields: [TestPathField],

    // Full-width set-level fields, appended below the title/active row.
    fields: [{ name: 'description', type: 'textarea' }],

    // Per-icon metadata appended to each row inside `iconsArray`.
    iconRowFields: [{ name: 'aliases', type: 'text', hasMany: true }],

    // Additional hooks (afterChange, afterRead, etc.) merged with the built-ins.
    hooks: {
      afterRead: [({ doc }) => doc],
    },
  },
})
```

### Rendering an icon by name

For the common case of "look up an icon by name from the active set and render it inline", import the `<Icon>` server component:

```tsx
import { Icon } from '@pro-laico/icons/Icon'

<Icon name="arrow-right" />
<Icon name="arrow-right" className="size-6 text-primary" />
<Icon name="logo" fallback={myCustomSvgString} />
```

Resolution happens server-side via `@pro-laico/core`'s cached `iconSet` + `icon` getters, so revalidating either tag invalidates just the rendered `<svg>`, not the surrounding page. JSX props always win over the SVG source's intrinsic attributes.

The component lives at the `./Icon` subpath rather than the root barrel so client-bundle imports of the lighter helpers (`extractSvgProps`, `IconLabelPath`, `AtomicIcon`) don't drag a `server-only` import along.

### The icon select widget

The Payload select field component lives behind a factory so you can pass in your app's cached fetcher. In the template, it's wired like this:

```ts
import { createIconSelect, type IconSelectGetCached } from '@pro-laico/icons/admin/iconSelect'
import getCached from '@/utilities/get/cache/react'

export default createIconSelect(getCached as unknown as IconSelectGetCached)
```

The narrow cast is a deliberate workaround for the overload typing.

`createIconSelect` is **intentionally not** re-exported from the package root — that keeps client-bundle imports of `IconLabelPath` / `AtomicIcon` from dragging admin code along.

## What lives in `src/`

| Path | What's there |
| --- | --- |
| `plugin.ts` | `iconsPlugin` — registers `Icon` + `IconSet`. |
| `collections/icon.ts` | The `Icon` upload collection with `formatSVGHook` wired in. |
| `collections/iconSet.ts` | The `IconSet` collection + `createIconSetCollection` factory. |
| `hooks/formatSVG.ts` | `formatSvg` + `formatSVGHook` (svgo + viewBox tightening). |
| `utilities/extractSVG.ts` | `extractSvgContent`, `extractSvgProps` — pull `<path>` data and attrs out of a serialized SVG. |
| `components/frontend/Icon.tsx` | The `<Icon name="..." />` server component — resolves by name from the active IconSet. |
| `components/frontend/AtomicIcon.tsx` | Admin marker glyph for atomic block types (tag/form/input/button/portal). |
| `components/admin/iconRowLabel.tsx` | Admin row label (referenced via `IconLabelPath`). |
| `components/admin/iconSelect.tsx` | Server component for the select widget. |
| `iconSet/defaults.ts` | Optional name presets for seeding or docs. |
| `blocks/iconChild/` | The `iconChild` block (component + block config). |
| `blocks/svgChild/` | The `svgChild` block (paste-in raw SVG). |
| `access/` | Default access predicates. |

## Subpath imports

| Subpath | What's there |
| --- | --- |
| `./schema` | `zap` registry augmentations |
| `./Icon` | `<Icon name="..." />` server component (resolves from the active IconSet) |
| `./admin/iconRowLabel` | Admin row label (loaded via import map) |
| `./admin/iconSelect` | `createIconSelect` factory |
| `./iconSet/defaults` | Name presets for seeding/docs |
| `./blocks/iconChild` | Child block config |
| `./blocks/iconChild/component` | Child block renderer |
| `./blocks/svgChild` | Child block config |
| `./blocks/svgChild/component` | Child block renderer |

## Peer dependencies

`svgo` and `svg-path-bbox` are optional peers — installed in the template but only needed if you actually upload SVGs through the hook.

## Where it sits in the monorepo

Depends on `core` and `atomic`. Used by `children` (renders iconChild/svgChild) and `seed` (writes default icon sets).
