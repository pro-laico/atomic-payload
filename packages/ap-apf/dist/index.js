export { default as deepMerge } from './utilities/deepMerge';
export { runAPF } from './utilities/runAPF';
export { APField } from './fields/index';
export { ActiveField } from './fields/active';
export { apfRegistry, apfStorage, generateAPFFields } from './fields/storage';
export { virtualAPFAfterReadFieldHook, virtualAPFBeforeChangeFieldHook, onArraySetAPFShallow, onUploadSetAPF, } from './hooks/field/apf';
/** Path constants for Payload admin component registration. */
export const APFControlsPath = '@pro-laico/ap-apf/admin/controls';
export const APFieldPath = '@pro-laico/ap-apf/admin/field';
export const APFieldLabelPath = '@pro-laico/ap-apf/admin/label';
//# sourceMappingURL=index.js.map