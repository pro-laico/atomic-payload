'use client'
import { Analytics } from '@vercel/analytics/next'
import type { ReactNode } from 'react'

export function VercelProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Analytics />
    </>
  )
}

export default VercelProvider
