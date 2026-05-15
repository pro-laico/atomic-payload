# @pro-laico/ap-icons

Atomic Payload icons plugin. Provides the `Icon` upload collection (SVG optimization via `svgo` + viewBox tightening via `svg-path-bbox`), `IconSet`, `formatSVGHook`, SVG helpers, `AtomicIcon`, admin row labels, and **`createIconSelect(getCached)`** for the Payload select field server component.

```ts
import { buildConfig } from 'payload'
import { iconsPlugin } from '@pro-laico/ap-icons'

export default buildConfig({
  plugins: [
    iconsPlugin({
      iconSetOptions: {
        atomicHook: yourHook,
        livePreviewUrl: yourPreview,
        extraSettingsFields: [/* e.g. test path relationship */],
      },
    }),
  ],
})
```

In the starter template, `Icon` + `iconSet` are registered via `iconsPlugin` in `src/plugins/icons.ts`. The admin **Icon select** field uses a short app file that wires your React-cached getter (overload typing requires a narrow cast):

```ts
import { createIconSelect, type IconSelectGetCached } from '@pro-laico/ap-icons/admin/iconSelect'
import getCached from '@/utilities/get/cache/react'

export default createIconSelect(getCached as unknown as IconSelectGetCached)
```

`createIconSelect` is not re-exported from the package root so importing `IconLabelPath` / `AtomicIcon` from `@pro-laico/ap-icons` does not pull admin code into client bundles.

Optional icon-name presets for seeding or docs: `@pro-laico/ap-icons/iconSet/defaults`.

<!-- workspace-deps:start (auto-generated, do not edit) -->

## Workspace dependencies

Other `@pro-laico/*` packages this package depends on:

- [`ap-apf`](../ap-apf)
- [`ap-types`](../ap-types)
- [`ap-utils`](../ap-utils)

Other `@pro-laico/*` packages that depend on this one:

- [`ap-child-blocks`](../ap-child-blocks)
- [`ap-seed`](../ap-seed)

<!-- workspace-deps:end -->
