import { BlocksField } from 'payload'
import { ActionBlocksPath } from '@/ui'
import { ActionBlockType } from '@/ts/types'

const AllActionBlocks: ActionBlockType[] = [
  'ActSetCC',
  'ActCCToDA',
  'ActSetTheme',
  'ActResetForm',
  'ActDSSetBool',
  'ActSubmitForm',
  'ActDSBoolToDA',
  'ActDSTextToDA',
  'ActDSCycleText',
  'ActFormErrorToDA',
  'ActSetPortalOpen',
  'ActFormStatusToDA',
]

export const ActionBlocks = (prefix: 'trigger' | 'content'): BlocksField => {
  return {
    type: 'blocks',
    name: 'actionBlocks',
    blocks: [],
    label: `${prefix.charAt(0).toUpperCase() + prefix.slice(1)} Actions`,
    blockReferences: AllActionBlocks,
    typescriptSchema: [() => ({ $ref: `#/definitions/ActionBlocks` })],
    admin: { initCollapsed: true, components: { Field: { path: ActionBlocksPath, clientProps: { placement: prefix } } } },
  }
}
