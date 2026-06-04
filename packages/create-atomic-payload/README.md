# @pro-laico/create-atomic-payload

> The `npx` scaffolder for new [Atomic Payload](https://atomicpayload.com) projects. Pick a scaffold, get a target directory, and the CLI copies it, installs dependencies, rebuilds sharp, and downloads fonts so you land on a working dev server.

## What this is

A small Node CLI (`bin/cli.js`) that bootstraps a new Atomic Payload project or example. It's the front door for anyone who isn't contributing to the monorepo — they run it, pick a scaffold, and get a runnable project.

Unlike the rest of the monorepo, this package has **no `src/`** and no transpile step:

- `bin/cli.js` — the CLI entrypoint (Node ESM, run directly).
- `scaffolds.js` — the registry of scaffolds the CLI can create (the single source of truth shared by the CLI and the bundle script).
- `scaffolds/` — the bundled scaffold sources, populated at pack time by `prepack`; the published tarball ships them verbatim. In the monorepo (dev), the CLI falls back to the real `templates/`/`examples/` directories instead.

## Usage

```bash
npm create @pro-laico/atomic-payload@latest
# or
npx @pro-laico/create-atomic-payload
```

Pass a project name to skip the default, and `--template` to skip the scaffold prompt:

```bash
npx @pro-laico/create-atomic-payload my-website
npx @pro-laico/create-atomic-payload my-icons --template icons-only
```

To scaffold into the current directory, pass `.`:

```bash
npx @pro-laico/create-atomic-payload .
```

If you omit the project name, the CLI uses `my-<scaffold>` (e.g. `my-atomic-payload`). Project names must use only lowercase letters, numbers, and hyphens, or `.` for the current directory. The CLI refuses to overwrite an existing directory (or, for `.`, a directory that already has a `package.json`).

## Options / flags

| Flag | Alias | What it does |
| --- | --- | --- |
| `--template <name>` | `-t` | Scaffold to use, skipping the interactive prompt. Must be one of the scaffold names below; an unknown name exits with an error. |
| `--help` | `-h` | Print usage, options, and the scaffold list, then exit. |

The single positional argument is the project name / target directory.

When no `--template` is given and the terminal is interactive (a TTY), the CLI shows a numbered prompt listing the scaffolds and defaults to the first (`atomic-payload`). In a non-interactive context (piped / CI), it skips the prompt and uses the default scaffold (`atomic-payload`).

## What you get

The CLI offers four scaffolds, defined in `scaffolds.js`:

| Name | Type | What it is |
| --- | --- | --- |
| `atomic-payload` | template | Full starter — Payload + Next.js + Tailwind, every plugin. **Default.** |
| `fonts-only` | example | Minimal example — `@pro-laico/fonts` in isolation. |
| `icons-only` | example | Minimal example — `@pro-laico/icons` in isolation. |
| `styles-only` | example | Minimal example — `@pro-laico/styles` in isolation. |

The chosen scaffold is copied into the target directory, skipping `node_modules`, `.next`, `.git`, `.env`, and `*.tsbuildinfo`. During the copy the CLI also:

- Renames `gitignore.template` → `.gitignore` (npm rewrites a packaged `.gitignore` to `.npmignore`, so it's shipped under a neutral name).
- Copies `.env.example` → `.env` so the project is ready to configure and run.

## After scaffolding

The CLI runs the post-scaffold steps for you:

1. **Installs dependencies** with `pnpm install`.
2. **Rebuilds sharp** (`pnpm rebuild sharp`) so its native binary matches your platform — fixes Windows/OneDrive issues. This step is best-effort: if it fails it's skipped with a warning (`run "pnpm rebuild sharp" if images fail`).
3. **Downloads fonts** (`pnpm download:fonts`) — only for scaffolds that ship a `download:fonts` script. Scaffolds without one skip this step (the CLI notes "this scaffold has no font step").

It then prints the next steps:

```bash
cd <project-name>
# Edit .env with your MongoDB URI, Payload secret, etc.
pnpm dev
```

(When you scaffold into `.`, the `cd` step is omitted.)

### Prerequisites

- Node.js 18+
- pnpm — the CLI shells out to `pnpm install`, `pnpm rebuild`, and `pnpm download:fonts`. Install it with `npm install -g pnpm` if you don't have it.

## How it works

`scaffolds.js` is the registry shared by `bin/cli.js` (which lists scaffolds and copies the chosen one) and `scripts/bundle-scaffolds.js`. The `prepack` script runs `bundle-scaffolds.js`, which copies each scaffold's git-tracked files from the monorepo (`templates/atomic-payload`, `examples/fonts-only`, `examples/icons-only`, `examples/styles-only`) into `scaffolds/<name>/`, rewrites each `workspace:*` dependency to a caret-pinned version read from the matching `packages/<name>/package.json`, and writes a self-contained `biome.json` into each scaffold. A `workspace:*` reference with no matching package fails the build so a broken tarball is never shipped.

At runtime the CLI resolves each scaffold's source from the bundled `scaffolds/<name>/` when published, or falls back to the monorepo directory when run in-repo during development. The published tarball ships `bin`, `scaffolds`, and `scaffolds.js` (see `files` in `package.json`); `scaffolds/` is regenerated on every publish and should not be committed.
