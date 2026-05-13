# @pro-laico/atomic-payload-icons

Atomic Payload icons plugin. Provides the `Icon` Payload upload collection (with SVG optimization via `svgo` and viewBox tightening via `svg-path-bbox`), the `formatSVGHook`, SVG extraction helpers, an `AtomicIcon` brand component, and an admin row label for icon arrays.

```ts
import { buildConfig } from 'payload'
import { iconsPlugin } from '@pro-laico/atomic-payload-icons'

export default buildConfig({
  plugins: [iconsPlugin({ enabled: true })],
})
```
