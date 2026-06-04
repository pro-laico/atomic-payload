> [!IMPORTANT]
> Our [Discord](https://discord.gg/EPHgjrQBxY) is the best place to get quick answers to questions.
>
> For documentation check out [Atomic Payload](https://atomicpayload.com).
>
> We are also looking for contributors!

# Atomic Payload

**The Payload CMS starter where all you need to know is Tailwind.**

Atomic Payload is an opinionated [Payload CMS](https://payloadcms.com) + [Next.js](https://nextjs.org) starter that lets you build and style pages from the admin dashboard using atomic CSS utility classes. It is the flagship template scaffolded by `create-atomic-payload`, wiring together the `@pro-laico/*` plugin suite into a ready-to-deploy website builder.

## What's Included

This template registers the following `@pro-laico/*` plugins (see `src/plugins/index.ts`):

- **`@pro-laico/site`** — the core "site shape": `Pages`, `Header`, and `Footer` collections plus the `SiteMetaData` and `Settings` globals.
- **`@pro-laico/styles`** — atomic class-name fields plus the `DesignSet` and `ShortcutSet` collections and draft/published CSS storage globals.
- **`@pro-laico/atomic`** — default form blocks (`formsPlugin`) and action blocks (`actionsPlugin`).
- **`@pro-laico/fonts`** — the `Font` collection and font upload/download pipeline.
- **`@pro-laico/icons`** — the `Icon` and `IconSet` collections.
- **`@pro-laico/images`** — the `Images` and `Favicons` collections (with blur-data-url generation).
- **`@pro-laico/mux-video`** — the `MuxVideo` collection for video upload/playback through the admin.
- **`@pro-laico/richtext`** — the Lexical editor configuration (`defaultLexical`).
- **`@pro-laico/tracking`** — the `Tracking` global (GTM + PostHog) and the `posthogProperty` collection.
- **`@pro-laico/seed`** — the `SEED DATABASE` admin banner and `POST /api/seed` route (gated by `INCLUDE_SEED`).
- **`@pro-laico/core`** — revalidation hooks and server-URL helpers.

It also wires Payload's `plugin-form-builder`, `plugin-nested-docs`, and `storage-vercel-blob`.

**Stack:** Payload 3 · Next.js 16 · React 19 · MongoDB (Mongoose adapter) · Vercel Blob storage · UnoCSS · Biome.

## Quick Start

> **Requirements:** Node `24.x` and [pnpm](https://pnpm.io). MongoDB is the database adapter, and Vercel Blob is the file storage — see [Setup](#setup) below for obtaining those connections.

```bash
# Scaffold a fresh project (skip if you already have one)
pnpx create-atomic-payload

# Install dependencies
pnpm install

# Copy the example env and fill in the required values (see Setup)
cp .env.example .env

# Start the dev server (also runs the font download prebuild on `build`)
pnpm dev
```

Then open `http://localhost:3000/admin` to create your first admin user. To seed starter content, use the **SEED DATABASE** button on the admin dashboard (requires `INCLUDE_SEED=true`).

## Scripts

| Script | Description |
| --- | --- |
| `pnpm dev` | Start the Next.js dev server. |
| `pnpm build` | Production build (runs `download:fonts` first via `prebuild`). |
| `pnpm start` | Start the production server. |
| `pnpm download:fonts` | Download configured fonts from the `Font` collection. |
| `pnpm generate:types` | Regenerate `payload-types.ts` and run `core-augment-types`. |
| `pnpm generate:importmap` | Regenerate the admin import map. |
| `pnpm payload` | Run the Payload CLI. |
| `pnpm lint` | Lint with Biome. |
| `pnpm format` | Format with Biome. |
| `pnpm check` | Run Biome check (lint + format) with fixes. |
| `pnpm typecheck` | Type-check with `tsc --noEmit`. |

> There is no standalone `seed` script — seeding runs through the seed plugin's **SEED DATABASE** admin banner / `POST /api/seed` route.

## Project Structure

```
src/
  app/
    (frontend)/        Next.js frontend routes, layout, sitemap, preview routes
    (payload)/         Payload admin + API routes
  access/              Reusable access-control helpers
  collections/         Users collection (all others come from plugins)
  plugins/             Plugin composition (index.ts) + per-plugin config files
  ui/                  Admin Icon/Logo graphics and site-trigger components
  payload.config.ts    Payload config (plugins, db, admin, live preview)
```

> All collections except `Users` are contributed by the `@pro-laico/*` plugins — see `src/collections/index.ts` and `src/plugins/index.ts`.

# Template Setup

This guide covers environment setup, deployment, and optional integrations (Mux, Resend) for your Atomic Payload project. Use it whether you created a project with `pnpx create-atomic-payload` or are developing from the monorepo template folder.

> **Developing the monorepo?** See [MONOREPO.md](../../MONOREPO.md) in the repo root for structure, local dev, and plugin instructions.

## Setup

1. **Get Required Connections**
   - Obtain a `MONGODB_URI` (Set up through Vercel to get a free tier cluster(`Storage → Create Database → MongoDB Atlas`)).
   - Create a Blob store in Vercel (`Storage → Create Database → Blob`) and copy the `BLOB_READ_WRITE_TOKEN` from .env.local.

2. **Configure your project**
   - Copy `.env.example` to `.env`.
   - Add the MongoDB URI and Blob token.
   - Generate and add the Payload and Preview secrets.

   ```bash
   # Mongo DB connection string
   MONGODB_URI="mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/my_database?retryWrites=true&w=majority"
   # Vercel Blob Read Write Secret
   BLOB_READ_WRITE_TOKEN="vercel_blob_rw_laogivGHAOSNeoFS_KJAGsjmeHSkaLQUVhUSHmfPGIXCbHe"

   # Used to encrypt JWT tokens
   PAYLOAD_SECRET=524AFEAC8E77853C6AC1C2EBCB266
   # Used to validate preview requests
   PREVIEW_SECRET=77E41879964C5D1C251661663DCD3
   ```

3. **Create First Admin User**

   ```bash
   pnpm dev
   ```

   - Open `http://localhost:3000/admin` and create the first admin user.

4. **Update environment variables**
   - Add the created admin email and password to `.env` as:

   ```bash
   # Script User Login
   SCRIPT_USER_EMAIL="chad@atomicpayload.com"
   SCRIPT_USER_PASSWORD="Password123"
   ```

5. **Deploy to Vercel**
   - Create a new project in Vercel by importing your repo. But before hitting create:
   - In your local `.env`, update:

   ```bash
   LIVE_SITE_URL='https://<project-name>.vercel.app'
   ```

   - Copy all environment variables above and including LIVE_SITE_URL to the Vercel project settings.
   - In the Vercel environment variables edit NEXT_PUBLIC_SERVER_URL to the LIVE_SITE_URL
   - Trigger a deploy and wait for the build to complete.

You now have a working version of Atomic Payload. It is recommended to go to the main admin dashboard on the site and seed the database with some data using the **SEED DATABASE** banner. Just keep in mind this will override existing data, so once you have seeded you can disable the seed functionality by setting `INCLUDE_SEED=false` in your environment (the seed banner and `POST /api/seed` route are gated on this flag).

# Additional Setup

### Vercel Rebuild Webhook

Trigger a rebuild of your deployment using a vercel webhook. Mainly used when updating fonts.

1. Get Hook URL
   - Go to your projects dashboard then (`Settings → Git → Deploy Hooks`).
   - Add a name and select the branch to rebuild (usually `main`).
   - Copy the hook URL and add it to your Vercel env. Example:
   ```bash
   VERCEL_DEPLOY_WEBHOOK_URL=https://api.vercel.com/v1/integrations/deploy/prj_55B6CE7961E311671658DBFD8B59C
   ```

### Mux Setup

Upload and serve video all through the Payload admin dashboard.

1. Account Setup
   - Create a Mux Account
   - Create a new environment
   - Set it to **Production** and configure access controls

2. Setup Mux Token
   - In Mux, go to (`Settings → Access Tokens`).
   - Create a new token.
   - Select **Payload Admin** and enable all permissions.
   - Copy the **Token ID** to `MUX_TOKEN_ID`.
   - Copy the **Secret Key** to `MUX_TOKEN_SECRET`.

3. Setup Mux Webhook
   - In Mux, go to (`Settings → Webhooks`):
   - Add a webhook for your live site with the route `/api/mux/webhook`. e.g: `<live-site-url>/api/mux/webhook`
   - Copy the generated secret to `MUX_WEBHOOK_SIGNING_SECRET`

   #### Example:

   ```bash
   #Mux Secrets. For mux video block component.
   MUX_TOKEN_ID=bd47f2c1e-5a8b-4f92-9b3e-2c1d7a6f4e91
   MUX_TOKEN_SECRET=K9ZpY1cE8M7R0xBqW3uT4nD2JH6OaLwFhVQ5S/ImsPjGkUoXyAetCzNrbf0d+8lH
   MUX_WEBHOOK_SIGNING_SECRET=7k4qv9xrmhsj2p1d8zf6bwl0ntgy5cqe
   ```

### Resend Setup

Send emails programmatically upon form submissions using Resend.

1. Get An API Key
   - In the Resend Dashboard Go To API Keys
   - Create and name a new API key then copy to `RESEND_API_KEY`
   ```bash
   RESEND_API_KEY=qR8_LpWzNy_7vKDmHT2JXsFo9BbUyRcAeLQ
   ```
2. Handle For The Sender Domain
   - Go To Domains And Create a New Domain (Use a purchased domain, and preferably set as a subdomain such as `notifications.atomicpayload.com`)
   - Go Through Resend Setup Instructions
   - In your repo, at `src/payload.config.ts` uncomment all code related to the resendAdapter and modify to fit your implementation.
