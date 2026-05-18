import type { SerializedLinkNode } from '@payloadcms/richtext-lexical'

export const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  if (!linkNode.fields.doc) throw new Error('Expected linkNode to have a doc')
  const { value } = linkNode.fields.doc
  if (typeof value !== 'object') throw new Error('Expected value to be an object')

  return value.href as string
}
