import type { Tab } from 'payload'
import { ActiveField } from '@pro-laico/atomic-payload-apf'
import { TestPathField, UniqueTitleField } from '@pro-laico/ap-utils'

export const ShortcutSettingsTab = (): Tab => ({
  label: 'Settings',
  fields: [{ type: 'row', fields: [ActiveField(), UniqueTitleField('New Shortcut Set'), TestPathField] }],
})
