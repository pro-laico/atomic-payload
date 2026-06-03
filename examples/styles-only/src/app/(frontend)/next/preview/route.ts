import configPromise from '@payload-config'
import { createPreviewRouteHandler } from '@pro-laico/core/next/preview'

export const GET = createPreviewRouteHandler({ configPromise })
