# Atomic Payload Icons Plugin

Turns SVG icons into first-class CMS content — an upload collection optimized on upload, an `IconSet` grouping collection, an admin select widget, an `<Icon>` server component, and child blocks for picking or pasting SVGs. Part of [Atomic Payload](https://atomicpayload.com).

- [Documentation](https://atomicpayload.com/docs/plugins/icons)
- [Source code](https://github.com/pro-laico/atomic-payload/tree/main/packages/icons)
- [Documentation source](https://github.com/pro-laico/atomic-payload/tree/main/docs/content/docs/plugins/icons.mdx)

## Atomic Payload dependencies

- `@pro-laico/core` — cache revalidation hooks plus the cached `iconSet` / `icon` getters that resolve icons by name.
- `@pro-laico/atomic` — the `IconChild` / `SVGChild` block components render via its `children` subpath.

`svgo` and `svg-path-bbox` are optional peers — only needed if you upload SVGs through the `formatSVG` hook.

## Exports

| Import | What's there |
| --- | --- |
| `.` | Plugin barrel — `iconsPlugin` plus the `extractSvgContent` / `extractSvgProps` SVG helpers and the `IconLabelPath` import-map constant. |
| `./schema` | Payload `Icon` / `IconSet` type-augmentation stubs. |
| `./Icon` | `<Icon name="..." />` server component (resolves from the active IconSet). |
| `./AtomicIcon` | `AtomicIcon` marker glyph for atomic block types — client-safe entry kept off the server-only main barrel. |
| `./admin/iconRowLabel` | Admin row label (loaded via import map). |
| `./admin/iconSelect` | `createIconSelect` factory for the admin select widget. |
| `./blocks/iconChild` | `IconChild` block config (exported `Icon` const + `createIconBlock` factory). |
| `./blocks/iconChild/component` | `IconChild` block renderer. |
| `./blocks/svgChild` | `SVGChild` block config (exported `SVGBlock` const + `createSvgBlock` factory). |
| `./blocks/svgChild/component` | `SVGChild` block renderer. |
