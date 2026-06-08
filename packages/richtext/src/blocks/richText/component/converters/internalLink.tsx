import type { SerializedLinkNode } from '@payloadcms/richtext-lexical'

export const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  // Never throw from a JSX converter: an uncaught throw inside convertLexicalToJSX
  // crashes the entire RichText subtree with no fallback. Degrade to '#' instead
  // when the relationship is missing or unpopulated (depth-0 fetch → string id).
  const doc = linkNode.fields.doc
  if (!doc) return '#'
  const { value } = doc
  if (!value || typeof value !== 'object') return '#'
  const href = (value as Record<string, unknown>).href
  return typeof href === 'string' && href ? href : '#'
}
