import { PerformSelectField } from '@pro-laico/atomic/actions/fields'
import type { Block } from 'payload'

export const ActSetTheme: Block = {
  slug: 'ActSetTheme',
  admin: { group: 'Theme' },
  interfaceName: 'ActSetTheme',
  labels: { singular: 'Set Theme', plural: 'Set Theme' },
  fields: [PerformSelectField({ set: 'theme' })],
}
