# `@pro-laico/zap` — Public Export Surface Audit

Barrel: 5 → keep 3, remove 2. Subpaths: 3 → keep 2, remove 1.

Audit-only. Removing an export does **not** delete the source module — the internal
relative imports inside `packages/zap/src` keep working regardless. "External
consumer" means an import in `templates/**`, `examples/**`, or another
`packages/*/src/**` (not `packages/zap/src` itself). Generated `*payload-types.ts`,
`dist/**`, comments, and `.md`/`.mdx` docs were ignored as evidence.

## Enumerated surface

Barrel (`packages/zap/src/index.ts`):

1. `z` (named export + `default`) — Zod re-exported with the `z.ap` registry helper attached.
2. `AtomicPayloadZodClass` — re-exported from `./ap`.
3. `GenerateBlocksTypeProps` (type) — from `./jsonSchema`.
4. `generateBlocksType` — from `./jsonSchema`.
5. `toJSONSchemaExtensions` — from `./jsonSchema`.

(`export * from 'zod'` lives inside `ap.ts` and is folded into the `z` namespace, so
it is covered by the `z` entry above. `ap` and `ap.Type` are reached via `z.ap`, not
exported standalone from the barrel.)

Subpaths (`exports` / `publishConfig.exports` in `packages/zap/package.json`):

1. `.` — the root barrel.
2. `./schema` — the `AtomicRegistry` type (`src/types/payload-augment.ts`).
3. `./src` — duplicate of the root barrel.

## Keep

- **`z` (named + default) — barrel.** The whole point of the package; imported via
  `import { z } from '@pro-laico/zap'` across many packages.
  Evidence: `packages/atomic/src/children/zap.ts:1`, `packages/styles/src/fields/value.ts:2`,
  `packages/site/src/zap.ts:1`.

- **`generateBlocksType` — barrel.** Imported by the starter template and passed into
  the core JSON-schema plugin.
  Evidence: `templates/atomic-payload/src/plugins/jsonSchema.ts:4` (`import { generateBlocksType, toJSONSchemaExtensions } from '@pro-laico/zap'`, used at line 15).

- **`toJSONSchemaExtensions` — barrel.** Imported by both the template and the styles
  plugin (the styles plugin appends it to `config.typescript.schema`).
  Evidence: `packages/styles/src/plugin.ts:3` (used at line 139); also
  `templates/atomic-payload/src/plugins/jsonSchema.ts:4` (used at line 14).

- **`.` — subpath.** The root barrel that delivers everything above. Keep.

- **`./schema` — subpath.** The `AtomicRegistry` type alias, intentionally split out
  so consumers can reference the registry type without dragging in the `server-only`
  runtime barrel. **Caveat:** the only import found is `packages/zap/src/ap.ts:5`
  (`import type { AtomicRegistry } from '@pro-laico/zap/schema'`) — that is zap
  importing its *own* subpath, i.e. internal, not a true external consumer. No
  `templates/**`, `examples/**`, or other-package import of `@pro-laico/zap/schema`
  exists today. It is kept on JUDGMENT (see below) because it is the documented,
  deliberately-isolated public type entrypoint, and zap itself depends on the subpath
  resolving. Removing the subpath would also break that self-import.

## Remove

- **`AtomicPayloadZodClass` — barrel (internal-only).** No external consumer imports it.
  It is defined and instantiated only inside the package; the shared instance `z.ap`
  is what everything uses. Only references: the definition + instantiation +
  re-export in `packages/zap/src/ap.ts:15,74,90` and the re-export in
  `packages/zap/src/index.ts:8`. No `templates/**`, `examples/**`, or other
  `packages/*/src/**` import. (Documented in `README.md`/`zap.mdx`, but docs are not
  consumers.) Removing the barrel re-export leaves the class fully functional
  internally. See Judgment calls — borderline public API.

- **`GenerateBlocksTypeProps` (type) — barrel (internal-only / redundant).** No external
  package imports it from zap. The only `packages/core` reference
  (`packages/core/src/jsonSchema.ts:12`, re-exported at `packages/core/src/index.ts:60`)
  is a **separate, locally-defined** `GenerateBlocksTypeProps` in core — not an import
  of zap's. Inside zap it is used only as the param type of `generateBlocksType`
  (`packages/zap/src/jsonSchema.ts:5,12`). Safe to drop from the barrel; the type stays
  available locally for `generateBlocksType`. See Judgment calls.

- **`./src` — subpath (redundant).** Duplicates the root barrel (`.`) — same
  `./src/index.ts` target — and nothing imports the `@pro-laico/zap/src` form anywhere
  (no hits in `templates/**`, `examples/**`, or any `packages/*/src/**`). Pure dead
  alias. Remove from both `exports` and `publishConfig.exports`.

## Judgment calls

- **`AtomicPayloadZodClass` (barrel).** Unused externally, but it is the class behind
  `z.ap` and is explicitly listed as public API in `packages/zap/README.md:17` and
  `docs/content/docs/plugins/zap.mdx:98` ("exported for typing and extension"). It is a
  plausible type/extension hook even with zero current importers.
  **Recommendation:** REMOVE from the barrel for now (nothing consumes it and `z.ap`
  covers the runtime need); if you'd rather preserve the advertised typing/extension
  surface, KEEP it and treat the zero-usage as intentional public API. Lean remove.

- **`GenerateBlocksTypeProps` (type, barrel).** Unused externally and shadowed by core's
  own same-named local type, but documented at `packages/zap/README.md:17` and
  `docs/content/docs/plugins/zap.mdx:101` as the argument shape for `generateBlocksType`.
  **Recommendation:** REMOVE the barrel re-export; keep the type local to `jsonSchema.ts`.
  Callers of `generateBlocksType` get the shape via inference and don't need the named
  type. Lean remove.

- **`./schema` subpath.** Kept above, but flagged: its only importer is zap importing
  itself (`packages/zap/src/ap.ts:5`). It is not consumed by any other package today.
  **Recommendation:** KEEP — it is the documented, runtime-free type entrypoint and zap's
  own self-import relies on it; removing it would break that import and the advertised
  API. (Could be reduced to a relative `import type` internally if you ever want to drop
  the subpath, but that is a refactor, not a pure export removal.)

## Notes / uncertainty

- Docs (`docs/content/docs/plugins/zap.mdx`, `core.mdx`, `styles.mdx`) and the package
  READMEs reference all these symbols, but per method docs are not consumers; if any
  removal is taken, those docs should be updated to match.
- `examples/**` was searched and contains **no** `@pro-laico/zap` imports at all, so it
  contributed no evidence either way.
