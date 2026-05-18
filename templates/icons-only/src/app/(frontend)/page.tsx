import config from '@payload-config'
import LivePreviewListener from '@pro-laico/core/components/frontend/LivePreviewListener'
import { extractSvgContent, extractSvgProps } from '@pro-laico/icons'
import { Icon } from '@pro-laico/icons/Icon'
import { draftMode, headers as nextHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

import { sampleIconSets } from '@/seed/sampleIcons'
import { CodeBlock } from './CodeBlock'

const totalSampleIcons = sampleIconSets.reduce((n, s) => n + s.icons.length, 0)

type IconDoc = { id: string | number; filename?: string | null; svgString?: string | null }
type IconSetDoc = {
  id: string | number
  title?: string | null
  active?: boolean | null
  iconsArray?: { id?: string | null; name?: string | null; icon?: IconDoc | string | number | null }[] | null
}

async function postTo(path: string): Promise<void> {
  const reqHeaders = await nextHeaders()
  const protocol = reqHeaders.get('x-forwarded-proto') ?? 'http'
  const host = reqHeaders.get('host') ?? 'localhost:3000'
  await fetch(`${protocol}://${host}${path}`, {
    method: 'POST',
    headers: { cookie: reqHeaders.get('cookie') ?? '' },
  })
}

async function seedAction(): Promise<void> {
  'use server'
  await postTo('/api/seed')
  redirect('/')
}

async function resetAction(): Promise<void> {
  'use server'
  await postTo('/api/reset')
  redirect('/')
}

/** Renders an SVG string as a native <svg> element, copying the source SVG's
 *  attributes onto the JSX node — the same shape @pro-laico/icons' IconChild
 *  uses, so styling / class hooks work identically. */
function SvgFromString({ svg }: { svg: string }) {
  return <svg {...extractSvgProps(svg)} dangerouslySetInnerHTML={{ __html: extractSvgContent(svg) }} />
}

/** Tile wrapper around the bundled `<Icon>` server component, which handles
 *  active-iconSet lookup, draft mode, fallback, and per-icon cache invalidation
 *  internally. */
function IconChildTile({ name }: { name: string }) {
  return (
    <div className="icon-tile">
      <Icon name={name} />
      <small>{name}</small>
    </div>
  )
}

export default async function HomePage() {
  const payload = await getPayload({ config })
  const reqHeaders = await nextHeaders()
  const { user } = await payload.auth({ headers: reqHeaders })
  const isLoggedIn = Boolean(user)
  const { isEnabled: draft } = await draftMode()

  const icons = (await payload.find({ collection: 'icon', limit: 100, depth: 0, overrideAccess: true })).docs as IconDoc[]
  const sets = (await payload.find({ collection: 'iconSet', limit: 25, depth: 1, sort: 'createdAt', overrideAccess: true })).docs as IconSetDoc[]

  return (
    <main>
      {draft && <LivePreviewListener />}
      <h1>Atomic Payload — Icons Demo</h1>
      <p className="lead">
        Minimal template showcasing <code>@pro-laico/icons</code>. The seed button wipes the <code>icon</code> and <code>iconSet</code> collections,
        then re-creates one IconSet per folder under <code>src/seed/</code>. Below, the active set is rendered via the bundled{' '}
        <code>&lt;Icon name=&quot;...&quot; /&gt;</code> server component from <code>@pro-laico/icons/Icon</code>.
      </p>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Seed sample data</h2>
        {isLoggedIn ? (
          <div className="row">
            <form className="seed" action={seedAction}>
              <button className="seed-btn" type="submit">
                Seed {sampleIconSets.length} sets ({totalSampleIcons} icons)
              </button>
            </form>
            <form className="seed" action={resetAction}>
              <button className="seed-btn seed-btn--danger" type="submit">
                Reset (delete all icons &amp; sets)
              </button>
            </form>
          </div>
        ) : (
          <p className="empty">
            <a href="/admin">Log in to /admin</a> first — the seed and reset endpoints require an authenticated user.
          </p>
        )}
        <p className="empty" style={{ marginTop: 12, marginBottom: 0 }}>
          <strong>Seed</strong> is idempotent — it skips icons whose filename already exists and IconSets whose title already exists.{' '}
          <strong>Reset</strong> deletes every <code>icon</code> and <code>iconSet</code> doc.
        </p>
      </div>

      <h2>
        All Uploaded Icons <small style={{ color: 'var(--muted)', fontWeight: 400 }}>({icons.length})</small>
      </h2>
      <p className="lead" style={{ marginBottom: 12 }}>
        The icons collection houses all the uploaded icons. You can query for them directly, but thats not the intended way of using the icons.
      </p>
      {icons.length === 0 ? (
        <p className="empty">
          No icons yet. Seed sample data above, or upload your own at <a href="/admin/collections/icon">/admin/collections/icon</a>.
        </p>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
          {icons.map((doc) => (
            <div className="icon-tile" key={String(doc.id)}>
              {doc.svgString ? <SvgFromString svg={doc.svgString} /> : null}
              <small>{doc.filename ?? '(no filename)'}</small>
            </div>
          ))}
        </div>
      )}

      <h2>
        Icon Sets <small style={{ color: 'var(--muted)', fontWeight: 400 }}>({sets.length})</small>
      </h2>
      <p className="lead" style={{ marginBottom: 12 }}>
        Icon sets are used to group icons together. You can have multiple icon sets, but only one can be active at a time. Toggle which set is active
        at <a href="/admin/collections/iconSet">/admin/collections/iconSet</a>.
      </p>
      {sets.length === 0 ? (
        <p className="empty">
          No icon sets yet. Seed sample data above, or create one at <a href="/admin/collections/iconSet">/admin/collections/iconSet</a>.
        </p>
      ) : (
        sets.map((set) => (
          <div className="card" key={String(set.id)}>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <strong>{set.title ?? '(untitled)'}</strong>
              <small style={{ color: set.active ? 'var(--brand)' : 'var(--muted)' }}>{set.active ? 'active' : 'inactive'}</small>
            </div>
            <div className="grid" style={{ marginTop: 12, gridTemplateColumns: 'repeat(6, 1fr)' }}>
              {(set.iconsArray ?? []).map((entry, idx) => {
                const icon = typeof entry.icon === 'object' && entry.icon ? (entry.icon as IconDoc) : null
                return (
                  <div className="icon-tile" key={entry.id ?? idx}>
                    {icon?.svgString ? <SvgFromString svg={icon.svgString} /> : null}
                    <small>{entry.name ?? icon?.filename ?? ''}</small>
                  </div>
                )
              })}
            </div>
          </div>
        ))
      )}

      <h2>Single-icon lookup</h2>
      <p className="lead" style={{ marginBottom: 12 }}>
        It is best to keep icon sets set icon names identical, that way they can be used interchangeably by name in the front end. Otherwise when you
        change the active icon set, the icons will not be found and the warning icon will be rendered.
      </p>
      <p className="lead" style={{ marginBottom: 12 }}>
        You will need to reload the page to see the new icons.
      </p>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
        <IconChildTile name="arrow-right" />
        <IconChildTile name="check" />
        <IconChildTile name="cog" />
        <IconChildTile name="heart" />
        <IconChildTile name="star" />
        <IconChildTile name="y" />
      </div>

      <h2>Live preview</h2>
      <p className="lead" style={{ marginBottom: 12 }}>
        Edits propagate to this page in real time. Open the active set at <a href="/admin/collections/iconSet/1">/admin/collections/iconSet/1</a>,
        rename the <code>x</code> icon to <code>y</code>, and press <code>Ctrl + S</code> to save a draft — the warning tile above turns into the
        actual icon as soon as the draft is saved.
      </p>

      <h2>Intended usage</h2>
      <p className="lead" style={{ marginBottom: 12 }}>
        Render icons by <strong>name</strong> from inside a server component. <code>getCached</code> is bound to the currently active{' '}
        <code>iconSet</code>, so swapping the active set in the admin re-routes every consumer to the new visuals without changing a single line of
        frontend code.
      </p>

      <h3 style={{ margin: '24px 0 8px', fontSize: '1rem' }}>
        1 — The bundled <code>&lt;Icon&gt;</code> component
      </h3>
      <p className="lead" style={{ marginBottom: 12 }}>
        Same path the tiles above use — exactly what this page does. Import the server component from the <code>./Icon</code> subpath and pass the
        icon&apos;s name from the active set. JSX props you pass win over the SVG source&apos;s intrinsic attributes, so <code>className</code>,{' '}
        <code>style</code>, etc. all work.
      </p>
      <CodeBlock lang="tsx">{`import { Icon } from '@pro-laico/icons/Icon'

// Anywhere in a server tree:
<Icon name="check" />
<Icon name="check" className="size-6 text-primary" />
<Icon name="logo" fallback={myCustomSvgString} />`}</CodeBlock>
      <p className="lead" style={{ margin: '12px 0' }}>
        Under the hood it&apos;s the same manual ceremony the older versions of this template ran inline — kept here for reference so you can see
        exactly what the component encapsulates:
      </p>
      <CodeBlock lang="tsx">{`import { draftMode } from 'next/headers'
import getCached from '@pro-laico/core/cache/auto'
import { extractSvgContent, extractSvgProps } from '@pro-laico/icons'

async function IconByHand({ name }: { name: string }) {
  const { isEnabled: draft } = await draftMode()
  const iconSet = await getCached('iconSet', draft)
  const svg = await getCached('icon', name, draft, iconSet)
  if (!svg) return <WarningFallback />
  return (
    <svg
      {...extractSvgProps(svg)}
      dangerouslySetInnerHTML={{ __html: extractSvgContent(svg) }}
    />
  )
}`}</CodeBlock>

      <h3 style={{ margin: '24px 0 8px', fontSize: '1rem' }}>2 — Editor-driven via the IconChild block</h3>
      <p className="lead" style={{ marginBottom: 12 }}>
        In a project that uses <code>@pro-laico/atomic</code>&apos;s children system, register <code>IconChild</code> on a blocks field. Editors then
        pick an icon by name from the active set in the admin UI, and the block renders with the same caching + warning-fallback behavior shown above.
      </p>
      <CodeBlock lang="tsx">{`import { Icon as IconChildBlock } from '@pro-laico/icons/blocks/iconChild/block'
import { IconChild } from '@pro-laico/icons/blocks/iconChild/component'

// Payload config — expose it as a child block on whatever blocks field hosts children:
{
  type: 'blocks',
  name: 'children',
  blocks: [IconChildBlock, /* …other children… */],
}

// Render path — IconChild is an async server component:
<IconChild block={childData} pt={passThroughProps} />`}</CodeBlock>

      <h3 style={{ margin: '24px 0 8px', fontSize: '1rem' }}>
        3 — Why <code>getCached</code> over a direct <code>payload.find</code>
      </h3>
      <p className="lead" style={{ marginBottom: 12 }}>
        Each <code>getCached</code> call is wrapped in <code>unstable_cache</code> with a tag derived from what it returns — the active{' '}
        <code>iconSet</code> sits behind the <code>iconSet</code> tag, and each individual <code>icon</code> sits behind <code>icon:&lt;id&gt;</code>.
        The icons plugin emits the matching <code>revalidateTag</code> calls on the relevant Payload collection hooks, so:
      </p>
      <ul className="lead" style={{ marginTop: 0, marginBottom: 12, paddingLeft: 20 }}>
        <li>
          Editing the active <code>iconSet</code> (re-ordering its array, swapping which icon a name points at, marking a different set active)
          invalidates only the <code>iconSet</code> tag. Pages re-render with the new mapping, but every individual icon&apos;s SVG payload stays
          cached.
        </li>
        <li>
          Editing one <code>icon</code> doc (uploading a new SVG) invalidates only that icon&apos;s tag. Pages that don&apos;t reference that name
          stay fully cached; pages that do re-render just the affected <code>&lt;Icon&gt;</code> tile, not the surrounding tree.
        </li>
        <li>
          Editing an <em>inactive</em> iconSet or an <em>unused</em> icon invalidates nothing user-facing — the active tag set is unaffected, so cache
          hits stay maximized.
        </li>
      </ul>
      <p className="lead" style={{ marginBottom: 12 }}>
        Reaching for <code>payload.find</code> directly works, but every consumer pays the full DB round-trip on every render. <code>getCached</code>{' '}
        trades that for a tag-scoped <code>unstable_cache</code> entry that the plugin keeps in sync for you.
      </p>
    </main>
  )
}
