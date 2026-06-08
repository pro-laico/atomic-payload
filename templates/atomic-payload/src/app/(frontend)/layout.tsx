import type React from 'react'
import { draftMode } from 'next/headers'
import { ThemeProvider } from 'next-themes'

import { getCachedDesignSet, getCachedSiteCSS } from '@pro-laico/styles/cache'
import { getCachedFooter, getCachedHeader } from '@pro-laico/site/cache'
import { getCachedTracking } from '@pro-laico/tracking/cache'
import { getCachedAtomicActions } from '@pro-laico/atomic/cache'
import { TrackingProvider } from '@pro-laico/tracking/provider'
import { AtomicStoreProvider } from '@pro-laico/atomic/hook/client'
import { Footer, Header } from '@pro-laico/site/components/frontend'
import { Toaster } from '@pro-laico/core/components/frontend/Toaster'

import fonts from '@/app/definition'

/** Payload-backed layouts need a live DB; avoid static prerender at `next build` when Mongo is unavailable. */
export const dynamic = 'force-dynamic'

const fontVariables = Object.values(fonts)
  .map((font) => (font instanceof Object && 'variable' in font ? font.variable : ''))
  .join(' ')

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled: draft } = await draftMode()

  const css = await getCachedSiteCSS(draft)
  const ds = await getCachedDesignSet(draft)
  const header = await getCachedHeader(draft)
  const footer = await getCachedFooter(draft)
  const tracking = await getCachedTracking(draft)
  const storedAtomicActions = await getCachedAtomicActions(draft)

  return (
    <html lang="en" suppressHydrationWarning className={`${ds?.htmlClassName} ${fontVariables}`}>
      <head>
        <style type="text/css" dangerouslySetInnerHTML={{ __html: css }} />
      </head>
      <body className={ds?.bodyClassName || undefined}>
        <AtomicStoreProvider initialState={storedAtomicActions}>
          <ThemeProvider enableSystem attribute="class" disableTransitionOnChange defaultTheme={ds?.defaultTheme}>
            <TrackingProvider tracking={tracking}>
              <Toaster>
                <div className={`${ds?.wrapperClassName} isolate` || 'isolate'}>
                  <Header header={header} />
                  {children}
                  <Footer footer={footer} />
                </div>
              </Toaster>
            </TrackingProvider>
          </ThemeProvider>
        </AtomicStoreProvider>
      </body>
    </html>
  )
}
