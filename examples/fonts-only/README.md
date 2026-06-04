# fonts-only

Minimal Atomic Payload template that demonstrates the `@pro-laico/fonts` plugin
in isolation. The only `@pro-laico` dependencies are **`@pro-laico/fonts`** and
**`@pro-laico/core`**. Upload font files to the `Font` collection, choose the
active four in the `fontSet` global, and the site renders them.

## The flow (like icons-only)

1. Visit `/` — an explainer page. Logged out, it points you to the admin.
2. Open `/admin`, create your first user.
3. On the dashboard, click **Seed sample fonts**.
4. Follow **← Back to the site** to `/` and see the plugin in action — the four
   active fonts rendered as specimens.

## What it shows

- `fontsPlugin({ global: true })` registers the **`Font` upload collection**
  (slug `font`: `title` + `family` + the font file, woff/woff2/ttf/otf) **and**
  the **`fontSet` global** — the active `sans` / `serif` / `mono` / `display`
  selection (the font analog of an active icon set). The template pins a known
  `staticDir` so the bytes can be read back.
- `POST /api/seed` uploads four bundled open-source Google fonts (one per role)
  **and points the `fontSet` global at them**. Auth-gated, idempotent by title.
  Run it from the **admin dashboard**.
- **Two delivery paths, one page.** The layout serves each active role via a
  `--font-<role>` CSS variable, resolved one of two ways:
  - **Inline (default).** With no download, the layout reads the active font's
    bytes off disk server-side (`readFontDataUrl` from `FONT_STATIC_DIR`) and
    inlines them as `@font-face { src: url(data:…) }`. The browser gets inlined
    bytes — never a `/api/font/file/…` URL. Works in plain local dev with no
    extra setup.
  - **`next/font/local` (optimized).** If `pnpm download:fonts` has run, the
    fonts live in `public/fonts` and `src/app/definition.ts` declares them; the
    layout applies the `next/font` classes and `--font-<role>` points at the
    generated `--font-set*` variable. Per-role: downloaded roles use next/font,
    the rest fall back to inline.
- `/` renders a specimen per active role (sizes, pangram, glyphs) plus a "use
  them together" layout. Everything resolves via `var(--font-<role>)`, so the
  page is identical regardless of delivery path. Swap a font in the `fontSet`
  global and it re-renders with it.

## Quick start

```bash
cp .env.example .env       # set a long PAYLOAD_SECRET; NEXT_PUBLIC_SERVER_URL is preset
cp gitignore.template .gitignore
pnpm install
pnpm generate:types        # generates src/payload-types.ts + augment
pnpm generate:importmap    # populates src/app/(payload)/admin/importMap.js
pnpm dev
```

Ships with SQLite (`@payloadcms/db-sqlite`) at `./font-only.db` — no DB server.
`DATABASE_URI` is optional (defaults to `file:./font-only.db`); swap adapters by
editing `src/payload.config.ts` and setting the matching connection string.

### Optional: the `next/font/local` path

`pnpm build` runs `prebuild` → `download:fonts`, which reads the active `fontSet`
from a **reachable Payload instance** and downloads the fonts to disk for
`next/font/local`. Set these (see `.env.example`) before building if you want it:

```bash
LIVE_SITE_URL=http://localhost:3000   # a running instance holding the active fonts
SCRIPT_USER_EMAIL=admin@example.com
SCRIPT_USER_PASSWORD=...
```

If they're unset, `download:fonts` no-ops (writes an empty `definition.ts`) and
the site uses the inline path — `pnpm build` still succeeds. The download is
storage-agnostic: it follows each font's URL as Payload reports it (local disk,
Vercel Blob, S3, …), so no storage token is required.

## How it works

```
upload Font (admin)  ──►  Payload writes the file to FONT_STATIC_DIR (./media)
        │
seed: POST /api/seed uploads public/seed-fonts/*.woff2
      then updateGlobal('fontSet', { sans, serif, mono, display })  ◄── active set
        │
        ├─ (optional) pnpm download:fonts ── reads fontSet global ──► public/fonts/* + definition.ts (next/font/local)
        │
layout.tsx → getActiveFonts() [fontSet global]  ──► per role:
   • downloaded?  --font-<role>: var(--font-set<Role>)   (next/font/local)
   • else         @font-face data: URL + --font-<role>   (readFontDataUrl, inline)
        │
page.tsx → getActiveFonts() ──► specimen per role + combined demo, via var(--font-<role>)
route is force-dynamic ──► seed / swap / reset shows up on the next render
```

## Layout

```
src/
  payload.config.ts                     # buildConfig — fontsPlugin({ global: true }) + staticDir
  collections/users.ts                  # auth collection (required by Payload)
  lib/
    fontDir.ts                          # FONT_STATIC_DIR + fontFamilyName (pure, no @payload-config)
    fonts.ts                            # getActiveFonts() [fontSet meta] + readFontDataUrl() [inline bytes]
  seed/sampleFonts.ts                   # manifest mapping bundled files → title + role (family)
  components/admin/                     # BeforeDashboard + SeedControls (seed/reset on the dashboard)
  app/
    definition.ts                       # committed stub; `download:fonts` overwrites it (next/font/local)
    (frontend)/
      layout.tsx                        # per-role: next/font var (downloaded) or inline @font-face
      page.tsx                          # explainer + a specimen per active role + "use them together"
    (payload)/
      admin/importMap.js                # `pnpm generate:importmap` populates this
      api/
        seed/route.ts                   # POST /api/seed → upload fonts + set the fontSet global
        reset/route.ts                  # POST /api/reset → clear the global + delete fonts
public/seed-fonts/*.woff2               # bundled OFL fonts (committed) + LICENSES.md
```

## Notes

- **Why a global?** It's the active-selection layer, mirroring icons-only's
  active `iconSet`. The `Font` collection can hold many uploads; the `fontSet`
  global picks the one `sans` / `serif` / `mono` / `display` the site uses. Edit
  it at `/admin/globals/fontSet`.
- **`definition.ts` is a committed stub** (empty) so the layout's import always
  resolves on a fresh checkout. `download:fonts` overwrites it with real
  `next/font/local` declarations; `public/fonts` (the binaries) is gitignored.
- **`FONT_STATIC_DIR`** (`./media`, gitignored) is where Payload writes uploads
  and where the inline path reads them back — shared via `src/lib/fontDir.ts` so
  the config and the reader never drift.
- **Adding fonts:** upload at `/admin/collections/font`, then set the role slots
  in `/admin/globals/fontSet`. To bundle more seed fonts, drop a `.woff2` in
  `public/seed-fonts/` and add an entry to `src/seed/sampleFonts.ts`.
- The bundled seed fonts (Inter, Lora, JetBrains Mono, Abril Fatface) are OFL;
  see `public/seed-fonts/LICENSES.md`. Replace them before shipping a real project.
- Dependency direction: depends on `@pro-laico/fonts` (the `Font` collection +
  `fontSet` global + the `download:fonts` CLI) and `@pro-laico/core` (the kernel +
  `core-augment-types` in `generate:types`). `tsx` / `@payloadcms/sdk` / `dotenv`
  are build tooling for `download:fonts`.
