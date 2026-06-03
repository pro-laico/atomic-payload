import 'server-only'
import configPromise from '@payload-config'
import { cache } from 'react'

import { createDefaultGetCached } from './index'

/** Per-request memoized `getCached` bound to the host project's `@payload-config`
 *  alias. Import this from any server component / server action to share one
 *  `react.cache` instance across every consumer in a render. */
const getCached = cache(createDefaultGetCached(configPromise))
export default getCached
