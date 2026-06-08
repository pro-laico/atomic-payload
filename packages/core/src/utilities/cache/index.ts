import 'server-only'

/**
 * `@pro-laico/core/cache` is now caching **primitives** only. The data getters
 * that used to live here moved to the packages that own their collections
 * (`@pro-laico/site/cache`, `styles/cache`, `icons/cache`, `images/cache`,
 * `tracking/cache`, `atomic/cache`); each calls {@link withCache} from here.
 */
export { mt, withCache } from './withCache'
export type { WithCacheOptions } from './withCache'
