# @pro-laico/zap

Zod with Atomic Payload extensions. Re-exports zod and adds the `z.ap` helper for registering and retrieving schemas typed against `AtomicRegistry`.

```ts
import { z } from '@pro-laico/zap'

export const MySlug = z.ap.add(z.enum(['a', 'b']), { id: 'MySlug' })
```

The `AtomicRegistry` shape is pulled from `@pro-laico/ap-types`. Augment it via `declare module '@pro-laico/ap-types'` in your project so `z.ap.get('MySlug')` and `z.ap.Type<'MySlug'>` resolve to concrete types.

Pinned to `zod@4.1.11` because of a known regression past that version.

<!-- workspace-deps:start (auto-generated, do not edit) -->

## Workspace dependencies

Other `@pro-laico/*` packages this package depends on:

- [`ap-core`](../core)

Other `@pro-laico/*` packages that depend on this one:

- [`ap-actions`](../ap-actions)
- [`ap-atomic-hook`](../ap-atomic-hook)
- [`children`](../children)
- [`ap-design-sets`](../design-sets)
- [`ap-forms`](../ap-forms)
- [`ap-site`](../site)

<!-- workspace-deps:end -->
