import { ActiveField, TestPathField, UniqueTitleField } from '@pro-laico/core'
import type { Tab } from 'payload'

export const ShortcutSettingsTab = (): Tab => ({
  label: 'Settings',
  fields: [{ type: 'row', fields: [ActiveField(), UniqueTitleField('New Shortcut Set'), TestPathField] }],
})
