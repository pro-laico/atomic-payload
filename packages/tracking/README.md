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

Frontend — `TrackingProvider` needs the `Tracking` global threaded in as a prop (without it, every provider short-circuits and nothing loads). Fetch it server-side in your root layout and pass it down:

```tsx
// app/(frontend)/layout.tsx — a Server Component
import config from '@payload-config'
import { TrackingProvider } from '@pro-laico/tracking/provider'
import { getPayload } from 'payload'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const payload = await getPayload({ config })
  // The Tracking global's `read` is authenticated-only; the Local API defaults to
  // `overrideAccess: true`, so this server fetch works without a session.
  const tracking = await payload.findGlobal({ slug: 'tracking' })

  return <TrackingProvider tracking={tracking}>{children}</TrackingProvider>
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

Why client components live behind a subpath: the providers are client components that pull in `posthog-js` / `@next/third-parties` / `@vercel/analytics`, which aren't safe to load on the server. Keeping them off the main barrel means the server-resolved entry (e.g. for `payload generate:importmap`) never reaches them.

| Subpath | What's there |
| --- | --- |
| `./provider` | All React providers (`PostHogProvider`, `GoogleTagManagerProvider`, `VercelProvider`, `TrackingProvider`) |
| `./schema` | Payload `Tracking` type augmentation stub |

## Peer dependencies

The three provider SDKs are optional (marked `optional: true` in `peerDependenciesMeta`) — install only the ones whose providers you enable. `payload`, `next`, and `react` are required.

| Peer | When you need it |
| --- | --- |
| `payload` (`>=3.0.0`) | Always — the global and collection are Payload configs. |
| `next` (`>=15.0.0`) | Always — required by the GTM provider and the React/Next runtime. |
| `react` (`>=19.0.0`) | Always — the `./provider` components are React components. |
| `posthog-js` (`>=1.0.0`) | Optional — if PostHog is enabled. |
| `@next/third-parties` (`>=15.0.0`) | Optional — if GTM is enabled. |
| `@vercel/analytics` (`>=1.0.0`) | Optional — if Vercel Analytics is enabled. |

## Where it sits in the monorepo

Depends on `core`. Optional peer of `atomic` (its child blocks use the tracking integration). The template wires `TrackingProvider` into the root layout.
