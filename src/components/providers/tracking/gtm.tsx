import { Tracking } from '@/ts/types'
import { useAtomicStore } from '@/hooks/frontEnd/atomicStore'
import { GoogleTagManager } from '@next/third-parties/google'

export function GoogleTagManagerProvider({ children, tracking }: { children: React.ReactNode; tracking?: Tracking }) {
  const preferences = useAtomicStore((state) => state.preferences)

  return (
    <>
      {preferences?.analytics === true && tracking?.googleTagManagerId && <GoogleTagManager gtmId={tracking.googleTagManagerId} />}
      {children}
    </>
  )
}
