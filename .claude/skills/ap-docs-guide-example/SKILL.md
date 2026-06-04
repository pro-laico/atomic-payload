---
name: ap-docs-guide-example
description: How to write the Example app pages for the Atomic Payload docs — docs/content/docs/examples/*.mdx (fonts-only, icons-only, styles-only). Use when creating, editing, or reviewing an example page. These document the minimal demo apps that exercise ONE standalone plugin in isolation. Builds on the ap-docs-guide skill for shared conventions.
---

# Example app pages

Pages under `docs/content/docs/examples/` documenting the minimal demo apps (`examples/<name>-only`). Each exercises ONE standalone plugin in isolation so a reader can see that plugin on its own. Follow `ap-docs-guide` for shared conventions.

## Structure

1. **Intro** — one sentence: which plugin it demos in isolation.
2. **## What it shows** — the specific plugin pieces demonstrated, and that the only `@pro-laico` deps are that plugin + `core`. Call out the real standalone wiring (e.g. `includeFontSet`, the seed endpoint, the frontend hookup) so readers see the minimal setup.
3. **## Scaffold it** — a `<Tabs>` block with `create-atomic-payload --template <name>` per package manager.
4. **(optional) ## How it works** — pointers to the key files (`payload.config.ts`, the layout) and what to read.
5. **## Related** / **## Provided by** — `<Cards>` to the matching `plugins/<x>` and `features/<x>`.

## Notes

- Minimal by design: the point is one plugin, not the whole platform — don't pull in unrelated features.
- The example app is the canonical **standalone** setup reference; keep "What it shows" in sync with the plugin page's standalone steps and the real `examples/<name>-only` source.

## Checklist

- [ ] Follows `ap-docs-guide` shared conventions.
- [ ] What it shows → Scaffold it → Related; matches the real `examples/<name>-only` app.
- [ ] Emphasizes the single-plugin, standalone nature.
