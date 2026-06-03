import type { TabAsField } from 'payload'

import { requiredWhenEnabled } from './validators'

export const postHogTabField = (): TabAsField => {
  const storageField: TabAsField = {
    type: 'tab',
    label: 'PostHog',
    admin: { condition: (_, sd) => Boolean(sd?.postHogEnabled) },
    fields: [
      {
        name: 'postHogPublicKey',
        type: 'text',
        validate: requiredWhenEnabled('postHogEnabled', 'PostHog public key is required when PostHog is enabled'),
      },
      {
        name: 'postHogHost',
        type: 'text',
        defaultValue: 'https://us.i.posthog.com',
        validate: requiredWhenEnabled('postHogEnabled', 'PostHog host is required when PostHog is enabled'),
      },
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
