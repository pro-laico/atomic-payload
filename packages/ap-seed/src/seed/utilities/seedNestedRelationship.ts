import type { Page } from '@pro-laico/atomic-payload-types/schema'

export function toPageRelationship({ title, slug, href, id }: Page) {
  return { title, slug, href, id }
}
