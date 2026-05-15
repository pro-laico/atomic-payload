# @pro-laico/ap-images

Atomic Payload images plugin. Ships the `Images` upload collection (with default WebP format options + image sizes), the `Favicons` collection, the `FaviconField` helper, and an optional integration with `@oversightstudio/blur-data-urls`.

```ts
import { imagesPlugin } from '@pro-laico/ap-images'

export default buildConfig({
  plugins: [imagesPlugin({ enabled: true })],
})
```

<!-- workspace-deps:start (auto-generated, do not edit) -->

## Workspace dependencies

Other `@pro-laico/*` packages this package depends on:

- [`ap-apf`](../ap-apf)
- [`ap-types`](../ap-types)
- [`ap-utils`](../ap-utils)

Other `@pro-laico/*` packages that depend on this one:

- [`ap-child-blocks`](../ap-child-blocks)
- [`ap-site`](../ap-site)
- [`ap-utils`](../ap-utils)

<!-- workspace-deps:end -->
