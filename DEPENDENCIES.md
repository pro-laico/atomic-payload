# Dependencies

Runtime dependencies per workspace, split into **Pro Laico** (internal `@pro-laico/*` packages, shown without the prefix) and **Other** (third-party). Plugin packages declare framework requirements as **Peers**. Build-only `devDependencies` are omitted; `docs` and `tools/*` (internal infra) are excluded.

## Packages

| Workspace | Pro Laico | Other | Peers |
|---|---|---|---|
| `@pro-laico/atomic` | core, icons, images, mux-video, richtext, site, styles, zap | @base-ui-components/react, dayjs, next-themes, traverse | @mux/blurup, @payloadcms/richtext-lexical, @payloadcms/ui, next, payload, react, react-dom, server-only, unocss, zustand |
| `@pro-laico/core` | — | @types/json-schema, dayjs, traverse | @base-ui-components/react, @payloadcms/live-preview-react, @payloadcms/ui, next, payload, react, server-only |
| `@pro-laico/create-atomic-payload` | — | chalk, execa, ora | — |
| `@pro-laico/fonts` | core | — | dotenv, payload |
| `@pro-laico/icons` | atomic, core | — | @payloadcms/ui, next, payload, react, server-only, svg-path-bbox, svgo |
| `@pro-laico/images` | atomic, core | — | @oversightstudio/blur-data-urls, next, payload, react |
| `@pro-laico/mux-video` | atomic, core | @mux/mux-video-react | @oversightstudio/mux-video, next, payload, react |
| `@pro-laico/richtext` | atomic, core | — | @payloadcms/richtext-lexical, payload, react |
| `@pro-laico/seed` | atomic, core, icons, site, styles | — | @payloadcms/ui, next, payload, react |
| `@pro-laico/site` | atomic, core, images, styles, zap | — | @payloadcms/plugin-nested-docs, payload, react |
| `@pro-laico/styles` | core, zap | — | @payloadcms/ui, payload, react, unocss |
| `@pro-laico/tracking` | core | — | @next/third-parties, @vercel/analytics, next, payload, posthog-js, react |
| `@pro-laico/zap` | core | server-only, traverse, zod | — |

## Examples

| Workspace | Pro Laico | Other |
|---|---|---|
| `fonts-only` | core, fonts | @payloadcms/db-sqlite, @payloadcms/next, @payloadcms/sdk, @payloadcms/ui, cross-env, dotenv, next, payload, react, react-dom, tsx |
| `icons-only` | core, icons | @payloadcms/db-sqlite, @payloadcms/live-preview-react, @payloadcms/next, @payloadcms/ui, cross-env, dotenv, next, payload, react, react-dom, sharp, shiki |
| `styles-only` | core, styles | @payloadcms/db-sqlite, @payloadcms/live-preview-react, @payloadcms/next, @payloadcms/ui, cross-env, dotenv, next, next-themes, payload, react, react-dom, sharp, unocss |

## Template

| Workspace | Pro Laico | Other |
|---|---|---|
| `atomic-payload` | atomic, core, fonts, icons, images, mux-video, richtext, seed, site, styles, tracking, zap | @base-ui-components/react, @mux/blurup, @mux/mux-video-react, @next/bundle-analyzer, @next/third-parties, @oversightstudio/blur-data-urls, @oversightstudio/mux-video, @payloadcms/db-mongodb, @payloadcms/email-resend, @payloadcms/live-preview-react, @payloadcms/next, @payloadcms/plugin-form-builder, @payloadcms/plugin-nested-docs, @payloadcms/richtext-lexical, @payloadcms/sdk, @payloadcms/storage-vercel-blob, @payloadcms/ui, @vercel/analytics, cross-env, dayjs, dotenv, next, next-themes, payload, posthog-js, react, react-dom, server-only, sharp, svg-path-bbox, svgo, traverse, zod, zustand |

## Internal dependency matrix

Which `@pro-laico/*` packages each workspace depends on. `core` is the base package — it has no internal dependencies (empty row) and every other workspace depends on it.

| Consumer ↓ / Dependency → | atomic | core | fonts | icons | images | mux-video | richtext | seed | site | styles | tracking | zap |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `core` |  |  |  |  |  |  |  |  |  |  |  |  |
| `atomic` |  | ✓ |  | ✓ | ✓ | ✓ | ✓ |  | ✓ | ✓ |  | ✓ |
| `fonts` |  | ✓ |  |  |  |  |  |  |  |  |  |  |
| `icons` | ✓ | ✓ |  |  |  |  |  |  |  |  |  |  |
| `images` | ✓ | ✓ |  |  |  |  |  |  |  |  |  |  |
| `mux-video` | ✓ | ✓ |  |  |  |  |  |  |  |  |  |  |
| `richtext` | ✓ | ✓ |  |  |  |  |  |  |  |  |  |  |
| `seed` | ✓ | ✓ |  | ✓ |  |  |  |  | ✓ | ✓ |  |  |
| `site` | ✓ | ✓ |  |  | ✓ |  |  |  |  | ✓ |  | ✓ |
| `styles` |  | ✓ |  |  |  |  |  |  |  |  |  | ✓ |
| `tracking` |  | ✓ |  |  |  |  |  |  |  |  |  |  |
| `zap` |  | ✓ |  |  |  |  |  |  |  |  |  |  |
| `fonts-only` |  | ✓ | ✓ |  |  |  |  |  |  |  |  |  |
| `icons-only` |  | ✓ |  | ✓ |  |  |  |  |  |  |  |  |
| `styles-only` |  | ✓ |  |  |  |  |  |  |  | ✓ |  |  |
| `atomic-payload` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
