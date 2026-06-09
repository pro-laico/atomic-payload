'use client'
import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect } from 'react'

/**
 * Initialises posthog-js once on the client and provides it to the tree.
 * `defaults: '2025-05-24'` turns on automatic pageview/pageleave capture via the
 * History API, so navigations are tracked without manual calls. The `__loaded`
 * guard keeps init to a single call (PostHog is a singleton).
 */
export function PostHogProvider({ children, apiKey, apiHost }: { children: React.ReactNode; apiKey?: string; apiHost?: string }) {
  useEffect(() => {
    if (!apiKey || !apiHost) return
    if (posthog.__loaded) return
    posthog.init(apiKey, { api_host: apiHost, defaults: '2025-05-24' })
  }, [apiKey, apiHost])

  return <PHProvider client={posthog}>{children}</PHProvider>
}

export default PostHogProvider
