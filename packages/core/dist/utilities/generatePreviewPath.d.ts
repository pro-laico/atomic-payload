import type { PayloadRequest } from 'payload';
type Props = {
    data: Partial<any>;
    req: PayloadRequest;
};
/** Slug of the collection that owns href-bearing docs and the `/next/preview` collection param.
 *  Override when your project uses a slug other than `'pages'`. */
export type GeneratePreviewPathOptions = {
    /** Defaults to `'pages'`. */
    pagesSlug?: string;
};
/** Generates the URL Payload's admin "live preview" iframe should hit. Handles
 *  pages-with-href (uses the latest breadcrumb), pages-with-testPath (looks up
 *  the target page), and falls back to `/testing`. The host project must
 *  provide a `/next/preview` route handler (see
 *  `@pro-laico/core/next/preview`). */
export declare const generateLivePreviewPath: ({ data, req: { payload } }: Props, options?: GeneratePreviewPathOptions) => Promise<string>;
export {};
//# sourceMappingURL=generatePreviewPath.d.ts.map