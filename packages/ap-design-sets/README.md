# @pro-laico/ap-design-sets

`designSet` and `shortcutSet` collections plus **`designSetsPlugin`**.

The template wires it like this:

```ts
import { designSetsPlugin } from '@pro-laico/ap-design-sets'

designSetsPlugin({
  atomicHook: yourBeforeChangeHook,
  generateLivePreviewPath: yourPreviewUrl,
  // optional: access, collection (shallow merge) for designSet
  shortcutSet: {
    // optional: false to omit shortcutSet entirely
    // defaultShortcuts: [...],  // read-only rows shown in admin for defaultShortcuts field
    // access, collection — same pattern as designSet
  },
})
```

Row-label / admin component paths still use the template `@/ui/...` strings resolved via the app `importMap`.

<!-- workspace-deps:start (auto-generated, do not edit) -->

## Workspace dependencies

Other `@pro-laico/*` packages this package depends on:

- [`ap-apf`](../ap-apf)
- [`ap-site`](../ap-site)
- [`ap-types`](../ap-types)
- [`ap-utils`](../ap-utils)
- [`ap-zap`](../ap-zap)

Other `@pro-laico/*` packages that depend on this one:

- [`ap-atomic-hook`](../ap-atomic-hook)
- [`ap-seed`](../ap-seed)
- [`ap-utils`](../ap-utils)

<!-- workspace-deps:end -->
