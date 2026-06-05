# `@pro-laico/fonts` — Public Export Surface Audit

Barrel: 13 → keep 6, remove 7. Subpaths: 3 → keep 2, remove 1.

> Barrel symbol count is 13 distinct names (the `default` and `fontsPlugin` exports are
> the same plugin value re-exported twice; counted once). Subpath count is the three
> `exports` entries (`.`, `./schema`, `./scripts/downloadFonts`); the `bin`
> `atomic-fonts-download` is also assessed below and kept.

Audit-only. Removing a barrel export does **not** delete its source module — every
internal relative import inside `packages/fonts/src` keeps working, zap registration is
unaffected (fonts registers no `z.ap.add` schemas), and `generate:types` is unaffected
(the `Font` / `FontSet` interfaces come from the `typescriptSchema` `$ref` stubs in
`src/types/payload-augment.ts`, not from the barrel). The `./schema` type-augmentation
subpath and the CLI/script runtime entry (`src/scripts/cli.ts`, wired as the `bin`) must
stay.

## Method notes / evidence base

Real external code consumers of the package (imports outside `packages/fonts/src`):

- `templates/atomic-payload/src/plugins/fonts.ts` — `import { fontsPlugin } from '@pro-laico/fonts'`
- `templates/atomic-payload/src/plugins/styles.ts` — `import { fontUploadField } from '@pro-laico/fonts'`
- `examples/fonts-only/src/payload.config.ts` — `import { fontsPlugin } from '@pro-laico/fonts'`
- `examples/fonts-only/src/app/(frontend)/layout.tsx` — `import { extractFonts } from '@pro-laico/fonts'`

The CLI is invoked **by file path**, not via the `bin` or the `./scripts/downloadFonts`
subpath:

- `templates/atomic-payload/package.json` → `"generate:fonts": "pnpm exec tsx node_modules/@pro-laico/fonts/src/scripts/cli.ts"`
- `examples/fonts-only/package.json` → same

`src/scripts/cli.ts` imports `runDownloadFonts` from `./downloadFonts.js` by **relative
path**, so the `./scripts/downloadFonts` subpath export itself has no consumer.

No `@pro-laico/fonts/schema` or `@pro-laico/fonts/scripts/downloadFonts` subpath import
exists anywhere in `templates/**`, `examples/**`, or another `packages/*/src/**`.

No fonts admin/UI component is loaded by any `admin/importMap.js` (fonts ships no
admin UI component subpath) — searched `**/admin/importMap.js`, no `fonts` matches.

Ignored (not real consumers, per instructions): everything under `packages/fonts/src`,
`dist/**`, `*payload-types.ts` (generated interfaces from the `typescriptSchema` `$ref`,
not imports), `.next/**` build artifacts, and all `.md` / `.mdx` docs + code comments.

---

## Keep

### Barrel exports

- **`default` / `fontsPlugin`** (`src/plugin.ts`) — the plugin itself; default + main
  named export. Evidence: `templates/atomic-payload/src/plugins/fonts.ts:1` and
  `examples/fonts-only/src/payload.config.ts:6`.
- **`FontsPluginOptions`** (type, `src/plugin.ts`) — the main options type that types the
  argument to `fontsPlugin()`. No standalone external import (callers use it
  inferentially), but it is the plugin's primary options type → keep as public API.
- **`extractFonts`** (`src/extractFonts.ts`) — frontend helper that turns the generated
  `definition.ts` export into the `next/font` className for the root `<html>`. Evidence:
  `examples/fonts-only/src/app/(frontend)/layout.tsx:2` (used at line 59).
- **`fontUploadField`** (`src/fields/font.ts`) — the Payload `Field` users pass to
  `@pro-laico/styles`' `designSet.fontField` to add the font picker to the Fonts tab.
  Evidence: `templates/atomic-payload/src/plugins/styles.ts:2` (used at line 15).
- **`exportFontsEndpoint`** (`src/endpoints/exportFonts.ts`) — this is the package's
  export endpoint (`GET /api/fonts/export`). Registered automatically by the plugin
  (`src/plugin.ts:42`) and exported for advanced use. No external code consumer, but the
  task treats "the export endpoint" as a keep category. **Soft keep** — see Judgment
  calls for the alternative.

### Subpaths / bin

- **`.`** (root barrel, `src/index.ts`) — the package entry every consumer imports from.
  Evidence: all four imports listed above.
