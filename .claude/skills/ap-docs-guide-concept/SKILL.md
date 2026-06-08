---
name: ap-docs-guide-concept
description: How to write the Core Concepts pages for the Atomic Payload docs — docs/content/docs/concepts/*.mdx (architecture, kernel, type-augmentation, caching, slugs). Use when creating, editing, or reviewing a concept page. These explain how Atomic Payload is built and why, for readers who want the mental model rather than a procedure. Builds on the ap-docs-guide skill for shared conventions.
---

# Core Concept pages

Explanatory pages under `docs/content/docs/concepts/` — the "how it's built and why" of Atomic Payload (the plugin model, the kernel, type augmentation, caching, slugs). They teach a mental model, not a procedure. Follow `ap-docs-guide` for shared conventions.

## Structure

1. **Intro** — one or two sentences stating plainly what the concept is.
2. **## What & why** — the idea, and the reasoning/tradeoff behind it (why it's split this way, why it exists).
3. **## How it works** — the mechanism, with a small `ts` snippet where it clarifies.
4. **## Notes** — `<Callout>`s for gotchas, overrides, and edge cases.
5. **## Related** — `<Cards>` to related concepts/plugins.

## Notes

- Concepts are the one place a bit more depth is welcome — but still explain plainly and prefer analogies over jargon. Define a term before leaning on it.
- They often describe cross-package behavior; verify against the real source (`@pro-laico/core/kernel`, etc.) and keep in sync with `MONOREPO.md`.

## Checklist

- [ ] Follows `ap-docs-guide` shared conventions.
- [ ] What & why → How it works → Notes → Related.
- [ ] Explains the model plainly; terms defined before use; grounded in real source.
