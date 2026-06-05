import type { Block } from 'payload'
import { PerformSelectField } from '../../../fields'

export const ActSetTheme: Block = {
  slug: 'ActSetTheme',
  admin: { group: 'Theme' },
  interfaceName: 'ActSetTheme',
  labels: { singular: 'Set Theme', plural: 'Set Theme' },
  fields: [PerformSelectField({ set: 'theme' })],
}
