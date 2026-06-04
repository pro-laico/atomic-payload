import type { Config, Plugin } from 'payload'

import { createSeedEndpoint, type SeedAuthorize, type SeedFn } from './endpoint'
import { seed as defaultSeed } from './seed'

export type { SeedAuthorize, SeedFn } from './endpoint'

/**
 * Admin import-map path for the `BeforeDashboard` SEED DATABASE banner. Defined
 * here (the plugin uses it at registration time) and re-exported from the
 * package barrel.
 */
export const BeforeDashboardPath = '@pro-laico/seed/admin/beforeDashboard'

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
  /** When true (default), registers the `BeforeDashboard` admin banner. */
  includeBeforeDashboard?: boolean
}

/**
 * Wires a seed flow into a Payload + Next.js app: adds a `POST /api/seed`
 * endpoint guarded by Payload auth and (optionally) a `BeforeDashboard` admin
 * banner with a SEED DATABASE button that hits the endpoint.
 */
export const seedPlugin =
  (opts: SeedPluginOptions = {}): Plugin =>
  (config: Config): Config => {
    const { seed = defaultSeed, enabled = true, endpointPath = '/seed', authorize, includeBeforeDashboard = true } = opts
    if (!enabled) return config

    const endpoints = [...(config.endpoints ?? []), createSeedEndpoint(seed, endpointPath, authorize)]

    const existingBefore = config.admin?.components?.beforeDashboard ?? []
    const beforeDashboard = includeBeforeDashboard ? [...existingBefore, BeforeDashboardPath] : existingBefore

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
