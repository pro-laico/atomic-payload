import { type Tab } from 'payload'
import { ActiveField } from '@/fields/active'
import { TestPathField } from '@/fields/testPath'
import { UniqueTitleField } from '@/fields/uniqueTitle'

export const SettingsTab = () => {
  const settingsField: Tab = {
    label: 'Settings',
    fields: [{ type: 'row', fields: [ActiveField(), UniqueTitleField('New Shortcut Set'), TestPathField] }],
  }

  return settingsField
}
