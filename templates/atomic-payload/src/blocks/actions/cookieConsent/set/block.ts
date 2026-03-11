import type { Block } from 'payload'
import { APField } from '@/fields/apf'
import { KeySelectField, ChangeKeyField, SetDataField, PerformSelectField } from '@/fields/actions'

export const ActSetCC: Block = {
  slug: 'ActSetCC',
  interfaceName: 'ActSetCC',
  admin: { group: 'Cookie Consent' },
  labels: { singular: 'Set Cookie Consent', plural: 'Set Cookie Consent' },
  fields: [
    PerformSelectField({ set: 'cookieConsent' }),
    APField({ type: 'checkbox', apf: ['actions'], name: 'acceptAll', admin: { condition: (_, sd) => Boolean(sd?.perform === 'accept') } }),
    KeySelectField({ set: 'cookieConsent', label: 'Set Preference', admin: { condition: (_, sd) => Boolean(sd?.perform === 'preference') } }),
    SetDataField(),
    ChangeKeyField({ admin: { condition: (_, sd) => Boolean(sd?.setDA) } }),
  ],
}
