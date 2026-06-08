import type { RunAPFProps } from '../types'
/**
 * Returns whether this APF was marked as changed for the document in the request
 * context — i.e. whether the per-`id`/`apf` flag set by the APF field hooks is
 * present. (Both legacy branches returned this same value; the `active` check was
 * a no-op, so it has been removed rather than left as misleading dead code.)
 */
export const runAPF = ({ context, id, apf }: RunAPFProps): boolean => Boolean(context[`${id}-${apf}`])
