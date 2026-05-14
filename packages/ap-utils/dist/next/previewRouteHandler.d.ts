import 'server-only';
import type { NextRequest } from 'next/server';
import type { SanitizedConfig } from 'payload';
type ConfigPromise = Promise<SanitizedConfig> | SanitizedConfig;
/** Factory that returns a Next.js `GET` route handler enabling Payload's draft
 *  mode after validating the `previewSecret` query parameter. Pair with
 *  `exitPreviewRouteHandler` at `/next/exit-preview`. Pass the host project's
 *  Payload config (typically `import configPromise from '@payload-config'`). */
export declare const createPreviewRouteHandler: ({ configPromise }: {
    configPromise: ConfigPromise;
}) => (req: NextRequest) => Promise<Response>;
export {};
//# sourceMappingURL=previewRouteHandler.d.ts.map