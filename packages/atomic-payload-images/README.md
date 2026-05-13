# @pro-laico/atomic-payload-images

Atomic Payload images plugin. Ships the `Images` upload collection (with default WebP format options + image sizes), the `Favicons` collection, the `FaviconField` helper, and an optional integration with `@oversightstudio/blur-data-urls`.

```ts
import { imagesPlugin } from '@pro-laico/atomic-payload-images'

export default buildConfig({
  plugins: [imagesPlugin({ enabled: true })],
})
```
