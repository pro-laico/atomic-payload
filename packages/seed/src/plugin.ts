import type { Config, Plugin } from 'payload'

import { BeforeDashboardPath } from './index'
import { seed as defaultSeed } from './seed'
import { createSeedEndpoint, type SeedAuthorize, type SeedFn } from './endpoint'

export type { SeedAuthorize, SeedFn } from './endpoint'

export interface SeedPluginOptions {
  /** Function that performs the actual seeding. Defaults to the bundled atomic-payload seed. */
  seed?: SeedFn
  /** When false, the plugin is a no-op. Defaults to true. */
  enabled?: boolean
  /** Endpoint path mounted under `/api`. Defaults to `/seed` (resolves to `/api/seed`). */
  endpointPath?: string
  /**
   * Authorization predicate run after the auth check. The seed wipes and
   * recreates the whole DB, so in multi-user / production apps pass a role test
   * (e.g. `(user) => user.roles?.includes('admin')`). Defaults to allowing any
   * authenticated user.
   */
  authorize?: SeedAuthorize
  /** Whether to register the `BeforeDashboard` admin banner. Defaults to true. */
  registerBeforeDashboard?: boolean
}

/**
 * Wires a seed flow into a Payload + Next.js app: adds a `POST /api/seed`
 * endpoint guarded by Payload auth and (optionally) a `BeforeDashboard` admin
 * banner with a SEED DATABASE button that hits the endpoint.
 */
export const seedPlugin =
  (opts: SeedPluginOptions): Plugin =>
  (config: Config): Config => {
    const { seed = defaultSeed, enabled = true, endpointPath = '/seed', authorize, registerBeforeDashboard = true } = opts
    if (!enabled) return config

    const endpoints = [...(config.endpoints ?? []), createSeedEndpoint(seed, endpointPath, authorize)]

    const existingBefore = config.admin?.components?.beforeDashboard ?? []
    const beforeDashboard = registerBeforeDashboard ? [...existingBefore, BeforeDashboardPath] : existingBefore

    return {
      ...config,
      endpoints,
      admin: {
        ...config.admin,
        components: {
          ...config.admin?.components,
          beforeDashboard,
        },
      },
    }
  }

export default seedPlugin
