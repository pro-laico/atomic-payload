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
            colorField('body', 'oklch(0.145 0 0)', 'oklch(0.985 0 0)'),
            colorField('headings', 'oklch(0.145 0 0)', 'oklch(0.985 0 0)'),
            colorField('lead', 'oklch(0.145 0 0)', 'oklch(0.985 0 0)'),
            colorField('links', 'oklch(0.145 0 0)', 'oklch(0.985 0 0)'),
            colorField('bold', 'oklch(0.145 0 0)', 'oklch(0.985 0 0)'),
            colorField('counters', 'oklch(0.145 0 0)', 'oklch(87.62% 0.240 148.61)'),
            colorField('bullets', 'oklch(0.145 0 0)', 'oklch(87.62% 0.240 148.61)'),
            colorField('hr', 'oklch(0.145 0 0)', 'oklch(0.985 0 0)'),
            colorField('quotes', 'oklch(0.145 0 0)', 'oklch(0.985 0 0)'),
            colorField('quote-borders', 'oklch(0.145 0 0)', 'oklch(87.62% 0.240 148.61)'),
            colorField('captions', 'oklch(0.145 0 0)', 'oklch(0.985 0 0)'),
            colorField('kbd', 'oklch(0.145 0 0)', 'oklch(0.985 0 0)'),
            colorField('kbd-shadows', 'oklch(0.145 0 0)', 'oklch(0.985 0 0)'),
            colorField('code', 'oklch(0.145 0 0)', 'oklch(0.985 0 0)'),
            colorField('pre-code', 'oklch(0.145 0 0)', 'oklch(0.985 0 0)'),
            colorField('pre-bg', 'oklch(0.145 0 0)', 'oklch(1 0 0 / 10%)'),
            colorField('th-borders', 'oklch(0.145 0 0)', 'oklch(0.985 0 0)'),
            colorField('td-borders', 'oklch(0.145 0 0)', 'oklch(0.985 0 0)'),
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
