'use server'
import 'server-only' //DO NOT REMOVE
import configPromise from '@payload-config'
import { createDefaultGetCached } from '@pro-laico/ap-utils/cache'

const getCached = createDefaultGetCached(configPromise)

export default getCached
