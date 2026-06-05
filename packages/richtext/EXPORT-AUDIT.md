# `@pro-laico/richtext` — Public Export Surface Audit

Barrel: 4 → keep 4, remove 0. Subpaths: 2 → keep 2, remove 0.

Audit-only. No source was edited and no typecheck was run. "External consumer" = an
import in `templates/**`, `examples/**`, or another `packages/*/src/**` (never
`packages/richtext/src` itself, never `dist/**`, never `*payload-types.ts` generated
files, never `.md`/`.mdx` docs).

The package is small: one barrel (`src/index.ts`) exporting 4 symbols, plus one extra
subpath (`./default-lexical`). Every export turned out to have a genuine external
consumer, so nothing is recommended for removal. Details and evidence below.

Note on method: removing an export would not delete its source module — internal
relative imports inside `packages/richtext/src` keep working, and there is no zap
registration or `generate:types` coupling in this package. The `./default-lexical`
subpath and the `RichTextChild` render component must stay (see Keep). This package
has **no** type-augmentation (`./schema`) entry and **no** admin/UI subpaths in the
runtime importMap — see "Runtime importMap note" below.

---

## Keep

### Barrel exports (`src/index.ts`)

- **`RichText`** (pre-built `Block`) — KEEP. Added to the default child-block set by a
  sibling package.
  Evidence: `packages/atomic/src/children/blocks.ts:6`
  (`import { RichText } from '@pro-laico/richtext'`).

- **`createRichTextBlock`** (block factory) — KEEP. Called by the atomic package's
  child-block builder so consumers can pass `prependFields` / `appendFields`.
  Evidence: `packages/atomic/src/children/buildChildBlocks.ts:2` + `:49`
  (`import { createRichTextBlock } from '@pro-laico/richtext'`, used as
  `createRichTextBlock(blockFields?.RichTextChild)`).

- **`RichTextChild`** (React render component) — KEEP. This is the frontend renderer for
  the block. It is re-exported by the atomic package's frontend-components barrel and
  consumed by the render pipeline.
  Evidence: `packages/atomic/src/children/frontend-components.ts:1`
  (`export { RichTextChild } from '@pro-laico/richtext'`), then imported/used in
  `packages/atomic/src/children/render/renderChildren.tsx:33,17,42`.

- **`defaultLexical`** (Lexical preset constant) — KEEP. Main editor preset of the
  package; this is the documented `editor` value. The template imports it via the
  `./default-lexical` subpath rather than the barrel, but it is the package's primary
  public value and the barrel re-export is the canonical entry.
  Evidence (subpath form): `templates/atomic-payload/src/payload.config.ts:10` + `:23`
  (`import { defaultLexical } from '@pro-laico/richtext/default-lexical'`,
  `editor: defaultLexical`).
  Note: I found **no** external consumer of the *barrel* form
  (`from '@pro-laico/richtext'`) of `defaultLexical` — every real import uses the
  `/default-lexical` subpath. It is kept as the main options/preset value and because
  the barrel and subpath are documented as interchangeable (README + plugin doc). If the
  monorepo wanted to be strict, the barrel re-export of `defaultLexical` is the one
  arguably-droppable line — see Judgment calls.

### Subpaths (`package.json` `exports` / `publishConfig.exports`)

- **`.`** (root barrel) — KEEP. Provides `RichText`, `createRichTextBlock`,
  `RichTextChild`, `RichTextBlockOptions` (see above), all consumed by
  `packages/atomic/src/children/**`.

- **`./default-lexical`** — KEEP. Imported by exact subpath at config build time.
  Evidence: `templates/atomic-payload/src/payload.config.ts:10`
  (`import { defaultLexical } from '@pro-laico/richtext/default-lexical'`). This subpath
  also exposes `createDefaultLexical` and `DefaultLexicalOptions`, which are **not** in
  the barrel — they are reachable only here (see Judgment calls for their external-usage
  status).

---

## Remove

None.

Every barrel symbol and every subpath has at least one real external consumer (or, for
`defaultLexical`, is the package's primary documented value reached via its subpath).
There are no internal-only constants/types leaking through the barrel, no redundant
subpath that merely duplicates the barrel for an importer that uses the barrel instead,
and no zap-style side-effect schemas in this package.

---

## Judgment calls

1. **`RichTextBlockOptions`** (type, barrel) — JUDGMENT → **keep**. I found **no**
   external import of this type (the only non-source hits are
   `docs/content/docs/plugins/richtext.mdx`, which the method says to ignore). It is the
   options type for the public `createRichTextBlock` factory, so it is legitimate public
   API a consumer would annotate against even though nobody in this repo currently does.
   It also costs nothing — it is a one-line `type` alias of `BlockFieldExtensions`.
   Recommendation: keep as the documented companion type to a kept factory. (If the repo
   were aggressively trimming unused type exports, this is the single barrel candidate,
   but I recommend against removing it.)

2. **`defaultLexical` barrel re-export** — JUDGMENT → **keep**. As noted above, the only
   real consumer (`templates/atomic-payload/src/payload.config.ts`) imports it from the
   `/default-lexical` subpath, not the barrel. The barrel line
   (`export { defaultLexical } from './blocks/richText/defaultLexical'`) is therefore not
   exercised by any external import. It is still the package's headline value and is
   documented as available from both places (`packages/richtext/README.md:18`, plugin
   doc), so removing the barrel form would be a doc-divergence with no real upside.
   Recommendation: keep.

3. **`createDefaultLexical` / `DefaultLexicalOptions`** (reachable only via
   `./default-lexical`, not the barrel) — JUDGMENT → **keep the subpath, no change**.
   These two symbols live in `src/blocks/richText/defaultLexical.ts` and are exposed only
   because the whole module is the `./default-lexical` subpath. I found **no** external
   importer of either (`templates/**`, `examples/**`, sibling `packages/*/src/**` only
   import `defaultLexical`); the only references are `docs/.../richtext.mdx` and the
   package README, both ignored by the method. They are a deliberate escape hatch (build
   the preset with a different `enabledCollections`) and are advertised in the docs as
   public API. They cannot be "removed" without either deleting them from the module or
   splitting the subpath, and the subpath itself must stay for `defaultLexical`.
   Recommendation: leave as-is; they ride along on a kept subpath at zero extra surface
   cost.

---

## Runtime importMap note

The generated admin importMaps
(`templates/**/admin/importMap.js`, `examples/**/admin/importMap.js`,
`packages/create-atomic-payload/scaffolds/**/admin/importMap.js`) contain **no**
`@pro-laico/richtext` entries. The only richtext-related importMap lines point at
`@payloadcms/richtext-lexical/rsc` and `@payloadcms/richtext-lexical/client` (the Lexical
editor's own client/RSC feature components — third-party, not this package).
Evidence: `templates/atomic-payload/src/app/(payload)/admin/importMap.js:12-30,56-74`.

Consequently this package has **no** admin/UI subpath that must be preserved for
importMap runtime loading. `RichTextChild` is a *frontend* render component (consumed by
the atomic render pipeline, not the admin importMap), and it is kept on those grounds.

This package also has **no** `./schema` (payload type-augmentation) subpath — the
`RichTextChild` interface is generated into app `payload-types.ts` from the block's
`interfaceName`/`typescriptSchema`, not imported from here.
