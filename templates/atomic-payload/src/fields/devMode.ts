import { CheckboxField } from 'payload'

export const DevModeField = (): CheckboxField => {
  const devModeField: CheckboxField = {
    name: 'devMode',
    type: 'checkbox',
    required: true,
    admin: { style: { maxWidth: '100px', alignSelf: 'center' } },
  }
  return devModeField
}
