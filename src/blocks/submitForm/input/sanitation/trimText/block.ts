import type { Block } from 'payload'
import { APField } from '@/fields/apf'

const d = {
  trimCharacters: 'The characters to trim. Comma seperated list. Defaults to just removing spaces.',
}

const options = [
  { label: 'Beginning', value: 'beginning' },
  { label: 'End', value: 'end' },
  { label: 'Both', value: 'both' },
]

export const IsTrimText: Block = {
  slug: 'IsTrimText',
  interfaceName: 'IsTrimText',
  admin: { disableBlockName: true },
  labels: { singular: 'Trim Text', plural: 'Trim Text' },
  custom: { usedOn: ['text', 'textarea', 'email'] },
  fields: [
    APField({ type: 'select', apf: ['form'], required: true, name: 'trimType', defaultValue: 'both', options }),
    APField({ type: 'text', apf: ['form'], required: true, name: 'trimCharacters', admin: { description: d.trimCharacters } }),
  ],
}
