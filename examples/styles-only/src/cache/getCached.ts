import { cache } from 'react'

import configPromise from '@payload-config'

import 'server-only'
import { createGetCached, defaultGetRegistry, type GetRegistry } from '@pro-laico/core/cache'

/**
 * Per-request memoized `getCached` for the styles demo.
 *
 * We start from `@pro-laico/core`'s stock getter registry — which already knows
 * how to read the active `designSet`, the active `shortcutSet`, the generated
 * `site-css` from the storage globals, and the `atomic-classes` collected off
 * the `pages` collection — then override the two getters the CSS processor calls
 * but which this minimal template has no source for:
 *
 *  - `header` / `footer` → there are no header/footer collections here, so we
 *    return `undefined` instead of querying a collection that doesn't exist.
 *
 * `atomic-classes` is intentionally NOT overridden: the stock getter reads each
 * page's `storedAtomicClasses`, which the page `cssHook` populates from the
 * blocks' `*ClassName` fields. That is the back-to-front loop — authored classes
 * become generated CSS with no safelist.
 *
 * Each getter is wrapped in `unstable_cache` with revalidation tags by
 * `createGetCached`, so editing a `designSet` / `shortcutSet` / page in the admin
 * (which fires the matching `revalidateTag`) flows through to this page — that
 * is what makes live preview update.
 */
const registry: GetRegistry = {
  ...defaultGetRegistry,
  header: (async () => undefined) as GetRegistry['header'],
  footer: (async () => undefined) as GetRegistry['footer'],
}

const getCached = cache(createGetCached(configPromise, registry))
export default getCached
