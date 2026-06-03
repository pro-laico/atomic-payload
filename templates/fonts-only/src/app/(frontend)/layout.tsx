import type React from 'react'
import definitionFonts from '@/app/definition'
import { fontFamilyName } from '@/lib/fontDir'
import { type FontRole, getActiveFonts, readFontDataUrl } from '@/lib/fonts'

/** Payload-backed layout needs a live DB; avoid static prerender at build time. */
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Atomic Payload Fonts Demo',
  description: 'A minimal showcase of the @pro-laico/fonts plugin.',
}

/** CSS `format()` hint for an `@font-face` src, derived from the upload mimeType. */
const formatFor = (mime: string): string =>
  mime.includes('woff2') ? 'woff2' : mime.includes('woff') ? 'woff' : mime.includes('ttf') ? 'truetype' : mime.includes('otf') ? 'opentype' : 'woff2'

/** Per-role keys in the generated `definition.ts` and the CSS variables that
 *  `next/font/local` defines for each (set by `download:fonts`). */
const DEFINITION_KEY: Record<FontRole, string> = { sans: 'fontSans', serif: 'fontSerif', mono: 'fontMono', display: 'fontDisplay' }
const NEXT_FONT_VAR: Record<FontRole, string> = {
  sans: '--font-setSans',
  serif: '--font-setSerif',
  mono: '--font-setMono',
  display: '--font-setDisplay',
}

/** Static demo chrome. Body text uses the active sans font, falling back to system UI. */
const demoChrome = `
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

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const active = await getActiveFonts()
  const definition = definitionFonts as Record<string, { variable?: string } | undefined>

  // next/font/local className(s) — present only for fonts `download:fonts` wrote.
  const nextFontClasses = Object.values(definition)
    .map((f) => f?.variable)
    .filter(Boolean)
    .join(' ')

  // Resolve each active role to `--font-<role>`: prefer the downloaded next/font
  // variable; otherwise inline the bytes as a data: URL `@font-face`.
  const faceRules: string[] = []
  const rootVars: string[] = []
  for (const font of active) {
    const downloaded = definition[DEFINITION_KEY[font.role]]?.variable
    if (downloaded) {
      rootVars.push(`--font-${font.role}:var(${NEXT_FONT_VAR[font.role]});`)
    } else {
      const dataUrl = await readFontDataUrl(font.filename, font.mimeType)
      if (!dataUrl) continue
      const family = fontFamilyName(font.role)
      faceRules.push(`@font-face{font-family:"${family}";src:url("${dataUrl}") format("${formatFor(font.mimeType)}");font-display:swap;}`)
      rootVars.push(`--font-${font.role}:"${family}";`)
    }
  }

  const inlineCss = `${faceRules.join('\n')}\n:root{${rootVars.join('')}}\n${demoChrome}`

  return (
    <html lang="en" className={nextFontClasses || undefined}>
      <head>
        <style id="fonts-inline" dangerouslySetInnerHTML={{ __html: inlineCss }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
