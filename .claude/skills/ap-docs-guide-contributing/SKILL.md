---
name: ap-docs-guide-contributing
description: How to write the Contributing pages for the Atomic Payload docs — docs/content/docs/contributing/*.mdx (index, releasing). Use when creating, editing, or reviewing contributor/maintainer docs. Unlike the rest of the site, these address people working ON the monorepo (its layout, local dev, the plugin shape, releasing/publishing), not people using the plugins. Builds on the ap-docs-guide skill for shared conventions.
---

# Contributing pages

Pages under `docs/content/docs/contributing/` for people working ON the Atomic Payload monorepo — not end users. They mirror `MONOREPO.md`: workspace layout, local dev commands, the standard plugin shape, and the release/publish flow. Follow `ap-docs-guide` for shared conventions.

## Structure

- **Intro** — one sentence framing the audience ("the map for contributors and maintainers").
- **Monorepo structure** — a `plaintext` tree of `packages/`, `templates/`, `examples/`, etc.
- **Local development** — the workspace commands (install, dev, typecheck, build) as `bash`.
- **The plugin shape** — the `(opts) => (config) => config` factory convention, for adding a new package.
- **Releasing** (the `releasing` page) — the lockstep version bump + publish flow.

## Notes

- Audience is contributors, so a bit more technical depth is fine — but still clear.
- This is the one doc area that mirrors `MONOREPO.md` — keep the two in sync (structure, commands, release steps); don't let them drift.
- Reflect the package taxonomy and plugin conventions accurately — verify against the actual repo.

## Checklist

- [ ] Follows `ap-docs-guide` shared conventions.
- [ ] Structure tree + dev commands + plugin shape + releasing.
- [ ] Kept in sync with `MONOREPO.md`; verified against the real repo layout/commands.
