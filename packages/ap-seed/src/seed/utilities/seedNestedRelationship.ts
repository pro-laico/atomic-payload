import type { Page } from '@pro-laico/ap-site/schema'
export function toPageRelationship({ title, slug, href, id }: Page) {
  return { title, slug, href, id }
}
