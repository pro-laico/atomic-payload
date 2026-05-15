import type { CollectionSlug, PayloadRequest } from 'payload';
export type UnsetActiveType = (args: {
    id: string;
    draft: boolean;
    req: PayloadRequest;
    slug: CollectionSlug;
}) => Promise<CollectionSlug | undefined>;
export declare const unsetActive: UnsetActiveType;
//# sourceMappingURL=unsetActive.d.ts.map