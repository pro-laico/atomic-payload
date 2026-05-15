import { z } from '@pro-laico/zap'

/**
 * Atomic-hook + storage zod enums for the ap-site collections plus the fixed
 * cross-package slugs from ap-design-sets (`designSet`, `shortcutSet`) and
 * ap-icons (`iconSet`). Hardcoded â€” projects that introduce additional
 * atomic-hook-using collections will need to extend these themselves.
 */

const PAGES_HEADER_FOOTER = ['pages', 'header', 'footer'] as const
const DESIGN_SET_AND_SHORTCUT_SET = ['designSet', 'shortcutSet'] as const

export const CollectionThatUsesAtomicHookSlug = z.ap.add(
  z.enum([...PAGES_HEADER_FOOTER, ...DESIGN_SET_AND_SHORTCUT_SET, 'iconSet']),
  { id: 'CollectionThatUsesAtomicHookSlug' },
)

export const CollectionWithStoredAtomicClassesSlug = z.ap.add(z.enum(PAGES_HEADER_FOOTER), {
  id: 'CollectionWithStoredAtomicClassesSlug',
})

export const CollectionThatUseCSSProcessorSlug = z.ap.add(z.enum([...DESIGN_SET_AND_SHORTCUT_SET, ...PAGES_HEADER_FOOTER]), {
  id: 'CollectionThatUsesCSSProcessorSlug',
})

export const CollectionWithStoredAtomicFormsSlug = z.ap.add(z.enum(PAGES_HEADER_FOOTER), {
  id: 'CollectionWithStoredAtomicFormsSlug',
})

export const CollectionWithStoredAtomicActionsSlug = z.ap.add(z.enum(PAGES_HEADER_FOOTER), {
  id: 'CollectionWithStoredAtomicActionsSlug',
})

const CollectionSchemas = [
  CollectionThatUsesAtomicHookSlug,
  CollectionWithStoredAtomicClassesSlug,
  CollectionThatUseCSSProcessorSlug,
  CollectionWithStoredAtomicFormsSlug,
  CollectionWithStoredAtomicActionsSlug,
]

export default CollectionSchemas
