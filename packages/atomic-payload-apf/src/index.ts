export { runAPF } from './utilities/runAPF'
export { APField } from './fields/index'
export { ActiveField } from './fields/active'
export { apfRegistry, apfStorage, generateAPFFields } from './fields/storage'
export {
  virtualAPFAfterReadFieldHook,
  virtualAPFBeforeChangeFieldHook,
  onArraySetAPFShallow,
  onUploadSetAPF,
} from './hooks/field/apf'

/** Path constants for Payload admin component registration. */
export const APFControlsPath = '@pro-laico/atomic-payload-apf/admin/controls'
export const APFieldPath = '@pro-laico/atomic-payload-apf/admin/field'
export const APFieldLabelPath = '@pro-laico/atomic-payload-apf/admin/label'
