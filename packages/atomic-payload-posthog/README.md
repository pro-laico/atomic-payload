# @pro-laico/atomic-payload-posthog

Atomic Payload PostHog integration.

```ts
import { posthogPlugin, postHogTabField } from '@pro-laico/atomic-payload-posthog'

export default buildConfig({ plugins: [posthogPlugin()] })
```

Use `postHogTabField()` inside your Tracking global's tabs array. Frontend provider is available at `@pro-laico/atomic-payload-posthog/provider`.
