# @pro-laico/ap-apf

Atomic Payload Functions (APF) - virtual checkbox flags used by Atomic Payload collections to mark when documents should re-run specific cache invalidation paths (`seo`, `form`, `page`, `pages`, `active`, `actions`, `classes`, `sitemap`, `siteMetadata`).

```ts
import { generateAPFFields, APField, APFControlsPath } from '@pro-laico/ap-apf'

const fields = [
  ...generateAPFFields(['classes', 'active']),
  APField({ type: 'text', name: 'title', apf: 'seo' }),
]
```

<!-- workspace-deps:start (auto-generated, do not edit) -->

## Workspace dependencies

Other `@pro-laico/*` packages this package depends on:

- [`ap-types`](../ap-types)

Other `@pro-laico/*` packages that depend on this one:

- [`ap-actions`](../ap-actions)
- [`ap-atomic-hook`](../ap-atomic-hook)
- [`ap-child-blocks`](../ap-child-blocks)
- [`ap-design-sets`](../ap-design-sets)
- [`ap-forms`](../ap-forms)
- [`ap-icons`](../ap-icons)
- [`ap-images`](../ap-images)
- [`ap-site`](../ap-site)
- [`ap-utils`](../ap-utils)

<!-- workspace-deps:end -->
