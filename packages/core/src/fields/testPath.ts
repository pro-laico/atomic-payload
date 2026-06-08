import type { CollectionSlug, RelationshipField } from 'payload'

/** Builds a `testPath` relationship field pointing at the consumer's pages collection.
 *  Defaults to `'pages'`. */
export const createTestPathField = (pagesSlug: string = 'pages'): RelationshipField => ({
  name: 'testPath',
  type: 'relationship',
  relationTo: pagesSlug as CollectionSlug,
})

/** Default `testPath` field bound to `pagesSlug = 'pages'`. Use `createTestPathField(slug)` for a different slug. */
export const TestPathField: RelationshipField = createTestPathField()
