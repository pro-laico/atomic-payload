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
| `.` | Plugin barrel — `iconsPlugin` plus the `extractSvgContent` / `extractSvgProps` SVG helpers and the `IconLabelPath` / `IconUsagePanelPath` import-map constants. |
| `./schema` | Payload `Icon` / `IconSet` type-augmentation stubs. |
| `./Icon` | `<Icon name="..." />` server component (resolves from the active IconSet). |
| `./AtomicIcon` | `AtomicIcon` marker glyph for atomic block types — client-safe entry kept off the server-only main barrel. |
| `./admin/iconRowLabel` | Admin row label (loaded via import map). |
| `./admin/iconSelect` | `createIconSelect` factory for the admin select widget. |
| `./blocks/iconChild` | `IconChild` block config (exported `Icon` const + `createIconBlock` factory). |
| `./blocks/iconChild/component` | `IconChild` block renderer. |
| `./blocks/svgChild` | `SVGChild` block config (exported `SVGBlock` const + `createSvgBlock` factory). |
| `./blocks/svgChild/component` | `SVGChild` block renderer. |
| `./admin/iconUsagePanel` | Server `UIField` for the IconSet edit view — diffs the build-time usage manifest against the set's icons. |
| `./scan` | Build-time usage scanner — `scanIconUsages`, `writeIconUsageManifest`, `loadIconUsageManifest`, and the pure `extractIconUsages`. |

## Requested-icons usage manifest

When you reference icons by name in your app (`<Icon name="chevron" />`), the IconSet collection has no idea which names your code actually needs — names live in the CMS, and a typo just falls back at render time. The usage manifest closes that loop: a build-time scan collects every **literal** `name` you request and an opt-in admin panel diffs it against the icons defined in the set, flagging the missing ones with their `file:line`.

### 1. Scan your source

Run the CLI (e.g. as a `prebuild` script or CI step). Only string literals are collected — `name="x"`, `name='x'`, `name={"x"}`, and non-interpolated `` name={`x`} ``. Dynamic `name={expr}` is intentionally skipped.

```sh
# scan ./src and ./app, write icon-usage-manifest.json
npx atomic-icons-scan

# explicit roots / output / component names / extensions
atomic-icons-scan src app --out icon-usage-manifest.json --component Icon --ext tsx,jsx
```

Or call it programmatically:

```ts
import { scanIconUsages, writeIconUsageManifest, resolveManifestPath } from '@pro-laico/icons/scan'

const { manifest } = scanIconUsages({ roots: ['src', 'app'] })
writeIconUsageManifest(manifest, resolveManifestPath())
```

### 2. Show the panel in the admin

Opt in via `iconSetOptions.usagePanel`. The panel reads the manifest server-side and diffs it live against the icons you're editing:

```ts
iconsPlugin({
  iconSetOptions: {
    usagePanel: true,
    // optional — defaults to $ICON_USAGE_MANIFEST, then icon-usage-manifest.json at cwd
    usageManifestPath: 'icon-usage-manifest.json',
  },
})
```

The manifest path resolves from the `usageManifestPath` option → the `ICON_USAGE_MANIFEST` env var → `icon-usage-manifest.json` in the server's working directory. When no manifest exists yet, the panel renders a hint telling editors to run the scan.

> Names are matched exactly against each icon's kebab-cased `name`, mirroring how `<Icon>` resolves at runtime. Because the scan never executes your code, an `<Icon name="…">` written inside a string or comment may also be picked up — a harmless over-count for an inventory, where missing a real usage would be the worse failure.

### 3. Track runtime misses (live)

The static scan only sees string literals. To also catch what production *actually* requests — including dynamic `<Icon name={slug} />` and genuine misses — enable `trackRequests`:

```ts
iconsPlugin({
  iconSetOptions: { usagePanel: true },
  trackRequests: true,
})
```

This registers an `iconRequest` collection and makes `<Icon>` record every name that fails to resolve against the active set — **throttled** (at most once per name per minute per process), **deferred** via Next's `after()` so it never blocks the response, and **best-effort** (failures are swallowed). Misses surface in the usage panel's "Missing from this set" list with a live `×count` and last-seen date, and dynamic names absent from the code scan are flagged as such. Force-disable the recorder with `ICON_USAGE_TRACKING=false`.

The panel becomes a three-way compare: names requested **in code** (manifest) vs requested **in production** (`iconRequest`) vs **defined** in the set you're editing — so missing, dynamic-only, and (via the present list) unused names are all visible. Counts reflect server renders, not unique visitors (static/ISR pages render once per revalidation).
