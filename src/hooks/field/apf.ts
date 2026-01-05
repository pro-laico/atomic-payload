// /////////////////////////////////////
// ONLY USE THESE HOOKS ON NON RECURSIVE FIELDS
// OTHERWISE PERFORMANCE WILL SUFFER
// /////////////////////////////////////
import type { FieldHook } from 'payload'
import type { APFunction } from '@/ts/types/apf'

export const virtualAPFBeforeChangeFieldHook: FieldHook = ({ context, value, field, originalDoc }) => {
  if (!originalDoc?.id) return
  const key = `${originalDoc?.id}-${field?.name?.replace(/^apf-/, '').trim()}`
  if (key in context) return
  context[key] = value
}

export const virtualAPFAfterReadFieldHook: FieldHook = () => false

/**
 * Field hook that marks a document as modified when arrays change (shallow comparison).
 * Only checks array length.
 *
 * @fields array
 * @param apf - The type of change to set in context. {@link APFunctions}
 */
export const onArraySetAPFShallow =
  (apf: APFunction[]): FieldHook =>
  ({ previousValue, value, context, originalDoc }) => {
    if (!originalDoc?.id) return

    const hasLengthChange = value?.length !== previousValue?.length
    if (!hasLengthChange) return

    for (const apfFunction of apf) {
      const contextKey = `${originalDoc.id}-${apfFunction}`
      if (context[contextKey]) continue // Respect context values set by other apf before validate hooks.
      context[contextKey] = true
    }
  }

/**
 * Field hook that marks a document as modified when the upload field changes.
 *
 * @fields upload
 * @param apf - The type of change to set in context. {@link APFunctions}
 */
export const onUploadSetAPF =
  (apf: APFunction[]): FieldHook =>
  ({ previousValue, value, context, originalDoc }) => {
    if (!originalDoc?.id) return

    const previousId = previousValue?.id
    const currentId = value?.id
    if (previousId === currentId) return

    for (const apfFunction of apf) {
      const contextKey = `${originalDoc.id}-${apfFunction}`
      if (context[contextKey]) continue
      context[contextKey] = true
    }
  }
