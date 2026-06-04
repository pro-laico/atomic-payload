# @pro-laico/seed

> Mechanism for seeding an Atomic Payload database from the admin UI. Wires a `POST /api/seed` endpoint and a `SEED DATABASE` button in the dashboard. Ships an opinionated default seed; consumers can pass their own.

## What this package is

A Payload plugin that gives you a one-click way to populate a fresh database with the content needed to make Atomic Payload actually work: a starter design set, a default icon set, header/footer globals, site metadata, etc. The pieces:

- **`POST /api/seed`** — a Payload custom endpoint that runs whatever `seed` function you give the plugin. Guarded: returns 403 unless `req.user` is authenticated, and (if an `authorize` predicate is passed) unless that predicate also approves the user.
- **`BeforeDashboard`** — a React banner registered into the admin dashboard with a SEED DATABASE button. Clicking it POSTs to the endpoint.
- **`seed`** — the bundled default seed for atomic-payload templates. It writes a design set, the standard icon set, header/footer, and `SiteMetaData`/`Settings` globals. You can replace it with your own.

## Why it exists

Atomic Payload depends on certain documents existing — there has to be an active design set, header, footer, and site metadata for anything to render correctly. Without a seed, a fresh install drops the user into an empty dashboard with no way to know what's expected. The seed flow solves that and gives a one-button reset for development.

The endpoint is mounted on Payload's API (`/api/seed`) rather than the Next.js app router, so it runs inside Payload's request lifecycle with auth, access checks, and transactions all wired up.

## Quick start

```ts
import { buildConfig } from 'payload'
import { seedPlugin } from '@pro-laico/seed'

export default buildConfig({
  plugins: [
    seedPlugin({
      enabled: process.env.INCLUDE_SEED === 'true',
    }),
  ],
})
```

That uses the bundled default seed. To pass your own:

```ts
import { seedPlugin } from '@pro-laico/seed'
import { mySeed } from './seed' // your own SeedFn

seedPlugin({ enabled: true, seed: mySeed })
```

A `seed` function has the signature `({ payload, req }) => Promise<void>` (the `SeedFn` type). The endpoint calls it inside Payload's request lifecycle, so `req` carries the transaction.

After enabling the plugin, run `pnpm payload generate:importmap` so Payload registers `@pro-laico/seed/admin/beforeDashboard` in its import map. Otherwise the dashboard banner won't render.

## Plugin options

| Option | Default | What it does |
| --- | --- | --- |
| `enabled` | `true` | No-op the plugin entirely. |
| `seed` | bundled default | The function the endpoint calls. |
| `endpointPath` | `/seed` | Path under `/api` (so default resolves to `/api/seed`). |
| `authorize` | allow any authenticated user | A `SeedAuthorize` predicate run **after** the auth check to further restrict who can seed. Receives the authenticated user, returns `boolean \| Promise<boolean>`. Since the seed wipes and recreates the whole DB, pass a role test in multi-user / production apps (e.g. `(user) => user.roles?.includes('admin')`). |
| `registerBeforeDashboard` | `true` | Whether to inject the admin banner. |

> **Slug overrides** are *not* a plugin option. The bundled `seed()` takes an optional **second argument**, `slugConfig` (a `SeedSlugConfig`), so you can remap the collection/global slugs it writes to: `seed(args, slugConfig)`. To use it through the plugin, wrap it: `seedPlugin({ seed: (args) => seed(args, { pages: 'my-pages' }) })`.

## What lives in `src/`

| Path | What's there |
| --- | --- |
| `index.ts` | Barrel — re-exports the plugin, `seed`, `createSeedEndpoint`, `BeforeDashboardPath`, and types. |
| `plugin.ts` | `seedPlugin` — wires endpoint + admin component. |
| `endpoint.ts` | `createSeedEndpoint` — builds the auth-guarded handler; `SeedFn`/`SeedAuthorize` types. |
| `seed/` | The bundled default seed (`seed`, `SeedSlugConfig`) plus its content modules and icon assets. |
| `components/admin/BeforeDashboard.tsx` | The dashboard banner (default export) that renders the seed instructions. |
| `components/admin/SeedButton.tsx` | The client SEED DATABASE button that POSTs to the endpoint. |

## Subpath imports

| Subpath | What's there |
| --- | --- |
| `./admin/beforeDashboard` | The admin component (loaded via Payload's import map) |

Also exported from the root: `seedPlugin` (default + named), the bundled `seed`, `createSeedEndpoint` (build the auth-guarded endpoint yourself), `BeforeDashboardPath` (the string Payload's import map resolves), and the types `SeedPluginOptions`, `SeedFn`, `SeedAuthorize`, and `SeedSlugConfig`.

## Migrating from a hand-rolled seed setup

If you're upgrading from a template that hand-wired the seed flow:

- The button now POSTs to `/api/seed` (a Payload custom endpoint) instead of `/next/seed`. Delete the old `app/(frontend)/next/seed/route.ts`.
- The `BeforeDashboard` admin component is provided by this package. Delete the local copy and drop the `beforeDashboard: [...]` entry from `admin.components` in `payload.config.ts` — `seedPlugin` injects it.
- Run `pnpm payload generate:importmap` after enabling the plugin.

## Peer dependencies

All required — the plugin registers a Payload endpoint and an admin React component.

| Peer | Why |
| --- | --- |
| `payload` | Plugin/endpoint host. |
| `next` | Host app framework. |
| `react` | The `BeforeDashboard` / `SeedButton` components. |
| `@payloadcms/ui` | `Banner` element and `toast` used by the admin components. |

## Where it sits in the monorepo

Depends on `core`, `styles`, `icons`, `site`, and `atomic`. The default seed needs all of those to know what to write. Has no internal dependents.
