import type React from 'react'
import { extractFonts } from '@pro-laico/fonts'

import definitionFonts from '@/app/definition'

/** The page reads the active selection from Payload, so render dynamically. */
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Atomic Payload Fonts Demo',
  description: 'A minimal showcase of the @pro-laico/fonts plugin.',
}

/** Maps each role variable to the `next/font/local` variable that
 *  `pnpm generate:fonts` writes into `definition.ts`, plus the demo's page styling. */
const demoChrome = `
  :root {
    --font-display: var(--font-setDisplay);
    --font-sans: var(--font-setSans);
    --font-serif: var(--font-setSerif);
    --font-mono: var(--font-setMono);
  }
  *, *::before, *::after { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    font-family: var(--font-sans, ui-sans-serif), system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: #0a0a0a; color: #ededed; line-height: 1.5; -webkit-font-smoothing: antialiased;
  }
  a { color: #4ade80; text-decoration: none; }
  a:hover { text-decoration: underline; }
  .demo-shell { max-width: 920px; margin: 0 auto; padding: 48px 24px 120px; }
  .demo-h1 { font-size: 2rem; font-weight: 700; letter-spacing: -0.02em; margin: 0 0 8px; }
  .demo-h2 { font-size: 1.3rem; font-weight: 600; letter-spacing: -0.01em; margin: 48px 0 6px; }
  .demo-lead { color: #a1a1a1; margin: 0 0 24px; }
  .demo-muted { color: #a1a1a1; }
  .demo-card { background: #171717; border: 1px solid #2a2a2a; border-radius: 12px; padding: 20px; margin-bottom: 16px; }
  .demo-notice { background: #221b06; border: 1px solid #6b5300; color: #f3d07a; border-radius: 12px; padding: 16px 20px; margin-bottom: 16px; }
  .demo-notice code { background: #2e2408; border-color: #6b5300; color: #f3d07a; }
  .demo-notice a { color: #f3d07a; text-decoration: underline; }
  .demo-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
  .demo-btn { background: #4ade80; color: #0a0a0a; border: 0; border-radius: 8px; padding: 10px 16px; font-weight: 600; cursor: pointer; font-size: 0.95rem; }
  .demo-btn:hover { filter: brightness(1.1); }
  .demo-btn--ghost { background: transparent; color: #ededed; border: 1px solid #2a2a2a; }
  .demo-btn--ghost:hover { background: #171717; }
  code { background: #171717; border: 1px solid #2a2a2a; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
  /* font specimen layout */
  .specimen { background: #171717; border: 1px solid #2a2a2a; border-radius: 12px; padding: 24px; margin-bottom: 16px; }
  .specimen__head { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
  .specimen__name { font-size: 1.4rem; font-weight: 600; }
  .specimen__badge { font-size: 0.7rem; letter-spacing: 0.08em; text-transform: uppercase; color: #a1a1a1; border: 1px solid #2a2a2a; border-radius: 999px; padding: 3px 10px; }
  .specimen__sample { font-size: 2rem; line-height: 1.25; margin: 0 0 12px; word-break: break-word; }
  .specimen__ramp > div { margin: 2px 0; word-break: break-word; }
  .specimen__glyphs { color: #cfcfcf; margin-top: 12px; word-break: break-word; }
`

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  // The `next/font/local` variable classes for the fonts `pnpm setup:fonts` has
  // written into `definition.ts` (undefined until then).
  const fontVariables = extractFonts(definitionFonts)

  return (
    <html lang="en" className={fontVariables}>
      <head>
        <style id="fonts-demo" dangerouslySetInnerHTML={{ __html: demoChrome }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
