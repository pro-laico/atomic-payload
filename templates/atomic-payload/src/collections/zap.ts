import { z } from '@/ts/zap'
import traverse from 'traverse'
import collections from './index'
import { atomicHook } from '@/hooks/collection/atomicHook/atomicHook'

function hasField(collection: Record<string, unknown>, fieldName: string): boolean {
  let found = false
  traverse(collection).forEach(function (node) {
    if (typeof node === 'object' && node !== null && 'name' in node && node.name === fieldName) {
      found = true
      this.stop()
    }
  })
  return found
}

function hasAtomicHook(collection: Record<string, unknown>): boolean {
  if (!('hooks' in collection) || !collection.hooks || typeof collection.hooks !== 'object' || !('beforeChange' in collection.hooks)) return false
  const beforeChangeHooks = collection.hooks.beforeChange
  return Array.isArray(beforeChangeHooks) && beforeChangeHooks.includes(atomicHook)
}

export const CollectionThatUsesAtomicHookSlug = z.ap.add(z.enum(collections.filter(hasAtomicHook).map((collection) => collection.slug)), {
  id: 'CollectionThatUsesAtomicHookSlug',
})

export const CollectionWithStoredAtomicClassesSlug = z.ap.add(
  z.enum(collections.filter((collection) => hasField(collection, 'storedAtomicClasses')).map((collection) => collection.slug)),
  { id: 'CollectionWithStoredAtomicClassesSlug' },
)

export const CollectionThatUseCSSProcessorSlug = z.ap.add(
  z.enum([
    'designSet',
    'shortcutSet',
    ...collections.filter((collection) => hasField(collection, 'storedAtomicClasses')).map((collection) => collection.slug),
  ]),
  { id: 'CollectionThatUsesCSSProcessorSlug' },
)

export const CollectionWithStoredAtomicFormsSlug = z.ap.add(
  z.enum(collections.filter((collection) => hasField(collection, 'storedAtomicForms')).map((collection) => collection.slug)),
  { id: 'CollectionWithStoredAtomicFormsSlug' },
)

export const CollectionWithStoredAtomicActionsSlug = z.ap.add(
  z.enum(collections.filter((collection) => hasField(collection, 'storedAtomicActions')).map((collection) => collection.slug)),
  { id: 'CollectionWithStoredAtomicActionsSlug' },
)

const CollectionSchemas = [
  CollectionThatUsesAtomicHookSlug,
  CollectionWithStoredAtomicClassesSlug,
  CollectionThatUseCSSProcessorSlug,
  CollectionWithStoredAtomicFormsSlug,
  CollectionWithStoredAtomicActionsSlug,
]

export default CollectionSchemas
