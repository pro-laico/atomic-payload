# Monorepo Development

This document is for contributors and maintainers working on the Atomic Payload monorepo — structure, local development, publishing the CLI, and adding plugins.

## Structure

```
atomic-payload/
├── packages/
│   ├── create-atomic-payload/   # CLI that scaffolds new projects
│   ├── core/                    # Kernel (PayloadAugment, Get<>, ExtractOrDefault), revalidate hooks, cache helpers, APF runtime, plugin
│   ├── zap/                     # zod + AtomicRegistry helper
│   ├── atomic/                  # actions, hook (createAtomicHook + cssProcessor), forms, children — runtime + admin UI
│   ├── site/                    # sitePlugin: Pages, Header, Footer, SiteMetaData, Settings, Storage globals
│   ├── styles/                  # stylesPlugin: designSet + shortcutSet collections, className field, CSS storage globals, token fields, cssProcessor + cssHook + processDesignSet (all CSS handling)
│   ├── icons/                   # iconsPlugin: Icon + iconSet collections, formatSVG, AtomicIcon
│   ├── images/                  # Images + Favicons collections + FaviconField + blur integration
│   ├── fonts/                   # fontsPlugin + Font collection + font download CLI
│   ├── mux-video/               # MuxVideo wrapper plugin
│   ├── tracking/                # trackingPlugin: Tracking global + GTM/PostHog/Vercel providers
│   ├── richtext/                # RichTextChild block + default Lexical editor + JSX renderer
│   └── seed/                    # seedPlugin: opinionated seed data + /api/seed endpoint
├── templates/
│   └── atomic-payload/          # Full Atomic Payload starter (Payload + Next.js + Tailwind)
├── examples/                    # Minimal single-plugin demo apps (not full templates)
│   ├── fonts-only/              # Exercises @pro-laico/fonts in isolation
│   ├── icons-only/              # Exercises @pro-laico/icons in isolation
│   └── styles-only/             # Exercises @pro-laico/styles in isolation
└── package.json                 # Workspace root
```

## Packages

| Package                            | Description                                                                                  |
| ---------------------------------- | -------------------------------------------------------------------------------------------- |
| `@pro-laico/create-atomic-payload` | CLI to scaffold new Atomic Payload projects                                                  |
| `@pro-laico/core`                  | Kernel types (`PayloadAugment`, `Get<>`, `ExtractOrDefault`), revalidate hooks + factories (`createRevalidateCache`, `createRevalidateCacheOnDelete`), cache helpers + factories (`createDefaultGetRegistry`, `createGetCachedPages`, etc.), `generateLivePreviewPath`, `createTestPathField`, APF runtime, JSON-schema plugin |
| `@pro-laico/zap`                   | zod + AtomicRegistry helper                                                                  |
| `@pro-laico/atomic`                | `actions` (action blocks + processor), `hook` (`createAtomicHook` + cssProcessor + slug config), `forms` (submit-form SVR blocks), `children` (childBlocksPlugin — `blockFields` prepends/appends generic fields per block; `classNameField` for the AtomicChild special case) |
| `@pro-laico/site`                  | sitePlugin: Pages, Header, Footer collections + SiteMetaData / Settings / draft+published Storage globals |
| `@pro-laico/styles`                | stylesPlugin: `designSet` + `shortcutSet` collections (each toggleable), `ClassNameField`, draft/published CSS storage globals, token fields, `createCssProcessor` + `createCssHook` + `processDesignSet` — all CSS handling for frontend + Payload |
| `@pro-laico/icons`                 | iconsPlugin (Icon + iconSet), formatSVG, AtomicIcon, createIconSelect                        |
| `@pro-laico/images`                | Images + Favicons collections + FaviconField + blur integration                              |
| `@pro-laico/fonts`                 | fontsPlugin + Font collection + font download CLI / API                                      |
| `@pro-laico/mux-video`             | MuxVideo extension collection + plugin wrapper                                               |
| `@pro-laico/tracking`              | trackingPlugin: Tracking global (GTM + PostHog tabs + toggles), PostHogProperty collection, GTM/PostHog/Vercel/composite providers |
| `@pro-laico/richtext`              | RichTextChild block + default Lexical editor preset + JSX renderer for serialized Lexical    |
| `@pro-laico/seed`                  | seedPlugin: opinionated seed data + `POST /api/seed` endpoint + BeforeDashboard admin banner |

## Templates

| Package                    | Description                                                              |
| -------------------------- | ------------------------------------------------------------------------ |
| `templates/atomic-payload` | The full starter template (Payload + Next.js + Tailwind) — uses every plugin |

## Examples

Minimal single-plugin demo apps — useful as partial-augmentation regression tests. Not full starter templates.

| Package                | Description                               |
| ---------------------- | ----------------------------------------- |
| `examples/fonts-only`  | Exercises `@pro-laico/fonts` in isolation  |
| `examples/icons-only`  | Exercises `@pro-laico/icons` in isolation  |
| `examples/styles-only` | Exercises `@pro-laico/styles` in isolation |

## Commands

All commands run from the monorepo root.

### Full-monorepo commands (recurse through every workspace project)

| Command                      | What it does                                                                                    |
| ---------------------------- | ----------------------------------------------------------------------------------------------- |
| `pnpm typecheck`             | Runs `tsc -p tsconfig.json --noEmit` in every package, template + example. Stops at the first failure.   |
| `pnpm -r --no-bail typecheck`| Same, but keeps going on failure so you see every package's errors in one run.                  |
| `pnpm -r --parallel typecheck` | Run all package typechecks concurrently. Faster but interleaved output.                       |
| `pnpm lint`                  | Runs `lint` in every workspace project (mostly `tsc --noEmit` or eslint).                       |

