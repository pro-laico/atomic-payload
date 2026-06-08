---
name: ap-docs-guide-template
description: How to write the Template pages for the Atomic Payload docs — docs/content/docs/templates/*.mdx (atomic-payload). Use when creating, editing, or reviewing the starter-template guide. This documents the full Payload + Next.js + Tailwind starter that wires up every plugin — setup, environment, deployment, and optional integrations. Builds on the ap-docs-guide skill for shared conventions.
---

# Template pages

Pages under `docs/content/docs/templates/` documenting the full starter (currently `atomic-payload`) — Payload + Next.js + Tailwind with every plugin pre-wired. This is the complete-app setup guide (richer than Getting Started, which just scaffolds). Follow `ap-docs-guide` for shared conventions.

## Structure

1. **## Overview** — what the starter is (the stack + "every plugin already installed and configured"), and that it serves both scaffolded projects and the monorepo template folder. Add a `<Callout>` pointing monorepo developers to `MONOREPO.md`.
2. **## Setup** — a `<Steps>` walkthrough: required external services (database, blob storage), env configuration (`.env`), secrets, install, run.
3. **Deployment** — how to deploy (e.g. Vercel) and any build settings.
4. **Optional integrations** — Mux, Resend, etc., each clearly optional.

## Notes

- This is the one place that documents whole-app concerns (env keys, deployment, storage). Keep env keys, scripts, and commands in sync with the real `templates/atomic-payload` (`.env.example`, `package.json`).
- Don't duplicate per-plugin reference here — link to the plugin pages instead.

## Checklist

- [ ] Follows `ap-docs-guide` shared conventions.
- [ ] Overview → Setup (`<Steps>`) → Deployment → Optional integrations.
- [ ] Env keys, scripts, and commands match the real template; links to plugin pages instead of duplicating them.
