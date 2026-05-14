import type { Config, Plugin } from 'payload'
import { createSeedEndpoint, type SeedFn } from './endpoint'
import { BeforeDashboardPath } from './index'

export type { SeedFn } from './endpoint'

export interface SeedPluginOptions {
  /** Function that performs the actual seeding. Receives `payload` and `req`. */
  seed: SeedFn
  /** When false, the plugin is a no-op. Defaults to true. */
  enabled?: boolean
  /** Endpoint path mounted under `/api`. Defaults to `/seed` (resolves to `/api/seed`). */
  endpointPath?: string
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
    const { seed, enabled = true, endpointPath = '/seed', registerBeforeDashboard = true } = opts
    if (!enabled) return config

    const endpoints = [...(config.endpoints ?? []), createSeedEndpoint(seed, endpointPath)]

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
