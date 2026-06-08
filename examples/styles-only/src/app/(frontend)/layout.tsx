import type React from 'react'
import { draftMode } from 'next/headers'
import { ThemeProvider } from 'next-themes'

import { getCachedDesignSet, getCachedSiteCSS } from '@pro-laico/styles/cache'
import LivePreviewListener from '@pro-laico/core/components/frontend/LivePreviewListener'

/** Payload-backed layout needs a live DB; avoid static prerender at build time. */
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Atomic Payload Styles Demo',
  description: 'A minimal showcase of the @pro-laico/styles plugin.',
}

/**
 * Static "chrome" stylesheet for the demo scaffolding (shell, cards, buttons,
 * code blocks). It is deliberately separate from the generated stylesheet: the
 * generated CSS is what `@pro-laico/styles` produces from the active design set
 * and is the thing being showcased; this is just the frame around it.
 *
 * Every color references a design-set token (`var(--foreground)`, …) with a
 * hard-coded fallback, so the page is legible before you seed (no tokens yet)
 * and automatically adopts the design set's palette once you do. It is injected
 * AFTER the generated CSS so the demo frame wins over UnoCSS's preflight reset.
 */
const demoChrome = `
  *, *::before, *::after { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: var(--background, #0a0a0a);
    color: var(--foreground, #ededed);
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }
  a { color: var(--brand-primary, #4ade80); text-decoration: none; }
  a:hover { text-decoration: underline; }
  .demo-shell { max-width: 920px; margin: 0 auto; padding: 48px 24px 120px; }
  .demo-h1 { font-size: 2rem; font-weight: 700; letter-spacing: -0.02em; margin: 0 0 8px; }
  .demo-h2 { font-size: 1.3rem; font-weight: 600; letter-spacing: -0.01em; margin: 40px 0 6px; }
  .demo-h3 { font-size: 1rem; font-weight: 600; margin: 24px 0 8px; }
  .demo-lead { color: var(--muted-foreground, #a1a1a1); margin: 0 0 24px; }
  .demo-muted { color: var(--muted-foreground, #a1a1a1); }
  .demo-card { background: var(--card, #171717); border: 1px solid var(--border, #2a2a2a); border-radius: 12px; padding: 20px; margin-bottom: 16px; }
  .demo-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
  .demo-between { justify-content: space-between; }
  .demo-grid { display: grid; gap: 12px; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); }
  .demo-swatch { display: flex; flex-direction: column; gap: 8px; }
  .demo-swatch-box { height: 56px; border-radius: 8px; border: 1px solid var(--border, #2a2a2a); }
  .demo-swatch small { font-size: 0.72rem; color: var(--muted-foreground, #a1a1a1); word-break: break-word; }
  .demo-swatch code { font-size: 0.66rem; }
  .demo-btn {
    background: var(--brand-primary, #4ade80); color: var(--background, #0a0a0a); border: 0; border-radius: 8px;
    padding: 10px 16px; font-weight: 600; cursor: pointer; font-size: 0.95rem;
  }
  .demo-btn:hover { filter: brightness(1.1); }
  .demo-btn--danger { background: transparent; color: var(--foreground, #ededed); border: 1px solid var(--border, #2a2a2a); }
  .demo-btn--danger:hover { background: var(--card, #171717); filter: none; }
  .demo-stat { display: flex; flex-direction: column; gap: 2px; }
  .demo-stat strong { font-size: 1.5rem; font-weight: 700; }
  code { background: var(--card, #171717); border: 1px solid var(--border, #2a2a2a); padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
  .code-block { margin: 0 0 16px; border: 1px solid var(--border, #2a2a2a); border-radius: 8px; overflow: hidden; }
  .code-block pre.shiki {
    background-color: var(--card, #171717) !important;
    margin: 0; padding: 16px; overflow-x: auto;
    font-size: 0.82rem; line-height: 1.55; max-height: 360px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  }
  .code-block pre.shiki code { background: transparent; border: 0; padding: 0; font-size: inherit; font-family: inherit; }
`

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled: draft } = await draftMode()

  // The generated stylesheet (written to the storage globals by the cssHook) and
  // the active design set (for its html / body / wrapper class names + theme).
  const css = await getCachedSiteCSS(draft)
  const ds = await getCachedDesignSet(draft)

  return (
    <html lang="en" suppressHydrationWarning className={ds?.htmlClassName ?? undefined}>
      <head>
        {/* The star of the show: CSS generated from the active design set. */}
        <style id="atomic-generated" type="text/css" dangerouslySetInnerHTML={{ __html: css || '' }} />
        {/* Demo frame — loaded after so it wins over the generated preflight reset. */}
        <style id="demo-chrome" dangerouslySetInnerHTML={{ __html: demoChrome }} />
      </head>
      <body className={ds?.bodyClassName || undefined}>
        {draft && <LivePreviewListener />}
        <ThemeProvider enableSystem={false} attribute="class" disableTransitionOnChange defaultTheme={ds?.defaultTheme ?? 'dark'}>
          <div className={`${ds?.wrapperClassName ?? ''} isolate`}>{children}</div>
        </ThemeProvider>
      </body>
    </html>
  )
}
