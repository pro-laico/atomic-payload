import 'server-only'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

/**
 * The host project's Payload instance, bound to the `@payload-config` alias.
 *
 * Centralised here (and consumed via the built `./payload` subpath) so other
 * workspace packages can write through the Local API without importing the
 * `@payload-config` alias from their own source — doing so would leak an
 * unresolved ambient module into every consumer's type-check. The emitted
 * `.d.ts` exposes only `() => Promise<Payload>`, with no `@payload-config`
 * reference, mirroring how `./cache/auto` hides the same dependency.
 */
export const getPayloadInstance = () => getPayload({ config: configPromise })

export default getPayloadInstance
