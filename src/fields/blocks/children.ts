import { BlocksField } from 'payload'
import { ChildBlockType } from '@/ts/types'

const AllChildBlocks: ChildBlockType[] = ['AtomicChild', 'SimpleTextChild', 'RichTextChild', 'ImageChild', 'VideoChild', 'IconChild', 'SVGChild']

/** Adds all children blocks to a collection or global. Do not use in anything other than a collection or global.*/
export const ChildrenBlocks: BlocksField = {
  name: 'children',
  type: 'blocks',
  blocks: [],
  admin: { initCollapsed: true },
  blockReferences: AllChildBlocks,
  labels: { singular: 'Child', plural: 'Children' },
  typescriptSchema: [() => ({ $ref: `#/definitions/ChildBlocks` })],
}
