import { type ActiveFont, getActiveFonts } from '@/lib/fonts'

const PANGRAM = 'The quick brown fox jumps over the lazy dog'
const RAMP = [14, 18, 24, 36]
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789 & ? ! @ # %'

function Specimen({ font }: { font: ActiveFont }) {
  // Resolved by the layout to the downloaded next/font family or an inlined one.
  const ff = `var(--font-${font.role})`
  return (
    <div className="specimen">
      <div className="specimen__head">
        <span className="specimen__name" style={{ fontFamily: ff }}>
          {font.title}
        </span>
        <span className="specimen__badge">{font.role}</span>
      </div>
      <p className="specimen__sample" style={{ fontFamily: ff }}>
        {PANGRAM}
      </p>
      <div className="specimen__ramp">
        {RAMP.map((size) => (
          <div key={size} style={{ fontFamily: ff, fontSize: size }}>
            {size}px — {PANGRAM}
          </div>
        ))}
      </div>
      <div className="specimen__glyphs" style={{ fontFamily: ff }}>
        {GLYPHS}
      </div>
    </div>
  )
}

export default async function HomePage() {
  const fonts = await getActiveFonts()

  return (
    <main className="demo-shell">
      <h1 className="demo-h1" style={{ fontFamily: 'var(--font-display, inherit)' }}>
        Atomic Payload — Fonts Demo
      </h1>
      <p className="demo-lead">
        This template showcases <code>@pro-laico/fonts</code> on its own. Upload font files to the <code>Font</code> collection, then pick the active{' '}
        <strong>sans / serif / mono / display</strong> in the <code>fontSet</code> global (the font analog of an icon set). The layout serves each
        active role two ways: if <code>pnpm download:fonts</code> has run it uses <code>next/font/local</code>; otherwise it reads the font
        server-side and inlines it as a <code>data:</code> URL. Either way the specimens below resolve via <code>var(--font-&lt;role&gt;)</code>.
      </p>

      <div className="demo-card">
        <div className="demo-row">
          <a className="demo-btn" href="/admin">
            Open the admin dashboard
          </a>
          <a className="demo-btn demo-btn--ghost" href="/admin/globals/fontSet">
            Edit the active set
          </a>
        </div>
        <p className="demo-muted" style={{ marginTop: 12, marginBottom: 0, fontSize: '0.85rem' }}>
          {fonts.length > 0 ? `${fonts.length} of 4 roles active.` : 'No active fonts yet.'} New here? Create an account at{' '}
          <a href="/admin">/admin</a>, click <strong>Seed sample fonts</strong> on the dashboard, then return.
        </p>
      </div>

      {fonts.length === 0 ? (
        <p className="demo-muted" style={{ fontStyle: 'italic' }}>
          No active fonts yet. Open the <a href="/admin">admin dashboard</a>, click <strong>Seed sample fonts</strong> — then come back here to see
          the four fonts in action.
        </p>
      ) : (
        <>
          <h2 className="demo-h2">The active fonts</h2>
          {fonts.map((font) => (
            <Specimen key={font.role} font={font} />
          ))}

          <h2 className="demo-h2">Use them together</h2>
          <p className="demo-lead">
            Each active role is wired to a CSS variable (<code>--font-display</code>, <code>--font-sans</code>, <code>--font-serif</code>,{' '}
            <code>--font-mono</code>) in the layout, so a real layout mixes them by role — swap a font in the <code>fontSet</code> global and
            everything below re-renders with it.
          </p>
          <article className="demo-card">
            <h3 style={{ fontFamily: 'var(--font-display, inherit)', fontSize: '2.25rem', margin: '0 0 12px', lineHeight: 1.15 }}>
              Typography that ships from the dashboard
            </h3>
            <p style={{ fontFamily: 'var(--font-sans, inherit)', fontSize: '1.05rem', margin: '0 0 16px' }}>
              Body copy in the sans role. Editors upload fonts in Payload and choose the active set; the site picks them up on the next render — no
              rebuild required for the inline path.
            </p>
            <blockquote
              style={{
                fontFamily: 'var(--font-serif, inherit)',
                fontStyle: 'italic',
                fontSize: '1.25rem',
                borderLeft: '3px solid #2a2a2a',
                paddingLeft: 16,
                margin: '0 0 16px',
                color: '#cfcfcf',
              }}
            >
              “A pull quote set in the serif role, because contrast is the whole point of a type system.”
            </blockquote>
            <pre
              style={{
                fontFamily: 'var(--font-mono, ui-monospace), monospace',
                background: '#0d0d0d',
                border: '1px solid #2a2a2a',
                borderRadius: 8,
                padding: '12px 14px',
                margin: 0,
                overflowX: 'auto',
                fontSize: '0.85rem',
              }}
            >
              <code>{'const fonts = await getActiveFonts() // the active set, by role'}</code>
            </pre>
          </article>
        </>
      )}
    </main>
  )
}
