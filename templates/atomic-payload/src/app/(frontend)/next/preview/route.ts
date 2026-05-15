import configPromise from '@payload-config'
import { createPreviewRouteHandler } from '@pro-laico/ap-core/next/preview'

export const GET = createPreviewRouteHandler({ configPromise })
