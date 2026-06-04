# @pro-laico/fonts — Planned Features & Deferred Work

Forward-looking backlog distilled from `AUDIT.md`. These items are intentionally **not** done today — each is publish-only or depends on the consumer's generated types. The corresponding `AUDIT.md` checkbox stays `[ ]` with an inline annotation.

## External-publish readiness

### Point `main`/`types`/`exports` at `dist`
- **What:** For an external npm consumer, change the `.`/`./schema` `default` conditions (and `main`/`types`) from `src/*.ts` to their `dist/` equivalents. The `bin` and `./scripts/downloadFonts` already point at `dist`.
- **Why deferred:** Intentional source-only consumption today (the standard `@pro-laico/*` `transpilePackages` pattern). Only the genuinely-compiled surfaces (the `bin` and the CLI script) point at `dist`.
- **Source:** `package.json:10-21` · AUDIT.md → Critical #2 / High (annotated intentional).

### `moduleResolution` for the published CLI
- **What:** Set `moduleResolution: "node16"`/`"nodenext"` in `tsconfig.build.json` so the `tsc`-compiled `dist/` doesn't emit bare specifiers Node's ESM resolver rejects.
- **Why deferred:** Changing it for just this package risks diverging from the monorepo's bundler-resolution baseline and surfacing extensionless-import errors across shared types. Only matters for external ESM consumers of the built CLI.
- **Source:** `tsconfig.build.json` · AUDIT.md → Medium.

## Notes / intentional-for-now

- **`Font` collection `authd` access** — fonts are licensed binaries, so authenticated-only read/write is appropriate; the shared `authd` now carries a JSDoc on tightening via `fontOptions.access` / `fontSetOptions.access`. The package ships no role model. (AUDIT.md → Medium.)
- **Schema stubs fall back to `Record<string, any>`** — intentional so the package compiles without the consumer's generated types; augmenting core's `PayloadAugment` removes the casts (the export endpoint casts slugs / docs for the same reason). (AUDIT.md → Low.)
