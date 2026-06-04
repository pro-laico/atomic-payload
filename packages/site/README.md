# @pro-laico/site

> The opinionated "what does an Atomic Payload site contain" package. Pages, Header, Footer collections plus the SiteMetaData and Settings globals — all registered by a single `sitePlugin()`.

## What this package is

Where every other plugin contributes one feature, `site` contributes the **shape** of an Atomic Payload site. It registers the collections and globals that every project needs to look like a website:

- **`Pages`** — the main content collection. Each page has SEO and settings tabs and a children-blocks field for Atomic content.
- **`Header`** — site-wide navigation. Modeled as a collection (not a global) so you can have multiple versions and reference them per page if needed.
- **`Footer`** — same pattern as Header.
- **`SiteMetaData`** global — title, description, favicon, default OpenGraph image, etc. The single source of truth for site-level metadata.
- **`Settings`** global — site-wide settings (auth pages, theme toggle defaults, anything that's "one row per site").

> The draft/published CSS storage globals that previously lived here now ship from `@pro-laico/styles` — `site` no longer registers them.

## Why it exists

Without a "site shape" package, every consumer would reinvent Pages, Header, and Footer slightly differently. Locking the shape down lets the template wire navigation consistently and gives `seed` a known set of slugs to populate. (The CSS storage globals the `@pro-laico/atomic/hook` processor writes to live in `@pro-laico/styles`.)

## Quick start

```ts
import { buildConfig } from 'payload'
import { sitePlugin } from '@pro-laico/site'

export default buildConfig({
  plugins: [sitePlugin()],
})
```

That's the whole API. The plugin is intentionally unopinionated about cross-package wiring (atomicHook callback, nested-docs plugin, live-preview URL, JSON-schema setup) — that's the template's job, because those choices depend on what other plugins you've enabled.

## Plugin options

| Option | Default | What it does |
| --- | --- | --- |
| `enabled` | `true` | When `false`, the plugin is a no-op and registers nothing. |

## What lives in `src/`

| Path | What's there |
| --- | --- |
| `plugin.ts` | `sitePlugin` + `SitePluginOptions` — registers the collections and globals. |
| `collections/pages/collection.ts` | The `Pages` collection. |
| `collections/pages/tabs/SEO.ts` | `SEOTab()` — the SEO tab used by `Pages`. |
| `collections/pages/tabs/settings.ts` | `SettingsTab()` — the per-page settings tab. |
| `collections/pages/atomicHookSlugs.ts` | `COLLECTION_SLUGS_WITH_ATOMIC_HOOK` — the slug list the atomic hook runs on. |
| `collections/headers/collection.ts` | The `Header` collection. |
| `collections/footers/collection.ts` | The `Footer` collection. |
| `collections/{headers,footers}/component.tsx` | The `Header` / `Footer` frontend renderers (re-exported from `./components/frontend`). |
| `globals/settings.ts` | The `Settings` global. |
| `globals/siteMetaData.ts` | The `SiteMetaData` global. |
| `access.ts` | Internal `authd` / `authenticatedOrPublished` access predicates (not exported). |
| `zap.ts` | The site's atomic-hook / storage slug zod enums for the `zap` registry. |
| `types/payload-augment.ts` | `Page` / `Header` / `Footer` / `SiteMetaDatum` / `ShortcutSet` type stubs (the `./schema` entry). |
| `types/payload.ts` | Side-effect `RequestContext` augmentation, imported from `index.ts`. |

## Notable exports

```ts
import {
  sitePlugin,
  type SitePluginOptions,
  Pages, Header, Footer,
  Settings, SiteMetaData,
  SEOTab, SettingsTab,
  COLLECTION_SLUGS_WITH_ATOMIC_HOOK,
} from '@pro-laico/site'
```

`COLLECTION_SLUGS_WITH_ATOMIC_HOOK` is the explicit list of collections the atomic hook should run on — keep `@pro-laico/atomic/hook`'s wiring in sync with this.

## Subpath imports

| Subpath | What's there |
| --- | --- |
| `./schema` | The Payload type stubs (`Page`, `Header`, `Footer`, `SiteMetaDatum`, `ShortcutSet`). |
| `./zap` | The site's slug zod enums (`CollectionThatUsesAtomicHookSlug`, `CollectionWithStoredAtomicClassesSlug`, etc.) for the `zap` registry. |
| `./components/frontend` | The `Header` and `Footer` frontend React renderers. Kept off the main barrel so server-side config never imports client code. |

## Peer dependencies

| Peer | When you need it |
| --- | --- |
| `payload` (`>=3.0.0`) | Always — the collections and globals are Payload configs. |
| `react` (`>=19.0.0`) | Always — the `./components/frontend` renderers are React components. |
| `@payloadcms/plugin-nested-docs` (`>=3.0.0`) | Always — `Pages` uses its `createParentField` / `createBreadcrumbsField` for the page tree. |

## Where it sits in the monorepo

Depends on `core`, `images` (for SiteMetaData's favicon field), `atomic`, `zap`, and `styles` (the last is a type-only / fields peer relationship). Consumed by `seed` and almost every template page.
