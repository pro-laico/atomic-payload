import { APField } from '@/fields/apf'
import { ArrayField, SelectField, TabAsField, GroupField } from 'payload'

export const typographySupportedTags = [
  'headings',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'th',
  'p',
  'a',
  'blockquote',
  'figure',
  'figcaption',
  'strong',
  'em',
  'kbd',
  'code',
  'pre',
  'ol',
  'ul',
  'li',
  'table',
  'thead',
  'tr',
  'td',
  'img',
  'video',
  'hr',
]

const tagField: SelectField = APField({
  type: 'select',
  name: 'tag',
  admin: { width: '50%', style: { maxWidth: '500px' }, description: 'Select the tag the nested styles will apply to.' },
  options: typographySupportedTags,
  interfaceName: 'TypographySupportedTags',
})

const typeographyField = (name: string, description: string): ArrayField => {
  return {
    name,
    type: 'array',
    admin: { description },
    fields: [
      tagField,
      {
        type: 'row',
        fields: [
          { type: 'array', name: 'values', fields: [APField({ type: 'text', name: 'cssSelector' }), APField({ type: 'text', name: 'value' })] },
        ],
      },
    ],
  }
}

const colorField = (name: string, light: string, dark: string): GroupField => {
  return {
    name,
    type: 'group',
    fields: [
      {
        type: 'row',
        fields: [
          APField({ name: 'light', type: 'text', defaultValue: light, admin: { width: '50%' } }),
          APField({ name: 'dark', type: 'text', defaultValue: dark, admin: { width: '50%' } }),
        ],
      },
    ],
  }
}

export const ProseTab: TabAsField = {
  type: 'tab',
  label: 'Prose',
  fields: [
    {
      label: 'Colors',
      type: 'collapsible',
      fields: [
        colorField('body', '700', '300'),
        colorField('headings', '900', 'white'),
        colorField('lead', '600', '400'),
        colorField('links', '900', 'white'),
        colorField('bold', '900', 'white'),
        colorField('counters', '500', '400'),
        colorField('bullets', '300', '600'),
        colorField('hr', '200', '700'),
        colorField('quotes', '900', '100'),
        colorField('quote-borders', '200', '700'),
        colorField('captions', '500', '400'),
        colorField('kbd', '900', 'white'),
        colorField('kbd-shadows', '900', 'white'),
        colorField('code', '900', 'white'),
        colorField('pre-code', '200', '300'),
        colorField('pre-bg', '800', 'rgb(0 0 0 / 50%)'),
        colorField('th-borders', '300', '600'),
        colorField('td-borders', '200', '700'),
      ],
    },
    typeographyField('sm', 'This size applies to small screens and above'),
    typeographyField('base', 'This size applies to base screens and above.'),
    typeographyField('lg', 'This size applies to large screens and above.'),
  ],
}
