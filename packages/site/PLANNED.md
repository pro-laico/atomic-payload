# @pro-laico/site — Planned Features & Deferred Work

Forward-looking backlog distilled from `AUDIT.md`. These items are intentionally **not** done today — mostly part of the cross-package circular-deps cleanup. The corresponding `AUDIT.md` checkbox stays `[ ]` with an inline annotation.

## Cross-package: circular workspace deps

### Break the `site ↔ core` / `site ↔ styles` type cycles
- **What:** `headers/component.tsx`, `footers/component.tsx`, and `types/payload-augment.ts` import `@pro-laico/site/schema`, while `core` and `styles` import the same subpath — yet `site` depends on both `core` and `styles`. Type-only today (so it resolves), but fragile: any value-level import across the boundary breaks it.
- **Approach:** Move the shared schema-stub types to a leaf package (`@pro-laico/zap` or a dedicated `schema` package) both sides depend on. Core's half is already resolved (siblings → optional peer + dev deps). Do site + styles + icons together.
- **Source:** `src/collections/{headers,footers}/component.tsx:3`, `src/types/payload-augment.ts:7` · AUDIT.md → Medium. See also `styles/PLANNED.md`, `core/PLANNED.md`.

### Drop the `ShortcutSet` re-stub from `types/payload.ts`
- **What:** `src/types/payload.ts` re-declares `ShortcutSet`, which is owned by `@pro-laico/styles` — two packages can disagree on the type. Import it from styles' schema instead. (`SiteMetaDatum` is site-owned and fine.)
- **Why deferred:** Same root as the cycle above — dropping it now would just point site at styles and tighten the cycle. Resolved by the leaf-package move.
- **Source:** `src/types/payload.ts:9-10` · AUDIT.md → Low.

### Populate the zap `Header`/`Footer` registry entries
- **What:** Frontend components self-import `@pro-laico/site/schema`, so `header.children`/`header.ClassName` resolve to `any` (`Get<'Header', DefaultRecord>` falls back to `Record<string, any>` when the registry has no `Header`). Switch to the local relative type once the registry entries are populated, restoring type safety on the rendered fields.
- **Why deferred:** Only pays off once the registry is populated, which is part of the shared-schema-package decision. Works today.
- **Source:** `src/collections/{headers,footers}/component.tsx:3` · AUDIT.md → Low.

## Notes / intentional-for-now

- **Public-read explicitness** — `SiteMetaData`/`Settings` globals (and Header/Footer) use `read: authd`; SSR works only because the cache getters use the Local API default `overrideAccess: true`. Could be made explicit with `() => true` (or `authenticatedOrPublished`) later, but current behavior is correct and consistent with tracking/fonts. (AUDIT.md → Low.)
- **External-publish build** — `build` is a no-op; the package ships raw `src/` and is consumed via `transpilePackages`. If ever published to npm for non-bundler consumers, wire `tsc -p tsconfig.build.json` and point `exports` at `dist`. (AUDIT.md → Low.)
