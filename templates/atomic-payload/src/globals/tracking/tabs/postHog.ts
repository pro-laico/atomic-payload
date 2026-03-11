import { TabAsField } from 'payload'

export const postHogTabField = () => {
  const storageField: TabAsField = {
    type: 'tab',
    label: 'PostHog',
    admin: { condition: (_, sd) => Boolean(sd?.postHogEnabled) },
    fields: [
      { name: 'postHogPublicKey', type: 'text', required: true },
      { name: 'postHogHost', type: 'text', defaultValue: 'https://us.i.posthog.com', required: true },
      {
        type: 'group',
        label: 'Feature Toggles',
        admin: { condition: (_, sd) => Boolean(sd?.postHogEnabled) },
        fields: [
          { name: 'enableAutoCapture', type: 'checkbox', defaultValue: true },
          { name: 'disableSessionRecording', type: 'checkbox', defaultValue: false },
          { name: 'disableSurveys', type: 'checkbox', defaultValue: false },
          { name: 'capturePerformance', type: 'checkbox', defaultValue: true },
        ],
      },
      {
        type: 'group',
        name: 'postHogAutoCaptureSettings',
        label: 'Auto Capture Settings',
        admin: { condition: (_, sd) => Boolean(sd?.postHogEnabled) },
        fields: [
          { name: 'urlAllowList', type: 'array', fields: [{ name: 'url', type: 'text' }] },
          { name: 'urlIgnoreList', type: 'array', fields: [{ name: 'url', type: 'text' }] },
        ],
      },
    ],
  }
  return storageField
}
