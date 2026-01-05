import type { Page } from '@/ts/types'

export function toPageRelationship({ title, slug, href, id }: Page) {
  return { title, slug, href, id }
}
