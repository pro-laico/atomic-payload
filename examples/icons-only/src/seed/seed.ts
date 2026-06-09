import type { Payload } from 'payload'

import { sampleIconSets } from './sampleIcons'

export type SeededSet = {
  key: string
  title: string
  created: string[]
  skipped: string[]
  iconSet: 'created' | 'exists'
}

/**
 * Seeds every entry in `sampleIconSets`: uploads each set's SVGs to the `icon`
 * collection, then creates a matching `iconSet` doc. Idempotent — skips any icon
 * whose `filename` already exists and any iconSet whose `title` already exists.
 *
 * Pure data logic, no HTTP/auth: the `/api/seed` route auth-gates and calls this;
 * the integration test calls it directly against a freshly-booted Payload.
 * `overrideAccess: true` makes the trusted server-side bypass explicit.
 */
export async function seedIcons({ payload }: { payload: Payload }): Promise<{ sets: SeededSet[] }> {
  const sets: SeededSet[] = []

  for (const set of sampleIconSets) {
    const created: string[] = []
    const skipped: string[] = []
    const filenameToId = new Map<string, string | number>()

    for (const { filename, svg } of set.icons) {
      const existing = await payload.find({ collection: 'icon', where: { filename: { equals: filename } }, limit: 1, depth: 0, overrideAccess: true })
      if (existing.docs.length > 0) {
        skipped.push(filename)
        filenameToId.set(filename, existing.docs[0].id)
        continue
      }
      const doc = await payload.create({
        collection: 'icon',
        data: {},
        overrideAccess: true,
        file: { data: Buffer.from(svg, 'utf8'), name: filename, mimetype: 'image/svg+xml', size: Buffer.byteLength(svg, 'utf8') },
      })
      created.push(filename)
      filenameToId.set(filename, doc.id)
    }

    let iconSet: 'created' | 'exists' = 'exists'
    const existingSet = await payload.find({
      collection: 'iconSet',
      where: { title: { equals: set.title } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    if (existingSet.docs.length === 0) {
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
      iconSet = 'created'
    }

    sets.push({ key: set.key, title: set.title, created, skipped, iconSet })
  }

  return { sets }
}
