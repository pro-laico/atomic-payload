import type { Metadata } from 'next'
import { RootProvider } from 'fumadocs-ui/provider/next'
import './global.css'
import { Inter, JetBrains_Mono, Source_Serif_4, Space_Grotesk } from 'next/font/google'

import { TrackingProvider } from '@/components/tracking'

const sans = Inter({ subsets: ['latin'], variable: '--font-inter' })
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' })
const serif = Source_Serif_4({ subsets: ['latin'], variable: '--font-source-serif' })
const display = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' })

const fontVars = `${sans.variable} ${mono.variable} ${serif.variable} ${display.variable}`

// The Atomic Payload mark (public/favicon.svg) as the site's SVG favicon.
export const metadata: Metadata = {
  icons: { icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }] },
}

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={fontVars} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen font-sans">
        <TrackingProvider>
          <RootProvider>{children}</RootProvider>
        </TrackingProvider>
      </body>
    </html>
  )
}
