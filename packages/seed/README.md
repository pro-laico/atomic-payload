# Atomic Payload Seed Plugin

Seeds an Atomic Payload database from the admin UI by wiring a `POST /api/seed` endpoint and a SEED DATABASE dashboard button, shipping an opinionated default seed that consumers can override. Part of [Atomic Payload](https://atomicpayload.com).

- [Documentation](https://atomicpayload.com/docs/plugins/seed)
- [Source code](https://github.com/pro-laico/atomic-payload/tree/main/packages/seed)
- [Documentation source](https://github.com/pro-laico/atomic-payload/tree/main/docs/content/docs/plugins/seed.mdx)

## Atomic Payload dependencies

The bundled default seed needs all of these to know what to write:

- `@pro-laico/core` — Atomic Payload kernel and defaults.
- `@pro-laico/atomic` — atomic block content written by the seed.
- `@pro-laico/icons` — writes the standard default icon set.
- `@pro-laico/site` — writes header/footer globals and `SiteMetaData`.
- `@pro-laico/styles` — writes the starter design set.

## Exports

| Import | What's there |
| --- | --- |
| `.` | Plugin barrel — `seedPlugin` (default + named), the bundled `seed`, and the `SeedPluginOptions` / `SeedSlugConfig` types. |
| `./admin/beforeDashboard` | The `BeforeDashboard` admin banner component (loaded via Payload's import map). |
