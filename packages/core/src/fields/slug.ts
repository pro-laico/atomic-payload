import type { CheckboxField, TextField } from 'payload'
import { formatSlugHook } from '../hooks/field/formatSlug'

type Overrides = { slugOverrides?: Partial<TextField>; checkboxOverrides?: Partial<CheckboxField> }

/** Factory for a paired slug + slugLock field set with the standard
 *  `formatSlugHook` wired up. `slugPath` is the Payload admin component path
 *  (e.g. '@/ui/fields/slug') the host project provides for the custom Slug UI;
 *  consumers can also pass full admin overrides via `slugOverrides`. */
export const slugField = (slugPath: string, fieldToUse = 'title', overrides: Overrides = {}): [TextField, CheckboxField] => {
  const { slugOverrides, checkboxOverrides } = overrides

  const checkBoxField: CheckboxField = {
    name: 'slugLock',
    type: 'checkbox',
    defaultValue: true,
    admin: { hidden: true, position: 'sidebar' },
    ...checkboxOverrides,
  }

  // @ts-expect-error - ts mismatch Partial<TextField> with TextField
  const slug: TextField = {
    name: 'slug',
    type: 'text',
    index: true,
    label: 'Slug',
    ...(slugOverrides || {}),
    hooks: { beforeValidate: [formatSlugHook(fieldToUse)] },
    admin: {
      ...(slugOverrides?.admin || {}),
      components: { Field: { path: slugPath, clientProps: { fieldToUse, checkboxFieldPath: checkBoxField.name } } },
    },
  }

  return [slug, checkBoxField]
}
