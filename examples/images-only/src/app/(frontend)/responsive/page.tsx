import { getPayload } from 'payload'
import config from '@payload-config'

import { ResponsiveImage } from '@pro-laico/images/components/image'
import { buildSrcset, deriveVersion } from '@pro-laico/images/components/buildSrcset'

export const dynamic = 'force-dynamic'

type ImageDoc = {
  id: string | number
  alt?: string | null
  width?: number | null
  height?: number | null
  blurDataUrl?: string | null
  focalX?: number | null
  focalY?: number | null
  filename?: string | null
}

export default async function ResponsivePage() {
  const payload = await getPayload({ config })
  const img = (await payload.find({ collection: 'images', limit: 1, depth: 0, sort: 'createdAt', overrideAccess: true })).docs[0] as
    | ImageDoc
    | undefined

  if (!img) {
    return (
      <main>
        <h1>Responsive srcset demo</h1>
        <p className="empty">
          No images yet — <a href="/">seed the samples</a> first, then come back.
        </p>
      </main>
    )
  }

  // The same srcset <ResponsiveImage> emits below, shown so you know which candidate
  // URLs to look for in the Network tab.
  const ar = img.width && img.height ? img.width / img.height : undefined
  const { srcset } = buildSrcset(String(img.id), { sourceWidth: img.width ?? undefined, aspectRatio: ar, version: deriveVersion(img) })

  return (
    <main>
      <p style={{ margin: 0 }}>
        <a href="/">← Back to the demo</a>
      </p>
      <h1>One image, every screen size</h1>
      <p className="lead">
        Below is a single <code>&lt;ResponsiveImage&gt;</code> with <code>sizes=&quot;100vw&quot;</code>, rendered full-bleed. There&apos;s no
        JavaScript and no resize handler — the browser reads the <code>srcset</code> and downloads the one variant that fits your screen.
      </p>

      <ol className="steps">
        <li>
          Open DevTools → <strong>Network</strong>, filter to <strong>Img</strong>, and tick <strong>Disable cache</strong> so every reload actually
          refetches.
        </li>
        <li>
          Turn on the <strong>device toolbar</strong> (responsive mode) and make the viewport <strong>narrow</strong> — phone-sized.
        </li>
        <li>
          <strong>Reload.</strong> Exactly one variant loads — the smallest that covers that width (times the device pixel ratio). Note its{' '}
          <code>?w=</code>.
        </li>
        <li>
          Now drag the viewport <strong>wider</strong>. Each time you cross a step, a larger <code>?w=</code> variant streams in.
        </li>
        <li>
          Start narrow and grow, not the other way around: <code>srcset</code> never <em>downgrades</em> — once the browser has a variant large
          enough, it keeps it even as the box shrinks (it never downloads more than it needs). So a smaller image only loads on a fresh, smaller load.
        </li>
      </ol>

      {/* Full-bleed: break out of the centered column so `sizes="100vw"` is honest. */}
      <div style={{ width: '100vw', marginLeft: 'calc(50% - 50vw)', marginTop: 24 }}>
        <ResponsiveImage image={img} sizes="100vw" priority />
      </div>

      <h2>The srcset it emitted</h2>
      <p className="lead" style={{ marginBottom: 12 }}>
        Each entry is a real transform URL with its width descriptor; the browser matches your screen against the <code>sizes</code> hint and picks
        one.
      </p>
      <pre className="code">{srcset.split(', ').join('\n')}</pre>
    </main>
  )
}
