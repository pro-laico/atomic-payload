import { GroupField } from 'payload'
import { ActionBlocks } from '@/fields/blocks/actions'

type ActionsTab = (prefix: 'trigger' | 'content') => GroupField

export const ActionsTab: ActionsTab = (prefix) => {
  const actionTab: GroupField = {
    type: 'group',
    name: `${prefix}Actions`,
    interfaceName: 'allActions',
    label: false,
    admin: {
      hideGutter: true,
      condition: (_, sd) => {
        if (Boolean(sd.blockType === 'AtomicChild')) {
          if (prefix === 'trigger') return Boolean(sd.type === 'button')
          else if (prefix === 'content') return Boolean(sd.type !== 'button') || Boolean(sd.buttonType === 'portal')
        }
        return true
      },
    },
    fields: [
      ActionBlocks(prefix),
      {
        name: 'actions',
        type: 'json',
        admin: { readOnly: true, condition: (data) => data.devMode },
        typescriptSchema: [(jsonSchema) => ({ ...jsonSchema, type: 'array', items: { $ref: `#/definitions/ActionBlockType` } })],
      },
      {
        name: 'runners',
        type: 'json',
        admin: { readOnly: true, condition: (data) => data.devMode },
        typescriptSchema: [() => ({ $ref: `#/definitions/Runners` })],
      },
      {
        name: 'attributers',
        type: 'json',
        admin: { readOnly: true, condition: (data) => data.devMode },
        typescriptSchema: [() => ({ $ref: `#/definitions/Attributers` })],
      },
    ],
  }

  return actionTab
}

export const TriggerActionsTab: GroupField = ActionsTab('trigger')
export const ContentActionsTab: GroupField = ActionsTab('content')
