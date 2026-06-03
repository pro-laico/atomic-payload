# @tools/releaser

Internal, **private** monorepo release tooling — never published to npm. Modeled on Payload's `tools/releaser`.

Its job is **lockstep versioning**: keep every package and template on one shared version (tied to the monorepo), so you never hand-edit version numbers across the workspace.

## What it does

When you run it, the script:

1. Reads the **root `package.json` version** as the source of truth.
2. Computes the next version from your chosen bump (`patch` / `minor` / `major` / `prerelease`).
3. Writes that **same version** into the root plus every releasable workspace package — all `packages/*` and all `templates/*` (the `tools/*` packages are intentionally excluded). Only the `version` line is rewritten, so Biome formatting is preserved.
4. `git commit -m "chore(release): vX.Y.Z"` and creates an annotated tag `vX.Y.Z`.

Internal `workspace:*` dependencies are left untouched — pnpm rewrites them to the concrete version automatically at publish time.

It does **not** publish to npm (see [What it doesn't do](#what-it-doesnt-do)).

## Usage

Always dry-run first — it prints the version table and writes nothing:

```bash
pnpm release --dry-run
```

Then the real run (it prompts for confirmation before writing, unless `--yes`):

```bash
pnpm release                       # patch bump (e.g. 0.2.0 -> 0.2.1)
```

To pass a bump type or other flags, invoke through the package filter so arguments forward cleanly:

```bash
pnpm --filter @tools/releaser release --bump minor                    # 0.2.0 -> 0.3.0
pnpm --filter @tools/releaser release --bump major                    # 0.2.0 -> 1.0.0
pnpm --filter @tools/releaser release --bump prerelease --preid beta  # 0.2.0 -> 0.2.1-beta.0
```

After a successful run, push the commit and tag:

```bash
git push --follow-tags
```

## Flags

| Flag | Default | Effect |
| --- | --- | --- |
| `--bump <patch\|minor\|major\|prerelease>` | `patch` | Which part of the version to bump. |
| `--preid <id>` | `beta` | Prerelease identifier (only used with `--bump prerelease`). |
| `--dry-run` | `false` | Print the plan, write nothing, run no git commands. |
| `--yes` | `false` | Skip the interactive confirmation prompt. |
| `--skip-git` | `false` | Stamp the version files but do not commit or tag. |

## Typical workflow

```bash
pnpm release --dry-run                                # eyeball the version table
pnpm --filter @tools/releaser release --bump minor    # confirm -> stamps + commits + tags
git push --follow-tags
```

## What it doesn't do

It **does not publish to npm**. The releaser owns the version number and the git tag only. Publishing is a separate step (each package builds its `dist` via `prepack`, then `pnpm publish -r`) that has not been wired up yet.

## How it works

- Entry point: `src/release.ts`, run via `tsx` (no `node` build step needed).
- Workspace enumeration: `src/getPackageDetails.ts` walks up from the cwd to find the repo root (`pnpm-workspace.yaml`), then reads `packages/*` and `templates/*`.
- Version math: a small inline SemVer increment — no external dependencies beyond `tsx`. The script uses Node built-ins (`util.parseArgs`, `child_process`, `readline`).
- Version writes: a targeted replacement of the top-level `"version"` string in each `package.json`, so nothing else in the file changes.

## Adding it to the workspace

This package is registered via the `tools/*` glob in the root `pnpm-workspace.yaml`. The root `package.json` exposes the shortcut:

```jsonc
"scripts": {
  "release": "pnpm --filter @tools/releaser release"
}
```
