import type { Field } from 'payload'

import { requiredWhenEnabled } from './validators'

/** Google Tag Manager settings as an unnamed (presentational) group — its fields
 *  sit at the `Tracking` root, shown only when `googleTagManagerEnabled` is on. */
export const googleTagManagerGroup = (): Field => ({
  type: 'group',
  label: 'Google Tag Manager',
  admin: { condition: (_, sd) => Boolean(sd?.googleTagManagerEnabled) },
  fields: [
    {
      name: 'googleTagManagerId',
      type: 'text',
      label: 'Google Tag Manager ID',
      validate: requiredWhenEnabled('googleTagManagerEnabled', 'Google Tag Manager ID is required when GTM is enabled'),
      admin: { condition: (_, sd) => Boolean(sd?.googleTagManagerEnabled) },
    },
  ],
})
