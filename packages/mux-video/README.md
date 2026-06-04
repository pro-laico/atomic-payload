# Atomic Payload Mux Video Plugin

Mux video upload and playback for Atomic Payload — a thin wrapper around `@oversightstudio/mux-video` that adds a local extension collection with Atomic Payload defaults and a `VideoChild` block. Part of [Atomic Payload](https://atomicpayload.com).

- [Documentation](https://atomicpayload.com/docs/plugins/mux-video)
- [Source code](https://github.com/pro-laico/atomic-payload/tree/main/packages/mux-video)
- [Documentation source](https://github.com/pro-laico/atomic-payload/tree/main/docs/content/docs/plugins/mux-video.mdx)

## Atomic Payload dependencies

- `@pro-laico/core` — Atomic Payload kernel and defaults.
- `@pro-laico/atomic` — the `VideoChild` component pulls playback via its `children` subpath.

Bundles `@mux/mux-video-react` as a direct dependency (the player the `VideoChild` renders). Peer-depends on `@oversightstudio/mux-video`, `next`, `payload`, and `react`.

## Exports

| Import | What's there |
| --- | --- |
| `.` | Plugin barrel — `muxVideoPlugin`, which composes the upstream plugin with the local `mux-video` extension collection. |
| `./blocks/videoChild` | `VideoChild` block — `createVideoBlock` factory, the built `Video` block, and the `VideoBlockOptions` type. |
| `./blocks/videoChild/component` | Child block renderer, which mounts the `@mux/mux-video-react` player. |
