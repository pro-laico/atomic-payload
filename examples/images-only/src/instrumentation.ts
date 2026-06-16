/**
 * Next.js instrumentation hook — runs once when the server starts, before any
 * request is handled.
 *
 * The app owns the `@payload-config` alias, so it registers the config with
 * `@pro-laico/core` here. `@pro-laico/images`' cache getter (`getCachedImage`)
 * then reaches the Local API via that registry without importing `@payload-config`
 * from package source.
 */
export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return

  const { registerPayloadConfig } = await import('@pro-laico/core/config')
  const { default: configPromise } = await import('@payload-config')

  registerPayloadConfig(configPromise)
}
