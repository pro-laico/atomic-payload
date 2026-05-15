# @pro-laico/ap-seed

Atomic Payload seed plugin. Wires a `POST /api/seed` Payload endpoint and an admin `BeforeDashboard` banner with a SEED DATABASE button. The consumer supplies the actual seed function — the package only ships the mechanism.

```ts
import { seedPlugin } from '@pro-laico/ap-seed'
import { seed } from '@/endpoints/seed'

export default buildConfig({
  plugins: [
    seedPlugin({
      enabled: process.env.INCLUDE_SEED === 'true',
      seed,
    }),
  ],
})
```

The button POSTs to `/api/seed` and the endpoint returns 403 unless `req.user` is authenticated.

## Migrating from a hand-rolled seed setup

If you're upgrading from a template that hand-wired the seed flow itself (a `BeforeDashboard` admin component plus a `POST /next/seed` Next.js route):

- The button now POSTs to `/api/seed` (a Payload custom endpoint) instead of `/next/seed`. Delete the old `app/(frontend)/next/seed/route.ts`.
- The `BeforeDashboard` admin component is provided by this package. Delete the local copy and drop the `beforeDashboard: [...]` entry from `admin.components` in `payload.config.ts` — `seedPlugin` injects it.
- After enabling the plugin (`INCLUDE_SEED=true`), run `pnpm payload generate:importmap` so Payload registers `@pro-laico/ap-seed/admin/beforeDashboard` in its import map.

<!-- workspace-deps:start (auto-generated, do not edit) -->

## Workspace dependencies

Other `@pro-laico/*` packages this package depends on:

- [`ap-core`](../ap-core)
- [`ap-design-sets`](../ap-design-sets)
- [`ap-forms`](../ap-forms)
- [`ap-icons`](../ap-icons)
- [`ap-site`](../ap-site)

Other `@pro-laico/*` packages that depend on this one:

- _(none)_

<!-- workspace-deps:end -->
