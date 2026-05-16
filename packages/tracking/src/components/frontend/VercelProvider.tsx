'use client'
import type { ReactNode } from 'react'
import { Analytics } from '@vercel/analytics/next'

export function VercelProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Analytics />
    </>
  )
}

export default VercelProvider
