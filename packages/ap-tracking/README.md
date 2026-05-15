# @pro-laico/ap-tracking

Atomic Payload tracking integration. Home for all tracking-related functionality (PostHog property collection, tracking global tab, React provider) consumed by atomic-payload via a plugin.

```ts
import { posthogPlugin, postHogTabField } from '@pro-laico/ap-tracking'

export default buildConfig({ plugins: [posthogPlugin()] })
```

Use `postHogTabField()` inside your Tracking global's tabs array. Frontend provider is available at `@pro-laico/ap-tracking/provider`.

<!-- workspace-deps:start (auto-generated, do not edit) -->

## Workspace dependencies

Other `@pro-laico/*` packages this package depends on:

- [`ap-core`](../ap-core)

Other `@pro-laico/*` packages that depend on this one:

- [`ap-core`](../ap-core)
- [`children`](../children) _(peer)_

<!-- workspace-deps:end -->
