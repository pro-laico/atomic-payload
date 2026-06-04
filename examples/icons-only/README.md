# icons-only

Minimal Atomic Payload template that demonstrates the `@pro-laico/icons`
plugin in isolation. No styles, fonts, forms, tracking, or other Atomic
Payload features — just the Icon and IconSet collections plus a small Next.js
page that renders them.

## What it shows

- `iconsPlugin({ enabled: true })` registered in `payload.config.ts` adds the
  `icon` and `iconSet` collections to the admin UI.
- `POST /api/seed` uploads two sample sets — "Demo Icon Set" (from
  `src/seed/icons/`, marked active) and "Second Demo Set" (from
  `src/seed/icons-two/`) — each with the same six lookup names (`arrow-right`,
  `check`, `cog`, `heart`, `star`, `x`). Auth-gated to logged-in admins.
  Idempotent — skips any icon whose filename already exists and any IconSet
  whose title already exists.
- `POST /api/reset` wipes every `icon` and `iconSet` doc, for starting from a
  clean slate. Also auth-gated.
- `/` renders three things: every uploaded `Icon` doc (inlined from its
  `svgString` field), each `IconSet` as a labelled grid, and a "Single-icon
  lookup" section that renders icons by name through the bundled `<Icon>`
  server component from `@pro-laico/icons/Icon` — the intended usage. The page
  also includes inline docs explaining `getCached`, the IconChild block, and
  the tag-based cache invalidation the plugin wires up.
- Live preview is wired for `iconSet` edits: open the active iconSet in the
  admin, edit it (e.g. rename the `x` icon to `y`), and edits propagate to the
  home page in real time via `<LivePreviewListener>` + the `/next/preview`
  route handler.

## Quick start

```bash
cp .env.example .env       # set PAYLOAD_SECRET + PREVIEW_SECRET (DATABASE_URI is optional)
cp gitignore.template .gitignore
pnpm install
pnpm generate:types        # payload generate:types + core-augment-types → src/payload-types.ts (+ .augment.d.ts)
pnpm generate:importmap    # populates src/app/(payload)/admin/importMap.js
pnpm dev
```

Required env vars (see `.env.example`): `PAYLOAD_SECRET` (long random string),
`PREVIEW_SECRET` (used by the live-preview route handler), and
`NEXT_PUBLIC_SERVER_URL` (defaults to `http://localhost:3000`). `DATABASE_URI`
is optional and defaults to a local SQLite file.

The demo ships with the SQLite adapter (`@payloadcms/db-sqlite`) wired to a
local file at `./icons-only.db` — no database server required. Payload supports
multiple DB adapters; swap to Postgres or MongoDB by changing the import + `db:`
call in `src/payload.config.ts` and installing the matching `@payloadcms/db-*`
package.

Then:

1. Open <http://localhost:3000/admin> and create your first user.
2. Go back to <http://localhost:3000>. The seed/reset buttons are now visible —
   click **Seed** to create the sample icons + sets. (**Reset** deletes them
   all.)
3. The page now renders the icons. Refresh after editing in the admin to see
   updates.

## Layout

```
src/
  payload.config.ts                     # buildConfig — the only place iconsPlugin runs
  collections/users.ts                  # auth collection (required by Payload)
  seed/
    sampleIcons.ts                      # reads the SVG folders at request time → IconSet entries
    icons/                              # SVGs for "Demo Icon Set" (active)
    icons-two/                          # SVGs for "Second Demo Set"
  app/
    (frontend)/
      layout.tsx                        # plain HTML layout, no design system
      page.tsx                          # demo page: lists icons + sets, <Icon> lookups, seed/reset
      CodeBlock.tsx                     # Shiki-highlighted code samples on the demo page
      next/
        preview/route.ts               # live-preview entry (uses PREVIEW_SECRET)
        exit-preview/route.ts          # exits draft mode
    (payload)/
      layout.tsx                        # Payload admin RootLayout
      custom.scss                       # admin overrides (empty)
      admin/
        importMap.js                    # `pnpm generate:importmap` populates this
        [[...segments]]/
          page.tsx                      # Payload admin entry
          not-found.tsx
      api/
        [...slug]/route.ts              # Payload REST endpoint
        seed/route.ts                   # POST /api/seed → seeds sample data
        reset/route.ts                  # POST /api/reset → wipes icons + sets
```

## Notes

- The seed endpoint uses Payload's local API (`payload.create`) and feeds
  the SVG bytes directly via the `file` argument, so the upload pipeline
  (including `@pro-laico/icons`' `formatSVG` hook) runs end-to-end.
- The "All Uploaded Icons" and "Icon Sets" sections inline each icon's
  `svgString` via `dangerouslySetInnerHTML`, using the `extractSvgProps` /
  `extractSvgContent` helpers from `@pro-laico/icons`. The "Single-icon lookup"
  section instead renders by name through the bundled `<Icon>` server
  component. Because the SVGs were uploaded through the `formatSVG` hook, the
  strings are already optimized and stripped of script tags by SVGO.
- Workspace dependency direction: this template depends on `@pro-laico/icons`
  and `@pro-laico/core` directly. `@pro-laico/icons` in turn pulls in
  `@pro-laico/core` (cache/revalidation helpers) and `@pro-laico/atomic`.
