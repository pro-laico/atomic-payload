---
name: ap-docs-guide-getting-started
description: How to write the Getting Started pages for the Atomic Payload docs — docs/content/docs/getting-started/*.mdx (quick-start, existing-project, environment, project-structure). Use when creating, editing, or reviewing a getting-started page. These are procedural, do-this-then-that guides that land the reader on a working project. Builds on the ap-docs-guide skill for shared conventions.
---

# Getting Started pages

Procedural setup guides under `docs/content/docs/getting-started/`. Goal: take the reader from nothing to a working project, step by step. Follow `ap-docs-guide` for shared conventions.

## Structure

1. **Intro** — one sentence on the outcome ("Scaffold a new project and land on a running dev server.").
2. **## Prerequisites** — a short bullet list (Node version, pnpm, a database URL), where relevant.
3. **The walkthrough** — a `<Steps>` block; each `<Step>` has a `###` heading, a short explanation, and a labeled command/code fence. Use `<Tabs groupId="package-manager">` for npm/pnpm/yarn variants.
4. **## Next** — a one-line pointer (or `<Cards>`) to the next guide.

## Notes

- Imperative, second person ("Run…", "Copy…"). One action per step.
- Commands and scripts must match the real template and CLI scaffolds — copy them, don't invent (verify against `templates/atomic-payload` and `packages/create-atomic-payload`).
- Keep conceptual "why" short; link to a concept page for depth.

## Checklist

- [ ] Follows `ap-docs-guide` shared conventions.
- [ ] Prerequisites (if any) → `<Steps>` walkthrough → Next.
- [ ] Every command verified against the real scaffold/template.
- [ ] Package-manager variants use `<Tabs groupId="package-manager">`.
