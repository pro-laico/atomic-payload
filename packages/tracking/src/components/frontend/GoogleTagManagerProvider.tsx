'use client'
import { GoogleTagManager } from '@next/third-parties/google'
import type { Tracking } from '@pro-laico/tracking/schema'
import type { ReactNode } from 'react'

export function GoogleTagManagerProvider({ children, tracking }: { children: ReactNode; tracking?: Tracking }) {
  return (
    <>
      {tracking?.googleTagManagerId && <GoogleTagManager gtmId={tracking.googleTagManagerId} />}
      {children}
    </>
  )
}

export default GoogleTagManagerProvider
