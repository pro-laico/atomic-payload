import type { CheckboxField } from 'payload'

export const DevModeField = (): CheckboxField => ({
  name: 'devMode',
  type: 'checkbox',
  required: true,
  admin: { style: { maxWidth: '100px', alignSelf: 'center' } },
})
