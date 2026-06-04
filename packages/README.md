# Packages

This directory contains the publishable packages that make up Atomic Payload. Each one is its own scope of responsibility and has its own README — start there if you're new to a package. This file is the map.

## Reading order for newcomers

If you've never touched this repo before, read the READMEs in roughly this order:

1. **[`zap`](./zap)** — the shared Zod-based schema registry. Everything else types itself against it.
2. **[`core`](./core)** — the kernel: shared types, APF runtime, cache helpers, JSON-schema generation, common fields.
3. **[`styles`](./styles)** — the theme-as-data layer (colors, tokens, shortcuts) **and** the runtime CSS processor + `processDesignSet`. Single home for all CSS handling.
4. **[`site`](./site)** — the canonical site shape (Pages, Header, Footer, globals).
5. **[`atomic`](./atomic)** — the runtime (action blocks, beforeChange hook, forms, child blocks). The integration layer.
6. The rest — feature plugins (images, icons, fonts, mux-video, richtext, tracking, seed) and the CLI (`create-atomic-payload`).

## Package index

| Package | Purpose |
| --- | --- |
| [`atomic`](./atomic) | Runtime: actions, beforeChange hook, forms, child blocks |
| [`core`](./core) | Kernel types, APF, cache helpers, revalidation + JSON-schema plugins |
| [`create-atomic-payload`](./create-atomic-payload) | `npx` scaffolder for new projects |
| [`styles`](./styles) | `designSet` + `shortcutSet` collections, token fields, `cssProcessor` + `processDesignSet` — all CSS handling |
| [`fonts`](./fonts) | `Font` collection + build-time font download CLI |
| [`icons`](./icons) | `Icon` + `IconSet` collections, SVG optimization, `AtomicIcon` |
| [`images`](./images) | `Images` + `Favicons` collections, blur-data-URL integration |
| [`mux-video`](./mux-video) | Mux video upload + playback wrapper |
| [`richtext`](./richtext) | Lexical rich-text block + renderer + default editor preset |
| [`seed`](./seed) | `/api/seed` endpoint + admin SEED DATABASE button |
| [`site`](./site) | Pages/Header/Footer collections + SiteMetaData/Settings globals, all via `sitePlugin()` |
| [`tracking`](./tracking) | PostHog/GTM/Vercel Analytics integration + Tracking global |
| [`zap`](./zap) | Zod + registry-aware schema layer used by every other package |

## Standard package shape

Most of the feature **plugin** packages (`core`, `styles`, `site`, `fonts`, `icons`, `images`, `mux-video`, `seed`, `tracking`) follow the same conventions. The non-plugin packages are exceptions, called out below.

- A `(opts) => (config) => config` plugin factory as both **default** and **named** export (e.g. `iconsPlugin`, `sitePlugin`). Exceptions: `atomic` ships four namespace plugins via subpaths (`actionsPlugin`, `atomicHookPlugin`, `formsPlugin`, `childBlocksPlugin`) and has **no** root default export; `richtext` exports a block (`createRichTextBlock`) and renderer rather than a plugin; `zap` default-exports the `z` object; `create-atomic-payload` is a CLI (`bin`), not a plugin.
- Raw collections, hooks, fields, and components exported as named imports for advanced consumers.
- A `./schema` subpath exporting `payload-augment` types so `zap` knows about the package's block shapes — common but **not** universal. Present in `zap`, `styles`, `site`, `fonts`, `icons`, `images`, and `tracking`; `atomic` instead exposes per-namespace schema subpaths (`./actions/schema`, `./hook/schema`, …). `core`, `mux-video`, `richtext`, and `create-atomic-payload` have no `./schema` export.
- An `index.ts` barrel that's safe to import from `payload.config.ts` (no client-only code).
- Client components and server-only utilities live behind subpaths to keep bundles clean.

See any existing package for the concrete pattern, or [`MONOREPO.md`](../MONOREPO.md) at the repo root for monorepo-level details (publishing, workspace deps, dev flow).

## Adding a new package

```
packages/your-package/
  package.json
  src/
    index.ts
    plugin.ts              # if it's a plugin package
    types/payload-augment.ts  # if it augments Payload's generated types
  tsconfig.json
  README.md
```

`plugin.ts` and `types/payload-augment.ts` are the typical plugin-package files — drop them for non-plugin packages (a CLI, a pure schema layer, a block-only package, etc.).

Then add it to the workspace via `pnpm-workspace.yaml` (already covers `packages/*`) and reference it from the template with `workspace:*` for local dev.
