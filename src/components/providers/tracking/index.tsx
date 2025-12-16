'use client'
import { ReactNode } from 'react'
import { Tracking } from '@/ts/types'
import { VercelProvider } from './vercel'
import { PostHogProvider } from './postHog'
import { GoogleTagManagerProvider } from './gtm'

type ProviderType = 'postHog' | 'vercel' | 'googleTagManager'

type ProviderConfig = {
  type: ProviderType
  component: React.ComponentType<{ children: ReactNode; tracking?: Tracking }>
}

const providerRegistry: Record<ProviderType, ProviderConfig> = {
  vercel: { type: 'vercel', component: ({ children }) => <VercelProvider>{children}</VercelProvider> },
  postHog: { type: 'postHog', component: ({ children, tracking }) => <PostHogProvider tracking={tracking}>{children}</PostHogProvider> },
  googleTagManager: {
    type: 'googleTagManager',
    component: ({ children, tracking }) => <GoogleTagManagerProvider tracking={tracking}>{children}</GoogleTagManagerProvider>,
  },
}

interface DynamicProviderProps {
  tracking?: Tracking
  children: ReactNode
}

export const TrackingProvider = ({ tracking, children }: DynamicProviderProps) => {
  if (!tracking) return <>{children}</>

  const activeProviders = {
    postHog: tracking.postHogEnabled,
    vercel: tracking.vercelAnalyticsEnabled,
    googleTagManager: tracking.googleTagManagerEnabled,
  }

  const validProviders = Object.entries(activeProviders)
    .filter(([_, isActive]) => isActive)
    .map(([type]) => ({ type: type as ProviderType, tracking }))

  return validProviders.reduceRight((acc, { type, tracking }) => {
    const Provider = providerRegistry[type].component
    return <Provider tracking={tracking}>{acc}</Provider>
  }, children)
}
