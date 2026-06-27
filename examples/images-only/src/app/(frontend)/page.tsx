import { getPayload } from 'payload'
import config from '@payload-config'
import { redirect } from 'next/navigation'
import { headers as nextHeaders } from 'next/headers'

import { ResponsiveImage } from '@pro-laico/images/components/image'

import { resetImages, sampleImages, seedImages } from '@/seed/seed'

type ImageDoc = {
  id: string | number
  alt?: string | null
  width?: number | null
  height?: number | null
  focalX?: number | null
  focalY?: number | null
  filename?: string | null
  url?: string | null
}

// The crops the demo renders for each source — all cut to the image's focal point.
const RATIOS: { label: string; ar?: string }[] = [
  { label: 'natural' },
  { label: '16:9', ar: '16:9' },
  { label: '1:1', ar: '1:1' },
  { label: '9:16', ar: '9:16' },
]

const TILE_SIZES = '(max-width: 920px) 45vw, 200px'

async function seedAction(): Promise<void> {
  'use server'
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await nextHeaders() })
  if (user) await seedImages({ payload })
  redirect('/')
}

async function resetAction(): Promise<void> {
  'use server'
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await nextHeaders() })
  if (user) await resetImages({ payload })
  redirect('/')
}

export default async function HomePage() {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await nextHeaders() })
  const isLoggedIn = Boolean(user)

  const images = (await payload.find({ collection: 'images', limit: 50, depth: 0, sort: 'createdAt', overrideAccess: true })).docs as ImageDoc[]

  return (
    <main>
      <h1>Atomic Payload — Images Demo</h1>
      <p className="lead">
        A minimal showcase of <code>@pro-laico/images</code>, standalone (no <code>@pro-laico/atomic</code>). Upload stores only the original; every
        size below is generated <strong>on demand</strong> by the transform endpoint at <code>/api/img/:id</code>, cropped to each image&apos;s focal
        point, and rendered through the responsive <code>&lt;ResponsiveImage&gt;</code> component (a fully server-rendered <code>&lt;img&gt;</code> with a
        baked-in <code>srcset</code>) — over a low-res placeholder built from the smallest variant.
      </p>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Seed sample images</h2>
        {isLoggedIn ? (
          <div className="row">
            <form className="seed" action={seedAction}>
              <button className="seed-btn" type="submit">
                Seed {sampleImages.length} images
              </button>
            </form>
            <form className="seed" action={resetAction}>
              <button className="seed-btn seed-btn--danger" type="submit">
                Reset (delete all)
              </button>
            </form>
            <a className="seed-btn seed-btn--ghost" href="/admin">
              Open admin →
            </a>
          </div>
        ) : (
          <p className="empty">
            <a href="/admin">Log in to /admin</a> first — seeding requires an authenticated user. You can also upload your own at{' '}
            <a href="/admin/collections/images">/admin/collections/images</a>.
          </p>
        )}
        <p className="empty" style={{ marginTop: 12, marginBottom: 0 }}>
          Each sample is a real photo with its subject deliberately off-center (landscape, portrait, and square). The focal point marks that subject,
          so the focal-aware crops keep it in frame across every ratio.
        </p>
      </div>

      <h2>
        Images <small style={{ color: 'var(--muted)', fontWeight: 400 }}>({images.length})</small>
      </h2>
      {images.length === 0 ? (
        <p className="empty">No images yet. Seed sample data above, or upload your own in the admin.</p>
      ) : (
        images.map((img) => (
          <div className="card" key={String(img.id)}>
            <div className="row" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
              <strong>{img.alt ?? '(no alt)'}</strong>
              <small style={{ color: 'var(--muted)' }}>
                {img.width}×{img.height} · focal {img.focalX ?? 50}%/{img.focalY ?? 50}%
              </small>
            </div>
            <div className="ratios">
              {RATIOS.map(({ label, ar }) => (
                <div className="ratio" key={label}>
                  <ResponsiveImage image={img} aspectRatio={ar} sizes={TILE_SIZES} />
                  <small>{label}</small>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      <h2>How it works</h2>
      <p className="lead" style={{ marginBottom: 12 }}>
        Pass a populated image doc (or just its id) and a display ratio. The component builds a <code>srcset</code> of on-demand transform URLs
        stepped by the plugin&apos;s <code>pixelStep</code> up to the source&apos;s width, and the endpoint crops to the stored focal point
        server-side.
      </p>
      <pre className="code">{`import { ResponsiveImage } from '@pro-laico/images/components/image'

// In any server or client component:
<ResponsiveImage image={image} aspectRatio="16:9" sizes="(max-width: 768px) 100vw, 50vw" />

// Emits a plain <img> like (the v= token is derived from the source's
// filename + focal, so editing either busts immutable browser/CDN caches):
//   <img
//     srcset="/api/img/<id>?w=320&h=180&fit=cover&q=75&fmt=auto&v=1a2b3c 320w, … "
//     sizes="(max-width: 768px) 100vw, 50vw"
//     style="aspect-ratio: 1.777…"
//   />`}</pre>

      {images.length > 0 && (
        <div className="card">
          <h2 style={{ marginTop: 0 }}>See srcset choose, live</h2>
          <p className="lead" style={{ marginBottom: 16 }}>
            A dedicated page renders one image full-bleed with a <code>srcset</code> + <code>sizes="100vw"</code>. Open your Network tab, then resize
            the window — the browser fetches a different variant for each screen width, with no extra code.
          </p>
          <a className="seed-btn" href="/responsive">
            Open the responsive demo →
          </a>
        </div>
      )}
    </main>
  )
}