- **`./schema`** (`src/types/payload-augment.ts`) — the Payload type-augmentation entry
  (`Font` / `FontSet` stubs built on `@pro-laico/core`'s `Get`). No direct external
  import found, but per instructions the `./schema` augmentation subpath must stay;
  it is the documented typed-access entry (`packages/fonts/README.md:18`).
- **`bin: atomic-fonts-download` → `./dist/scripts/cli.js`** (source `src/scripts/cli.ts`)
  — the CLI/script runtime entry. The template + example actually run it by path
  (`node_modules/@pro-laico/fonts/src/scripts/cli.ts`), and the `bin` is the published
  way to run it. Keep the script and the `bin`.

---

## Remove

All of the following are barrel exports with **no** external code consumer
(`templates/**`, `examples/**`, other `packages/*/src/**`). Each is used only via relative
imports inside `packages/fonts/src`, so removing it from `src/index.ts` is safe.

- **`Font`** (collection, `src/collections/font.ts`) — internal-only. The plugin adds the
  collection itself via `mergeCollection(Font, …)` (`src/plugin.ts:5,40`); the endpoint
  uses `Font.slug` (`src/plugin.ts:42`). No external import — searched
  `{ Font }` / `import … Font … @pro-laico/fonts`, only generated `payload-types.ts`
  references the name (ignored). Apps consume the collection through the plugin, not by
  importing it.
- **`fontUploadFields`** (`src/fields/font.ts`) — internal-only. The four upload-slot
  fields shared by the global and the design-set group; consumed by `fontUploadField`
  and `globals/fontSet` via relative imports. The plural form has no external consumer
  (the template imports the singular `fontUploadField`).
- **`createFontSetGlobal`** (`src/globals/fontSet.ts`) — no external consumer. The plugin
  uses the pre-built `FontSet` global, not the factory. (Arguably a public factory — see
  Judgment calls.)
- **`FONT_SET_SLUG`** (`src/globals/fontSet.ts`) — internal-only. Read internally at
  `src/plugin.ts:6,42`. The one external place that touches the slug
  (`examples/fonts-only/src/lib/fonts.ts:26`) hardcodes the literal `'fontSet'` instead
  of importing the constant.
- **`FontSet`** (global, `src/globals/fontSet.ts`) — internal-only. Registered by the
  plugin via `mergeGlobal(FontSet, …)` (`src/plugin.ts:6,41`). No external import. (Note:
  the *type* `FontSet` that apps use lives at `@pro-laico/fonts/schema`, a different
  export that is kept.)
- **`ExportedFont`** (type, `src/endpoints/exportFonts.ts`) — internal-only type. No
  external import. (`src/scripts/downloadFonts.ts` even re-declares its own local
  `ExportedFont` type rather than importing this one — see line 17 there.)
- **`ExportFontsEndpointOptions`** (type, `src/endpoints/exportFonts.ts`) — internal-only
  options type for `exportFontsEndpoint`. No external import.
- **`ExportFontsResponse`** (type, `src/endpoints/exportFonts.ts`) — internal-only
  response type. No external import (the CLI/download script re-declares its own).

### Subpath

- **`./scripts/downloadFonts`** (`src/scripts/downloadFonts.ts`, exports
  `runDownloadFonts` + `RunDownloadFontsOptions`) — **redundant / unused subpath.** No
  external code imports `@pro-laico/fonts/scripts/downloadFonts`. The CLI entry
  (`src/scripts/cli.ts:2`) imports `runDownloadFonts` from `./downloadFonts.js` by
  relative path, and the template/example `generate:fonts` scripts invoke
  `src/scripts/cli.ts` directly by file path — neither goes through this subpath. The
  source module stays (the CLI needs it); only the public subpath export is removable.
  It is, however, documented as public API (`packages/fonts/README.md:19`,
  `docs/.../plugins/fonts.mdx`) → see Judgment calls before removing.

---

## Judgment calls

- **`./scripts/downloadFonts` subpath (`runDownloadFonts` / `RunDownloadFontsOptions`)** —
  No external consumer today (the CLI uses a relative import; apps run `cli.ts` by path),
  so by the "redundant subpath" rule it could be removed. But it is deliberately
  documented as a public escape hatch — "call it from your own build script instead of the
  `generate:fonts` command" (`docs/content/docs/plugins/fonts.mdx:260`,
  `packages/fonts/README.md:19`). **Recommendation: keep** as an intentional public API,
  or remove it *only together with* the doc/README entries that advertise it. Do not
  remove silently.

- **`exportFontsEndpoint`** — Registered internally by the plugin and never imported
  externally, so on a strict "internal-only" reading it is removable. But it is the
  package's `/api/fonts/export` endpoint factory, documented as "exported for advanced
  use" (`docs/content/docs/plugins/fonts.mdx:258`). **Recommendation: keep** as a public
  advanced-use export (the position taken above), unless the package intends the endpoint
  to be non-overridable — in which case remove it and drop the doc entry.

- **`createFontSetGlobal`** — Advanced factory for a customized `fontSet` global
  (custom slug/fields), documented at `docs/content/docs/plugins/fonts.mdx:240`. Unused
  externally. **Recommendation: lean remove** for now (apps customize via the plugin's
  `fontSetOptions` merge instead), but it is defensibly public API; keep it if you want to
  preserve the documented factory. If removed, also remove the doc/README line.

- **`FontsPluginOptions`** — Kept above as the main options type, but note it has **no**
  standalone external import either (callers rely on inference). It is genuine public API
  for anyone typing an options object explicitly, so keeping it is the safe call.