### Per-package commands (filter to a single workspace)

| Command                                       | What it does                                                |
| --------------------------------------------- | ----------------------------------------------------------- |
| `pnpm --filter @pro-laico/core typecheck`     | Typecheck a single package by name.                         |
| `pnpm --filter atomic-payload typecheck`      | Typecheck a template by its `name` field.                   |
| `pnpm --filter "./templates/*" typecheck`     | Typecheck only the templates (path glob).                   |
| `pnpm --filter "./examples/*" typecheck`      | Typecheck only the example apps (path glob).                |
| `pnpm --filter "@pro-laico/*" typecheck`      | Typecheck only the `@pro-laico/*` packages.                 |
| `pnpm --filter @pro-laico/core build`         | Build a single package (the ones that emit a `dist/`).      |
| `pnpm --filter @pro-laico/core exec tsc --noEmit` | Run any binary inside a package's environment.          |

### Template / scaffold

| Command                       | What it does                                                                           |
| ----------------------------- | -------------------------------------------------------------------------------------- |
| `pnpm dev`                    | Runs `next dev` in `templates/atomic-payload` (the main reference template).           |
| `pnpm build`                  | Runs `next build` in `templates/atomic-payload` (includes `prebuild` font download).   |
| `pnpm start`                  | Runs `next start` in `templates/atomic-payload`.                                       |
| `pnpm download:fonts`         | Runs the font-download CLI against the active design set.                              |
| `pnpm generate:types`         | Regenerates Payload's `payload-types.ts` + appends `payload-types.augment.d.ts`.       |
| `pnpm generate:importmap`     | Regenerates Payload's admin importmap.                                                 |
| `pnpm create`                 | Runs the `create-atomic-payload` CLI locally against the workspace.                    |

### Publishing the CLI

| Command                                                      | What it does                                                                 |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| `pnpm --filter @pro-laico/create-atomic-payload exec node scripts/bundle-scaffolds.js` | Bundles every scaffold (`templates/*` + `examples/*`, per `scaffolds.js`) into the CLI's `scaffolds/` and rewrites each `workspace:*` dep to a caret-pinned version read from `packages/<name>/package.json`. |
| `pnpm --filter @pro-laico/create-atomic-payload pack`        | Triggers `prepack` (the above) then produces a tarball.                      |
| `pnpm --filter @pro-laico/create-atomic-payload publish`     | Publish to npm. Run `pnpm typecheck` first.                                  |

## Cross-package type augmentation

Domain packages (`atomic`, `site`, `styles`, …) define schema stubs as `Get<'X', Default>` against the single `PayloadAugment` interface in `@pro-laico/core/kernel`. Consumer projects fill the interface in once via a generated `payload-types.augment.d.ts` (produced by `payload generate:types && core-augment-types`), and every package's stubs resolve to the project's concrete shapes.

`Get<K, F>` returns `F` when the key isn't augmented. For `Extract<T, { discriminant: K }>` patterns whose `T` is a default fallback like `DefaultBlock`, use `ExtractOrDefault<T, V>` (exported from `@pro-laico/core/kernel`) — it falls back to `T & V` rather than collapsing to `never` when the augmentation is missing.

## Slug configuration

Atomic-payload-conventional collection / global slugs (`pages`, `header`, `footer`, `designSet`, `shortcutSet`, `iconSet`, `forms`, `draftStorage`, `publishedStorage`, …) are not hardcoded in the runtime. Consumers can override every slug through factories with backward-compat defaults:

- `atomicHookWith(slugConfig)` (`@pro-laico/atomic/hook`) — `pagesSlug`, `designSetSlug`, `unsetActiveCleanup`, `cssProcessorSkipSlugs`, `cssCacheTagBySlug`, `cssStorageGlobals`.
- `createRevalidateCache(handlers)` / `createRevalidateCacheOnDelete(handlers)` (`@pro-laico/core`) — per-slug `beforeChange` / `afterDelete` handler maps.
- `createDefaultGetRegistry({ pagesSlug, formsSlug })` and per-getter factories like `createGetCachedPages('articles')` (`@pro-laico/core/cache`).
- `createTestPathField(slug)` (`@pro-laico/core`) and `createLinkControlBarFields(slug)` (`@pro-laico/atomic`).
- `seed({ payload, req }, slugConfig)` (`@pro-laico/seed`) — full slug-config object.

Default exports (e.g. `atomicHook`, `revalidateCache`, `TestPathField`, `LinkControlBarFields`, `seed`) stay bound to atomic-payload-conventional slugs so existing imports keep working unchanged.

## Adding Plugins

Create Payload plugins in `packages/` (e.g. `packages/atomic-payload-<name>`). Each package can be:

- **Used independently**: `pnpm add @pro-laico/atomic-payload-<name>`
- **Used via a template**: Add to the template's dependencies with `workspace:*` for local dev. The `prepack` step (`packages/create-atomic-payload/scripts/copy-template.js`) automatically rewrites those to caret-pinned versions when bundling the scaffold tarball.

The standard package shape is visible in every existing package: a `(opts) => (config) => config` plugin factory as both the default export and a named export, with the raw collections/hooks/fields/components also exported as named imports for advanced consumers.
