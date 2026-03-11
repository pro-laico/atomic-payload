import { Tracking } from '@/ts/types'
import { GoogleTagManager } from '@next/third-parties/google'

export function GoogleTagManagerProvider({ children, tracking }: { children: React.ReactNode; tracking?: Tracking }) {
  return (
    <>
      {tracking?.googleTagManagerId && <GoogleTagManager gtmId={tracking.googleTagManagerId} />}
      {children}
    </>
  )
}
