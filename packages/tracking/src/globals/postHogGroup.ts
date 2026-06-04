import type { Field } from 'payload'

import { requiredWhenEnabled } from './validators'

/** PostHog settings as an unnamed (presentational) group — its fields sit at the
 *  `Tracking` root, shown only when `postHogEnabled` is on. */
export const postHogGroup = (): Field => ({
  type: 'group',
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
    { name: 'enableAutoCapture', type: 'checkbox', defaultValue: true },
    {
      type: 'group',
      name: 'postHogAutoCaptureSettings',
      label: 'Auto Capture Settings',
      admin: { condition: (_, sd) => Boolean(sd?.postHogEnabled) && Boolean(sd?.enableAutoCapture) },
      fields: [
        { name: 'urlAllowList', type: 'array', fields: [{ name: 'url', type: 'text' }] },
        { name: 'urlIgnoreList', type: 'array', fields: [{ name: 'url', type: 'text' }] },
      ],
    },
  ],
})
