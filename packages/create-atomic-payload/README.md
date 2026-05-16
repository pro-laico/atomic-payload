# @pro-laico/create-atomic-payload

> The `npx` scaffolder for new [Atomic Payload](https://atomicpayload.com) projects. Copies the starter template, installs dependencies, builds sharp, and downloads fonts so the user lands on a working dev server.

## What this package is

A small Node CLI (`bin/cli.js`) that bootstraps a new Atomic Payload project. It's the front door for anyone who isn't contributing to the monorepo — they `npx` this, answer a path, and get a runnable template.

Unlike the rest of the monorepo, this package has **no `src/`**:

- `bin/cli.js` — the CLI entrypoint (Node ESM, no transpile step).
- `scripts/copy-template.js` — a `prepack` step that copies `templates/atomic-payload/` from the repo root into this package's `template/` folder so the published tarball is self-contained.
- `template/` — populated at pack time; the published tarball ships this verbatim.

## Why it exists separately

It's the only published artifact that's a CLI rather than a library. Keeping it in its own package means:

- The user-facing `npx` flow is decoupled from how the monorepo organizes plugins.
- Releases of the template don't force version bumps on every plugin.
- We can rev the scaffolder UX (prompts, post-install steps) without touching runtime code.

## Quick start (for end users)

```bash
npx @pro-laico/create-atomic-payload my-project
cd my-project
cp .env.example .env
# Edit .env with your MongoDB URI, Payload secret, etc.
pnpm dev
```

To scaffold into the current directory:

```bash
npx @pro-laico/create-atomic-payload .
```

## What the CLI does

1. Copies `template/` (i.e. `templates/atomic-payload/`) into the target directory.
2. Installs dependencies with `pnpm`.
3. Rebuilds `sharp` for the local platform.
4. Downloads fonts via the template's `download:fonts` script.

After that the user edits `.env` and runs `pnpm dev`.

## Maintaining this package

- The `prepack` script (`scripts/copy-template.js`) is what makes `template/` real. Don't commit `template/` — it's regenerated on every publish.
- The version of this package is the version end users see. Bump it when:
  - The template gains breaking changes.
  - The CLI flow itself changes (new prompts, new post-install steps).
- See `MONOREPO.md` at the repo root for the publish flow.

## Prerequisites for end users

- Node.js 18+
- pnpm (recommended): `npm install -g pnpm`

## Where it sits in the monorepo

Leaf package — depends on no `@pro-laico/*` packages. The template it ships (`templates/atomic-payload/`) is the consumer of every other plugin in this repo.
