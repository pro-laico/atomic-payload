/**
 * Next.js instrumentation hook — runs once when the server starts (and in the
 * build worker for static generation), before any request is handled.
 *
 * The template owns the `@payload-config` alias, so it registers the config with
 * `@pro-laico/core` here. Workspace packages then reach the Local API via the
 * cache helpers without importing `@payload-config` from their own source.
 */
export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return

  const { registerPayloadConfig } = await import('@pro-laico/core/config')
  const { default: configPromise } = await import('@payload-config')

  registerPayloadConfig(configPromise)
}
