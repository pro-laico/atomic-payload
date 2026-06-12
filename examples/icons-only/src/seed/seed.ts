import type { Payload } from 'payload'

import { sampleIconSets } from './sampleIcons'

export type SeededSet = {
  key: string
  title: string
  /** Filenames uploaded that didn't previously exist. */
  created: string[]
  /** Filenames that already existed and were deleted + re-uploaded. */
  replaced: string[]
  iconSet: 'created'
}

/**
 * Seeds every entry in `sampleIconSets`: uploads each set's SVGs to the `icon`
 * collection, then creates a matching `iconSet` doc.
 *
 * Re-running REPLACES the sample data rather than skipping it, following
 * Payload's own seed pattern (drop the target collections first, then write —
 * see the website template's `/endpoints/seed`). Concretely:
 *
 * - `iconSet` (pure data) — every existing doc is deleted up front.
 * - `icon` (an UPLOAD collection) — each filename we're about to write is
 *   deleted first via the high-level `payload.delete`, which removes the doc
 *   AND its file from disk. A raw `db.deleteMany` would orphan the files, and
 *   the next upload would then collide on the unique `filename` — exactly the
 *   gap the Payload template leaves open. Deleting through the operation keeps
 *   the database and the upload directory in sync without needing
 *   `overwriteExistingFiles`.
 *
 * Pure data logic, no HTTP/auth: the `/api/seed` route auth-gates and calls this;
 * the integration test calls it directly against a freshly-booted Payload.
 * `overrideAccess: true` makes the trusted server-side bypass explicit.
 */
export async function seedIcons({ payload }: { payload: Payload }): Promise<{ sets: SeededSet[] }> {
  // Clear the data collection wholesale before seeding so re-runs are
  // deterministic. iconSet is deleted first (and entirely) so it never holds a
  // dangling reference to an icon we're about to replace below.
  await payload.delete({ collection: 'iconSet', where: { id: { exists: true } }, overrideAccess: true })

  const sets: SeededSet[] = []

  for (const set of sampleIconSets) {
    const created: string[] = []
    const replaced: string[] = []
    const filenameToId = new Map<string, string | number>()

    for (const { filename, svg } of set.icons) {
      // Asset: delete any existing icon with this filename first so the upload
      // can't collide. The high-level delete removes the doc and its on-disk
      // file; its result tells us whether one existed (replaced vs created).
      const deleted = await payload.delete({ collection: 'icon', where: { filename: { equals: filename } }, overrideAccess: true })
      ;(deleted.docs.length > 0 ? replaced : created).push(filename)

      const doc = await payload.create({
        collection: 'icon',
        data: {},
        overrideAccess: true,
        file: { data: Buffer.from(svg, 'utf8'), name: filename, mimetype: 'image/svg+xml', size: Buffer.byteLength(svg, 'utf8') },
      })
      filenameToId.set(filename, doc.id)
    }

    const iconsArray = set.entries
      .map(({ name, filename }) => {
        const id = filenameToId.get(filename)
        return id ? { name, icon: id } : null
      })
      .filter(Boolean) as { name: string; icon: string | number }[]
    await payload.create({
      collection: 'iconSet',
      overrideAccess: true,
      data: { title: set.title, active: set.defaultActive, iconsArray, _status: 'published' },
    } as Parameters<typeof payload.create>[0])

    sets.push({ key: set.key, title: set.title, created, replaced, iconSet: 'created' })
  }

  return { sets }
}

/**
 * Clean-slate counterpart to {@link seedIcons}: deletes every `iconSet` and
 * `icon` (and each icon's stored file, via the high-level delete). `iconSet`
 * first so it never references an icon that's already been removed.
 */
export async function resetIcons({ payload }: { payload: Payload }): Promise<void> {
  await payload.delete({ collection: 'iconSet', where: { id: { exists: true } }, overrideAccess: true })
  await payload.delete({ collection: 'icon', where: { id: { exists: true } }, overrideAccess: true })
}
