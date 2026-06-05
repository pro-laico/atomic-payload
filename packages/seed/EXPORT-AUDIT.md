# `@pro-laico/seed` — Public Export Surface Audit

Barrel: 9 → keep 1, remove 4, judgment 4. Subpaths: 2 → keep 2, remove 0.

Audit-only. No source was edited and no typechecks were run. Counts treat the barrel's
nine exported symbols (`src/index.ts`) and the two `exports` subpaths in `package.json`
as the public surface.

## Method / what counts as a consumer

Searched the whole repo for real external importers — code under `templates/**`,
`examples/**`, or another `packages/*/src/**` (never `packages/seed/src` itself).
Ignored, per the brief: anything in `packages/seed/src`, `dist/**`, `*payload-types.ts`
(generated), and comments / `.md` / `.mdx` docs.

Findings, in short:

- The **only** external code that imports from `@pro-laico/seed` is the template:
  - `templates/atomic-payload/src/plugins/index.ts:3` — `import { seedPlugin } from '@pro-laico/seed'`
  - `templates/atomic-payload/src/app/(payload)/admin/importMap.js:39` — `import { default as … } from '@pro-laico/seed/admin/beforeDashboard'` (the **subpath**, not the barrel)
- No `packages/*/src` and no `examples/*` import anything from `@pro-laico/seed`.
  The three examples (`fonts-only`, `icons-only`, `styles-only`) have their **own**
  local seed routes (`@/seed/…`) and do not touch this package.
- The template has **no** `app/api/seed` route importing the `seed` function — the
  endpoint is mounted entirely inside `seedPlugin` via `createSeedEndpoint`, so neither
  `seed` nor `createSeedEndpoint` is imported externally.
- A repo-wide grep for `createSeedEndpoint|SeedSlugConfig|SeedAuthorize|SeedPluginOptions|BeforeDashboardPath`
  across `packages/`, `templates/`, `examples/` returned hits **only** inside
  `packages/seed/src` itself — zero external consumers for all five.
- The per-collection seed builders (`backendForm`, `designSet`, `footer`, `header`,
  `iconSet`, `shortcutSet`, `siteMetaData`, the `icons/*`, the `pages/*`) are **not on
  the barrel at all** — they are relative imports inside `src/seed`. They are already
  off the public surface; nothing to remove.

> Removing a name from `src/index.ts` (or a redundant subpath from `package.json`) does
> **not** delete the underlying module. Internal relative imports inside
> `packages/seed/src` keep working, and there is no zap registration or
> `generate:types` coupling in this package, so type generation is unaffected.

## Keep

- **`seedPlugin`** (value, from `./plugin`) — the main plugin entry; imported by name.
  Evidence: `templates/atomic-payload/src/plugins/index.ts:3` (used at
  `:55`, `seedPlugin({ enabled: … })`).

- **Subpath `.`** (root barrel) — the consumed entry point; `seedPlugin` is imported
  through it. Evidence: same file, `templates/atomic-payload/src/plugins/index.ts:3`.

- **Subpath `./admin/beforeDashboard`** — the admin `BeforeDashboard` React component,
  loaded through Payload's import map. Evidence:
  `templates/atomic-payload/src/app/(payload)/admin/importMap.js:39` and `:83`.
  This subpath is *not* redundant with the root barrel: the barrel deliberately does
  **not** re-export the component (see the comment at `src/index.ts:7-11`), so the
  import map can only reach it via this subpath. Keep.

## Remove

All four below are internal-only: referenced solely via relative imports inside
`packages/seed/src`, with no external importer anywhere in `templates/`, `examples/`, or
another package's `src`.

- **`BeforeDashboardPath`** (value, from `./plugin`; barrel line 11) — REMOVE.
  Read only by the plugin itself (`src/plugin.ts:47`, where the constant is defined at
  `:13` and used to populate `admin.components.beforeDashboard`). External code never
  imports the constant; the template's import map references the **string literal path**
  `@pro-laico/seed/admin/beforeDashboard` directly (`importMap.js:39`), not this export.
  Evidence: the name `BeforeDashboardPath` appears outside `packages/seed/src` in **no**
  code file (only in `docs/content/docs/plugins/seed.mdx`, which is docs). Safe to drop
  from the barrel; the in-module `const` stays where the plugin uses it.

