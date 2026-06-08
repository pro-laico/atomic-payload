import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { buildConfig, getPayload, type CollectionConfig, type Payload, type Plugin } from 'payload'

// Minimal auth collection so Payload boots a valid config; also a stable target
// for a generic CRUD round-trip that proves the in-memory DB works.
const Users: CollectionConfig = { slug: 'users', auth: true, fields: [] }

export interface BootOptions {
  /**
   * Extra collections registered alongside `users`. Use to stub collections a
   * plugin relates to but doesn't own — e.g. `@pro-laico/styles` has a relationship
   * to `pages` (owned by `@pro-laico/site`), so an isolated styles test passes
   * `[{ slug: 'pages', fields: [] }]`.
   */
  collections?: CollectionConfig[]
}

/**
 * Boot a real Payload instance backed by an in-memory SQLite database (no Docker,
 * no downloaded binary), applying the given plugins. The sqlite adapter pushes the
 * schema on boot (`push: true`), so no migration step is needed. Each test FILE
 * gets its own module-isolated instance under Vitest.
 */
export async function bootPayload(plugins: Plugin[] = [], options: BootOptions = {}): Promise<Payload> {
  const config = await buildConfig({
    secret: 'test-secret',
    telemetry: false,
    db: sqliteAdapter({ push: true, client: { url: ':memory:' } }),
    collections: [Users, ...(options.collections ?? [])],
    plugins,
    // No image processing in tests.
    sharp: undefined,
  })
  return getPayload({ config })
}

/** Close the database connection so the test process can exit cleanly. */
export async function teardown(payload: Payload | undefined): Promise<void> {
  const db = payload?.db as { destroy?: () => Promise<void> } | undefined
  await db?.destroy?.()
}
