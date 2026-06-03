import { APField, onArraySetAPFShallow } from '@pro-laico/core'
import type { Field, Tab } from 'payload'

import { TokenValueArrayField } from '../../fields/value'
import { DesignTokenLabelPath } from '../../paths'

/**
 * Builds the Fonts tab. The font `upload` fields (sans / serif / mono / display)
 * are NOT defined here — they require a `font` collection and would couple this
 * package to `@pro-laico/fonts`. Instead, pass that group in via `fontField`
 * (e.g. `fontUploadField()` from `@pro-laico/fonts`); when omitted the tab simply
 * carries the collection-independent type tokens. `processDesignSet` handles a
 * missing `font` group (`generateUnoFonts` returns `{}`).
 */
export const FontsTab = (fontField?: Field) => {
  const fontsField: Tab = {
    label: 'Fonts',
    admin: { description: 'These are the fonts that are applied to the entire website.' },
    fields: [
      ...(fontField ? [fontField] : []),
      {
        type: 'array',
        name: 'text',
        label: 'Text',
        admin: { components: { RowLabel: { path: DesignTokenLabelPath } } },
        fields: [
          APField({ type: 'text', apf: ['classes'], name: 'name', required: true, kebab: true }),
          APField({ type: 'text', apf: ['classes'], name: 'fontSize', required: true }),
          APField({ type: 'text', apf: ['classes'], name: 'lineHeight', required: true }),
        ],
        hooks: { beforeValidate: [onArraySetAPFShallow(['classes'])] },
      },
      TokenValueArrayField('fontWeight'),
      TokenValueArrayField('tracking'),
      TokenValueArrayField('leading'),
      TokenValueArrayField('textStrokeWidth'),
    ],
  }

  return fontsField
}
