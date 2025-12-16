import { TabAsField } from 'payload'

export const googleTagManagerTabField = () => {
  const storageField: TabAsField = {
    type: 'tab',
    label: 'Google Tag Manager',
    admin: { condition: (_, siblingData) => siblingData?.googleTagManagerEnabled === true },
    fields: [
      {
        name: 'googleTagManagerId',
        type: 'text',
        label: 'Google Tag Manager ID',
        admin: { condition: (_, siblingData) => siblingData.googleTagManagerEnabled },
      },
    ],
  }
  return storageField
}
