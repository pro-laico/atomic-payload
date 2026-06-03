# icons-only

Minimal Atomic Payload template that demonstrates the `@pro-laico/icons`
plugin in isolation. No design sets, child blocks, forms, tracking, or other
Atomic Payload framework — just the Icon and IconSet collections plus a
small Next.js page that renders them.

## What it shows

- `iconsPlugin({ enabled: true })` registered in `payload.config.ts` adds the
  `icon` and `iconSet` collections to the admin UI.
- `POST /api/seed` creates 6 sample SVG icons + a "Demo Icon Set" that groups
  them. Auth-gated to logged-in admins. Idempotent.
- `/` renders every `Icon` doc inline by inlining its `svgString` field, and
  renders each `IconSet` as a labelled grid.
- Live preview is wired for `iconSet` edits: open any iconSet in the admin,
  click the "Live Preview" tab, and edits propagate to the home page in real
  time via `<LivePreviewListener>` + the `/next/preview` route handler.

## Quick start

```bash
cp .env.example .env       # set a long PAYLOAD_SECRET (DATABASE_URI is optional)
cp gitignore.template .gitignore
pnpm install
pnpm generate:types        # generates src/payload-types.ts + augment
pnpm generate:importmap    # populates src/app/(payload)/admin/importMap.js
pnpm dev
```

The demo ships with the SQLite adapter (`@payloadcms/db-sqlite`) wired to a
local file at `./icons-only.db` — no database server required. Payload supports
multiple DB adapters; swap to Postgres or MongoDB by changing the import + `db:`
call in `src/payload.config.ts` and installing the matching `@payloadcms/db-*`
package.

Then:

1. Open <http://localhost:3000/admin> and create your first user.
2. Go back to <http://localhost:3000>. The seed button is now visible — click
   it to create the sample icons + set.
3. The page now renders the icons. Refresh after editing in the admin to see
   updates.

## Layout

```
src/
  payload.config.ts                     # buildConfig — the only place iconsPlugin runs
  collections/users.ts                  # auth collection (required by Payload)
  seed/sampleIcons.ts                   # bundled SVG strings + IconSet entries
  app/
    (frontend)/
      layout.tsx                        # plain HTML layout, no design system
      page.tsx                          # demo page: lists icons + sets, seed button
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
```

## Notes

- The seed endpoint uses Payload's local API (`payload.create`) and feeds
  the SVG bytes directly via the `file` argument, so the upload pipeline
  (including ap-icons's `formatSVGHook`) runs end-to-end.
- The page uses `dangerouslySetInnerHTML` to inline each icon's `svgString`
  field. Because the icons are uploaded SVGs that pass through `formatSVGHook`,
  the strings are already optimized and stripped of script tags by SVGO.
- Workspace dependency direction: this template depends on `@pro-laico/icons`,
  which transitively pulls in `@pro-laico/ap-utils` (for revalidation hooks),
  `@pro-laico/ap-apf` (for the IconSet's APField wiring), and `@pro-laico/ap-types`
  (kernel).
