'use client'
import type { Tracking } from '@pro-laico/tracking/schema'
import { usePathname } from 'next/navigation'
import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect } from 'react'

export function PostHogProvider({ children, tracking }: { children: React.ReactNode; tracking?: Tracking }) {
  const pathname = usePathname()
  useEffect(() => {
    if (!tracking) return
    const {
      postHogPublicKey,
      postHogHost,
      disableSessionRecording,
      disableSurveys,
      capturePerformance,
      enableAutoCapture,
      postHogAutoCaptureSettings,
    } = tracking
    if (!postHogPublicKey || !postHogHost) return

    if (!pathname?.includes('/admin')) {
      posthog.init(postHogPublicKey, {
        api_host: postHogHost,
        defaults: '2025-05-24',
        ...(enableAutoCapture && {
          autocapture: {
            url_allowlist: postHogAutoCaptureSettings?.urlAllowList?.map((item: { url?: string }) => item.url ?? ''),
            url_ignorelist: postHogAutoCaptureSettings?.urlIgnoreList?.map((item: { url?: string }) => item.url ?? ''),
          },
        }),
        ...(disableSessionRecording && { disable_session_recording: disableSessionRecording }),
        ...(disableSurveys && { disable_surveys: disableSurveys }),
        ...(capturePerformance && { capture_performance: capturePerformance }),
      })
    }
  }, [pathname, tracking])

  return <PHProvider client={posthog}>{children}</PHProvider>
}

export default PostHogProvider
