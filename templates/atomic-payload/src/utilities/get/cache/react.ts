import 'server-only' //DO NOT REMOVE
import configPromise from '@payload-config'
import { createReactCachedGetCached } from '@pro-laico/ap-utils/cache/react'

const getCached = createReactCachedGetCached(configPromise)

export default getCached
