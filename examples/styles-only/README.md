# Atomic Payload — Styles Only Example

A minimal Atomic Payload example that demonstrates the `@pro-laico/styles` plugin in isolation — author a `designSet` and `shortcutSet` plus atomic-class-styled page blocks in the admin, and the standalone UnoCSS `cssHook` compiles the stylesheet the frontend renders. Part of [Atomic Payload](https://atomicpayload.com).

- [Documentation](https://atomicpayload.com/docs/examples/styles-only)
- [Source code](https://github.com/pro-laico/atomic-payload/tree/main/examples/styles-only)
- [Documentation source](https://github.com/pro-laico/atomic-payload/tree/main/docs/content/docs/examples/styles-only.mdx)

## Quick start

```bash
npx @pro-laico/create-atomic-payload my-styles --template styles-only
```

## Atomic Payload packages used

- `@pro-laico/styles` — the `designSet` + `shortcutSet` collections, the `ClassNameField` input, the draft/published CSS globals, the standalone `cssHook`, and the cache getters (`@pro-laico/styles/cache`: `getCachedDesignSet`, `getCachedSiteCSS`, `createCssGetCached`).
- `@pro-laico/core` — the kernel, the `withCache` caching primitive, the config registry (`registerPayloadConfig`), and `core-augment-types` (used in `generate:types`).
