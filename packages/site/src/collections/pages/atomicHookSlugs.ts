/**
 * Collection slugs that attach `atomicHook` in `beforeChange`.
 * Includes ap-site's own collections (pages/header/footer) plus the fixed
 * package-owned slugs from ap-design-sets (designSet/shortcutSet) and ap-icons
 * (iconSet). Treated as a stable contract.
 */
export const COLLECTION_SLUGS_WITH_ATOMIC_HOOK = ['pages', 'header', 'footer', 'designSet', 'shortcutSet', 'iconSet'] as const
