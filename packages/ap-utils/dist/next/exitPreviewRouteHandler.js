import { draftMode } from 'next/headers';
/** Next.js `GET` route handler that disables Payload's draft mode. Mount at
 *  `/next/exit-preview` alongside `createPreviewRouteHandler`. */
export const exitPreviewRouteHandler = async () => {
    const draft = await draftMode();
    draft.disable();
    return new Response('Draft mode is disabled');
};
//# sourceMappingURL=exitPreviewRouteHandler.js.map