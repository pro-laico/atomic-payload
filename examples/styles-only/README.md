# styles-only

Minimal Atomic Payload template that demonstrates the `@pro-laico/styles`
plugin in isolation — and the full **back-to-front** loop it enables. A
`designSet` (theme) and `shortcutSet` are authored in the admin; a `pages`
collection houses example UI **blocks** whose styling is authored as atomic
classes; the standalone UnoCSS `cssHook` collects those classes and compiles the
stylesheet; and the frontend renders the blocks with the result. No stylesheet
lives in the repo.

## What it shows

- `stylesPlugin({ getCached, generateLivePreviewPath })` in `payload.config.ts`
  registers the `designSet` + `shortcutSet` collections and the
  `draftStorage` / `publishedStorage` CSS globals. Passing `getCached` (and
  **no** `atomicHook`) attaches the standalone `cssHook`, so CSS is processed
  without the rest of the Atomic runtime.
- The `pages` collection houses example **blocks** (`hero`, `buttonRow`,
  `cardGrid`, `prose`, `palette`). Every visual choice in a block is a
  `ClassNameField` (the styles plugin's atomic-classes input), not a hard-coded
  class. The same standalone `cssHook` is attached to `pages`: on save it walks
  the document for every `*ClassName` value (including those nested in blocks),
  stores them in `storedAtomicClasses`, and regenerates the stylesheet.
- `getCached('atomic-classes')` reads those `storedAtomicClasses` back off the
  pages — so authored classes become generated CSS with **no safelist**.
- `POST /api/seed` creates the shortcut set, the design set, and a home page
  made of one of each block. Auth-gated, idempotent. It's driven from the admin
  dashboard via the **Seed sample data** button (`SeedControls` in
  `beforeDashboard`); `POST /api/reset` (the **Reset** button) wipes the sets +
  pages.
- `/` loads the home page, injects the generated stylesheet into `<head>`, and
  renders the blocks — every utility, shortcut, token color, radius, and prose
  style you see was authored in the admin and compiled on save. A theme toggle
  flips the `dark` class to swap every token's light/dark value. (Seeding is on
  the admin dashboard, not this page.)
- Live preview is wired for `designSet` / `shortcutSet` / `pages` edits via
  `<LivePreviewListener>` + the `/next/preview` route handler. Local `afterChange`
  hooks add the `revalidateTag` calls that bust the frontend cache.

## Quick start

```bash
cp .env.example .env       # set a long PAYLOAD_SECRET + PREVIEW_SECRET (DATABASE_URI is optional)
cp gitignore.template .gitignore
pnpm install
pnpm generate:types        # generates src/payload-types.ts + augment
pnpm generate:importmap    # populates src/app/(payload)/admin/importMap.js
pnpm dev
```

`.env.example` ships `PAYLOAD_SECRET`, `PREVIEW_SECRET` (required by the live-preview
route handler), and `NEXT_PUBLIC_SERVER_URL` (defaults to `http://localhost:3000`).
`DATABASE_URI` is optional — see below.

The demo ships with the SQLite adapter (`@payloadcms/db-sqlite`) wired to a
local file at `./styles-only.db` — no database server required. Payload supports
multiple DB adapters; swap to Postgres or MongoDB by changing the import + `db:`
call in `src/payload.config.ts` and installing the matching `@payloadcms/db-*`
package.

Then:

1. Open <http://localhost:3000/admin> and create your first user.
2. On the admin dashboard, click **Seed sample data** (the controls rendered
   above the dashboard) to create the design set, shortcut set, and home page.
3. Open <http://localhost:3000>. The page renders, styled by the generated CSS.
   Edit a block's class names (or a design-set color) in the admin and the page
   restyles after the save.

## The back-to-front loop

