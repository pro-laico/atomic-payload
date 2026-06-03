/** Builds a `testPath` relationship field pointing at the consumer's pages collection.
 *  Defaults to `'pages'`. */
export const createTestPathField = (pagesSlug = 'pages') => ({
    name: 'testPath',
    type: 'relationship',
    relationTo: pagesSlug,
});
/** Default `testPath` field bound to `pagesSlug = 'pages'`. Use `createTestPathField(slug)` for a different slug. */
export const TestPathField = createTestPathField();
//# sourceMappingURL=testPath.js.map