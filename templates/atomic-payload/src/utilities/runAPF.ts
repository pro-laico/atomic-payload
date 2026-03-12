import { RunAPFProps } from '@/ts/types/apf'

/**
 * Checks if a document has been marked as changed in the context.
 * If the documents data includes 'active' it will only return true if active = true.
 */
export const runAPF = ({ context, id, apf, data }: RunAPFProps): boolean => {
  if (data instanceof Object && 'active' in data && data.active) return Boolean(context[`${id}-${apf}`])
  else return Boolean(context[`${id}-${apf}`])
}