```
page (blocks) ─save─▶ cssHook (beforeChange)
                        ├─ collectClassNames(data)  → storedAtomicClasses on the page
                        └─ createCssProcessor → UnoCSS generate(
                              defaultClasses + getCached('atomic-classes')  ◀─ reads every
                              + active designSet tokens                        page's stored
                              + active shortcutSet shortcuts )                 classes
                                                     └─▶ writes layoutCSS to
                                                         draft/published storage globals
                                                                    │
   frontend: getCached('site-css') → <style> in <head>  ◀───────────┘
             RenderBlocks(page.layout)  → components apply the stored *ClassName values
```

The design set + shortcut set follow the same `cssHook` path; saving any of the
three regenerates the single stylesheet.

## Layout

```
src/
  payload.config.ts                     # buildConfig — stylesPlugin + local revalidate plugin, page cssHook
  access.ts                             # shared access helpers
  collections/
    users.ts                            # auth collection (required by Payload)
    pages.ts                            # createPages(cssHook) — blocks + storedAtomicClasses + revalidation
  blocks/
    configs.ts                          # Block configs (ClassNameField-driven) + data types — no React
    components.tsx                       # the matching render components (frontend only)
    RenderBlocks.tsx                    # blockType → component dispatcher
  cache/getCached.ts                    # stock core registry + header/footer no-op overrides
  seed/sampleSets.ts                    # authored designSet + shortcutSet + home page (blocks)
  components/admin/
    BeforeDashboard.tsx                 # dashboard banner that hosts the seed/reset controls
    SeedControls.tsx                    # client buttons → POST /api/seed | /api/reset
    index.scss                          # styles for the dashboard controls
  app/
    (frontend)/
      layout.tsx                        # injects generated CSS + demo chrome; theme provider
      page.tsx                          # demo toolbar + RenderBlocks(home page)
      ThemeToggle.tsx                   # client light/dark toggle
      next/preview/route.ts             # live-preview enter handler (createPreviewRouteHandler)
      next/exit-preview/route.ts        # live-preview exit handler
    (payload)/
      custom.scss                       # admin styles entry
      admin/importMap.js                # `pnpm generate:importmap` populates this
      api/
        [...slug]/route.ts              # Payload REST/admin API handler
        seed/route.ts                   # POST /api/seed → sets + home page
        reset/route.ts                  # POST /api/reset → deletes pages + sets
```

## Notes

- **Configs vs components.** `blocks/configs.ts` is pulled into the Payload
  config graph (via `pages`), so it stays free of React / `server-only` imports.
  The render components live in `blocks/components.tsx` and are imported only by
  the frontend. Keeping them apart is what lets `payload generate:types` run.
- **No safelist.** Because every block class is a `ClassNameField` stored on the
  page, the stock `getCached('atomic-classes')` (which reads `storedAtomicClasses`)
  feeds the processor exactly the classes in use. `getCached` only overrides
  `header` / `footer` (collections this template doesn't have) to return
  `undefined`.
- **Adding a block.** Add a config to `blocks/configs.ts` (+ its `exampleBlocks`
  entry), a component to `blocks/components.tsx`, and a `case` in
  `RenderBlocks.tsx`. Style it with `ClassNameField`s and the classes flow
  through automatically.
- **Just `styles` + `core`.** This template declares only `@pro-laico/styles`
  and `@pro-laico/core` (plus `unocss`, a styles peer dependency). Two things
  that used to be required are now opt-in:
  - **No `@pro-laico/zap`.** `stylesPlugin` auto-appends zap's schema extension
    to `typescript.schema` (its `registerTypescriptSchema` option, default on),
    so `generate:types` resolves the designSet field type `$ref`s without the
    app importing or wiring zap (it's pulled in transitively by styles).
  - **No `@pro-laico/fonts`.** We pass no `fontField`, so the designSet's Fonts
    tab has no `font`-collection upload fields and the config needs no `font`
    collection. To enable font uploads: add `@pro-laico/fonts`, register
    `fontsPlugin`, and pass `designSet: { fontField: fontUploadField() }` to
    `stylesPlugin`.
