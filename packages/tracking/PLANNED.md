# @pro-laico/tracking — Planned Features & Deferred Work

Forward-looking backlog distilled from `AUDIT.md`. These items are intentionally **not** done today — each needs a breaking migration, a build artifact, or has low marginal benefit. The corresponding `AUDIT.md` checkbox stays `[ ]` with an inline annotation.

## RSC / bundle optimization

### `./provider` `react-server` stub
- **What:** Add a `"react-server"` condition (before `import`) on the `./provider` subpath pointing to a server-stub file that exports `null`-returning stubs, so server builds / `generate:importmap` never resolve the full client bundle (which pulls in `posthog-js` + `@next/third-parties`).
- **Why deferred:** Real optimization but low marginal benefit — `TrackingProvider` is already `'use client'`, so the RSC boundary already prevents server execution of `posthog-js`. Needs a stub file + condition + rebuild.
- **Source:** `package.json` `./provider` export · AUDIT.md → High.

### GTM / Vercel providers as Server Components
- **What:** `GoogleTagManagerProvider` and `VercelProvider` wrap server components (`<GoogleTagManager>`, `<Analytics />`) in `'use client'`, which prevents SSR script injection and delays load. Refactor to render them directly from a Server Component in the layout.
- **Source:** `src/components/frontend/*` · AUDIT.md → Notes.

## Notes / intentional-for-now

- **`Tracking` global `read: authd`** — intentional, same posture as site/fonts: the cache getter reads via Local API default `overrideAccess: true`, so SSR works while anonymous REST/GraphQL reads stay denied. Could be made explicit later. (AUDIT.md → High, annotated intentional.)
- **External-publish build** — `main`/`types`/`./schema` resolve to `src` (workspace pattern); only `./provider` points at `dist` (genuine client bundle). For an external npm consumer, compile `./schema` and `main`/`types` to `dist`. (AUDIT.md → Medium.)
