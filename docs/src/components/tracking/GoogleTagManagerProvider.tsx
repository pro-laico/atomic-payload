'use client'
import { GoogleTagManager } from '@next/third-parties/google'
import type { ReactNode } from 'react'

/** Injects the Google Tag Manager container script when a `gtmId` is provided. */
export function GoogleTagManagerProvider({ children, gtmId }: { children: ReactNode; gtmId?: string }) {
  return (
    <>
      {gtmId && <GoogleTagManager gtmId={gtmId} />}
      {children}
    </>
  )
}

export default GoogleTagManagerProvider
