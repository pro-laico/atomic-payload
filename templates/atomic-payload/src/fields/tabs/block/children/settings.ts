import { TabAsField } from 'payload'
import { ChildBlockType } from '@/ts/types'
import type { Field, TextField } from 'payload'
import { StaticDataAttributesField } from '@/fields/staticDataAttributes'
import { PortalBackdropTab } from '@/fields/tabs/block/children/backdrop'
import {
  TagSettingsTab,
  FormSettingsTab,
  InputSettingsTab,
  LinkSettingsTab,
  DialogSettingsTab,
  PopoverSettingsTab,
} from '@pro-laico/atomic-payload-child-blocks/variant-settings'

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
