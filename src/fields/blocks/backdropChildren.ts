import { BlocksField } from 'payload'

export const BackdropChildren: BlocksField = {
  name: 'backdropChildren',
  label: 'Blocks',
  type: 'blocks',
  blocks: [],
  blockReferences: ['SVGChild'],
  typescriptSchema: [() => ({ $ref: `#/definitions/BackdropChildren` })],
  admin: { description: 'You can add backdrop blocks that will be displayed in the portal backdrop div.' },
}
