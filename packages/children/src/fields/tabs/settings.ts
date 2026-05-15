import type { Field, TabAsField, TextField } from 'payload'
import type { ChildBlockType } from '@pro-laico/children/schema'
import { StaticDataAttributesField } from '../staticDataAttributes'
import { PortalBackdropTab } from './backdrop'
import { TagSettingsTab } from '../../atomic/variants/tag/settings'
import { FormSettingsTab } from '../../atomic/variants/form/settings'
import { InputSettingsTab } from '../../atomic/variants/input/settings'
import { LinkSettingsTab } from '../../atomic/variants/button/variants/link/settings'
import { DialogSettingsTab } from '../../atomic/variants/button/variants/portal/dialog/settings'
import { PopoverSettingsTab } from '../../atomic/variants/button/variants/portal/popover/settings'

const d = {
  tab: 'Whichever block type is selected, this tab will contain the non control bar settings for that block type.',
  cid: 'Sets the components anchor ID, which can be used in anchor links.',
}

const cidField: TextField = { name: 'cid', type: 'text', label: 'Anchor ID', admin: { description: d.cid } }

export const ChildsSettingsTab = (childBlock: ChildBlockType) => {
  let fields: Field[] | undefined = undefined

  switch (childBlock) {
    case 'AtomicChild':
      fields = [
        cidField,
        TagSettingsTab,
        FormSettingsTab,
        LinkSettingsTab,
        InputSettingsTab,
        PortalBackdropTab,
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
