import type { Payload } from 'payload'

import { sampleDesignSet, sampleHomePage, sampleShortcutSet } from './sampleSets'

export type SeedStylesResult = Record<'shortcutSet' | 'designSet' | 'page', 'created' | 'exists'>

/**
 * Creates the demo `shortcutSet`, `designSet`, and home `page`. Idempotent —
 * skips any doc whose title/href already exists.
 *
 * Order matters: the `shortcutSet` and `designSet` are created first so that when
 * the home page's `cssHook` runs last, the active shortcuts and design tokens are
 * available and get folded into the generated stylesheet. Each save runs the CSS
 * processor and writes the result to the `draftStorage` + `publishedStorage`
 * globals.
 *
 * Pure data logic, no HTTP/auth: the `/api/seed` route auth-gates and calls this;
 * the integration test calls it directly. `overrideAccess: true` makes the
 * trusted server-side bypass explicit.
 */
export async function seedStyles({ payload }: { payload: Payload }): Promise<SeedStylesResult> {
  const result: SeedStylesResult = { shortcutSet: 'exists', designSet: 'exists', page: 'exists' }

  const existingShortcut = await payload.find({
    collection: 'shortcutSet',
    where: { title: { equals: sampleShortcutSet.title } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  if (existingShortcut.docs.length === 0) {
    await payload.create({ collection: 'shortcutSet', overrideAccess: true, data: sampleShortcutSet } as Parameters<typeof payload.create>[0])
    result.shortcutSet = 'created'
  }

  const existingDesign = await payload.find({
    collection: 'designSet',
    where: { title: { equals: sampleDesignSet.title } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  if (existingDesign.docs.length === 0) {
    await payload.create({ collection: 'designSet', overrideAccess: true, data: sampleDesignSet } as Parameters<typeof payload.create>[0])
    result.designSet = 'created'
  }

  const existingPage = await payload.find({
    collection: 'pages',
    where: { href: { equals: sampleHomePage.href } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  if (existingPage.docs.length === 0) {
    await payload.create({ collection: 'pages', overrideAccess: true, data: sampleHomePage } as Parameters<typeof payload.create>[0])
    result.page = 'created'
  }

  return result
}
