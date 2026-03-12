'use server'
import React from 'react'
import fonts from '@/app/definition'
import { draftMode } from 'next/headers'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/toast'
import getCached from '@/utilities/get/cache/react'
import { Header } from '@/collections/headers/component'
import { Footer } from '@/collections/footers/component'
import { AtomicStoreProvider } from '@/hooks/frontEnd/atomicStore'
import { TrackingProvider } from '@/components/providers/tracking'

const fontVariables = Object.values(fonts)
  .map((font) => (font instanceof Object && 'variable' in font ? font.variable : ''))
  .join(' ')

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled: draft } = await draftMode()

  const css = await getCached('site-css', draft)
  const ds = await getCached('designSet', draft)
  const header = await getCached('header', draft)
  const footer = await getCached('footer', draft)
  const tracking = await getCached('tracking', draft)
  const storedAtomicActions = await getCached('atomic-actions', draft)

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
                <div className={ds?.wrapperClassName + ' isolate' || 'isolate'}>
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
