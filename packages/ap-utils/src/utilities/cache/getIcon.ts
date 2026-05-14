'use server'
import 'server-only' //DO NOT REMOVE
import { getPayload } from 'payload'
import type { GCFunction } from '@pro-laico/atomic-payload-types'
import cacheLogger from '../cacheLogger'
import { toTitleCase } from '../toTitleCase'

/** Type guard to check if icon is a string (when depth: 0, icon is always a string ID). */
const isIconString = (item: {
  name: string
  icon?: (string | null) | { id: string } | null
  id?: string | null
}): item is { name: string; icon: string; id?: string | null } => {
  return typeof item.icon === 'string' && item.icon.length > 0
}

/** Gets the active icon sets icons array. Specifically only the name and icon reference id of each icon. */
export const getCachedIconSet: GCFunction<'iconSet'> = async (configPromise, tag, draft) => {
  const payload = await getPayload({ config: configPromise })
  const results = (await payload
    .find({ collection: 'iconSet', depth: 0, limit: 1, draft, pagination: false, select: { iconsArray: true }, where: { active: { equals: true } } })
    .then((res) => res.docs[0] || null)) as { iconsArray?: Array<{ name: string; icon?: (string | null) | { id: string } | null; id?: string | null }> } | null

  const filteredResults = results?.iconsArray?.filter(isIconString).map(({ id, ...item }) => ({ name: item.name, icon: item.icon })) || []
  cacheLogger({ tag, draft })
  return { iconsArray: filteredResults }
}

/** Gets the SVG string that matches the passed in icon name, from the active icon set collection. */
export const getCachedIconByName: GCFunction<'icon'> = async (configPromise, tag, tid, draft, iconSet) => {
  if (!iconSet?.iconsArray) return
  const iconItem = iconSet.iconsArray.find((item) => item.name === tid)
  if (!iconItem?.icon || typeof iconItem.icon !== 'string') return
  const payload = await getPayload({ config: configPromise })
  const icon = await payload
    .find({ collection: 'icon', limit: 1, draft, where: { id: { equals: iconItem.icon } } })
    .then((res) => res.docs[0] || null)
  cacheLogger({ tag, tid, draft })
  return icon?.svgString || undefined
}

/** Formats the icon set into a list of options for the icon select field. */
export const getCachedIconOptions: GCFunction<'icon-options'> = async (_configPromise, tag, draft, iconSet) => {
  cacheLogger({ tag, draft })
  return iconSet?.iconsArray?.map((icon) => ({ value: icon.name, label: toTitleCase(icon.name) })) || []
}
