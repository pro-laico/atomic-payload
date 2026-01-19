import { APField } from '@/fields/apf'
import { ArrayField, TextField, SelectField, TabAsField, GroupField } from 'payload'

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
  required: true,
  apf: ['classes'],
  admin: { width: '50%', style: { maxWidth: '500px' }, description: 'Select the tag the nested styles will apply to.' },
  options: typographySupportedTags,
  interfaceName: 'TypographySupportedTags',
})

const psuedoClassField: TextField = APField({
  name: 'psuedoClass',
  type: 'text',
  required: false,
  admin: {
    width: '50%',
    style: { maxWidth: '500px' },
    description: 'Optionally add a psuedo-class (e.g., :hover, :focus, etc.) to target specific states.',
  },
  apf: ['classes'],
})

const typeographyField = (name: string, description: string): ArrayField => {
  return {
    name,
    type: 'array',
    admin: { description },
    interfaceName: 'TypographyStyles',
    fields: [
      tagField,
      psuedoClassField,
      {
        type: 'row',
        fields: [
          {
            type: 'array',
            name: 'values',
            fields: [
              APField({ type: 'text', name: 'cssSelector', required: true, apf: ['classes'] }),
              APField({ type: 'text', name: 'value', required: true, apf: ['classes'] }),
            ],
          },
        ],
      },
    ],
  }
}

const colorField = (name: string, light: string, dark: string): GroupField => {
  return {
    name,
    type: 'group',
    interfaceName: 'ProseColorField',
    fields: [
      {
        type: 'row',
        fields: [
          APField({ name: 'light', required: true, type: 'text', defaultValue: light, admin: { width: '50%' }, apf: ['classes'] }),
          APField({ name: 'dark', required: true, type: 'text', defaultValue: dark, admin: { width: '50%' }, apf: ['classes'] }),
        ],
      },
    ],
  }
}

export const ProseTab: TabAsField = {
  type: 'tab',
  label: 'Prose',
  admin: {
    description: 'Configure typography styles and colors for prose content. Utilizes UnoCSS Typography Preset: https://unocss.dev/presets/typography',
  },
  fields: [
    {
      label: 'Colors',
      type: 'collapsible',
      fields: [
        {
          type: 'group',
          label: false,
          name: 'proseColors',
          required: true,
          interfaceName: 'ProseColors',
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
      ],
    },
    {
      type: 'group',
      name: 'proseStyles',
      fields: [
        typeographyField('default', 'The default typography styles applied with "prose".'),
        typeographyField('sm', 'This size applies to small screens and above with "prose prose-sm".'),
        typeographyField('base', 'This size applies to base screens and above with "prose prose-base".'),
        typeographyField('lg', 'This size applies to large screens and above with "prose prose-lg".'),
      ],
    },
  ],
}
