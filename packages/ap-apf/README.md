# @pro-laico/ap-apf

Atomic Payload Functions (APF) - virtual checkbox flags used by Atomic Payload collections to mark when documents should re-run specific cache invalidation paths (`seo`, `form`, `page`, `pages`, `active`, `actions`, `classes`, `sitemap`, `siteMetadata`).

```ts
import { generateAPFFields, APField, APFControlsPath } from '@pro-laico/ap-apf'

const fields = [
  ...generateAPFFields(['classes', 'active']),
  APField({ type: 'text', name: 'title', apf: 'seo' }),
]
```
