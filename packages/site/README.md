# @pro-laico/site

> The opinionated "what does an Atomic Payload site contain" package. Pages, Header, Footer collections plus the SiteMetaData, Settings, and draft/published Storage globals — all registered by a single `sitePlugin()`.

## What this package is

Where every other plugin contributes one feature, `site` contributes the **shape** of an Atomic Payload site. It registers the collections and globals that every project needs to look like a website:

- **`Pages`** — the main content collection. Each page has SEO and settings tabs and a children-blocks field for Atomic content.
- **`Header`** — site-wide navigation. Modeled as a collection (not a global) so you can have multiple versions and reference them per page if needed.
- **`Footer`** — same pattern as Header.
- **`SiteMetaData`** global — title, description, favicon, default OpenGraph image, etc. The single source of truth for site-level metadata.
- **`Settings`** global — site-wide settings (auth pages, theme toggle defaults, anything that's "one row per site").
- **`baseStorage('draft')`** and **`baseStorage('published')`** globals — the storage targets for the CSS / JSON the `@pro-laico/atomic/hook` processor generates. Two of them so draft and published builds don't clobber each other.

## Why it exists

Without a "site shape" package, every consumer would reinvent Pages, Header, Footer, and the storage globals slightly differently — and the hook in `@pro-laico/atomic/hook` would have to be configurable enough to write to any of them. Locking the shape down lets the hook hardcode where it writes generated CSS, lets the template wire navigation consistently, and gives `seed` a known set of slugs to populate.

## Quick start

```ts
import { buildConfig } from 'payload'
import { sitePlugin } from '@pro-laico/site'

export default buildConfig({
  plugins: [sitePlugin()],
})
```

That's the whole API. The plugin is intentionally unopinionated about cross-package wiring (atomicHook callback, nested-docs plugin, live-preview URL, JSON-schema setup) — that's the template's job, because those choices depend on what other plugins you've enabled.

## What lives in `src/`

| Path | What's there |
| --- | --- |
| `plugin.ts` | `sitePlugin` — registers all collections and globals. |
| `collections/pages/` | The `Pages` collection, SEO tab, settings tab, atomic-hook slug map. |
| `collections/headers/` | The `Header` collection. |
| `collections/footers/` | The `Footer` collection. |
| `globals/settings.ts` | The `Settings` global. |
| `globals/siteMetaData.ts` | The `SiteMetaData` global. |
| `globals/storage.ts` | `baseStorage(stage)` — factory for the draft/published storage globals. |
| `access.ts` | Default access predicates. |
| `components/frontend/` | Frontend React components (Header/Footer/Pages renderers). Lives at a subpath so server config doesn't import client code. |
| `zap.ts` | `zap` registry augmentations + helpers. |

## Notable exports

```ts
import {
  sitePlugin,
  Pages, Header, Footer,
  Settings, SiteMetaData, baseStorage,
  SEOTab, SettingsTab,
  COLLECTION_SLUGS_WITH_ATOMIC_HOOK,
} from '@pro-laico/site'
```

`COLLECTION_SLUGS_WITH_ATOMIC_HOOK` is the explicit list of collections the atomic hook should run on — keep `@pro-laico/atomic/hook`'s wiring in sync with this.

## Subpath imports

| Subpath | What's there |
| --- | --- |
| `./schema` | `zap` registry augmentations |
| `./zap` | The zap helpers for site types |
| `./components/frontend` | Frontend React components |

## Where it sits in the monorepo

Depends on `core`, `images` (for SiteMetaData's favicon field), `atomic`, and `zap`. Consumed by `design-sets`, `seed`, and almost every template page.
