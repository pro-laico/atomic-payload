import type { Block } from 'payload'
import { KeySelectField, ChangeKeyField, ListenSelectField } from '@pro-laico/atomic/actions/fields'

export const ActCCToDA: Block = {
  slug: 'ActCCToDA',
  interfaceName: 'ActCCToDA',
  admin: { group: 'Cookie Consent' },
  labels: { singular: 'Cookie Consent To Data Attribute', plural: 'Cookie Consent To Data Attribute' },
  fields: [
    ListenSelectField({ set: 'cookieConsent' }),
    KeySelectField({ set: 'cookieConsent', admin: { condition: (_, sd) => Boolean(sd?.listen === 'preference') } }),
    ChangeKeyField(),
  ],
}
