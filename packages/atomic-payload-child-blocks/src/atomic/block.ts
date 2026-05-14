import { AtomicRowLabelPath as AtomicPath } from '../components/admin'
import { ClassNameField } from '@pro-laico/ap-utils'
import { ColoredEnd } from '../fields/coloredEnd'
import { TrackingTab } from '../fields/trackingTab'
import { AtomicChildSettingsTab } from '../fields/tabs/settings'
import { TriggerActionsTab, ContentActionsTab } from '../fields/tabs/actions'
import { inputTab } from '../fields/tabs/submitForm/input'
import { formRateLimitTab, formSanitationTab, formValidationTab } from '../fields/tabs/submitForm/form'
import type { DepthControls } from '@pro-laico/atomic-payload-types'
import type { NonRecursiveChildBlockType } from '@pro-laico/atomic-payload-types/schema'
import { AtomicBlockControlBar } from './controlBar'
import type { Block, BlocksField } from 'payload'

const d = {
  trigger:
    'The trigger is the actual button element. You can add what the button element renders inside it, such as text, icons, or anything else.',
  ariaLabel: 'Accessibility label for screen readers.',
  content: 'Used for all blocks, except non portal button blocks.',
  svr: '( Sanitation | Validation | Rate Limiting ) Used for form and input blocks.',
  screenReaderText: 'Text specifically for screen readers. Required if no visible text is present.',
  actions: 'Used to perform actions, but can also be used to receive data on other actions being performed.',
  contentTab:
    'Content is the element itself, and what is rendered inside it. If you set the Atomic Block to (Button + Open Portal), this is the content inside of the opened portal.',
}
//let count = 0
const contentClassNameField = ClassNameField({ label: 'Content Atomic Classes' })
const triggerClassNameField = ClassNameField({ namePrefix: 'trigger', label: 'Trigger Atomic Classes' })

const NonRecursiveChildBlocks: NonRecursiveChildBlockType[] = [
  'SimpleTextChild',
  'RichTextChild',
  'ImageChild',
  'VideoChild',
  'IconChild',
  'SVGChild',
]

/** Do not use this anywhere. Only use the files default export. */
export function AtomicBlockFactory({ depthControls }: { depthControls: DepthControls }): Block {
  const { cd, cmd, td, tmd } = depthControls

  const childrenBase: Omit<BlocksField, 'name'> = {
    type: 'blocks',
    blocks: [],
    admin: { initCollapsed: true },
    typescriptSchema: [() => ({ $ref: `#/definitions/ChildBlocks` })],
  }

  const cb: BlocksField = {
    ...childrenBase,
    name: 'children',
    blockReferences: [...NonRecursiveChildBlocks],
    admin: { ...childrenBase.admin, condition: (_, sd) => Boolean(sd.type !== 'input') },
  }
  if (cd < cmd) cb.blockReferences?.unshift(AtomicBlockFactory({ depthControls: { ...depthControls, cd: cd + 1 } }))

  const tcb: BlocksField = { ...childrenBase, name: 'triggerChildren', blockReferences: [...NonRecursiveChildBlocks] }
  if (td < tmd) tcb.blockReferences?.unshift(AtomicBlockFactory({ depthControls: { cd: td + 1, cmd: tmd, td: td + 1, tmd } }))

  const atomicBlock: Block = {
    slug: 'AtomicChild',
    interfaceName: 'AtomicChild',
    labels: { singular: 'Atomic', plural: 'Atomic' },
    admin: { components: { Label: { path: AtomicPath } } },
    fields: [
      AtomicBlockControlBar,
      {
        type: 'tabs',
        tabs: [
          {
            label: 'Content',
            admin: { description: d.content },
            fields: [
              {
                type: 'group',
                label: 'Content',
                admin: {
                  hideGutter: true,
                  description: d.contentTab,
                  condition: (_, sd) => Boolean(sd?.type !== 'button' || (sd?.type === 'button' && sd?.buttonType === 'portal')),
                },
                fields: [contentClassNameField, cb],
              },
            ],
          },
          {
            label: 'Trigger',
            admin: { description: d.trigger },
            fields: [
              {
                type: 'group',
                label: 'Trigger',
                admin: { hideGutter: true, condition: (_, sd) => Boolean(sd?.type === 'button') },
                fields: [
                  triggerClassNameField,
                  {
                    type: 'row',
                    fields: [
                      { type: 'text', name: 'ariaLabel', admin: { description: d.ariaLabel, width: '50%' } },
                      { type: 'text', name: 'screenReaderText', admin: { description: d.screenReaderText, width: '50%' } },
                    ],
                  },
                  tcb,
                ],
              },
            ],
          },
          { label: 'Actions', admin: { description: d.actions }, fields: [TriggerActionsTab, ContentActionsTab] },
          { label: 'SVR', admin: { description: d.svr }, fields: [formRateLimitTab, formSanitationTab, formValidationTab, inputTab] },
          AtomicChildSettingsTab,
          TrackingTab,
        ],
      },
      ColoredEnd,
    ],
  }
  return atomicBlock
}

const AtomicBlock = AtomicBlockFactory({ depthControls: { cd: 0, cmd: 12, td: 0, tmd: 1 } })

export default AtomicBlock
