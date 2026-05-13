# @pro-laico/atomic-payload-zap

Zod with Atomic Payload extensions. Re-exports zod and adds the `z.ap` helper for registering and retrieving schemas typed against `AtomicRegistry`.

```ts
import { z } from '@pro-laico/atomic-payload-zap'

export const MySlug = z.ap.add(z.enum(['a', 'b']), { id: 'MySlug' })
```

The `AtomicRegistry` shape is pulled from `@pro-laico/atomic-payload-types`. Augment it via `declare module '@pro-laico/atomic-payload-types'` in your project so `z.ap.get('MySlug')` and `z.ap.Type<'MySlug'>` resolve to concrete types.

Pinned to `zod@4.1.11` because of a known regression past that version.
