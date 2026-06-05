/**
 * Next.js instrumentation hook — runs once when the server starts (and in the
 * build worker for static generation), before any request is handled.
 *
 * The app owns the `@payload-config` alias, so it registers the config with
 * `@pro-laico/core` here. The `@pro-laico/styles` cache getters (and the
 * `cssHook`'s `createCssGetCached`) then reach the Local API via that registry
 * without importing `@payload-config` from package source.
 */
export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return

  const { registerPayloadConfig } = await import('@pro-laico/core/config')
  const { default: configPromise } = await import('@payload-config')

  registerPayloadConfig(configPromise)
}
