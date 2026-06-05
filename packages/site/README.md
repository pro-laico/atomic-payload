# Atomic Payload Site Plugin

The opinionated "site shape" package: Pages, Header, and Footer collections plus the SiteMetaData and Settings globals, all registered by a single `sitePlugin()`. Part of [Atomic Payload](https://atomicpayload.com).

- [Documentation](https://atomicpayload.com/docs/plugins/site)
- [Source code](https://github.com/pro-laico/atomic-payload/tree/main/packages/site)
- [Documentation source](https://github.com/pro-laico/atomic-payload/tree/main/docs/content/docs/plugins/site.mdx)

## Atomic Payload dependencies

- `@pro-laico/core` — shared kernel the plugin builds on.
- `@pro-laico/styles` — type-only / fields relationship for design-set wiring.
- `@pro-laico/images` — supplies SiteMetaData's favicon field.
- `@pro-laico/zap` — the schema registry the site's slug enums feed into.
- `@pro-laico/atomic` — the children-blocks content the Pages collection hosts.

## Exports

| Import | What's there |
| --- | --- |
| `@pro-laico/site` | `sitePlugin` + `SitePluginOptions`, the `Pages` / `Header` / `Footer` collections, and the `SEOTab` / `SettingsTab` fields. |
| `@pro-laico/site/schema` | The Payload type stubs (`Page`, `Header`, `Footer`, `SiteMetaDatum`, `ShortcutSet`). |
| `@pro-laico/site/zap` | The `CollectionSchemas` default export — the site's slug schemas for the `zap` registry. |
| `@pro-laico/site/components/frontend` | The `Header` and `Footer` frontend React renderers, kept off the main barrel so server config never imports client code. |
