# @pro-laico/mux-video

> Mux video upload + playback for Atomic Payload. A thin wrapper around `@oversightstudio/mux-video` that adds a local extension collection and a `VideoChild` block.

## What this package is

A Payload plugin that:

1. Registers a local `mux-video` extension collection — the slug the upstream plugin attaches its fields to via `extendCollection: 'mux-video'`. This is where your Mux upload metadata lives.
2. Composes `@oversightstudio/mux-video` with Atomic Payload defaults (admin thumbnail mode, CORS origin from `NEXT_PUBLIC_SERVER_URL`, env-driven Mux credentials).
3. Ships a `VideoChild` block so editors can drop a Mux video into Atomic content. The block renderer mounts the `@mux/mux-video-react` player and pulls playback from Mux via `@pro-laico/atomic/children`.

## Why it exists

Mux is the right answer for video, but its upstream Payload plugin requires you to register a collection it can extend. Every Atomic Payload site needs the same shape there, so we ship one. The wrapper also normalizes config (env vars, defaults) and surfaces the editor block that makes the whole thing usable.

## Quick start

```ts
import { buildConfig } from 'payload'
import { muxVideoPlugin } from '@pro-laico/mux-video'

export default buildConfig({ plugins: [muxVideoPlugin()] })
```

Peer dependencies (you supply these):

| Peer | Range | Needed when |
| --- | --- | --- |
| `@oversightstudio/mux-video` | `>=1.0.0` | Always — this package composes the upstream plugin. |
| `next` | `>=15.0.0` | Always — already present in a Payload + Next.js app. |
| `payload` | `>=3.0.0` | Always — already present in a Payload app. |
| `react` | `>=19.0.0` | Always — already present in a Next.js app. |

`@mux/mux-video-react` is bundled as a direct dependency (the Mux player the `VideoChild` component renders), so you don't install it yourself.

Default env vars (all picked up automatically):

| Env | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SERVER_URL` | Used as the `cors_origin` for Mux uploads. Falls back to `http://localhost:3000`. |
| `MUX_TOKEN_ID` | Mux API token ID. |
| `MUX_TOKEN_SECRET` | Mux API token secret. |
| `MUX_WEBHOOK_SIGNING_SECRET` | Mux webhook signing secret. |

## Plugin options

| Option | Default | What it does |
| --- | --- | --- |
| `enabled` | `true` | No-op the plugin entirely. |
| `includeCollection` | `true` | Register the bundled `mux-video` extension collection. Disable if you supply your own with the same slug. |
| `collectionOverride` | — | Override the bundled collection. Top-level keys replace, but `access`/`admin` are deep-merged, `fields` are appended, and `hooks` are merged per phase — so a partial override can't silently drop the collection's access rules or fields. |
| `adminThumbnail` | `'image'` | What to show in the admin list view (`'image'`, `'gif'`, `'none'`). |
| `uploadSettings` | from `NEXT_PUBLIC_SERVER_URL` | `{ cors_origin: string }` passed to upstream. |
| `initSettings` | from env | Mux credentials — `{ tokenId: string; tokenSecret: string; webhookSecret: string }`. |

## What lives in `src/`

| Path | What's there |
| --- | --- |
| `plugin.ts` | `muxVideoPlugin` — composes the upstream plugin with our defaults + collection. |
| `collections/muxVideo.ts` | The local `mux-video` extension collection. |
| `blocks/videoChild/` | The `VideoChild` block (component + block config). The component renders the `@mux/mux-video-react` player. |

## Subpath imports

| Subpath | What's there |
| --- | --- |
| `./blocks/videoChild` | The `VideoChild` block — exports the `createVideoBlock` factory, the built `Video` block, and the `VideoBlockOptions` type (they are intentionally **not** re-exported from the root `.`). |
| `./blocks/videoChild/component` | Child block renderer (`VideoChild`), which mounts the `@mux/mux-video-react` player. |

## Gotchas

- The upstream `muxVideoPlugin` from `@oversightstudio/mux-video` is async in some versions. This wrapper throws if it gets back a Promise, because Payload's plugin composition requires sync return. If you hit that error, pin to a sync version of the upstream plugin.
- If `MUX_TOKEN_ID` / `MUX_TOKEN_SECRET` resolve empty (env unset and no explicit `initSettings`), the plugin logs a warning at build time but does **not** throw — the config still builds, but Mux uploads and API calls will fail until you set them.

## Where it sits in the monorepo

Depends on `core` and `atomic`, and bundles `@mux/mux-video-react` for playback. Has no internal dependents. Peer-depends on `@oversightstudio/mux-video`, `next`, `payload`, and `react`.
