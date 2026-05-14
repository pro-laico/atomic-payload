import type { Block } from 'payload'
import { PerformSelectField } from '@pro-laico/ap-actions/fields'

export const ActSetTheme: Block = {
  slug: 'ActSetTheme',
  admin: { group: 'Theme' },
  interfaceName: 'ActSetTheme',
  labels: { singular: 'Set Theme', plural: 'Set Theme' },
  fields: [PerformSelectField({ set: 'theme' })],
}
