import type { ChildBlockType } from '@pro-laico/atomic/children/schema'
import type { BlocksField } from 'payload'

const AllChildBlocks: ChildBlockType[] = ['AtomicChild', 'SimpleTextChild', 'RichTextChild', 'ImageChild', 'VideoChild', 'IconChild', 'SVGChild']

/** Adds all children blocks to a collection or global. Do not use in anything other than a collection or global. */
export const ChildrenBlocksField: BlocksField = {
  name: 'children',
  type: 'blocks',
  blocks: [],
  admin: { initCollapsed: true },
  blockReferences: AllChildBlocks,
  labels: { singular: 'Child', plural: 'Children' },
  typescriptSchema: [() => ({ $ref: `#/definitions/ChildBlocks` })],
}
