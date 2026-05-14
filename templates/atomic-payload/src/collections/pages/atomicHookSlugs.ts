/**
 * Collection slugs that attach `atomicHook` in `beforeChange`.
 * Keep in sync with `header` / `footer` / `pages` collections and
 * `designSetsPlugin` / `iconsPlugin` (`designSet`, `shortcutSet`, `iconSet`).
 */
export const COLLECTION_SLUGS_WITH_ATOMIC_HOOK = [
  'pages',
  'header',
  'footer',
  'designSet',
  'shortcutSet',
  'iconSet',
] as const
