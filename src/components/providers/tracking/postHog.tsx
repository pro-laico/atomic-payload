'use client'
import posthog from 'posthog-js'
import { useEffect } from 'react'
import { Tracking } from '@/ts/types'
import { usePathname } from 'next/navigation'
import { PostHogProvider as PHProvider } from 'posthog-js/react'

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
            url_allowlist: postHogAutoCaptureSettings?.urlAllowList?.map((item) => item.url ?? ''),
            url_ignorelist: postHogAutoCaptureSettings?.urlIgnoreList?.map((item) => item.url ?? ''),
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
