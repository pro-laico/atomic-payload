# Atomic Payload

The Payload CMS starter where all you need to know is Tailwind — an opinionated Payload + Next.js template that lets you build and style pages from the admin dashboard using atomic CSS utility classes, wiring the full `@pro-laico/*` plugin suite into a ready-to-deploy website builder. Part of [Atomic Payload](https://atomicpayload.com).

- [Documentation](https://atomicpayload.com/docs/templates/atomic-payload)
- [Source code](https://github.com/pro-laico/atomic-payload/tree/main/templates/atomic-payload)
- [Documentation source](https://github.com/pro-laico/atomic-payload/tree/main/docs/content/docs/templates/atomic-payload.mdx)

## Quick start

```bash
npx @pro-laico/create-atomic-payload
```

## Atomic Payload packages used

- `@pro-laico/core` — revalidation hooks and server-URL helpers (the kernel).
- `@pro-laico/atomic` — default form blocks (`formsPlugin`) and action blocks (`actionsPlugin`).
- `@pro-laico/site` — the core "site shape": `Pages`, `Header`, and `Footer` collections plus the `SiteMetaData` and `Settings` globals.
- `@pro-laico/styles` — atomic class-name fields plus the `DesignSet` and `ShortcutSet` collections and draft/published CSS storage globals.
- `@pro-laico/icons` — the `Icon` and `IconSet` collections.
- `@pro-laico/images` — the `Images` and `Favicons` collections (with blur-data-url generation).
- `@pro-laico/fonts` — the `Font` collection and font upload/download pipeline.
- `@pro-laico/mux-video` — the `MuxVideo` collection for video upload/playback through the admin.
- `@pro-laico/richtext` — the Lexical editor configuration (`defaultLexical`).
- `@pro-laico/tracking` — the `Tracking` global (GTM + PostHog) and the `posthogProperty` collection.
- `@pro-laico/seed` — the `SEED DATABASE` admin banner and `POST /api/seed` route (gated by `INCLUDE_SEED`).
- `@pro-laico/zap` — schema-extension support pulled in by the styles/types pipeline.
