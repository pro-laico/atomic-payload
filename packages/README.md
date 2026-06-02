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
| [`site`](./site) | Pages/Header/Footer collections + SiteMetaData/Settings/Storage globals |
| [`tracking`](./tracking) | PostHog/GTM/Vercel Analytics integration + Tracking global |
| [`zap`](./zap) | Zod + registry-aware schema layer used by every other package |

## Standard package shape

Every plugin package follows the same conventions:

- A `(opts) => (config) => config` plugin factory as both **default** and **named** export.
- Raw collections, hooks, fields, and components exported as named imports for advanced consumers.
- A `schema` subpath exporting `payload-augment` types so `zap` knows about the package's block shapes.
- An `index.ts` barrel that's safe to import from `payload.config.ts` (no client-only code).
- Client components and server-only utilities live behind subpaths to keep bundles clean.

See any existing package for the concrete pattern, or [`MONOREPO.md`](../MONOREPO.md) at the repo root for monorepo-level details (publishing, workspace deps, dev flow).

## Adding a new package

```
packages/your-package/
  package.json
  src/
    index.ts
    plugin.ts
    types/payload-augment.ts
  tsconfig.json
  README.md
```

Then add it to the workspace via `pnpm-workspace.yaml` (already covers `packages/*`) and reference it from the template with `workspace:*` for local dev.
