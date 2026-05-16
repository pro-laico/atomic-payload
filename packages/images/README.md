# @pro-laico/images

Atomic Payload images plugin. Ships the `Images` upload collection (with default WebP format options + image sizes), the `Favicons` collection, the `FaviconField` helper, and an optional integration with `@oversightstudio/blur-data-urls`.

```ts
import { imagesPlugin } from '@pro-laico/images'

export default buildConfig({
  plugins: [imagesPlugin({ enabled: true })],
})
```

<!-- workspace-deps:start (auto-generated, do not edit) -->

## Workspace dependencies

Other `@pro-laico/*` packages this package depends on:

- [`ap-core`](../core)

Other `@pro-laico/*` packages that depend on this one:

- [`children`](../children)
- [`ap-core`](../core)
- [`ap-site`](../site)

<!-- workspace-deps:end -->
