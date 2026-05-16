# @pro-laico/mux-video

> Mux video upload + playback for Atomic Payload. A thin wrapper around `@oversightstudio/mux-video` that adds a local extension collection and a `videoChild` block.

## What this package is

A Payload plugin that:

1. Registers a local `mux-video` extension collection — the slug the upstream plugin attaches its fields to via `extendCollection: 'mux-video'`. This is where your Mux upload metadata lives.
2. Composes `@oversightstudio/mux-video` with Atomic Payload defaults (admin thumbnail mode, CORS origin from `NEXT_PUBLIC_SERVER_URL`, env-driven Mux credentials).
3. Ships a `videoChild` block so editors can drop a Mux video into Atomic content. Renders via `@pro-laico/atomic/children`.

## Why it exists

Mux is the right answer for video, but its upstream Payload plugin requires you to register a collection it can extend. Every Atomic Payload site needs the same shape there, so we ship one. The wrapper also normalizes config (env vars, defaults) and surfaces the editor block that makes the whole thing usable.

## Quick start

```ts
import { buildConfig } from 'payload'
import { muxVideoPlugin } from '@pro-laico/mux-video'

export default buildConfig({ plugins: [muxVideoPlugin()] })
```

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
| `collectionOverride` | — | Shallow merge over the bundled collection. |
| `adminThumbnail` | `'image'` | What to show in the admin list view (`'image'`, `'gif'`, `'none'`). |
| `uploadSettings` | from `NEXT_PUBLIC_SERVER_URL` | Passed to upstream. |
| `initSettings` | from env | Mux credentials. |

## What lives in `src/`

| Path | What's there |
| --- | --- |
| `plugin.ts` | `muxVideoPlugin` — composes the upstream plugin with our defaults + collection. |
| `collections/muxVideo.ts` | The local `mux-video` extension collection. |
| `blocks/videoChild/` | The `videoChild` block (component + block config). |
| `types/` | Type augmentations. |

## Subpath imports

| Subpath | What's there |
| --- | --- |
| `./blocks/videoChild` | Child block config |
| `./blocks/videoChild/component` | Child block renderer |

## Gotchas

- The upstream `muxVideoPlugin` from `@oversightstudio/mux-video` is async in some versions. This wrapper throws if it gets back a Promise, because Payload's plugin composition requires sync return. If you hit that error, pin to a sync version of the upstream plugin.

## Where it sits in the monorepo

Depends on `core` and `atomic`. Has no internal dependents. Peer-depends on `@oversightstudio/mux-video`.
