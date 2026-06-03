import type { ChildBlockType } from '@pro-laico/atomic/children/schema'
import type { ClassNameFieldWrapper } from '@pro-laico/core'
import type { Field, TabAsField, TextField } from 'payload'

import { LinkSettingsTab } from '../../atomic/variants/button/variants/link/settings'
import { DialogSettingsTab } from '../../atomic/variants/button/variants/portal/dialog/settings'
import { PopoverSettingsTab } from '../../atomic/variants/button/variants/portal/popover/settings'
import { FormSettingsTab } from '../../atomic/variants/form/settings'
import { InputSettingsTab } from '../../atomic/variants/input/settings'
import { TagSettingsTab } from '../../atomic/variants/tag/settings'
import { StaticDataAttributesField } from '../staticDataAttributes'
import { createPortalBackdropTab } from './backdrop'

const d = {
  tab: 'Whichever block type is selected, this tab will contain the non control bar settings for that block type.',
  cid: 'Sets the components anchor ID, which can be used in anchor links.',
}

const cidField: TextField = { name: 'cid', type: 'text', label: 'Anchor ID', admin: { description: d.cid } }

/** Extra options for {@link ChildsSettingsTab}. */
export interface ChildsSettingsTabOptions {
  /**
   * The `@pro-laico/styles` `ClassNameField` (or compatible wrapper), threaded
   * down to the portal backdrop group (only used by the `AtomicChild` branch).
   */
  classNameField?: ClassNameFieldWrapper
}

export const ChildsSettingsTab = (childBlock: ChildBlockType, { classNameField }: ChildsSettingsTabOptions = {}) => {
  let fields: Field[] | undefined

  switch (childBlock) {
    case 'AtomicChild':
      fields = [
        cidField,
        TagSettingsTab,
        FormSettingsTab,
        LinkSettingsTab,
        InputSettingsTab,
        createPortalBackdropTab({ classNameField }),
        DialogSettingsTab,
        PopoverSettingsTab,
        StaticDataAttributesField('trigger'),
        StaticDataAttributesField('content'),
      ]
      break
  }

  if (fields === undefined) fields = [cidField, StaticDataAttributesField('content')]
  const childSettingsTabField: TabAsField = { type: 'tab', label: 'Settings', admin: { description: d.tab }, fields }
  return childSettingsTabField
}

export const AtomicChildSettingsTab: TabAsField = ChildsSettingsTab('AtomicChild')
