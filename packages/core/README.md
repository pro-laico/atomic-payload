# @pro-laico/core

> The foundation every other Atomic Payload package builds on. Kernel types, the APF runtime, cache + revalidation helpers, JSON-schema generation, and shared UI primitives.

## What this package is

`core` is the load-bearing base of the Atomic Payload monorepo. If you imagine the dependency graph as a tree, `core` is the trunk — almost every other `@pro-laico/*` package imports something from it. It consolidates what used to ship as three separate packages (`ap-types`, `ap-apf`, `ap-utils`) into one place.

Four big things live here:

1. **Kernel types** — `PayloadAugment` and `Get<K>`, the indirection layer that lets packages reference the consuming app's generated `payload-types.ts` types without hard-coding them.
2. **APF (Atomic Payload Functions)** — a runtime + field generator that lets admin users define and run small functions inside Payload (think: spreadsheet formulas for content fields).
3. **Cache + revalidation** — opinionated helpers around Next.js `revalidateTag`, including `getCached` factories, collection/global hooks that revalidate on save, and a `revalidationPlugin`.
4. **JSON-schema plugin** — generates JSON Schema entries from registered `zap` schemas, then feeds them into Payload's `typescript.schema` so app types reflect block shapes.

It also ships small but pervasive utilities: `slugField`, `StorageTab`, `ClassNameField`, `DevModeField`, `formatSlugHook`, `getServerSideURL`, `GenerateMetaData`, `deepMerge`, case converters, and admin UI like the `Toaster` and `LivePreviewListener`.

## Why it exists

Atomic Payload is plugin-based, but plugins still need shared primitives. Putting them in one trunk package avoids:

- Circular workspace dependencies between sibling packages.
- Each plugin reinventing slug fields, cache helpers, or type indirection.
- Apps having to wire ten separate plugins for things that always travel together (revalidation + APF + JSON schema).

## Quick start

The default export is `revalidationPlugin`. Most apps wire it in alongside the JSON-schema plugin:

```ts
import { buildConfig } from 'payload'
import revalidationPlugin, { jsonSchemaPlugin } from '@pro-laico/core'

export default buildConfig({
  plugins: [
    revalidationPlugin(),
    jsonSchemaPlugin(),
  ],
})
```

Cache helpers and server-only utilities live behind subpath imports to keep client bundles clean:

```ts
import { createGetCached } from '@pro-laico/core/cache'      // server
import getCached from '@pro-laico/core/cache/react'          // React cache wrapper
import { revalidationLogger } from '@pro-laico/core/logger'  // server-only
```

## What lives in `src/`

| Path | What's there |
| --- | --- |
| `kernel.ts` | `PayloadAugment` interface, `Get<>` helper, default fallbacks. The thing every other package extends. |
| `apf/` | APF runtime, field generator, admin UI (controls, field, label), per-field hooks. |
| `plugin.ts` | `revalidationPlugin` — wires collection/global revalidation hooks. |
| `jsonSchema.ts` | `jsonSchemaPlugin` — converts registered `zap` schemas into Payload `typescript.schema` entries. |
| `utilities/cache/` | `getCached` factory, React `cache()` wrapper, auto-keyed variants. |
| `utilities/revalidateTag.ts` | A safe `revalidateTag` server action wrapper. |
| `hooks/collection/` `hooks/global/` `hooks/field/` | Reusable Payload hooks (`revalidateCache`, `sanitizeAfterRead`, `formatSlug`, etc). |
| `fields/` | `slugField`, `StorageTab`, `ClassNameField`, `DevModeField`, `TestPathField`, `UniqueTitleField`. |
| `ui/` | Admin field components (`slug`, `siteTriggers`) loaded via Payload's import map. |
| `components/frontend/` | `Toaster`, `LivePreviewListener`. |
| `next/` | `previewRouteHandler`, `exitPreviewRouteHandler` for draft preview routes. |

## CLI

This package ships a `core-augment-types` binary (formerly `ap-augment-types`). The template's `generate:types` script chains it after `payload generate:types` to write the project-specific `PayloadAugment` augmentation alongside `payload-types.ts`.

```bash
pnpm payload generate:types && pnpm core-augment-types
```

## Subpath imports — and why they exist

Some modules in `src/index.ts` are intentionally NOT re-exported from the barrel because they would poison client bundles:

| Module | Reason it's a subpath only |
| --- | --- |
| `@pro-laico/core/logger` | `revalidationLogger` imports `server-only`. |
| `@pro-laico/core/cache` | `createGetCached` imports `server-only`. |
| `@pro-laico/core/auth/getMeUser` | Imports `next/navigation`, breaks under the `react-server` condition. |
| `@pro-laico/core/admin/*` | Admin React components; loaded via Payload's import map. |

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

## Where it sits in the monorepo

Foundational. If you're new to the repo, this is the second package to read after `zap`. Almost every other plugin extends one of its primitives.
