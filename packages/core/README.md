# @pro-laico/core

> The foundation every other Atomic Payload package builds on. Kernel types, the APF runtime, cache + revalidation helpers, JSON-schema generation, and shared UI primitives.

## What this package is

`core` is the load-bearing base of the Atomic Payload monorepo. If you imagine the dependency graph as a tree, `core` is the trunk — almost every other `@pro-laico/*` package imports something from it. It consolidates what used to ship as three separate packages (`ap-types`, `ap-apf`, `ap-utils`) into one place.

Four big things live here:

1. **Kernel types** — `PayloadAugment` and `Get<K>`, the indirection layer that lets packages reference the consuming app's generated `payload-types.ts` types without hard-coding them.
2. **APF (Atomic Payload Functions)** — a runtime + field generator that lets admin users define and run small functions inside Payload (think: spreadsheet formulas for content fields).
3. **Cache + revalidation** — opinionated helpers around Next.js `revalidateTag`, including `createGetCached` / `createDefaultGetCached` factories, collection/global hooks that revalidate on save, and a `revalidationPlugin`.
4. **JSON-schema plugin** — generates JSON Schema entries from registered `zap` schemas, then feeds them into Payload's `typescript.schema` so app types reflect block shapes.

It also ships small but pervasive utilities: `slugField`, `StorageTab`, `DevModeField`, `formatSlugHook`, `getServerSideURL`, `GenerateMetaData`, `deepMerge`, case converters, and admin UI like the `Toaster` and `LivePreviewListener`. (The `ClassNameField` lives in `@pro-laico/styles`, not here.)

## Why it exists

Atomic Payload is plugin-based, but plugins still need shared primitives. Putting them in one trunk package avoids:

- Circular workspace dependencies between sibling packages.
- Each plugin reinventing slug fields, cache helpers, or type indirection.
- Apps having to wire ten separate plugins for things that always travel together (revalidation + APF + JSON schema).

## Quick start

The default export is `revalidationPlugin`. Most apps wire it in alongside the JSON-schema plugin. `revalidationPlugin` attaches its hooks only to the slugs you name in its options, so pass the collections/globals whose saves should revalidate:

```ts
import { buildConfig } from 'payload'
import revalidationPlugin, { jsonSchemaPlugin } from '@pro-laico/core'

export default buildConfig({
  plugins: [
    revalidationPlugin({
      collectionSlugs: ['pages'],
      deleteCollectionSlugs: ['pages'],
      globalSlugs: ['header', 'footer'],
    }),
    jsonSchemaPlugin({
      toJSONSchemaExtensions, // ({ jsonSchema }) => jsonSchema
      generateBlocksType, // ({ name, refs }) => definitions
      blocks, // { ChildBlocks, ActionBlocks, ... } — block $ref lists
    }),
  ],
})
```

Cache helpers and server-only utilities live behind subpath imports to keep client bundles clean:

```ts
import { createGetCached, createDefaultGetCached } from '@pro-laico/core/cache'  // server
import { createReactCachedGetCached } from '@pro-laico/core/cache/react'         // React cache wrapper
import { revalidationLogger } from '@pro-laico/core/logger'                      // server-only
```

## `revalidationPlugin` options

| Option | Default | What it does |
| --- | --- | --- |
| `enabled` | `true` | No-op the plugin entirely. |
| `collectionSlugs` | `[]` | Collections that get the `beforeChange` revalidate hook. |
| `deleteCollectionSlugs` | `[]` | Collections that get the `afterDelete` revalidate hook. |
| `globalSlugs` | `[]` | Globals that get the `beforeChange` revalidate hook. |

`jsonSchemaPlugin` accepts `enabled` (defaults to `true`) plus the required schema-wiring options `toJSONSchemaExtensions`, `generateBlocksType`, and `blocks` (an `AtomicPayloadSchemaBlocks` map of block `$ref` lists), and an optional `extraDefinitions` for per-project overrides. The `createJSONSchemaExtensions` factory and `atomicPayloadStoredDefinitions` are exported alongside it.

## What lives in `src/`

| Path | What's there |
| --- | --- |
| `kernel.ts` | `PayloadAugment` interface, `Get<>` helper, default fallbacks. The thing every other package extends. |
| `apf/` | APF runtime, field generator, admin UI (controls, field, label), per-field hooks. |
| `plugin.ts` | `revalidationPlugin` — wires collection/global revalidation hooks. |
| `jsonSchema.ts` | `jsonSchemaPlugin` — converts registered `zap` schemas into Payload `typescript.schema` entries. |
| `utilities/cache/` | `createGetCached` / `createDefaultGetCached` factories, the stock `defaultGetRegistry`, React `cache()` wrapper (`createReactCachedGetCached`), and the auto-bound `cache/auto` getter. |
| `utilities/revalidateTag.ts` | A safe `revalidateTag` server action wrapper. |
| `utilities/log.ts` | `revalidationLogger` (server-only). |
| `utilities/getPayloadInstance.ts` | `getPayloadInstance` — Local API handle resolved from the registered config (server-only). |
| `utilities/getMeUser.ts` | `getMeUser` — frontend auth helper (imports `next/navigation`). |
| `config/` | `registerPayloadConfig` / `getPayloadConfig` — the `globalThis` config registry the cache helpers read from (server-only). |
| `hooks/collection/` `hooks/global/` `hooks/field/` | Reusable Payload hooks (`revalidateCache`, `sanitizeAfterRead`, `formatSlug`, `updateHrefHook`, `updatePublishedAtHook`, etc). |
| `fields/` | `slugField`, `StorageTab`, `DevModeField`, `TestPathField` / `createTestPathField`, `UniqueTitleField`. |
| `ui/` | Admin field components (`slug`, `siteTriggers`) loaded via Payload's import map. |
| `components/frontend/` | `Toaster`, `LivePreviewListener`. |
| `next/` | `previewRouteHandler`, `exitPreviewRouteHandler` for draft preview routes. |

