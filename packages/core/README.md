# Atomic Payload Core

The foundational kernel every other Atomic Payload package builds on: kernel types, the APF runtime, cache + revalidation helpers, JSON-schema generation, and shared admin/frontend UI primitives. Part of [Atomic Payload](https://atomicpayload.com).

- [Documentation](https://atomicpayload.com/docs/plugins/core)
- [Source code](https://github.com/pro-laico/atomic-payload/tree/main/packages/core)
- [Documentation source](https://github.com/pro-laico/atomic-payload/tree/main/docs/content/docs/plugins/core.mdx)

## Atomic Payload dependencies

This is a base package with no `@pro-laico/*` runtime dependencies — it's the trunk almost every other package imports from. It declares its siblings as optional (type-only) peers, referenced but never forced on apps that don't install them:

- `@pro-laico/atomic` (optional) — cache getters / schema for atomic blocks.
- `@pro-laico/site` (optional) — cache getters for header/footer/site metadata.
- `@pro-laico/styles` (optional) — cache getters for design sets / site CSS.
- `@pro-laico/tracking` (optional) — cache getter for the tracking global.
- `@pro-laico/images` (optional) — cache getters for images.

## Exports

| Import | What's there |
| --- | --- |
| `@pro-laico/core` | The barrel: `revalidationPlugin` (default), `jsonSchemaPlugin`, kernel types, fields, hooks, and admin component path constants. |
| `@pro-laico/core/kernel` | `PayloadAugment`, `Get<>`, default fallbacks and generic config helpers. |
| `@pro-laico/core/logger` | `revalidationLogger` — imports `server-only`. |
| `@pro-laico/core/cache` (and `/cache/primitives`) | `withCache` (the caching primitive every package getter wraps its fetch with) and the `mt` tag-merge helper. The data getters now live in the packages that own their collections (`@pro-laico/site/cache`, `styles/cache`, etc.). Imports `server-only`. |
| `@pro-laico/core/payload` | `getPayloadInstance` — Local API handle from the registered config (server-only). |
| `@pro-laico/core/config` | `registerPayloadConfig` / `getPayloadConfig` — the config registry (server-only). |
| `@pro-laico/core/auth/getMeUser` | `getMeUser` — frontend auth helper; imports `next/navigation`. |
| `@pro-laico/core/components/frontend/Toaster` | The `Toaster` client component. |
| `@pro-laico/core/components/frontend/LivePreviewListener` | The `LivePreviewListener` client component. |
| `@pro-laico/core/next/preview` | `previewRouteHandler` for the draft-preview route. |
| `@pro-laico/core/next/exit-preview` | `exitPreviewRouteHandler` for exiting draft preview. |
| `@pro-laico/core/ui/root/siteTriggers` | Admin `SiteTriggers` UI component (import-map). |
| `@pro-laico/core/ui/fields/slug` | Admin slug field UI component (import-map). |
| `@pro-laico/core/admin/controls` | APF admin controls component (import-map). |
| `@pro-laico/core/admin/field` | APF admin field component (import-map). |
| `@pro-laico/core/admin/label` | APF admin label component (import-map). |
