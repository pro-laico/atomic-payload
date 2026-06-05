# `@pro-laico/mux-video` — Public Export Surface Audit

Barrel: 4 → keep 3, remove 0 (1 judgment). Subpaths: 3 → keep 3, remove 0.

Audit-only. Removing a barrel export never deletes its source module — the
plugin reaches `MuxVideo`, `createVideoBlock`, etc. via **relative** imports
inside `packages/mux-video/src`, and there is no zap registration or
`generate:types` dependency on the barrel. The `./blocks/videoChild` and
`./blocks/videoChild/component` subpaths must stay (consumed by
`@pro-laico/atomic`). This package has **no `./schema` (payload-augment)
subpath** — the `VideoChild` block's type augmentation lives in
`@pro-laico/atomic` (`packages/atomic/src/children/types/payload-augment.ts`),
not here, so there is nothing of that kind to keep.

## Method notes / what was checked

- Barrel = `packages/mux-video/src/index.ts`: `MuxVideo`, `default`,
  `muxVideoPlugin`, `MuxVideoPluginOptions` (type).
- Subpaths = `package.json` `exports` / `publishConfig.exports`: `.`,
  `./blocks/videoChild`, `./blocks/videoChild/component`.
- The block subpath (`./blocks/videoChild`) re-exports symbols that are **not**
  on the root barrel: `createVideoBlock`, `Video`, `VideoBlockOptions` (type).
  These are only reachable via the subpath.
- Ignored as non-consumers per the brief: everything under
  `packages/mux-video/src`, all `dist/**`, the generated
  `templates/atomic-payload/src/payload-types.ts` (the `MuxVideo` /
  `VideoChild` names there are generated interfaces, not imports), and all
  `.md` / `.mdx` docs.
- Runtime importMaps checked
  (`templates/**/admin/importMap.js`, `examples/**/admin/importMap.js`,
  `packages/create-atomic-payload/scaffolds/**/admin/importMap.js`): **none**
  reference any `@pro-laico/mux-video` subpath. The only Mux entries are
  `@oversightstudio/mux-video/elements` (upstream). The `VideoChild` component
  is a **frontend/SSR** render component pulled in through
  `@pro-laico/atomic`'s `frontend-components.ts`, not an admin importMap UI
  component — so it is kept on the strength of that import, not importMap.

## Keep

### Barrel

- **`muxVideoPlugin`** (named) — the plugin factory; main entry users wire up.
  Evidence: `templates/atomic-payload/src/plugins/muxVideo.ts:1`
  (`import { muxVideoPlugin } from '@pro-laico/mux-video'`).
- **`default`** (the plugin) — default export of the plugin factory. No external
  file imports the *default* form today (the template uses the named export),
  but it is the package's plugin/default export and is kept per the standing
  KEEP rule for plugin + default export. Evidence: declared at
  `packages/mux-video/src/plugin.ts:67` (`export default muxVideoPlugin`).
- **`MuxVideoPluginOptions`** (type) — the main options type for the plugin.
  No external import (the template calls `muxVideoPlugin()` with no typed
  variable), but kept per the standing KEEP rule for the main options type.
  Evidence: `packages/mux-video/src/index.ts:4`.

### Subpaths

- **`.`** (root barrel) — consumed for the plugin.
  Evidence: `templates/atomic-payload/src/plugins/muxVideo.ts:1`.
- **`./blocks/videoChild`** — block factory + prebuilt block, imported by a
  sibling package. Evidence: `Video` →
  `packages/atomic/src/children/blocks.ts:10`; `createVideoBlock` →
  `packages/atomic/src/children/buildChildBlocks.ts:6`.
- **`./blocks/videoChild/component`** — the `VideoChild` SSR render component,
  re-exported by a sibling package's frontend component registry. Evidence:
  `packages/atomic/src/children/frontend-components.ts:5`
  (`export { VideoChild } from '@pro-laico/mux-video/blocks/videoChild/component'`).

#### Symbols behind `./blocks/videoChild` (kept with the subpath)

- **`createVideoBlock`** — imported externally; see above.
- **`Video`** — imported externally; see above.
- **`VideoBlockOptions`** (type) — the options type for the exported
  `createVideoBlock` factory. No external import of the *type* itself (the
  atomic caller passes `BlockFieldExtensions`-shaped objects positionally), but
  it is the public option type of a kept public factory, so it travels with it.
  Evidence: declared `packages/mux-video/src/blocks/videoChild/block.ts:21`.

## Remove

None. No barrel export and no subpath is internal-only or a redundant duplicate
of the root barrel:

- The barrel is only 4 symbols; 3 are the plugin/options surface and the 4th
  (`MuxVideo`) is a documented public collection (see Judgment).
- Neither block subpath duplicates the root barrel — `createVideoBlock`,
  `Video`, and `VideoBlockOptions` are *not* on the root barrel, so the
  subpaths are the only way to reach them and cannot be "redundant".

## Judgment calls

- **`MuxVideo`** (collection, barrel — `packages/mux-video/src/index.ts:1`).
  No real external consumer imports it. The only repo hits are the **generated**
  `templates/atomic-payload/src/payload-types.ts` (a generated interface, not an
  import) and docs (`docs/content/docs/plugins/mux-video.mdx:196`, which tells
  users to import it to "register or extend the collection yourself"). The
  plugin registers this collection itself via `includeCollection` (default
  true) using a relative import (`packages/mux-video/src/plugin.ts:6`), so the
  barrel export is unused by any code today.
  - **Recommendation: KEEP (lean).** It is a legitimately public collection
    factory — exactly the "collection a user adds/extends" case the KEEP rule
    covers — and it is documented as such. The cost of keeping it is one barrel
    line. Only remove it if you decide the documented extend-it-yourself path is
    not supported, in which case also drop the docs export-table row. Removing
    it would not break the plugin (it imports `MuxVideo` relatively, not from
    the barrel).
