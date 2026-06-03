import type { TextFieldSingleValidation } from 'payload'
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

export type DefaultLexicalOptions = {
  /** Collections the internal-link feature can target. Defaults to `['pages']`. */
  enabledCollections?: string[]
}

/**
 * Factory for the opinionated Atomic Payload Lexical preset. Pass
 * `enabledCollections` to point the internal-link feature at a different set of
 * collections without copy-pasting the whole preset.
 */
export function createDefaultLexical(options: DefaultLexicalOptions = {}): ReturnType<typeof lexicalEditor> {
  const { enabledCollections = ['pages'] } = options
  return lexicalEditor({
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
        enabledCollections,
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
}

/** The default Atomic Payload Lexical preset (internal links target `pages`). */
export const defaultLexical: ReturnType<typeof lexicalEditor> = createDefaultLexical()
