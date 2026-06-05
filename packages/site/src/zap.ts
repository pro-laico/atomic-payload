import { z } from '@pro-laico/zap'

/**
 * Atomic-hook + storage zod enums for the ap-site collections plus the fixed
 * cross-package slugs from @pro-laico/styles (`designSet`, `shortcutSet`) and
 * ap-icons (`iconSet`). Hardcoded — projects that introduce additional
 * atomic-hook-using collections will need to extend these themselves.
 */

const PAGES_HEADER_FOOTER = ['pages', 'header', 'footer'] as const
const DESIGN_SET_AND_SHORTCUT_SET = ['designSet', 'shortcutSet'] as const

const CollectionThatUsesAtomicHookSlug = z.ap.add(z.enum([...PAGES_HEADER_FOOTER, ...DESIGN_SET_AND_SHORTCUT_SET, 'iconSet']), {
  id: 'CollectionThatUsesAtomicHookSlug',
})

const CollectionWithStoredAtomicClassesSlug = z.ap.add(z.enum(PAGES_HEADER_FOOTER), {
  id: 'CollectionWithStoredAtomicClassesSlug',
})

const CollectionThatUseCSSProcessorSlug = z.ap.add(z.enum([...DESIGN_SET_AND_SHORTCUT_SET, ...PAGES_HEADER_FOOTER]), {
  id: 'CollectionThatUsesCSSProcessorSlug',
})

const CollectionWithStoredAtomicFormsSlug = z.ap.add(z.enum(PAGES_HEADER_FOOTER), {
  id: 'CollectionWithStoredAtomicFormsSlug',
})

const CollectionWithStoredAtomicActionsSlug = z.ap.add(z.enum(PAGES_HEADER_FOOTER), {
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
