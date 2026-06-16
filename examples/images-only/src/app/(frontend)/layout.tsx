import type React from 'react'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Atomic Payload Images Demo',
  description: 'A minimal showcase of the @pro-laico/images plugin.',
}

const styles = `
  :root {
    color-scheme: dark;
    --brand: oklch(72% 0.16 250);
    --bg: oklch(0.145 0 0);
    --card: oklch(0.205 0 0);
    --border: oklch(1 0 0 / 10%);
    --fg: oklch(0.985 0 0);
    --muted: oklch(0.708 0 0);
  }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: var(--bg);
    color: var(--fg);
    min-height: 100vh;
    line-height: 1.5;
  }
  a { color: var(--brand); text-decoration: none; }
  a:hover { text-decoration: underline; }
  main { max-width: 920px; margin: 0 auto; padding: 48px 24px 96px; }
  h1 { font-size: 2rem; font-weight: 700; letter-spacing: -0.02em; margin: 0 0 8px; }
  h2 { font-size: 1.25rem; font-weight: 600; letter-spacing: -0.01em; margin: 40px 0 12px; }
  h3 { font-size: 0.95rem; font-weight: 600; margin: 24px 0 8px; }
  p.lead { color: var(--muted); margin: 0 0 24px; }
  .card { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 20px; margin-bottom: 16px; }
  .empty { color: var(--muted); font-style: italic; }
  .row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
  form.seed { margin: 0; }
  /* Shared button box — applies to both <button> and the <a> "Open admin" link,
     so all three controls share the same height, padding, radius, and font. */
  .seed-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 6px;
    box-sizing: border-box; min-height: 40px; padding: 10px 16px;
    border: 1px solid transparent; border-radius: 8px;
    font-weight: 600; font-size: 0.95rem; line-height: 1; cursor: pointer;
    text-decoration: none; transition: filter 120ms ease, background 120ms ease, border-color 120ms ease;
  }
  .seed-btn { background: var(--brand); color: var(--bg); }
  .seed-btn:hover { filter: brightness(1.1); text-decoration: none; }
  .seed-btn--danger { background: transparent; color: var(--fg); border-color: var(--border); }
  .seed-btn--danger:hover { background: var(--card); filter: none; border-color: oklch(0.65 0.18 25 / 60%); }
  .seed-btn--ghost { background: transparent; color: var(--brand); border-color: var(--border); }
  .seed-btn--ghost:hover { background: var(--card); filter: none; border-color: var(--brand); }
  /* Numbered walkthrough (responsive demo page). */
  ol.steps { color: var(--muted); margin: 0 0 24px; padding-left: 20px; }
  ol.steps li { margin: 6px 0; }
  ol.steps strong { color: var(--fg); }
  code { background: var(--card); border: 1px solid var(--border); padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
  pre.code { background: var(--card); border: 1px solid var(--border); border-radius: 8px; padding: 16px; overflow-x: auto; font-size: 0.82rem; line-height: 1.55; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
  /* The ratio tiles: a fixed-ratio box; <ResponsiveImage>'s wrapper fills it. */
  .ratios { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px; }
  .ratio { border: 1px solid var(--border); border-radius: 8px; overflow: hidden; background: var(--card); }
  .ratio small { display: block; padding: 6px 8px; font-size: 0.72rem; color: var(--muted); border-top: 1px solid var(--border); }
`

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: styles }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
