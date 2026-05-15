import type { Tab } from 'payload'
import { ActiveField } from '@pro-laico/ap-core'
import { TestPathField, UniqueTitleField } from '@pro-laico/ap-core'

export const ShortcutSettingsTab = (): Tab => ({
  label: 'Settings',
  fields: [{ type: 'row', fields: [ActiveField(), UniqueTitleField('New Shortcut Set'), TestPathField] }],
})
