import 'server-only'

import { cache } from 'react'
import { type CollectionSlug, getPayload } from 'payload'

import { toTitleCase } from '@pro-laico/core'
import { getPayloadConfig } from '@pro-laico/core/config'
import { mt, withCache } from '@pro-laico/core/cache/primitives'

/** The active icon set's icons array — name + icon reference id only. The `icon`
 *  ref is a string under Mongo (ObjectId) and a number under SQLite / Postgres-serial. */
export type IconSetReturn = { iconsArray: { name: string; icon: string | number }[] }

/** Usable-reference guard: with `depth: 0` Payload returns the relationship as its id. */
const isIconRef = (item: {
  name: string
  icon?: string | number | { id: string | number } | null
  id?: string | number | null
}): item is { name: string; icon: string | number; id?: string | number | null } => {
  if (typeof item.icon === 'string') return item.icon.length > 0
  if (typeof item.icon === 'number') return true
  return false
}

/** The active icon set's icons (name + ref). */
export const getCachedIconSet = cache(
  (draft: boolean): Promise<IconSetReturn> =>
    withCache(
      async () => {
        const payload = await getPayload({ config: getPayloadConfig() })
        const results = (await payload
          .find({
            collection: 'iconSet' as CollectionSlug,
            depth: 0,
            limit: 1,
            draft,
            pagination: false,
            select: { iconsArray: true },
            where: { active: { equals: true } },
          })
          .then((res) => res.docs[0] || null)) as {
          iconsArray?: Array<{ name: string; icon?: string | number | { id: string | number } | null; id?: string | number | null }>
        } | null
        const iconsArray = results?.iconsArray?.filter(isIconRef).map((item) => ({ name: item.name, icon: item.icon })) || []
        return { iconsArray }
      },
      { tag: 'iconSet', draft },
    ),
)

/** The SVG string for an icon name, resolved through the active icon set. */
export const getCachedIconByName = cache((name: string, draft: boolean, iconSet: IconSetReturn | undefined): Promise<string | undefined> => {
  const iconItem = iconSet?.iconsArray?.find((item) => item.name === name)
  const extraTags = [mt(['iconSet', draft ? 'draft' : undefined]), iconItem?.icon != null ? mt(['icon', iconItem.icon]) : undefined]
  return withCache(
    async () => {
      if (iconItem?.icon == null) return undefined
      if (typeof iconItem.icon !== 'string' && typeof iconItem.icon !== 'number') return undefined
      const payload = await getPayload({ config: getPayloadConfig() })
      const icon = (await payload
        .find({ collection: 'icon' as CollectionSlug, limit: 1, draft, where: { id: { equals: iconItem.icon } } })
        .then((res) => res.docs[0] || null)) as { svgString?: string | null } | null
      return icon?.svgString || undefined
    },
    { tag: 'icon', tid: name, draft, extraTags },
  )
})

/** The icon set as `{ label, value }` options for the icon select field. */
export const getCachedIconOptions = cache(
  (draft: boolean, iconSet: IconSetReturn | undefined): Promise<{ label: string; value: string }[]> =>
    withCache(async () => iconSet?.iconsArray?.map((icon) => ({ value: icon.name, label: toTitleCase(icon.name) })) || [], {
      tag: 'icon-options',
      draft,
      extraTags: [mt(['iconSet', draft ? 'draft' : undefined])],
    }),
)
