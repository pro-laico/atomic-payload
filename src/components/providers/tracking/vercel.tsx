import { Analytics } from '@vercel/analytics/next'

export function VercelProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Analytics />
    </>
  )
}
