import type { ReactNode } from 'react'

import { GoogleTagManagerProvider } from './GoogleTagManagerProvider'
import { PostHogProvider } from './PostHogProvider'

// Config comes from NEXT_PUBLIC_* env vars (the docs site has no Payload backend,
// so there's no Tracking global to read). Each provider is enabled only when its
// vars are present — set none and this is a transparent pass-through.
const gtmId = process.env.NEXT_PUBLIC_GTM_ID
const postHogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
const postHogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST

/**
 * Composite analytics provider for the docs site: wraps `children` with whichever
 * of Google Tag Manager and PostHog are configured via env. Server component — it
 * reads env and passes the values down as props to the client providers.
 */
export function TrackingProvider({ children }: { children: ReactNode }) {
  let tree: ReactNode = children

  if (postHogKey && postHogHost) {
    tree = (
      <PostHogProvider apiKey={postHogKey} apiHost={postHogHost}>
        {tree}
      </PostHogProvider>
    )
  }
  if (gtmId) {
    tree = <GoogleTagManagerProvider gtmId={gtmId}>{tree}</GoogleTagManagerProvider>
  }

  return <>{tree}</>
}

export default TrackingProvider
