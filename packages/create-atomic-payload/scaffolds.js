/**
 * Registry of scaffolds the CLI can create — the single source of truth shared
 * by `scripts/bundle-scaffolds.js` (which copies each into the package for
 * publish) and `bin/cli.js` (which lists them and copies the chosen one).
 *
 * `dir` is the path relative to the monorepo root, used only in local/dev mode.
 * When published, each scaffold is bundled at `scaffolds/<name>/`.
 */
export const scaffolds = [
  {
    name: 'atomic-payload',
    dir: 'templates/atomic-payload',
    type: 'template',
    title: 'Atomic Payload',
    description: 'Full starter — Payload + Next.js + Tailwind, every plugin',
  },
  {
    name: 'fonts-only',
    dir: 'examples/fonts-only',
    type: 'example',
    title: 'Fonts only',
    description: 'Minimal example — @pro-laico/fonts in isolation',
  },
  {
    name: 'icons-only',
    dir: 'examples/icons-only',
    type: 'example',
    title: 'Icons only',
    description: 'Minimal example — @pro-laico/icons in isolation',
  },
  {
    name: 'styles-only',
    dir: 'examples/styles-only',
    type: 'example',
    title: 'Styles only',
    description: 'Minimal example — @pro-laico/styles in isolation',
  },
]

/** The scaffold used when none is chosen (non-interactive / no `--template`). */
export const defaultScaffold = 'atomic-payload'
