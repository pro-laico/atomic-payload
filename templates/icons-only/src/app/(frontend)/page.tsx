import { headers as nextHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'

import { sampleIcons } from '@/seed/sampleIcons'

type IconDoc = {
  id: string | number
  filename?: string | null
  svgString?: string | null
}

type IconSetDoc = {
  id: string | number
  title?: string | null
  active?: boolean | null
  iconsArray?: { id?: string | null; name?: string | null; icon?: IconDoc | string | number | null }[] | null
}

async function seedAction(): Promise<void> {
  'use server'
  const reqHeaders = await nextHeaders()
  const protocol = reqHeaders.get('x-forwarded-proto') ?? 'http'
  const host = reqHeaders.get('host') ?? 'localhost:3000'
  await fetch(`${protocol}://${host}/api/seed`, {
    method: 'POST',
    headers: { cookie: reqHeaders.get('cookie') ?? '' },
  })
  redirect('/')
}

export default async function HomePage() {
  const payload = await getPayload({ config })
  const reqHeaders = await nextHeaders()
  const { user } = await payload.auth({ headers: reqHeaders })

  const icons = (await payload.find({ collection: 'icon', limit: 100, depth: 0, overrideAccess: true })).docs as IconDoc[]
  const sets = (await payload.find({ collection: 'iconSet', limit: 25, depth: 1, overrideAccess: true })).docs as IconSetDoc[]

  const isLoggedIn = Boolean(user)

  return (
    <main>
      <h1>Atomic Payload — Icons Demo</h1>
      <p className="lead">
        Minimal template showcasing <code>@pro-laico/icons</code>. Visit <a href="/admin">/admin</a> to manage uploads,
        then come back here to see the rendered SVGs. The seed button creates {sampleIcons.length} sample icons and one
        Demo Icon Set if they don&apos;t already exist.
      </p>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Seed sample data</h2>
        {isLoggedIn ? (
          <form className="seed" action={seedAction}>
            <button className="seed-btn" type="submit">
              Seed {sampleIcons.length} icons + 1 set
            </button>
          </form>
        ) : (
          <p className="empty">
            <a href="/admin">Log in to /admin</a> first — the seed endpoint requires an authenticated user.
          </p>
        )}
      </div>

      <h2>
        Icons <small style={{ color: '#9aa3b2', fontWeight: 400 }}>({icons.length})</small>
      </h2>
      {icons.length === 0 ? (
        <p className="empty">No icons yet. Seed sample data above, or upload your own at <a href="/admin/collections/icon">/admin/collections/icon</a>.</p>
      ) : (
        <div className="grid">
          {icons.map((doc) => (
            <div className="icon-tile" key={String(doc.id)}>
              {doc.svgString ? <span dangerouslySetInnerHTML={{ __html: doc.svgString }} /> : null}
              <small>{doc.filename ?? '(no filename)'}</small>
            </div>
          ))}
        </div>
      )}

      <h2>
        Icon Sets <small style={{ color: '#9aa3b2', fontWeight: 400 }}>({sets.length})</small>
      </h2>
      {sets.length === 0 ? (
        <p className="empty">
          No icon sets yet. Seed sample data above, or create one at <a href="/admin/collections/iconSet">/admin/collections/iconSet</a>.
        </p>
      ) : (
        sets.map((set) => (
          <div className="card" key={String(set.id)}>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <strong>{set.title ?? '(untitled)'}</strong>
              <small style={{ color: set.active ? '#86efac' : '#9aa3b2' }}>{set.active ? 'active' : 'inactive'}</small>
            </div>
            <div className="grid" style={{ marginTop: 12 }}>
              {(set.iconsArray ?? []).map((entry, idx) => {
                const icon = typeof entry.icon === 'object' && entry.icon ? (entry.icon as IconDoc) : null
                return (
                  <div className="icon-tile" key={entry.id ?? idx}>
                    {icon?.svgString ? <span dangerouslySetInnerHTML={{ __html: icon.svgString }} /> : null}
                    <small>{entry.name ?? icon?.filename ?? ''}</small>
                  </div>
                )
              })}
            </div>
          </div>
        ))
      )}
    </main>
  )
}
