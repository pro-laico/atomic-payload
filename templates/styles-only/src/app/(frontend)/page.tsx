import config from '@payload-config'
import { draftMode, headers as nextHeaders } from 'next/headers'
import { getPayload } from 'payload'
import type { AnyBlock } from '@/blocks/RenderBlocks'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { ThemeToggle } from './ThemeToggle'

type PageDoc = { id: string | number; title?: string | null; mainClassName?: string | null; layout?: AnyBlock[] | null }
type StorageDoc = { cssSize?: number | null }

export default async function HomePage() {
  const payload = await getPayload({ config })
  const reqHeaders = await nextHeaders()
  const { user } = await payload.auth({ headers: reqHeaders })
  const isLoggedIn = Boolean(user)
  const { isEnabled: draft } = await draftMode()

  const page = (await payload.find({ collection: 'pages', where: { href: { equals: '/' } }, limit: 1, depth: 1, draft, overrideAccess: true })).docs[0] as
    | PageDoc
    | undefined
  const storage = (await payload.findGlobal({ slug: 'publishedStorage', overrideAccess: true }).catch(() => null)) as StorageDoc | null
  const cssSize = storage?.cssSize ?? 0

  return (
    <>
      {/* Demo toolbar — styled by the static "demo chrome" stylesheet in the
          layout, so it works even before any CSS has been generated. Seeding
          lives on the admin dashboard (`/admin`), not here. */}
      <div className="demo-shell">
        <h1 className="demo-h1">Atomic Payload — Styles Demo</h1>
        <p className="demo-lead">
          The blocks below live in the <code>pages</code> collection. Each block's classes are <code>ClassNameField</code> values; saving a page
          collects them, the <code>cssHook</code> regenerates the stylesheet, and the components render with the result — back to front, no stylesheet
          in the repo.
        </p>
        <div className="demo-card">
          <div className="demo-row">
            <a className="demo-btn" href="/admin">
              Open the admin dashboard
            </a>
            <ThemeToggle />
          </div>
          <p className="demo-muted" style={{ marginTop: 12, marginBottom: 0, fontSize: '0.85rem' }}>
            {cssSize > 0 ? `Generated stylesheet: ${(cssSize / 1024).toFixed(1)} KB.` : 'No stylesheet generated yet.'}{' '}
            {isLoggedIn ? 'Seed (or edit) from the dashboard, then reload.' : 'Log in at /admin, then seed from the dashboard.'}
          </p>
        </div>
      </div>

      {page ? (
        <main className={page.mainClassName || undefined}>
          <RenderBlocks blocks={page.layout} draft={draft} />
        </main>
      ) : (
        <div className="demo-shell">
          <p className="demo-muted" style={{ fontStyle: 'italic' }}>
            No home page yet. Open the <a href="/admin">admin dashboard</a> and click <strong>Seed sample data</strong> — then come back here.
          </p>
        </div>
      )}
    </>
  )
}
