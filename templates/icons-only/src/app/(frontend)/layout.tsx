import React from 'react'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Atomic Payload Icons Demo',
  description: 'A minimal showcase of the @pro-laico/icons plugin.',
}

const styles = `
  :root {
    color-scheme: dark;
    --brand: oklch(87.62% 0.240 148.61);
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
  main { max-width: 880px; margin: 0 auto; padding: 48px 24px 96px; }
  h1 { font-size: 2rem; font-weight: 700; letter-spacing: -0.02em; margin: 0 0 8px; }
  h2 { font-size: 1.25rem; font-weight: 600; letter-spacing: -0.01em; margin: 32px 0 12px; }
  p.lead { color: var(--muted); margin: 0 0 32px; }
  .card { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 20px; margin-bottom: 16px; }
  .empty { color: var(--muted); font-style: italic; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(96px, 1fr)); gap: 12px; }
  .icon-tile { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 16px 8px; border: 1px solid var(--border); border-radius: 8px; background: var(--card); }
  .icon-tile svg { width: 32px; height: 32px; }
  .icon-tile small { font-size: 0.75rem; color: var(--muted); word-break: break-word; text-align: center; }
  form.seed { margin: 8px 0 0; }
  button.seed-btn {
    background: var(--brand); color: var(--bg); border: 0; border-radius: 8px;
    padding: 10px 16px; font-weight: 600; cursor: pointer; font-size: 0.95rem;
  }
  button.seed-btn:hover { filter: brightness(1.1); }
  button.seed-btn--danger { background: transparent; color: var(--fg); border: 1px solid var(--border); }
  button.seed-btn--danger:hover { background: var(--card); filter: none; }
  code { background: var(--card); border: 1px solid var(--border); padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
  .code-block { margin: 0 0 16px; border: 1px solid var(--border); border-radius: 8px; overflow: hidden; }
  .code-block pre.shiki {
    background-color: var(--card) !important;
    margin: 0; padding: 16px; overflow-x: auto;
    font-size: 0.85rem; line-height: 1.55;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  }
  .code-block pre.shiki code { background: transparent; border: 0; padding: 0; font-size: inherit; font-family: inherit; }
  .row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
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
