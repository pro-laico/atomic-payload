'use client'
import type { ReactNode } from 'react'
import type { Tracking } from '@pro-laico/ap-types/schema'
import { GoogleTagManager } from '@next/third-parties/google'

export function GoogleTagManagerProvider({ children, tracking }: { children: ReactNode; tracking?: Tracking }) {
  return (
    <>
      {tracking?.googleTagManagerId && <GoogleTagManager gtmId={tracking.googleTagManagerId} />}
      {children}
    </>
  )
}

export default GoogleTagManagerProvider
