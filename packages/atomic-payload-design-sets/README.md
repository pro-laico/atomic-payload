# @pro-laico/atomic-payload-design-sets

`designSet` and `shortcutSet` collections plus **`designSetsPlugin`**.

The template wires it like this:

```ts
import { designSetsPlugin } from '@pro-laico/atomic-payload-design-sets'

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
