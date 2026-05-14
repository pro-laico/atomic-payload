import type { PayloadRequest } from 'payload';
type Props = {
    data: Partial<any>;
    req: PayloadRequest;
};
/** Generates the URL Payload's admin "live preview" iframe should hit. Handles
 *  pages-with-href (uses the latest breadcrumb), pages-with-testPath (looks up
 *  the target page), and falls back to `/testing`. The host project must
 *  provide a `/next/preview` route handler (see
 *  `@pro-laico/ap-utils/next/preview`). */
export declare const generateLivePreviewPath: ({ data, req: { payload } }: Props) => Promise<string>;
export {};
//# sourceMappingURL=generatePreviewPath.d.ts.map