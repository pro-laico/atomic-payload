import 'server-only'

import type { PayloadConfigPromise } from '../types/cache'

/**
 * Server-only registry holding the host project's Payload config.
 *
 * The host app — which owns the `@payload-config` alias — calls
 * {@link registerPayloadConfig} once at startup (e.g. from Next
 * `instrumentation.ts`). Workspace packages then reach the Local API through the
 * cache helpers (`getCached`, `getPayloadInstance`) **without importing
 * `@payload-config` from their own source**, which would otherwise leak an
 * unresolved ambient module into every consumer's type-check.
 *
 * The value lives on `globalThis` (keyed by a shared `Symbol.for`), NOT a
 * module-scoped variable: in dev, Turbopack may give `instrumentation.ts` and
 * the RSC / server-action graphs *separate instances* of this module, so a
 * plain module variable set by instrumentation would be invisible to consumers.
 * A `globalThis` slot is the same object across every instantiation in the
 * process. (In a production build everything shares one instance, so this also
 * works there — it just isn't relied upon.)
 */
const REGISTRY_KEY = Symbol.for('@pro-laico/core/payload-config-registry')

interface ConfigRegistry {
  config?: PayloadConfigPromise
}

function getRegistry(): ConfigRegistry {
  const scope = globalThis as unknown as Record<symbol, ConfigRegistry | undefined>
  return (scope[REGISTRY_KEY] ??= {})
}

/** Register the host project's Payload config (or its resolution promise).
 *  Call once at app startup before any `getCached` / `getPayloadInstance` use. */
export function registerPayloadConfig(config: PayloadConfigPromise): void {
  getRegistry().config = config
}

/** Return the registered Payload config. Throws if {@link registerPayloadConfig}
 *  has not run yet — register it in your Next `instrumentation.ts`. */
export function getPayloadConfig(): PayloadConfigPromise {
  const { config } = getRegistry()
  if (config === undefined) {
    throw new Error(
      '[@pro-laico/core] Payload config not registered. Call registerPayloadConfig(configPromise) at app startup (e.g. in your Next instrumentation.ts) before using getCached / getPayloadInstance.',
    )
  }
  return config
}
