import type { DepthControls } from '@pro-laico/atomic/children'
import type { NonRecursiveChildBlockType } from '@pro-laico/atomic/children/schema'
import type { ClassNameFieldWrapper } from '@pro-laico/core'
import type { Block, BlocksField } from 'payload'

import { AtomicRowLabelPath as AtomicPath } from '../components/admin'
import { ColoredEnd } from '../fields/coloredEnd'
import { ContentActionsTab, TriggerActionsTab } from '../fields/tabs/actions'
import { ChildsSettingsTab } from '../fields/tabs/settings'
import { formRateLimitTab, formSanitationTab, formValidationTab } from '../fields/tabs/submitForm/form'
import { inputTab } from '../fields/tabs/submitForm/input'
import { TrackingTab } from '../fields/trackingTab'
import { AtomicBlockControlBar } from './controlBar'

const d = {
  trigger: 'The trigger is the actual button element. You can add what the button element renders inside it, such as text, icons, or anything else.',
  ariaLabel: 'Accessibility label for screen readers.',
  content: 'Used for all blocks, except non portal button blocks.',
  svr: '( Sanitation | Validation | Rate Limiting ) Used for form and input blocks.',
  screenReaderText: 'Text specifically for screen readers. Required if no visible text is present.',
  actions: 'Used to perform actions, but can also be used to receive data on other actions being performed.',
  contentTab:
    'Content is the element itself, and what is rendered inside it. If you set the Atomic Block to (Button + Open Portal), this is the content inside of the opened portal.',
}
//let count = 0
const NonRecursiveChildBlocks: NonRecursiveChildBlockType[] = [
  'SimpleTextChild',
  'RichTextChild',
  'ImageChild',
  'VideoChild',
  'IconChild',
  'SVGChild',
]

/** Options for {@link AtomicBlockFactory}. */
export interface AtomicBlockFactoryOptions {
  depthControls: DepthControls
  /**
   * The `@pro-laico/styles` `ClassNameField` (or a compatible wrapper). When
   * supplied, the content, trigger, and portal-backdrop atomic classes fields
   * are added at their canonical spots. Omit it (the default) to ship the block
   * without any CSS dependency. Threaded through the recursive child/trigger
   * `AtomicChild` references.
   */
  classNameField?: ClassNameFieldWrapper
}

/** Do not use this anywhere. Only use the files default export. */
export function AtomicBlockFactory({ depthControls, classNameField }: AtomicBlockFactoryOptions): Block {
  const { cd, cmd, td, tmd } = depthControls

  const contentClassNameField = classNameField ? [classNameField({ label: 'Content Atomic Classes' })] : []
  const triggerClassNameField = classNameField ? [classNameField({ namePrefix: 'trigger', label: 'Trigger Atomic Classes' })] : []

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
  if (cd < cmd) cb.blockReferences?.unshift(AtomicBlockFactory({ depthControls: { ...depthControls, cd: cd + 1 }, classNameField }))

  const tcb: BlocksField = { ...childrenBase, name: 'triggerChildren', blockReferences: [...NonRecursiveChildBlocks] }
  if (td < tmd) tcb.blockReferences?.unshift(AtomicBlockFactory({ depthControls: { cd: td + 1, cmd: tmd, td: td + 1, tmd }, classNameField }))

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
                fields: [...contentClassNameField, cb],
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
                  ...triggerClassNameField,
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
          ChildsSettingsTab('AtomicChild', { classNameField }),
          TrackingTab,
        ],
      },
      ColoredEnd,
    ],
  }
  return atomicBlock
}

/** Default nesting limits for the top-level `AtomicChild` block: content nests
 *  up to 12 deep, trigger children up to 1 deep. */
export const defaultAtomicDepthControls: DepthControls = { cd: 0, cmd: 12, td: 0, tmd: 1 }

/** The default `AtomicChild` block, with no className field. */
const AtomicBlock = AtomicBlockFactory({ depthControls: defaultAtomicDepthControls })

export default AtomicBlock
