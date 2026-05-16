import type { Page } from '@pro-laico/site/schema'
export function toPageRelationship({ title, slug, href, id }: Page) {
  return { title, slug, href, id }
}
