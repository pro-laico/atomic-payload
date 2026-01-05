import type { Block } from 'payload'
import { APField } from '@/fields/apf'

const d = {
  addBetween: 'Adds a string between the two fields. Defaults to a space.',
}

export const FsCombineTwoFields: Block = {
  slug: 'FsCombineTwoFields',
  interfaceName: 'FsCombineTwoFields',
  admin: { disableBlockName: true },
  labels: { singular: 'Combine Two Fields', plural: 'Combine Two Fields' },
  fields: [
    APField({ type: 'text', apf: ['form'], name: 'firstFieldName', required: true }),
    APField({ type: 'text', apf: ['form'], name: 'addBetween', admin: { description: d.addBetween } }),
    APField({ type: 'text', apf: ['form'], name: 'secondFieldName', required: true }),
    APField({ type: 'text', apf: ['form'], name: 'outputFieldName', required: true }),
  ],
}
