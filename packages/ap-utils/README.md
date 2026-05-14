# @pro-laico/ap-utils

Atomic Payload revalidation utilities: a `revalidateTag` server action that knows the full Atomic Payload tag taxonomy (with cascading revalidations), the unified collection/global Payload hooks, and a Payload plugin factory that wires those hooks into the slugs you specify.

## Install

```bash
pnpm add @pro-laico/ap-utils
```

## Usage

```ts
import { buildConfig } from 'payload'
import { revalidationPlugin } from '@pro-laico/ap-utils'

export default buildConfig({
  plugins: [
    revalidationPlugin({
      collectionSlugs: ['icon', 'iconSet', 'images', 'forms', 'form-submissions'],
      deleteCollectionSlugs: ['header', 'footer', 'iconSet', 'designSet', 'shortcutSet', 'pages'],
      globalSlugs: ['siteMetaData', 'tracking', 'settings'],
    }),
  ],
})
```

Direct imports are also available:

```ts
import { revalidateTag } from '@pro-laico/ap-utils'

await revalidateTag('pages', true) // revalidate draft pages (cascades to sitemap)
```
