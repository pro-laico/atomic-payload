import 'server-only'

import { cache } from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export type FontRole = 'display' | 'sans' | 'serif' | 'mono'

/** Roles in the order the page presents them. */
const FONT_ROLES: FontRole[] = ['display', 'sans', 'serif', 'mono']

/** A role and the title of the font selected for it in the `fontSet` global. */
export type ActiveFont = { role: FontRole; title: string }

type FontDoc = { title?: string | null }
type FontSetGlobal = Partial<Record<FontRole, FontDoc | string | null>>

/**
 * Reads the active font selection (role → font title) from the `fontSet` global,
 * so the page can label which fonts are active. Wrapped in React `cache()` so it
 * runs once per request; the route is `force-dynamic`, so changes show up on the
 * next render.
 */
export const getActiveFonts = cache(async (): Promise<ActiveFont[]> => {
  const payload = await getPayload({ config: configPromise })
  const fontSet = (await payload.findGlobal({ slug: 'fontSet', depth: 1, overrideAccess: true })) as FontSetGlobal

  const active: ActiveFont[] = []
  for (const role of FONT_ROLES) {
    const doc = fontSet?.[role]
    if (doc && typeof doc === 'object') active.push({ role, title: doc.title ?? role })
  }
  return active
})
