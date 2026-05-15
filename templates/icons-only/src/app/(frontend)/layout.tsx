import React from 'react'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Atomic Payload Icons Demo',
  description: 'A minimal showcase of the @pro-laico/ap-icons plugin.',
}

const styles = `
  :root { color-scheme: light dark; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: #0b0d12;
    color: #e6e9ef;
    min-height: 100vh;
    line-height: 1.5;
  }
  a { color: #7aa7ff; text-decoration: none; }
  a:hover { text-decoration: underline; }
  main { max-width: 880px; margin: 0 auto; padding: 48px 24px 96px; }
  h1 { font-size: 2rem; font-weight: 700; letter-spacing: -0.02em; margin: 0 0 8px; }
  h2 { font-size: 1.25rem; font-weight: 600; letter-spacing: -0.01em; margin: 32px 0 12px; }
  p.lead { color: #9aa3b2; margin: 0 0 32px; max-width: 60ch; }
  .card { background: #131722; border: 1px solid #1f2533; border-radius: 12px; padding: 20px; margin-bottom: 16px; }
  .empty { color: #9aa3b2; font-style: italic; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(96px, 1fr)); gap: 12px; }
  .icon-tile { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 16px 8px; border: 1px solid #1f2533; border-radius: 8px; background: #0f1320; }
  .icon-tile svg { width: 32px; height: 32px; }
  .icon-tile small { font-size: 0.75rem; color: #9aa3b2; word-break: break-word; text-align: center; }
  form.seed { margin: 8px 0 0; }
  button.seed-btn {
    background: #2563eb; color: white; border: 0; border-radius: 8px;
    padding: 10px 16px; font-weight: 600; cursor: pointer; font-size: 0.95rem;
  }
  button.seed-btn:hover { background: #1d4ed8; }
  code { background: #1f2533; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
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
