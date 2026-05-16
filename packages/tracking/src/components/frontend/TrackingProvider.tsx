'use client'
import type { ReactNode } from 'react'
import type { Tracking } from '@pro-laico/tracking/schema'
import { PostHogProvider } from './PostHogProvider'
import { GoogleTagManagerProvider } from './GoogleTagManagerProvider'
import { VercelProvider } from './VercelProvider'

type ProviderType = 'postHog' | 'vercel' | 'googleTagManager'

const providerRegistry: Record<ProviderType, React.ComponentType<{ children: ReactNode; tracking?: Tracking }>> = {
  vercel: ({ children }) => <VercelProvider>{children}</VercelProvider>,
  postHog: ({ children, tracking }) => <PostHogProvider tracking={tracking}>{children}</PostHogProvider>,
  googleTagManager: ({ children, tracking }) => <GoogleTagManagerProvider tracking={tracking}>{children}</GoogleTagManagerProvider>,
}

export const TrackingProvider = ({ tracking, children }: { tracking?: Tracking; children: ReactNode }) => {
  if (!tracking) return <>{children}</>

  const activeProviders: Record<ProviderType, boolean | null | undefined> = {
    postHog: tracking.postHogEnabled,
    vercel: tracking.vercelAnalyticsEnabled,
    googleTagManager: tracking.googleTagManagerEnabled,
  }

  const validProviders = (Object.entries(activeProviders) as [ProviderType, boolean | null | undefined][])
    .filter(([, isActive]) => Boolean(isActive))
    .map(([type]) => type)

  return validProviders.reduceRight<ReactNode>((acc, type) => {
    const Provider = providerRegistry[type]
    return <Provider tracking={tracking}>{acc}</Provider>
  }, children)
}

export default TrackingProvider