## CLI

This package ships a `core-augment-types` binary. The template's `generate:types` script chains it after `payload generate:types`. It scans the consumer's `node_modules/@pro-laico/*` packages for their `src/types/payload-augment.ts` stub markers and writes a `payload-types.augment.d.ts` sibling next to the generated `payload-types.ts`, wiring the project's concrete types into the shared `PayloadAugment` interface so every package's `Get<>` stubs resolve to project-specific shapes.

```bash
# defaults to ./src/payload-types.ts; pass a path to override
pnpm payload generate:types && pnpm core-augment-types
```

## Subpath imports

Many modules are intentionally NOT re-exported from the main barrel: server-only modules (`import 'server-only'`) would poison any client component that imports the barrel, `next/navigation` consumers break under the `react-server` condition, and admin React components are loaded by string path through Payload's import map rather than imported directly. Each lives behind its own subpath. The full set matches the `exports` keys in `package.json`:

| Subpath | What's there / why it's separate |
| --- | --- |
| `./kernel` | `PayloadAugment`, `Get<>`, default fallbacks and generic config helpers (also re-exported from the barrel). |
| `./logger` | `revalidationLogger` — imports `server-only`. |
| `./cache` | `createGetCached` / `createDefaultGetCached`, `defaultGetRegistry`, and the stock `getCached*` getters — imports `server-only`. |
| `./cache/react` | `createReactCachedGetCached` — `react.cache()` wrapper, bind per request. |
| `./cache/auto` | Default-exported `getCached`, lazily bound to the registered config via `react.cache()`. |
| `./payload` | `getPayloadInstance` — Local API handle from the registered config (server-only). |
| `./config` | `registerPayloadConfig` / `getPayloadConfig` — the config registry (server-only). |
| `./auth/getMeUser` | `getMeUser` — imports `next/navigation`, breaks under the `react-server` condition. |
| `./components/frontend/Toaster` | The `Toaster` client component. |
| `./components/frontend/LivePreviewListener` | The `LivePreviewListener` client component. |
| `./next/preview` | `previewRouteHandler` for the draft-preview route. |
| `./next/exit-preview` | `exitPreviewRouteHandler` for exiting draft preview. |
| `./ui/root/siteTriggers` | Admin `SiteTriggers` UI component (import-map). |
| `./ui/fields/slug` | Admin slug field UI component (import-map). |
| `./admin/controls` | APF admin controls component (import-map). |
| `./admin/field` | APF admin field component (import-map). |
| `./admin/label` | APF admin label component (import-map). |

Stick to the subpaths shown in `package.json` `exports` and you won't fight bundlers.

## Path constants

Several admin components are referenced by string path (Payload's `importMap` resolves them at runtime). The constants live in the barrel:

```ts
APFControlsPath   // '@pro-laico/core/admin/controls'
APFieldPath       // '@pro-laico/core/admin/field'
APFieldLabelPath  // '@pro-laico/core/admin/label'
SiteTriggersPath  // '@pro-laico/core/ui/root/siteTriggers'
SlugPath          // '@pro-laico/core/ui/fields/slug'
```

## Peer dependencies

| Peer | Optional | When you need it |
| --- | --- | --- |
| `payload` (`>=3.0.0`) | — | Always. The plugins and field configs are Payload primitives. |
| `next` (`>=15.0.0`) | — | Cache/revalidation helpers and preview route handlers target Next.js. |
| `react` (`>=19.0.0`) | — | UI primitives and the `react.cache()` wrappers. |
| `server-only` (`>=0.0.1`) | — | Marks the server-only cache/logger/config modules. |
| `@payloadcms/ui` (`>=3.0.0`) | — | Admin UI components. |
| `@payloadcms/live-preview-react` (`>=3.0.0`) | — | `LivePreviewListener`. |
| `@base-ui-components/react` (`>=1.0.0-rc.0`) | — | Admin field UI primitives. |
| `@pro-laico/atomic` (`>=0.1.0`) | Yes | Cache getters / schema for atomic blocks, when used. |
| `@pro-laico/site` (`>=0.1.0`) | Yes | Cache getters for header/footer/site metadata, when used. |
| `@pro-laico/styles` (`>=0.1.0`) | Yes | Cache getters for design sets / site CSS, when used. |
| `@pro-laico/tracking` (`>=0.1.0`) | Yes | Cache getter for the tracking global, when used. |
| `@pro-laico/images` (`>=0.1.0`) | Yes | Cache getters for images, when used. |

The five `@pro-laico/*` siblings are optional peers: `core` references their types/getters but doesn't force them on apps that don't install them.

Runtime `dependencies`: `dayjs`, `traverse`, `@types/json-schema`.

## Where it sits in the monorepo

Foundational — the trunk almost every other `@pro-laico/*` plugin imports from. Optional peer of its siblings (`atomic`, `site`, `styles`, `tracking`, `images`), which it references but does not require.
