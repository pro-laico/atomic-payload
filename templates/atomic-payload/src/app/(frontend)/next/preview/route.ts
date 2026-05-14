import configPromise from '@payload-config'
import { createPreviewRouteHandler } from '@pro-laico/ap-utils/next/preview'

export const GET = createPreviewRouteHandler({ configPromise })
