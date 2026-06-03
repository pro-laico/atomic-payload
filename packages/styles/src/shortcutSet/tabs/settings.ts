import type { Tab } from 'payload'

import { ActiveField, TestPathField, UniqueTitleField } from '@pro-laico/core'

export const ShortcutSettingsTab = (): Tab => ({
  label: 'Settings',
  fields: [{ type: 'row', fields: [ActiveField(), UniqueTitleField('New Shortcut Set'), TestPathField] }],
})