- **`SeedSlugConfig`** (type, from `./seed`; barrel line 2) — REMOVE.
  Used only inside `src/seed/index.ts` (`:33` `DEFAULT_SEED_SLUGS`, `:45` the `seed`
  signature). No external file references `SeedSlugConfig`. Evidence: grep for
  `SeedSlugConfig` across `packages/`, `templates/`, `examples/` hits only
  `packages/seed/src/seed/index.ts`.

- **`SeedFn`** (type, from `./plugin`, re-exported from `./endpoint`; barrel line 5) —
  REMOVE. Used only internally: defined at `src/endpoint.ts:3`, consumed by
  `createSeedEndpoint` (`src/endpoint.ts:15`) and the `SeedPluginOptions.seed` field
  (`src/plugin.ts:3`,`:6`). No external importer. Evidence: grep returns only
  `packages/seed/src` hits. (See Judgment note — it is documented as public API.)

- **`SeedAuthorize`** (type, from `./plugin`, re-exported from `./endpoint`; barrel
  line 5) — REMOVE. Used only internally: defined `src/endpoint.ts:11`, consumed by
  `createSeedEndpoint` (`src/endpoint.ts:15`) and `SeedPluginOptions.authorize`
  (`src/plugin.ts:28`). No external importer. Evidence: grep returns only
  `packages/seed/src` hits.

## Judgment calls

These four have **no external importer today**, but each is plausibly intentional public
API (the plugin's options type, the documented default seed, and the endpoint
escape-hatch). All are listed in `docs/content/docs/plugins/seed.mdx` as exports, so
removing them is a documented-surface change, not a pure dead-code deletion. Decide per
your public-API policy.

- **`default` export (= `seedPlugin`)** (barrel line 4) — RECOMMEND KEEP.
  Every other `@pro-laico/*` plugin exports the plugin as `default`; the template happens
  to import the **named** `seedPlugin`, so the default has no external consumer in this
  repo. Keep for ecosystem consistency / external consumers outside the monorepo.

- **`SeedPluginOptions`** (type, from `./plugin`; barrel line 5) — RECOMMEND KEEP.
  The options type for the package's primary export. Not imported by the template (which
  passes an inline `{ enabled }`), but it is the canonical "main entry + its options
  type" public type. Conventional to keep even with no in-repo importer.

- **`seed`** (value, from `./seed`; barrel line 1) — RECOMMEND KEEP (lean toward).
  The bundled default seed function, documented (`seed.mdx`) as overridable/callable
  with an optional `slugConfig` second arg. No external code imports it in this repo (the
  template lets the plugin run it by default rather than calling it directly), but it is
  the headline public capability of the package. Keeping it implies keeping
  `SeedSlugConfig` too (its second-parameter type) — if you keep `seed` as public API,
  promote `SeedSlugConfig` back from the Remove list.

- **`createSeedEndpoint`** (value, from `./endpoint`; barrel line 3) — RECOMMEND REMOVE
  (weak keep). Documented as an "advanced use" escape hatch but used only by `seedPlugin`
  internally (`src/plugin.ts:44`). No external importer. With `seedPlugin` already
  covering the normal path, this is a low-value public export — safe to remove unless you
  want to preserve the advertised escape hatch; if removed, `SeedFn`/`SeedAuthorize` (its
  parameter types) have no remaining public reason to exist either.

### Coupled-type note

`SeedSlugConfig`, `SeedFn`, and `SeedAuthorize` are placed in **Remove** strictly on the
"no external importer" rule, but they are the parameter/companion types of the judgment-
call values (`seed` and `createSeedEndpoint`). If you decide to keep `seed` public, keep
`SeedSlugConfig`; if you decide to keep `createSeedEndpoint` public, keep `SeedFn` and
`SeedAuthorize`. Treat each value + its types as a unit.
