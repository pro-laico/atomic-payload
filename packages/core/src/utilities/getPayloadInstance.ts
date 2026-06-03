import 'server-only'

import { getPayload } from 'payload'

import { getPayloadConfig } from '../config'

/**
 * The host project's Payload instance, resolved from the config the app
 * registered via `registerPayloadConfig` (see `@pro-laico/core/config`).
 *
 * Centralised here so other workspace packages can write through the Local API
 * without importing the `@payload-config` alias from their own source — doing so
 * would leak an unresolved ambient module into every consumer's type-check. The
 * emitted `.d.ts` exposes only `() => Promise<Payload>`, with no `@payload-config`
 * reference.
 */
export const getPayloadInstance = () => getPayload({ config: getPayloadConfig() })

export default getPayloadInstance
