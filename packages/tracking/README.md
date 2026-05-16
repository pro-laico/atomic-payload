# @pro-laico/tracking

> Analytics + tag-manager integration for Atomic Payload. One Tracking global (with PostHog, Google Tag Manager, and Vercel Analytics tabs + per-provider toggles), one PostHogProperty collection, and React providers you compose at the app root.

## What this package is

The home for everything tracking-related in Atomic Payload. It registers:

- **`Tracking`** global — a single document in the admin with tabs for each supported provider (PostHog, GTM) and toggles to enable/disable them per environment. Editors don't need to touch env vars to flip providers on or off.
- **`PostHogProperty`** collection — lets editors define PostHog user/group properties as content. Used together with `postHogPropertyApplicator` to hydrate the PostHog client.
- **Frontend providers** — React components (`PostHogProvider`, `GoogleTagManagerProvider`, `VercelProvider`, and a composite `TrackingProvider`) you mount at the app root. They read from the Tracking global and conditionally load their respective scripts.

The two "Tab fields" (`postHogTabField`, `googleTagManagerTabField`) are exported so apps that prefer to compose their own Tracking global can drop them in à la carte.

## Why it exists

Tracking is high-friction: env vars in every environment, multiple SDKs that don't agree on initialization, conditional script loading. Putting the config inside Payload — and the provider composition inside a single React component — collapses that to "edit one global, mount one provider."

It's a separate package from `site` because tracking is genuinely optional (some sites have none) and because the optional peer deps (`posthog-js`, `@next/third-parties`, `@vercel/analytics`) shouldn't be forced on anyone who doesn't need them.

## Quick start

```ts
import { buildConfig } from 'payload'
import { trackingPlugin } from '@pro-laico/tracking'

export default buildConfig({
  plugins: [trackingPlugin()],
})
```

Frontend:

```tsx
import { TrackingProvider } from '@pro-laico/tracking/provider'

export default function RootLayout({ children }) {
  return (
    <TrackingProvider>
      {children}
    </TrackingProvider>
  )
}
```

## Plugin options

| Option | Default | What it does |
| --- | --- | --- |
| `enabled` | `true` | No-op the plugin entirely. |
| `addPropertyCollection` | `true` | Register `PostHogProperty`. |
| `addTrackingGlobal` | `true` | Register the `Tracking` global. |

## What lives in `src/`

| Path | What's there |
| --- | --- |
| `plugin.ts` | `trackingPlugin` — registers global + collection. |
| `globals/tracking.ts` | The `Tracking` global config. |
| `globals/postHogTab.ts` | `postHogTabField()` — drop-in tab for the global. |
| `globals/gtmTab.ts` | `googleTagManagerTabField()` — same for GTM. |
| `collections/posthogProperty.ts` | The `PostHogProperty` collection. |
| `components/frontend/PostHogProvider.tsx` | PostHog SDK loader. |
| `components/frontend/GoogleTagManagerProvider.tsx` | GTM loader via `@next/third-parties`. |
| `components/frontend/VercelProvider.tsx` | Vercel Analytics loader. |
| `components/frontend/TrackingProvider.tsx` | Composite — picks providers based on Tracking global flags. |
| `utilities/propertyApplicatorUtility.ts` | `postHogPropertyApplicator` — hydrates PostHog identify calls from `PostHogProperty` docs. |

## Subpath imports

Why client components live behind a subpath: server tooling (e.g. `payload generate:importmap`) resolves the package under the `react-server` condition, where `posthog-js` / `@next/third-parties` / `@vercel/analytics` aren't safe to load.

| Subpath | What's there |
| --- | --- |
| `./provider` | All React providers (`PostHogProvider`, `GoogleTagManagerProvider`, `VercelProvider`, `TrackingProvider`) |
| `./schema` | `zap` registry augmentations |

## Peer dependencies (all optional)

| Peer | When you need it |
| --- | --- |
| `posthog-js` | If PostHog is enabled. |
| `@next/third-parties` | If GTM is enabled. |
| `@vercel/analytics` | If Vercel Analytics is enabled. |

## Where it sits in the monorepo

Depends on `core`. Optional peer of `children`. The template wires `TrackingProvider` into the root layout.
