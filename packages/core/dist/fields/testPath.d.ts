import type { RelationshipField } from 'payload';
/** Builds a `testPath` relationship field pointing at the consumer's pages collection.
 *  Defaults to `'pages'`. */
export declare const createTestPathField: (pagesSlug?: string) => RelationshipField;
/** Default `testPath` field bound to `pagesSlug = 'pages'`. Use `createTestPathField(slug)` for a different slug. */
export declare const TestPathField: RelationshipField;
//# sourceMappingURL=testPath.d.ts.map