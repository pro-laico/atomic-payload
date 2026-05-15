# @pro-laico/ap-atomic-hook

Atomic Payload atomic-hook plugin factory. Attaches a caller-supplied `atomicHook` (orchestrating beforeChange hook) to a list of collection slugs. Also exports the shared `sanitizeData` and `manualLogger` utilities used by the hook.

```ts
import { atomicHookPlugin } from '@pro-laico/ap-atomic-hook'
import { atomicHook } from '@/hooks/collection/atomicHook/atomicHook'

export default buildConfig({
  plugins: [
    atomicHookPlugin({
      hook: atomicHook,
      collectionSlugs: ['pages', 'header', 'footer', 'iconSet', 'designSet', 'shortcutSet'],
    }),
  ],
})
```

### Roadmap

The orchestrating hook implementation currently lives in the consuming template because it imports template-only processors (`ActionBlockStorageProcessor`, `cssProcessor`, `processDesignSet`). A subsequent release will fold the hook and its processors into this package once the action and design-set extractions are complete.

<!-- workspace-deps:start (auto-generated, do not edit) -->

## Workspace dependencies

Other `@pro-laico/*` packages this package depends on:

- [`ap-actions`](../ap-actions)
- [`ap-core`](../ap-core)
- [`ap-design-sets`](../ap-design-sets)
- [`ap-forms`](../ap-forms)
- [`ap-site`](../ap-site)
- [`zap`](../zap)

Other `@pro-laico/*` packages that depend on this one:

- [`ap-actions`](../ap-actions)
- [`children`](../children)
- [`ap-core`](../ap-core)
- [`ap-site`](../ap-site)

<!-- workspace-deps:end -->
