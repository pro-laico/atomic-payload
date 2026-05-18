import {
  AlignFeature,
  BlockquoteFeature,
  BoldFeature,
  FixedToolbarFeature,
  HeadingFeature,
  IndentFeature,
  InlineCodeFeature,
  InlineToolbarFeature,
  ItalicFeature,
  LinkFeature,
  type LinkFields,
  lexicalEditor,
  OrderedListFeature,
  ParagraphFeature,
  StrikethroughFeature,
  SuperscriptFeature,
  UnderlineFeature,
  UnorderedListFeature,
} from '@payloadcms/richtext-lexical'
import type { TextFieldSingleValidation } from 'payload'

export const defaultLexical: ReturnType<typeof lexicalEditor> = lexicalEditor({
  features: [
    BoldFeature(),
    ItalicFeature(),
    UnderlineFeature(),
    StrikethroughFeature(),
    SuperscriptFeature(),
    InlineCodeFeature(),
    ParagraphFeature(),
    HeadingFeature(),
    AlignFeature(),
    IndentFeature(),
    UnorderedListFeature(),
    OrderedListFeature(),
    BlockquoteFeature(),
    InlineToolbarFeature(),
    FixedToolbarFeature(),
    LinkFeature({
      enabledCollections: ['pages'],
      fields: ({ defaultFields }) => {
        const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
          if ('name' in field && field.name === 'url') return false
          return true
        })

        return [
          ...defaultFieldsWithoutUrl,
          {
            name: 'url',
            type: 'text',
            required: true,
            label: ({ t }) => t('fields:enterURL'),
            admin: { condition: (_data, sd) => Boolean(sd?.linkType !== 'internal') },
            validate: ((value, options) => {
              if ((options?.siblingData as LinkFields)?.linkType === 'internal') return true
              return value ? true : 'URL is required'
            }) as TextFieldSingleValidation,
          },
        ]
      },
    }),
  ],
})
